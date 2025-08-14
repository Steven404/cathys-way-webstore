import { inject, Injectable } from '@angular/core';
import { doc, Firestore, updateDoc } from '@angular/fire/firestore';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadBytesResumable,
} from '@angular/fire/storage';

import { CustomUploadTask } from '../../../core/types';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  firestore = inject(Firestore);
  storage = inject(Storage);

  private async compressImage(
    file: File,
    quality = 0.8,
    maxWidth = 1600,
    maxHeight = 1600,
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e) => {
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;
          if (width > maxWidth || height > maxHeight) {
            const scale = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * scale);
            height = Math.round(height * scale);
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else reject(new Error('Compression failed'));
            },
            'image/jpeg',
            quality,
          );
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async uploadImagesAndGetUrls(
    productId: string,
    mainImage: File,
    extraImages: File[],
  ) {
    // Compress main image
    const compressedMain = await this.compressImage(mainImage, 0.8);

    const mainImageStorageRef = ref(
      this.storage,
      `products/${productId}/main-image/${mainImage.name}`,
    );

    const mainImageTask: CustomUploadTask = {
      uploadTask: uploadBytesResumable(mainImageStorageRef, compressedMain),
      ref: mainImageStorageRef,
    };

    const extraImageUploadTasks: CustomUploadTask[] = [];

    for (const extraImage of extraImages) {
      const compressedExtra = await this.compressImage(extraImage, 0.8);
      const extraImageRef = ref(
        this.storage,
        `products/${productId}/extra-images/${extraImage.name}`,
      );
      extraImageUploadTasks.push({
        ref: extraImageRef,
        uploadTask: uploadBytesResumable(extraImageRef, compressedExtra),
      });
    }

    const mainImageUrl = await new Promise<string>((resolve, reject) => {
      mainImageTask.uploadTask.on('state_changed', null, reject, async () => {
        try {
          const url = await getDownloadURL(mainImageTask.ref);
          resolve(url);
        } catch (error) {
          reject(error);
        }
      });
    });

    const extraImageUrls: string[] = [];

    for (const task of extraImageUploadTasks) {
      const url = await new Promise<string>((resolve, reject) => {
        task.uploadTask.on('state_changed', null, reject, async () => {
          try {
            const downloadUrl = await getDownloadURL(task.ref);
            resolve(downloadUrl);
          } catch (err) {
            reject(err);
          }
        });
      });

      extraImageUrls.push(url);
    }

    const productRef = doc(this.firestore, `products/${productId}`);
    await updateDoc(productRef, { mainImageUrl, extraImageUrls });
  }
}

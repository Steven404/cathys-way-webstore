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

  async uploadImagesAndGetUrls(
    productId: string,
    mainImage: File,
    extraImages: File[],
  ) {
    const mainImageStorageRef = ref(
      this.storage,
      `products/${productId}/main-image/${mainImage.name}`,
    );

    const mainImageTask: CustomUploadTask = {
      uploadTask: uploadBytesResumable(mainImageStorageRef, mainImage),
      ref: mainImageStorageRef,
    };

    const extraImageUploadTasks: CustomUploadTask[] = [];

    extraImages.forEach((extraImage) => {
      const extraImageRef = ref(
        this.storage,
        `products/${productId}/extra-images/${extraImage.name}`,
      );
      extraImageUploadTasks.push({
        ref: extraImageRef,
        uploadTask: uploadBytesResumable(extraImageRef, extraImage),
      });
    });

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

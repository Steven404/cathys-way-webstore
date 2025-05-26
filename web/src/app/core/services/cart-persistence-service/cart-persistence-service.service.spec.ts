import { TestBed } from '@angular/core/testing';

import { CartPersistenceServiceService } from './cart-persistence-service.service';

describe('CartPersistanceServiceService', () => {
  let service: CartPersistenceServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartPersistenceServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

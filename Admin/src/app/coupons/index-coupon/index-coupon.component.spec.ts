import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexCouponComponent } from './index-coupon.component';

describe('IndexCouponComponent', () => {
  let component: IndexCouponComponent;
  let fixture: ComponentFixture<IndexCouponComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndexCouponComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexCouponComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

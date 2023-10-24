import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnproductComponent } from './returnproduct.component';

describe('ReturnproductComponent', () => {
  let component: ReturnproductComponent;
  let fixture: ComponentFixture<ReturnproductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReturnproductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnproductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailsaleComponent } from './retailsale.component';

describe('RetailsaleComponent', () => {
  let component: RetailsaleComponent;
  let fixture: ComponentFixture<RetailsaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetailsaleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailsaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

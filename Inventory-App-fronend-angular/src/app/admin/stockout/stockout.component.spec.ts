import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockoutComponent } from './stockout.component';

describe('StockoutComponent', () => {
  let component: StockoutComponent;
  let fixture: ComponentFixture<StockoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

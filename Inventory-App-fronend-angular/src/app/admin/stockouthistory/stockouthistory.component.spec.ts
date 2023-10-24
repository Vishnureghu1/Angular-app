import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockouthistoryComponent } from './stockouthistory.component';

describe('StockouthistoryComponent', () => {
  let component: StockouthistoryComponent;
  let fixture: ComponentFixture<StockouthistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockouthistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockouthistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

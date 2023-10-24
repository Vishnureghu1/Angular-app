import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockinhistoryComponent } from './stockinhistory.component';

describe('StockinhistoryComponent', () => {
  let component: StockinhistoryComponent;
  let fixture: ComponentFixture<StockinhistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockinhistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockinhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

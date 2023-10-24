import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnhistoryComponent } from './returnhistory.component';

describe('ReturnhistoryComponent', () => {
  let component: ReturnhistoryComponent;
  let fixture: ComponentFixture<ReturnhistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReturnhistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockinComponent } from './stockin.component';

describe('StockinComponent', () => {
  let component: StockinComponent;
  let fixture: ComponentFixture<StockinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

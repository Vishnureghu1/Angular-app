import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateattributeComponent } from './updateattribute.component';

describe('UpdateattributeComponent', () => {
  let component: UpdateattributeComponent;
  let fixture: ComponentFixture<UpdateattributeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateattributeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateattributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

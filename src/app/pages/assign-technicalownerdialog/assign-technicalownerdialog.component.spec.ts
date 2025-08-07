import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignTechnicalownerdialogComponent } from './assign-technicalownerdialog.component';

describe('AssignTechnicalownerdialogComponent', () => {
  let component: AssignTechnicalownerdialogComponent;
  let fixture: ComponentFixture<AssignTechnicalownerdialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssignTechnicalownerdialogComponent]
    });
    fixture = TestBed.createComponent(AssignTechnicalownerdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

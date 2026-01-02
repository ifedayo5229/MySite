import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignRoleDialogComponent } from './assign-role-dialog.component';

describe('AssignRoleDialogComponent', () => {
  let component: AssignRoleDialogComponent;
  let fixture: ComponentFixture<AssignRoleDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssignRoleDialogComponent]
    });
    fixture = TestBed.createComponent(AssignRoleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

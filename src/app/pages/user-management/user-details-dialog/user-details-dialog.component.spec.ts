import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetailsDialogComponent } from './user-details-dialog.component';

describe('UserDetailsDialogComponent', () => {
  let component: UserDetailsDialogComponent;
  let fixture: ComponentFixture<UserDetailsDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserDetailsDialogComponent]
    });
    fixture = TestBed.createComponent(UserDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

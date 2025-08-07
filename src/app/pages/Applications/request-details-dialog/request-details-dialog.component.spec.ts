import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestDetailsDialogComponent } from './request-details-dialog.component';

describe('RequestDetailsDialogComponent', () => {
  let component: RequestDetailsDialogComponent;
  let fixture: ComponentFixture<RequestDetailsDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequestDetailsDialogComponent]
    });
    fixture = TestBed.createComponent(RequestDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

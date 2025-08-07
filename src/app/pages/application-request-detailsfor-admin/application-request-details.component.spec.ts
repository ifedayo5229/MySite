import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationRequestDetailsforAdminComponent } from './application-request-details.component';

describe('ApplicationRequestDetailsforAdminComponent', () => {
  let component: ApplicationRequestDetailsforAdminComponent;
  let fixture: ComponentFixture<ApplicationRequestDetailsforAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApplicationRequestDetailsforAdminComponent]
    });
    fixture = TestBed.createComponent(ApplicationRequestDetailsforAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

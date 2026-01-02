import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveApplicationsComponent } from './live-applications.component';

describe('LiveApplicationsComponent', () => {
  let component: LiveApplicationsComponent;
  let fixture: ComponentFixture<LiveApplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiveApplicationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

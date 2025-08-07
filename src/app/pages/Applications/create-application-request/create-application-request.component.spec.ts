import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateApplicationRequestComponent } from './create-application-request.component';

describe('CreateApplicationRequestComponent', () => {
  let component: CreateApplicationRequestComponent;
  let fixture: ComponentFixture<CreateApplicationRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateApplicationRequestComponent]
    });
    fixture = TestBed.createComponent(CreateApplicationRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

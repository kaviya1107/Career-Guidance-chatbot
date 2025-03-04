import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalassessmentComponent } from './personalassessment.component';

describe('PersonalassessmentComponent', () => {
  let component: PersonalassessmentComponent;
  let fixture: ComponentFixture<PersonalassessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalassessmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PersonalassessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

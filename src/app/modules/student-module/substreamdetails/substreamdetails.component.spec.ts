import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstreamdetailsComponent } from './substreamdetails.component';

describe('SubstreamdetailsComponent', () => {
  let component: SubstreamdetailsComponent;
  let fixture: ComponentFixture<SubstreamdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubstreamdetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubstreamdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstreamsComponent } from './substreams.component';

describe('SubstreamsComponent', () => {
  let component: SubstreamsComponent;
  let fixture: ComponentFixture<SubstreamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubstreamsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubstreamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

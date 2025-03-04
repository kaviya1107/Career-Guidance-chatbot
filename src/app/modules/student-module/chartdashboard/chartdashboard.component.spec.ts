import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartdashboardComponent } from './chartdashboard.component';

describe('ChartdashboardComponent', () => {
  let component: ChartdashboardComponent;
  let fixture: ComponentFixture<ChartdashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartdashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChartdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { D3PieChartComponent } from './d3-pie-chart.component';

describe('D3PieChartComponent', () => {
  let component: D3PieChartComponent;
  let fixture: ComponentFixture<D3PieChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [D3PieChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(D3PieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

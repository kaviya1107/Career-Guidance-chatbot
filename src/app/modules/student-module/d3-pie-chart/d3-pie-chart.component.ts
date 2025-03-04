import { Component,OnInit } from '@angular/core';
import * as d3 from 'd3';
import { ChatserviceService } from '../../../services/chatservice.service';



@Component({
  selector: 'app-d3-pie-chart',
  standalone: true,
  imports: [],
  templateUrl: './d3-pie-chart.component.html',
  styleUrl: './d3-pie-chart.component.css'
})
export class D3PieChartComponent implements OnInit {
  private data: { name: string, value: number }[] = [];
  private svgPie: any;
  private svgBar: any;
  private margin = 50;
  private width = 450;
  private height = 450;
  private radius = Math.min(this.width, this.height) / 2 - this.margin;
  private pieColors: any;
  private barColors: any;

  constructor(private chatService: ChatserviceService) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.chatService.getIntentAnalysis().subscribe(response => {
      this.data = [
        { name: 'Correct Predictions', value: response.correct_predictions },
        { name: 'Null Intents', value: response.null_intents }
      ];
      this.createPieChart();
      this.createBarChart();
    });
  }

  private createPieChart(): void {
    this.createPieSvg();
    this.createColors();
    this.drawPieChart();
  }

  private createPieSvg(): void {
    this.svgPie = d3.select('figure#pie')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr('transform', `translate(${this.width / 2},${this.height / 2})`);
  }

  private createColors(): void {
    this.pieColors = d3.scaleOrdinal()
      .domain(this.data.map(d => d.value.toString()))
      .range(['#4CAF50', '#F44336']); // Green and red for pie chart

    this.barColors = d3.scaleOrdinal()
      .domain(this.data.map(d => d.value.toString()))
      .range(['#2196F3', '#FFC107']); // Blue and yellow for bar chart
  }

  private drawPieChart(): void {
    const pie = d3.pie<any>().value((d: any) => d.value);

    this.svgPie
      .selectAll('pieces')
      .data(pie(this.data))
      .enter()
      .append('path')
      .attr('d', d3.arc()
        .innerRadius(0)
        .outerRadius(this.radius)
      )
      .attr('fill', (d: any, i: number) => this.pieColors(i))
      .attr('stroke', '#121926')
      .style('stroke-width', '1px');

    // Add labels
    const labelLocation = d3.arc()
      .innerRadius(100)
      .outerRadius(this.radius);

    this.svgPie
      .selectAll('pieces')
      .data(pie(this.data))
      .enter()
      .append('text')
      .text((d: any) => `${d.data.name}: ${d.data.value}`)
      .attr('transform', (d: any) => `translate(${labelLocation.centroid(d)})`)
      .style('text-anchor', 'middle')
      .style('font-size', '15px');
  }

  private createBarChart(): void {
    const barWidth = 40;
    const barMargin = 10;
    const barHeightScale = d3.scaleLinear()
      .domain([0, d3.max(this.data, d => d.value) || 0])
      .range([0, this.height - this.margin]);

    this.svgBar = d3.select('figure#bar')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr('transform', `translate(${this.margin},${this.margin})`);

    this.svgBar.selectAll('rect')
      .data(this.data)
      .enter()
      .append('rect')
      .attr('x', (d: any, i: number) => i * (barWidth + barMargin))
      .attr('y', (d: any) => this.height - this.margin - barHeightScale(d.value))
      .attr('width', barWidth)
      .attr('height', (d: any) => barHeightScale(d.value))
      .attr('fill', (d: any, i: number) => this.barColors(i));

    // Add labels
    this.svgBar.selectAll('text')
      .data(this.data)
      .enter()
      .append('text')
      .text((d: any) => `${d.name}: ${d.value}`)
      .attr('x', (d: any, i: number) => i * (barWidth + barMargin) + barWidth / 2)
      .attr('y', (d: any) => this.height - this.margin - barHeightScale(d.value) - 5)
      .style('text-anchor', 'middle')
      .style('font-size', '12px');
  }
}
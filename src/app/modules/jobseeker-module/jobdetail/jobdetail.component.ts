import { Component } from '@angular/core';
import { RegisterService } from '../../../services/couchdb.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-jobdetail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './jobdetail.component.html',
  styleUrl: './jobdetail.component.css'
})
export class JobdetailComponent {
  jobs: any[] = []; // Array to store job details

  constructor(private registerservice: RegisterService) {}

  ngOnInit(): void {
    this.fetchJobs();
  }

  fetchJobs(): void {
    this.registerservice.getJobs().subscribe({
      next: (response) => {
        this.jobs = response.rows.map((row:any)=>row.doc.data); // Store job details in array
        console.log("jobs",this.jobs);
      },
      error: (error: any) => {
        console.error('Error fetching jobs:', error);
      }
    });
  }
}


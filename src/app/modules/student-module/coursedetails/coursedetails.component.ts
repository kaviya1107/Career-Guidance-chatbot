import { Component, OnInit } from '@angular/core';
import { RegisterService } from '../../../services/register.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-coursedetails',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './coursedetails.component.html',
  styleUrl: './coursedetails.component.css'
})
export class CoursedetailsComponent implements OnInit {
  courses: any[] = [];

  constructor(readonly registerService: RegisterService, readonly router: Router) {}

  ngOnInit(): void {
    this.fetchCourses();
  }

  fetchCourses() {
    this.registerService.getCourses().subscribe({
      next: (data: any) => {
        console.log(data);
          this.courses = data.rows.map((row: any) => row.doc)
          console.log("courses",this.courses);
          
      },
      error: (error: any) => {
        console.log("Error Fetching Courses", error);
      }
    });
  }

  navigateTo(stream: any) {
    this.router.navigate([`/stream`, stream]); 
  }
}

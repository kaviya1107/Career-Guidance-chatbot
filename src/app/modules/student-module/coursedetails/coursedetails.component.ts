import { Component, OnInit } from '@angular/core';
import { RegisterService } from '../../../services/couchdb.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-coursedetails',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './coursedetails.component.html',
  styleUrl: './coursedetails.component.css'
})
export class CoursedetailsComponent implements OnInit {
  Streams: any[] = [];
  searchQuery: string = '';
  filteredStreams: any[] = []; // This controls the UI display

  courseCategories = [
    { key: 'medical', label: 'Medical Details' },
    { key: 'engineering', label: 'Engineering Details' },
    { key: 'law', label: 'Law Details' },
    { key: 'arts', label: 'Arts & Science' },
    { key: 'design', label: 'Designing Details' },
    { key: 'business', label: 'Business Details' }
  ];

  constructor(private registerService: RegisterService, private router: Router) {}

  ngOnInit(): void {
    this.fetchCourses();
  }

  fetchCourses() {
    this.registerService.getStreams().subscribe({
      next: (data: any) => {
        this.Streams = data.rows.map((row: any) => row.doc);
        this.filteredStreams = [...this.Streams]; // Default all courses displayed
      },
      error: (error: any) => {
        console.log("Error Fetching Courses", error);
      }
    });
  }

  navigateTo(streamId: any) {
    this.router.navigate([`/stream`, streamId]); 
  }

  // Search Courses using CouchDB Full-Text Search API
  searchCourses() {
    if (this.searchQuery.trim() === '') {
      // If search query is empty, reset to all courses
      this.filteredStreams = [...this.Streams];
      return;
    }

    this.registerService.getSearchStream(this.searchQuery).subscribe({
      next: (response: any) => {
        console.log("Search Results:", response);
        
        // Extract search results and update UI
        this.filteredStreams = response.rows.map((e: any) => e.doc) || [];
      },
      error: (error: any) => {
        console.log("Error Searching Courses", error);
      }
    });
  }
}

import { Component,OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RegisterService } from '../../../services/couchdb.service';

@Component({
  selector: 'app-substreamdetails',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './substreamdetails.component.html',
  styleUrl: './substreamdetails.component.css'
})
export class SubstreamdetailsComponent implements OnInit {
    substreamDetails: any = ""; 
    substreamId: string | null = "";

    streamId : string = "";
    colleges: any[] = [];

    constructor(
      readonly registerService: RegisterService, 
      readonly route: ActivatedRoute, 
    ) {}
  
    ngOnInit(): void {
      this.substreamId = this.route.snapshot.paramMap.get('id');
      console.log(this.substreamId);
      this.fetchSubstreamDetails();
    }
    
    fetchColleges():void{
      this.registerService.getColleges(this.streamId).subscribe({
        next:(response:any)=>{
          console.log(response);
          this.colleges=response.rows.map((row: any) => row.doc.data);
          console.log(this.colleges);
          
        },
        error: (error: any) => {
          console.log("Error Fetching Courses", error);
        }
      });
    }

    fetchSubstreamDetails(): void {
      this.registerService.getSubstream().subscribe({
        next: (data: any) => {
          console.log("substream", data);
          console.log(this.substreamId);
          
          this.substreamDetails = data.rows
          .filter((e: any) => e.id === this.substreamId)
            .map((row: any) => row.doc)
            console.log("substreamDetails",this.substreamDetails);
            this.streamId = this.substreamDetails[0].data.streamId;
            console.log("Stream", this.streamId);
            this.fetchColleges();
        },
        error: (error: any) => {
          console.error('Error fetching subSubstream:', error);
        }
      });
    }
  }

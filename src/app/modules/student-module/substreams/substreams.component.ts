import { Component, OnInit } from '@angular/core';
import { RegisterService } from '../../../services/couchdb.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-substreams',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './substreams.component.html',
  styleUrl: './substreams.component.css'
})
export class SubstreamsComponent implements OnInit {
  substream: any[] = []; 
  streamId: string | null = "";
  clickedData : any = [];

  constructor(
    readonly registerService: RegisterService, 
    readonly route: ActivatedRoute, 
    readonly router: Router 
  ) {}

  ngOnInit(): void {
    this.streamId = this.route.snapshot.paramMap.get('id');
    this.fetchSubstream();
  }

  fetchSubstream(): void {
    this.registerService.getSubstream().subscribe({ 
      next: (data: any) => {
        console.log(data.rows);
        
        this.substream = data.rows
          .map((row: any) => row.doc)
          .filter((e: any) => e.data.streamId === this.streamId);
          console.log("sub stream ",this.substream);
      },
      error: (error: any) => {
        console.log('Error fetching subStreams:', error);
      }
    });
  }
  navigateTo(subStreamId: any) {
    console.log("Sub Stream before navigating");
    console.log(subStreamId);
    this.clickedData = this.substream.find((e) => {
      return e._id === subStreamId
    })
    console.log("Clicked Data : ");
    
    console.log(this.clickedData);
    ++this.clickedData.data.clickCount;
    this.registerService.updateSubStream(this.clickedData).subscribe({
      next : (response) =>{
        console.log(response)
        console.log("Updated success");
        this.router.navigate([`/substream`, subStreamId]);
        console.log("Navigated"); 

      },
      error : (error)=> {
        console.log(error)
      }
    })
  }
}

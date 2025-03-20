import { Component } from '@angular/core';
import { RegisterService } from '../../../services/couchdb.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-trending-courses',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trending-courses.component.html',
  styleUrl: './trending-courses.component.css'
})
export class TrendingCoursesComponent {

  subStreamDetails : any = [];
 
  ngOnInit():void{
    this.fetchSubstream();
  }
  constructor(readonly registerService:RegisterService){}

  fetchSubstream():void{
    this.registerService.getClickCount().subscribe({
      next:(response:any)=>{
        response.rows.splice(8,response.rows.length );
        response.rows.forEach((e :any)=>{
          this.registerService.getParticularSubStream(e.value).subscribe({
            next : (response) =>{
              this.subStreamDetails.push(response)
              console.log(response);
            },
            error :(err:any) =>{
              console.log('Error fetching subStreams:', err);
            }
          })
        })
        console.log(response);
        
      },
      error:(err:any)=>{
        console.log("clickcount substream error",err)
      }
    })
  }

}


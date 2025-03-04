import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';



@Component({
  selector: 'app-admin-homepage',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './admin-homepage.component.html',
  styleUrl: './admin-homepage.component.css'
})
export class AdminHomepageComponent {

  constructor (readonly router:Router){}
  navigatetoAdmin(){
    this.router.navigate(['/userlist'])
  }
}


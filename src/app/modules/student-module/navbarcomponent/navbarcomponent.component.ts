import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RegisterService } from '../../../services/couchdb.service';
import {  HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbarcomponent',
  standalone: true,
  imports: [RouterModule, HttpClientModule, CommonModule],
  templateUrl: './navbarcomponent.component.html',
  styleUrl: './navbarcomponent.component.css',
  providers:[]
})
export class NavbarcomponentComponent {
  user: string | null = null;
  
  constructor(private navbar: RegisterService, private router: Router) {}

  ngOnInit() {
    // Subscribe to user changes so navbar updates dynamically
   this.user=this.navbar.getUserdata();
  }

  logout() {
    this.navbar.logOut(); // Log out the user
    this.user='';
    this.router.navigate(['/commonlogin']); // Redirect to login page
  }
}


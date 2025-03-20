import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NavbarcomponentComponent } from '../navbarcomponent/navbarcomponent.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RegisterService } from '../../../services/couchdb.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-homecomponent',
  standalone: true,
  imports: [NavbarcomponentComponent, HttpClientModule,FormsModule,RouterModule,CommonModule],
  templateUrl: './homecomponent.component.html',
  styleUrl: './homecomponent.component.css',
  providers:[HttpClient,RegisterService]
})
export class HomecomponentComponent {
  
  plans: any[] = [];
  
  constructor(readonly registerService:RegisterService) {}

  ngOnInit(): void {
    this.fetchPlans();
  }

  fetchPlans() {
    this.registerService.getPlans().subscribe({
      next: (response: any) => {
        this.plans = response.rows.map((row: any) => row.doc.data);
      },
      error: (err) => {
        alert('Failed to fetch plans.');
      },
    });
  }

}

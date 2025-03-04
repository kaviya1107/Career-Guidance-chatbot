import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { NavbarcomponentComponent } from "./modules/student-module/navbarcomponent/navbarcomponent.component";
import { HomecomponentComponent } from './modules/student-module/homecomponent/homecomponent.component';
import { RegisterComponent } from "./login/register/register.component";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RegisterService } from './services/register.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotmoduleComponent } from "./modules/chatbotmodule/chatbotmodule.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,RouterModule, NavbarcomponentComponent, HomecomponentComponent, RegisterComponent, HttpClientModule, CommonModule, FormsModule, ChatbotmoduleComponent],
  providers: [HttpClient, RegisterService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Career-Guidance-chatbot';
  routeVal: boolean = false;

  showNavbar=true;

  route(): void {
    this.routeVal = !this.routeVal;
  }

  constructor(readonly router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log(event.url);
        const hideNavbarRoutes = ['/adminhome', '/userlist', '/login', '/register']; 
        this.showNavbar = hideNavbarRoutes.some(route => event.url.includes(route));
      }
    });
  }






  // isLoading = false;

  // constructor(private router: Router) {
  //   this.router.events.subscribe((event: Event) => {
  //     if (event instanceof NavigationStart) {
  //       this.isLoading = true;
  //     } else if (event instanceof NavigationEnd || event instanceof NavigationError) {
  //       this.isLoading = false;
  //     }
  //   });
  // }
}

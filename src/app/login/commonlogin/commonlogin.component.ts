import { Component, inject} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { RegisterService } from '../../services/register.service';


@Component({
  selector: 'app-commonlogin',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, HttpClientModule],
  templateUrl: './commonlogin.component.html',
  styleUrl: './commonlogin.component.css',
  providers: [HttpClient],
})
export class CommonloginComponent {
  email: string = '';
  password: string = ''; 
  userType: string = '';
  isFormSubmitted = false;
  data:any

  loginStatus : boolean = false;

  emailError='';
  passwordError='';
  
  // private router = inject(Router);

  constructor(readonly registerService: RegisterService,readonly router: Router) {}
  // Handle form submission
  onLogin(form: NgForm) {
    this.isFormSubmitted = true;

    if (form.invalid) {
      alert('Please fill all fields correctly');
      return;
    }

    // Call getUser to check if the user exists
    this.registerService.checkUser(this.email).subscribe({
      next: (response: any) => {
        if(response.rows.length===0){
          this.emailError='Incorrect Email'
          return ;
        }
        const userdata=response.rows[0].doc.data
        console.log(userdata);

        if(userdata.password!== this.password){
          this.passwordError='Incorrect Password'
          return
        }
        
        let userType : string = userdata.userType;
        console.log('Response from DB:',userType);
        
        this.registerService.setUserdata(userdata.name);
        this.loginStatus=true;

        if(this.loginStatus === true){
          if(userType === 'student')
            this.router.navigate(['/home']);
          else if(userType ==='jobseeker')
            this.router.navigate(['/jobdetail']);
          else if(userType==='Admin')
            this.router.navigate(['/adminhome'])
        }
      },
    });
  }
  // reset the form 
  resetForm(form: NgForm) {
    form.resetForm(); 
    this.email = '';
    this.password = '';
    this.userType = '';
    this.loginStatus=false;
    this.emailError='';
    this.passwordError='';
  }
}

import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RegisterService } from '../../services/couchdb.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers:[HttpClient]
})
export class LoginComponent {
    email: string = '';
    password: string = ''; 
    userType: string = '';
    isFormSubmitted = false;
  
    emailError='';
    passwordError='';
    
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
          console.log("res",response)
          if(response.rows.length===0){
            this.emailError='Incorrect Email'
            return ;
          }
          const userdata=response.rows[0].doc.data
          console.log("user",userdata);
  
          if(userdata.password!== this.password){
            this.passwordError='Incorrect Password'
            return
          }
          
          let userType : string = userdata.userType;
          console.log('Response from DB:',userType);
          
          this.registerService.setUserdata(userdata.name);
          
            if(userType === 'student')
              this.router.navigate(['/home']);
            else if(userType ==='jobseeker')
              this.router.navigate(['/jobdetail']);
            else if(userType==='Admin')
              this.router.navigate(['/adminhome'])
          },
      });
    }

    // reset the form 
    resetForm(form: NgForm) {
      form.resetForm(); 
      this.email = '';
      this.password = '';
      this.userType = '';
      this.emailError='';
      this.passwordError='';
    }
}

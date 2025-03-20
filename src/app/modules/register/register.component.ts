import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import{v4 as uuidv4} from 'uuid';
import { RegisterService } from '../../services/couchdb.service';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule, FormsModule], 
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [RegisterService, HttpClient], 
})
export class RegisterComponent {
  userName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = ''; 

  userType: string = '';
  isFormSubmitted = false;
  emailExists: boolean = false;
  user: any[] = [];
  isUsernameInvalid: boolean = false;

  constructor(readonly registerService:RegisterService, readonly router: Router) { }
  validateUsername(): void {
    const uppercaseRegex = /[A-Z]/;
    this.isUsernameInvalid = !uppercaseRegex.test(this.userName);
  }

  isPasswordValidLength = false;
  hasSpecialChar = false;
  hasCapitalLetter = false;
  hasNumber = false;

  validatepassword() {
    const password = this.password;
    this.isPasswordValidLength = password.length >= 8;
    this.hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    this.hasCapitalLetter = /[A-Z]/.test(password);
    this.hasNumber = /\d/.test(password);
  }

  ispasswordCriteriaMet(): boolean {
    return this.isPasswordValidLength && this.hasCapitalLetter && this.hasSpecialChar && this.hasNumber;
  }

  emailExistsornot(): boolean {
    this.registerService.checkUser(this.email).subscribe({
      next: (response: any) => {
        console.log("response",response);
        this.emailExists=response.rows.length>0;
        console.log("email exists",this.emailExists);
      },
      error: (error:any) => {
        alert("Error")
      }
    });
    return this.emailExists;
  }

  submitForm(form: NgForm) {
    this.isFormSubmitted = true;
    console.log("email existence", this.emailExistsornot());

    if (form.valid && this.ispasswordCriteriaMet() && !this.emailExistsornot()) {
      console.log("Form submitted");

      const formData = {
        _id: `register_2_${uuidv4()}`,
        data:{
        name: this.userName,
        email: this.email,
        password: this.password,
        userType: this.userType,
        type:'register'
        }
      };

      // Call the register service
      this.registerService.registerUser(formData).subscribe({
        next: (response: any) => {
          console.log(response); 
          alert('Registration successful!');
          this.router.navigate(['/commonlogin']);
          this.clearForm(form); // Reset the form
        },
        error: (error: any) => {
          console.log(error); 
          alert('Username Already Exists')
        },
      });
    }
    else {
      console.log(form);
      console.log("Invalid Form values");

    }
  }
 
  checkPasswordMatch(): boolean {
    return this.confirmPassword !== this.password
  }

  clearForm(form: NgForm) {
    form.resetForm();
    this.userName = '';
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
    this.isFormSubmitted = false; 
  }
}


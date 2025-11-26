import { Component } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { SharedCore } from 'src/app/shared/shared-core';
import { SharedUI } from 'src/app/shared/shared-ui';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [...SharedCore, ...SharedUI, CommonModule, FormsModule],
})
export class LoginComponent {
  credentials = {
    email: '',
    password: '',
  };

  showAlert = false;
  alertMsg = 'Please wait! We are logging you in.';
  alertColor = 'blue';
  inSubmission = false;

  constructor(private auth: Auth) {}

  async login() {
    this.showAlert = true;
    this.alertMsg = 'Please wait! We are logging you in.';
    this.alertColor = 'blue';
    this.inSubmission = true;

    try {
      await signInWithEmailAndPassword(
        this.auth,
        this.credentials.email,
        this.credentials.password
      );

      this.alertMsg = 'Success! You are now logged in.';
      this.alertColor = 'green';
    } catch (e: any) {
      this.inSubmission = false;
      this.alertColor = 'red';

   
      switch (e.code) {
        case 'auth/user-not-found':
          this.alertMsg =
            'No account found with this email. Please check your email address.';
          break;

        case 'auth/wrong-password':
          this.alertMsg =
            'Incorrect password. Please check your password and try again.';
          break;

        case 'auth/invalid-email':
          this.alertMsg =
            'Invalid email format. Please enter a valid email address.';
          break;

        case 'auth/user-disabled':
          this.alertMsg =
            'This account has been disabled. Please contact support.';
          break;

        case 'auth/too-many-requests':
          this.alertMsg = 'Too many failed attempts. Please try again later.';
          break;

        case 'auth/invalid-credential':
          this.alertMsg =
            'Invalid email or password. Please check your credentials.';
          break;

        case 'auth/network-request-failed':
          this.alertMsg =
            'Network error. Please check your internet connection.';
          break;

        default:
          this.alertMsg = 'An error occurred during login. Please try again.';
          console.error('Error code:', e.code);
          console.error('Error message:', e.message);
      }
    }
  }
}

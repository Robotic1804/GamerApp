import { Component } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { SharedCore } from 'src/app/shared/shared-core';
import { SharedUI } from 'src/app/shared/shared-ui';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 👈 Asegúrate de tener esto

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [...SharedCore, ...SharedUI, CommonModule, FormsModule], // 👈 Agrega FormsModule
})
export class LoginComponent {
  credentials = {
    emails: '',
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
        this.credentials.emails,
        this.credentials.password
      );

      this.alertMsg = 'Success! You are now logged in.';
      this.alertColor = 'green';
    } catch (e: any) {
      this.inSubmission = false;
      this.alertMsg =
        e.message || 'An unexpected error occurred. Please try again later.';
      this.alertColor = 'red';
      console.error(e);
    }
  }
}

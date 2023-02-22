import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  credentials = {
    emails: '',
    password: '',
    
  }

  showAlert = false
  alertMsg = 'Please wait! We are loggin you in.'
  alertColor = 'blue'
  inSubmission = false

  constructor(private auth: AngularFireAuth){}

  async login() {
    this.showAlert = true
    this.alertMsg = 'Please wait! We are loggin you in.'
    this.alertColor = 'blue'
    this.inSubmission = true
   try {
  await   this.auth.signInWithEmailAndPassword(
        this.credentials.emails, this.credentials.password
      )
   }
   catch (e) {
     this.inSubmission = false
     this.alertMsg = 'An unexpected error ocurred. Please try again later.'
     this.alertColor = 'red'
     
     console.log(e)

     return
     
   }
    this.alertMsg = 'Sucess! You are now logged in'
    this.alertColor = 'green'
  }

}

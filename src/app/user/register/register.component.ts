import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import IUser from 'src/app/models/user.model';
import { RegisterValidators } from '../validators/register-validators';
import { EmailTaken } from '../validators/email-taken';
import { SharedCore } from 'src/app/shared/shared-core';
import { SharedUI } from 'src/app/shared/shared-ui';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [...SharedCore, ...SharedUI]
})
export class RegisterComponent {
  // Angular 20: inject() function - Mejor práctica moderna
  private auth = inject(AuthService);
  private emailTaken = inject(EmailTaken);
  inSubmission = false

  name= new FormControl('', [
    Validators.required,
    Validators.minLength(3)
  ])
  email = new FormControl('', [
    Validators.required,
    Validators.email
  ], [this.emailTaken.validate])
  
  age = new FormControl<number | null>(null, [
    Validators.required,
    Validators.min(18),
    Validators.max(120)
  ])
  password = new FormControl('', [
    Validators.required,
    // Corregido: Eliminar flags 'g' y 'm' innecesarios
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
  ])
  comfirm_password = new FormControl('', [
    Validators.required
    
  ])

   
    phoneNumber = new FormControl('', [
    Validators.required,
    Validators.minLength(13),
    Validators.maxLength(13)

    ])
  
    showAlert = false
    alertMsg = 'Please wait! Your account is being created'
    alertColor = 'blue'
    
    registerForm = new FormGroup({
    name: this.name,
    email: this.email,
    age: this.age,
    password: this.password,
    comfirm_password: this.comfirm_password,
    phoneNumber: this.phoneNumber
  }, [RegisterValidators.match('password', 'comfirm_password')])

 async register() {
    this.showAlert = true
    this.alertMsg = 'Please wait! Your account is being created.'
   this.alertColor = 'blue'
   this.inSubmission = true

   try {
     await this.auth.createUser(this.registerForm.value as IUser)
   } catch (error: unknown) {
     // Mejor práctica: Tipado correcto de errores
     console.error('Error creating user:', error)
     this.alertMsg = 'An unexpected error occurred. Please try again later'
     this.alertColor = 'red'
     this.inSubmission = false
     return
   }

   this.alertMsg = 'Success! Your account has been created.'
   this.alertColor = 'green'
 }
  
}

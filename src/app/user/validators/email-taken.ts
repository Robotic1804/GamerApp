import { Injectable } from '@angular/core';
import { AsyncValidator, AbstractControl, ValidationErrors } from '@angular/forms';
import { Auth, fetchSignInMethodsForEmail } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class EmailTaken implements AsyncValidator {
  constructor(private auth: Auth) {}

  validate = (control: AbstractControl): Promise<ValidationErrors | null> => {
  
    const email = (control.value ?? '').trim();

    if (!email) return Promise.resolve(null);

    return fetchSignInMethodsForEmail(this.auth, email)
      .then(methods => (methods.length ? { emailTaken: true } : null))
      .catch((error) => {
       
        console.error('Error validando email en Firebase:', error);
      
        return null;
      });
  };
}



import { Injectable } from '@angular/core';
import { AsyncValidator, AbstractControl, ValidationErrors } from '@angular/forms';
import { Auth, fetchSignInMethodsForEmail } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class EmailTaken implements AsyncValidator {
  constructor(private auth: Auth) {}

  validate = (control: AbstractControl): Promise<ValidationErrors | null> => {
    const email = (control.value ?? '').toString().trim();

    // Si está vacío, deja que 'required' u otros validators se encarguen
    if (!email) return Promise.resolve(null);

    return fetchSignInMethodsForEmail(this.auth, email)
      .then(methods => (methods.length ? { emailTaken: true } : null))
      .catch(() => null); // evita romper el form si hay un error de red
  };
}



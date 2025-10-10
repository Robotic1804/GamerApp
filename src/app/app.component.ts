import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgIf, AsyncPipe } from '@angular/common';
import { NavComponent } from './nav/nav.component';
import { AuthModalComponent } from './user/auth-modal/auth-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterOutlet, NgIf, AsyncPipe, NavComponent, AuthModalComponent],
})
export class AppComponent {
  constructor(public auth: any) {} // puedes cambiar el tipo si tienes AuthService
}

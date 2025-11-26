import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent {
 
  public auth = inject(AuthService);
  private modal = inject(ModalService);
  private router = inject(Router);

  
  handleStartUploading(event: Event): void {
    event.preventDefault();
    this.auth.isAuthenticated$
      .pipe(take(1))
      .subscribe((isAuthenticated) => {
        if (isAuthenticated) {
     
          this.router.navigate(['/upload']);
        } else {
        
          this.modal.toggleModal('auth');
        }
      });
  }
}

import { Component, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnDestroy {
  isMobileMenuOpen = false;

  constructor(public auth: AuthService, public modal: ModalService) {}

  toggleMobileMenu(): void {
    // Si hay un modal abierto, cerrarlo primero
    if (this.modal.isAnyModalOpen()) {
      this.modal.closeAllModals();
      return;
    }

    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    this.updateBodyOverflow();
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    this.updateBodyOverflow();
  }

  openModal(event: Event): void {
    event.preventDefault();
    event.stopPropagation();


    if (this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }

    setTimeout(
      () => {
        this.modal.toggleModal('auth');
      },
      this.isMobileMenuOpen ? 100 : 0
    );
  }


  private updateBodyOverflow(): void {

    if (this.isMobileMenuOpen && !this.modal.isAnyModalOpen()) {
      document.body.style.overflow = 'hidden';
    } else if (!this.modal.isAnyModalOpen()) {
      document.body.style.overflow = '';
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.target.innerWidth >= 768 && this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  // Cerrar menú al presionar ESC
  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent) {
    if (this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  // Limpiar al destruir el componente
  ngOnDestroy() {
    document.body.style.overflow = '';
  }
}

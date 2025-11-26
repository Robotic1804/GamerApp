import { Injectable } from '@angular/core';

interface Imodal {
  id: string;
  visible: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modals: Imodal[] = [];

  constructor() {}

  register(id: string) {
    this.modals.push({
      id,
      visible: false,
    });
  }

  unregister(id: string) {
    this.modals = this.modals.filter((element) => element.id !== id);
    this.updateBodyOverflow();
  }

  isModalOpen(id: string): boolean {
    return !!this.modals.find((element) => element.id === id)?.visible;
  }


  isAnyModalOpen(): boolean {
    return this.modals.some((modal) => modal.visible);
  }

  toggleModal(id: string) {
    const modal = this.modals.find((element) => element.id === id);
    if (modal) {
      modal.visible = !modal.visible;
      this.updateBodyOverflow();
    }
  }


  closeModal(id: string) {
    const modal = this.modals.find((element) => element.id === id);
    if (modal) {
      modal.visible = false;
      this.updateBodyOverflow();
    }
  }


  closeAllModals() {
    this.modals.forEach((modal) => (modal.visible = false));
    this.updateBodyOverflow();
  }

  // Manejo centralizado del body overflow
  private updateBodyOverflow(): void {
    if (this.isAnyModalOpen()) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
}

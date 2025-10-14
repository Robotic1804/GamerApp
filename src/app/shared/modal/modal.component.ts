import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input() modalID = '';

  constructor(public modal: ModalService) {}

  ngOnInit(): void {
    this.modal.register(this.modalID);
  }

  ngOnDestroy(): void {
    this.modal.unregister(this.modalID);
  }

  closeModal() {
    this.modal.closeModal(this.modalID);
  }
}

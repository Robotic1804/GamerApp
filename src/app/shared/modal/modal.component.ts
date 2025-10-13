import { Component, Input, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
import { SharedCore } from '../shared-core';

@Component({
  selector: 'app-modal',
  standalone: true,
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  imports: [SharedCore],
  //providers: [ModalService]
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input() modalID = ''
  
  constructor(public modal: ModalService, public el: ElementRef) {
    console.log(el)
  }
  

  ngOnInit(): void {
    document.body.appendChild(this.el.nativeElement)
  }
  ngOnDestroy(): void {
    document.body.removeChild(this.el.nativeElement)
  }

  closeModal() {
    this.modal.toggleModal(this.modalID)

  }


}

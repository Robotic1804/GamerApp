import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
import { SharedCore } from 'src/app/shared/shared-core';
import { SharedUI } from 'src/app/shared/shared-ui';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';


@Component({
  selector: 'app-auth-modal',
  standalone: true,
   imports: [...SharedCore,  ...SharedUI, LoginComponent, RegisterComponent],
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.css'],

})
export class AuthModalComponent implements OnInit, OnDestroy {
  constructor(public modal: ModalService) { }
  
  ngOnInit(): void{
    this.modal.register('auth')
    

  }

  ngOnDestroy(): void {
    this.modal.unregister('auth')
  }

}

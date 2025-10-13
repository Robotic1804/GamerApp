import { Component } from '@angular/core';
import { SharedUI } from 'src/app/shared/shared-ui';
import { ClipsListComponent } from '../clips-list/clips-list.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
   

    SharedUI,
    ClipsListComponent,
  
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  
 


}

import { Component, Input } from '@angular/core';
import { SharedCore } from '../shared-core';

@Component({
  selector: 'app-alert',
  standalone: true,
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
  , imports: [SharedCore]
})
export class AlertComponent {
  @Input() color = 'blue'
  
  get bgColor() {

     return `bg-${this.color}-400`

  }

}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from 'src/app/core/model/User';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent {


  @Input() userData: User | any;
  @Output() toggleBar = new EventEmitter();



  toggleSidebar() {
    this.toggleBar.emit(true);
  }

}

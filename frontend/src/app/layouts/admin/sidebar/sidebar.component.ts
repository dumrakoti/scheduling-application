import { Component, Input } from '@angular/core';
import { User } from 'src/app/core/model/User';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Input() userData: User | any;

}

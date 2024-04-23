import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Component, Input, inject } from '@angular/core';
import { User } from 'src/app/core/model/User';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  private router = inject(Router);

  @Input() userData: User | any;

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/auth/login']);
  }

}

import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationError, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { TopbarComponent } from './topbar/topbar.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, FooterComponent, TopbarComponent],
  templateUrl: './admin.component.html'
})

export class AdminComponent implements OnInit {
  private authService = inject(AuthService);

  userData: any;
  showSidebar: boolean = true;

  ngOnInit() {
    this.userData = this.authService.getUserData();
    this.onResize('');
  }

  toggleSideBar(event?: any) {
    this.showSidebar = !this.showSidebar
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.showSidebar = window.innerWidth <= 1199.98 ? false : true;
  }

}

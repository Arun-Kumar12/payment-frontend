import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  activeLink: string = '';
  title = 'payment-management-frontend';

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.activeLink = this.router.url;
    });
  }

  isActive(link: string): boolean {
    return this.activeLink === link;
  }
}

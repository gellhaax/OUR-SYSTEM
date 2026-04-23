import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {
  logout() {
    localStorage.removeItem('currentUser'); // Remove logged-in user
    window.location.href = '/login';       // Redirect to login page
  }
}

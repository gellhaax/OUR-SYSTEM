import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit {

  ngOnInit(): void {
    const dark = localStorage.getItem('darkMode');

    if (dark === 'true') {
      document.body.classList.add('dark-mode');
    }
  }

  get isLoggedIn(): boolean {
    return typeof window !== 'undefined' && !!localStorage.getItem('currentUser');
  }
}
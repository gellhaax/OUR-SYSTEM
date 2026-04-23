import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';   // ⭐ ADD THIS

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],   // ⭐ ADD HERE
  templateUrl: './contact.html',
  styleUrls: ['./contact.css']
})
export class Contact {}
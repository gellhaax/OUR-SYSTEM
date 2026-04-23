import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {

  records: any[] = [];

  ngOnInit() {
    const data = localStorage.getItem('records');
    this.records = data ? JSON.parse(data) : [];
  }

  get totalCash(): number {
    return this.records
      .filter(r => r.method === 'Cash')
      .reduce((sum, r) => sum + Number(r.amount), 0);
  }

  get totalGCash(): number {
    return this.records
      .filter(r => r.method === 'GCash')
      .reduce((sum, r) => sum + Number(r.amount), 0);
  }

  get totalPayment(): number {
    return this.records
      .reduce((sum, r) => sum + Number(r.amount), 0);
  }
}
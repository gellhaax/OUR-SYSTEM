import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-records',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './records.html',
  styleUrls: ['./records.css']
})
export class Records implements OnInit {

  searchId = '';
  records: any[] = [];
  filteredRecords: any[] = [];

  showAddForm = false;
  showTransactionForm = false;

  selectedRecord: any = null;
  selectedIndex = -1;

  feeMap: any = {
    "Organization fee": 100,
    "Usg Fee": 500,
    "Miscellaneous fee": 1000,
    "Tuition fee": 5000
  };

  newRecord: any = this.getEmptyRecord();
  newTransaction: any = this.getEmptyTransaction();

  // =========================
  // INIT
  // =========================
  ngOnInit() {
    const data = localStorage.getItem('records');
    this.records = data ? JSON.parse(data) : [];

    // 🔥 MIGRATE OLD DATA (name → first/middle/last)
    this.records = this.records.map((r: any) => {
      if (!r.firstName && r.name) {
        const parts = r.name.split(' ');
        return {
          ...r,
          firstName: parts[0] || '',
          middleName: parts[1] || '',
          lastName: parts.slice(2).join(' ') || ''
        };
      }
      return r;
    });

    this.saveToStorage();
  }

  // =========================
  // MODELS
  // =========================
  getEmptyRecord() {
    return {
      studentId: '',
      firstName: '',
      middleName: '',
      lastName: '',
      course: '',
      year: '',
      fee: '',
      amount: 0,
      method: '',
      balance: 0,
      status: '',
      date: '',
      receipt: ''
    };
  }

  getEmptyTransaction() {
    return {
      fee: '',
      amount: 0,
      method: '',
      balance: 0,
      status: '',
      date: '',
      receipt: ''
    };
  }

  // =========================
  // STORAGE
  // =========================
  saveToStorage() {
    localStorage.setItem('records', JSON.stringify(this.records));
  }

  // =========================
  // COMPUTE BALANCE
  // =========================
  computeBalance(record: any) {
    const fee = this.feeMap[record.fee] || 0;

    let paid = Number(record.amount || 0);
    if (paid < 0) paid = 0;
    if (paid > fee) paid = fee;

    record.amount = paid;
    record.balance = fee - paid;
    record.status = record.balance === 0 ? 'Paid' : 'Partial';
  }

  // =========================
  // FILE UPLOAD
  // =========================
  onFileSelected(event: any, target: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => target.receipt = reader.result as string;
    reader.readAsDataURL(file);
  }

  // =========================
  // SEARCH STUDENT
  // =========================
  searchStudent() {
  const key = this.searchId.trim();

  if (!key) {
    this.filteredRecords = [];
    return;
  }

  this.filteredRecords = this.records.filter(r =>
    r.studentId.includes(key)
  );
}

  // =========================
  // ADD STUDENT
  // =========================
  addRecord() {

    if (!this.newRecord.firstName?.trim()) {
      alert("First Name is required!");
      return;
    }

    if (!this.newRecord.lastName?.trim()) {
      alert("Last Name is required!");
      return;
    }

    if (!this.newRecord.studentId) {
      alert("Student ID is required!");
      return;
    }

    // 🔥 SAFE DUPLICATE CHECK (ONLY ID)
    const existing = this.records.find(r =>
      r.studentId === this.newRecord.studentId
    );

    if (existing) {
      alert("Student already exists!");
      return;
    }

    this.computeBalance(this.newRecord);

    const student = {
      studentId: this.newRecord.studentId,
      firstName: this.newRecord.firstName,
      middleName: this.newRecord.middleName,
      lastName: this.newRecord.lastName,
      course: this.newRecord.course,
      year: this.newRecord.year,
      transactions: [
        {
          fee: this.newRecord.fee,
          amount: this.newRecord.amount,
          method: this.newRecord.method,
          balance: this.newRecord.balance,
          status: this.newRecord.status,
          date: this.newRecord.date,
          receipt: this.newRecord.receipt
        }
      ]
    };

    this.records.push(student);
    this.saveToStorage();

    window.dispatchEvent(new Event('storage'));

    this.closeAddForm();
  }

  // =========================
  // TRANSACTION
  // =========================
  addTransaction() {
    const student = this.filteredRecords[0];
    if (!student) return;

    this.computeBalance(this.newTransaction);

    student.transactions.push({ ...this.newTransaction });

    this.saveToStorage();
    window.dispatchEvent(new Event('storage'));

    this.closeTransactionForm();
    this.searchStudent();
  }

  deleteTransaction(index: number) {
    const student = this.filteredRecords[0];
    if (!student || !student.transactions) return;

    student.transactions.splice(index, 1);

    this.saveToStorage();
    window.dispatchEvent(new Event('storage'));
  }

  // =========================
  // FORMS
  // =========================
  openAddForm() {
    this.showAddForm = true;
    this.showTransactionForm = false;
  }

  closeAddForm() {
    this.showAddForm = false;
    this.newRecord = this.getEmptyRecord();
  }

  openTransactionForm() {
    if (!this.filteredRecords.length) {
      alert("Search/select a student first.");
      return;
    }

    this.showTransactionForm = true;
    this.showAddForm = false;
    this.newTransaction = this.getEmptyTransaction();
  }

  closeTransactionForm() {
    this.showTransactionForm = false;
    this.newTransaction = this.getEmptyTransaction();
  }

  // =========================
  // EDIT
  // =========================
  editRecord(record: any, index: number) {
    this.selectedRecord = { ...record };
    this.selectedIndex = index;
  }

  saveEdit() {
    this.records[this.selectedIndex] = this.selectedRecord;

    this.saveToStorage();
    window.dispatchEvent(new Event('storage'));

    this.selectedRecord = null;
  }

  cancelEdit() {
    this.selectedRecord = null;
  }
}
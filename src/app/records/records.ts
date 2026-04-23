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

  ngOnInit() {
    const data = localStorage.getItem('records');
    this.records = data ? JSON.parse(data) : [];
    this.filteredRecords = [];
  }

  getEmptyRecord() {
    return {
      studentId: '',
      name: '',
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

  saveToStorage() {
    localStorage.setItem('records', JSON.stringify(this.records));
  }

  // FORMS
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

  // LOGIC
  computeBalance(record: any) {
    const fee = this.feeMap[record.fee] || 0;

    let paid = Number(record.amount || 0);
    if (paid < 0) paid = 0;
    if (paid > fee) paid = fee;

    record.amount = paid;
    record.balance = fee - paid;
    record.status = record.balance === 0 ? 'Paid' : 'Partial';
  }

  onFileSelected(event: any, target: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => target.receipt = reader.result as string;
    reader.readAsDataURL(file);
  }

  findStudent(studentId: string, name: string) {
    return this.records.find(r =>
      r.studentId === studentId ||
      r.name.toLowerCase() === name.toLowerCase()
    );
  }

  // ADD STUDENT
  addRecord() {
    const existing = this.findStudent(
      this.newRecord.studentId,
      this.newRecord.name
    );

    if (existing) {
      alert("Student already exists!");
      return;
    }

    this.computeBalance(this.newRecord);

    this.records = [...this.records, { ...this.newRecord }];
    this.saveToStorage();

    this.closeAddForm();
    this.searchId = '';
    this.filteredRecords = [];
  }

  // ADD TRANSACTION
  addTransaction() {

    const student = this.filteredRecords[0];

    const newEntry = {
      studentId: student.studentId,
      name: student.name,
      course: student.course,
      year: student.year,
      ...this.newTransaction
    };

    this.computeBalance(newEntry);

    this.records = [...this.records, newEntry];
    this.saveToStorage();

    this.closeTransactionForm();
    this.searchId = '';
    this.filteredRecords = [];
  }

  // SEARCH
  searchStudent() {
    const key = this.searchId.trim().toLowerCase();

    if (!key) {
      this.filteredRecords = [];
      return;
    }

    this.filteredRecords = this.records.filter(r =>
      r.studentId.includes(key) ||
      r.name.toLowerCase().includes(key)
    );
  }

  // EDIT / DELETE
  editRecord(record: any, index: number) {
    this.selectedRecord = { ...record };
    this.selectedIndex = index;
  }

  saveEdit() {
    this.computeBalance(this.selectedRecord);
    this.records[this.selectedIndex] = this.selectedRecord;
    this.saveToStorage();
    this.selectedRecord = null;
  }

  cancelEdit() {
    this.selectedRecord = null;
  }

  confirmDelete(index: number) {
    if (confirm("Are you sure you want to delete this record?")) {
      this.records.splice(index, 1);
      this.saveToStorage();
      this.filteredRecords = [];
      this.searchId = '';
    }
  }
}
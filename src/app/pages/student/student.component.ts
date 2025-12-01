import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StudentService } from '../../core/service/student.service';
import { Student } from '../../core/models/Student';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class StudentComponent implements OnInit {

  private studentService = inject(StudentService);
  private fb = inject(FormBuilder);

  students: Student[] = [];
  studentForm: FormGroup;
  editingStudentId: number | null = null;
  submitted = false;

  constructor() {
    this.studentForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadStudents();
  }

  loadStudents() {
    this.studentService.getStudents().subscribe(data => this.students = data);
  }

  onSubmit() {
    this.submitted = true;
    if (this.studentForm.invalid) return;

    const student: Student = this.studentForm.value;

    if (this.editingStudentId) {
      this.studentService.updateStudent(this.editingStudentId, student).subscribe(() => {
        this.loadStudents();
        this.resetForm();
      });
    } else {
      this.studentService.createStudent(student).subscribe(() => {
        this.loadStudents();
        this.resetForm();
      });
    }
  }

  editStudent(student: Student) {
    this.editingStudentId = student.id || null;
    this.studentForm.patchValue(student);
  }

  deleteStudent(id: number) {
    if (confirm('Are you sure to delete this student?')) {
      this.studentService.deleteStudent(id).subscribe(() => this.loadStudents());
    }
  }

  resetForm() {
    this.submitted = false;
    this.editingStudentId = null;
    this.studentForm.reset();
  }

  get formControls() {
    return this.studentForm.controls;
  }
}

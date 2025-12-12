import { TestBed } from '@angular/core/testing';
import { StudentService } from './student.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Student } from '../models/Student';
import { HttpErrorResponse } from '@angular/common/http';

describe('StudentService', () => {
  let service: StudentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StudentService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(StudentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /** ---------------------- getStudents ---------------------- */
  it('should fetch all students', () => {
    const mockStudents: Student[] = [
      { id: 1, firstName: 'John', lastName: 'Doe' },
      { id: 2, firstName: 'Jane', lastName: 'Smith' }
    ];

    service.getStudents().subscribe(students => expect(students).toEqual(mockStudents));

    const req = httpMock.expectOne('/api/students');
    expect(req.request.method).toBe('GET');
    req.flush(mockStudents);
  });

  it('should handle error on getStudents', () => {
    service.getStudents().subscribe({
      next: () => fail('expected an error'),
      error: (err: HttpErrorResponse) => expect(err.status).toBe(500)
    });

    const req = httpMock.expectOne('/api/students');
    req.flush({ message: 'Server error' }, { status: 500, statusText: 'Internal Server Error' });
  });

  /** ---------------------- getStudent ---------------------- */
  it('should fetch a student by id', () => {
    const mockStudent: Student = { id: 1, firstName: 'John', lastName: 'Doe' };

    service.getStudent(1).subscribe(student => expect(student).toEqual(mockStudent));

    const req = httpMock.expectOne('/api/students/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockStudent);
  });

  it('should handle error on getStudent', () => {
    service.getStudent(999).subscribe({
      next: () => fail('expected an error'),
      error: (err: HttpErrorResponse) => expect(err.status).toBe(404)
    });

    const req = httpMock.expectOne('/api/students/999');
    req.flush({ message: 'Not found' }, { status: 404, statusText: 'Not Found' });
  });

  /** ---------------------- createStudent ---------------------- */
  it('should create a student', () => {
    const newStudent: Student = { id: 3, firstName: 'Alice', lastName: 'Brown' };

    service.createStudent(newStudent).subscribe(student => expect(student).toEqual(newStudent));

    const req = httpMock.expectOne('/api/students');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newStudent);
    req.flush(newStudent);
  });

  it('should handle error on createStudent', () => {
    const newStudent: Student = { id: 3, firstName: 'Alice', lastName: 'Brown' };

    service.createStudent(newStudent).subscribe({
      next: () => fail('expected an error'),
      error: (err: HttpErrorResponse) => expect(err.status).toBe(400)
    });

    const req = httpMock.expectOne('/api/students');
    req.flush({ message: 'Bad request' }, { status: 400, statusText: 'Bad Request' });
  });

  /** ---------------------- updateStudent ---------------------- */
  it('should update a student', () => {
    const updatedStudent: Student = { id: 1, firstName: 'John', lastName: 'DoeUpdated' };

    service.updateStudent(1, updatedStudent).subscribe(student => expect(student).toEqual(updatedStudent));

    const req = httpMock.expectOne('/api/students/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedStudent);
    req.flush(updatedStudent);
  });

  it('should handle error on updateStudent', () => {
    const updatedStudent: Student = { id: 1, firstName: 'John', lastName: 'DoeUpdated' };

    service.updateStudent(1, updatedStudent).subscribe({
      next: () => fail('expected an error'),
      error: (err: HttpErrorResponse) => expect(err.status).toBe(404)
    });

    const req = httpMock.expectOne('/api/students/1');
    req.flush({ message: 'Not found' }, { status: 404, statusText: 'Not Found' });
  });

  /** ---------------------- deleteStudent ---------------------- */
  it('should delete a student', () => {
    service.deleteStudent(1).subscribe(res => expect(res).toBeUndefined());

    const req = httpMock.expectOne('/api/students/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should handle error on deleteStudent', () => {
    service.deleteStudent(999).subscribe({
      next: () => fail('expected an error'),
      error: (err: HttpErrorResponse) => expect(err.status).toBe(404)
    });

    const req = httpMock.expectOne('/api/students/999');
    req.flush({ message: 'Not found' }, { status: 404, statusText: 'Not Found' });
  });
});

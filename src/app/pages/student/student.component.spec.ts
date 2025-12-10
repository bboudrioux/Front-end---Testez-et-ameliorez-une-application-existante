import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { StudentComponent } from './student.component';
import { FormBuilder } from '@angular/forms';
import { StudentService } from '../../core/service/student.service';
import { of } from 'rxjs';

describe('StudentComponent', () => {
  let component: StudentComponent;
  let fixture: ComponentFixture<StudentComponent>;
  let studentServiceMock: any;

  const mockStudents = [
    { id: 1, firstName: 'John', lastName: 'Doe' },
    { id: 2, firstName: 'Jane', lastName: 'Smith' }
  ];

  beforeEach(async () => {
    studentServiceMock = {
      getStudents: jest.fn().mockReturnValue(of(mockStudents)),
      createStudent: jest.fn().mockReturnValue(of({})),
      updateStudent: jest.fn().mockReturnValue(of({})),
      deleteStudent: jest.fn().mockReturnValue(of({}))
    };

    await TestBed.configureTestingModule({
      imports: [StudentComponent],
      providers: [
        FormBuilder,
        { provide: StudentService, useValue: studentServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty controls', () => {
    const form = component.studentForm;
    expect(form.get('firstName')?.value).toBe('');
    expect(form.get('lastName')?.value).toBe('');
  });

  it('should load students on init', () => {
    expect(studentServiceMock.getStudents).toHaveBeenCalled();
    expect(component.students).toEqual(mockStudents);
  });

  it('should not submit if form is invalid', () => {
    component.studentForm.patchValue({ firstName: '', lastName: '' });
    component.onSubmit();
    expect(studentServiceMock.createStudent).not.toHaveBeenCalled();
    expect(studentServiceMock.updateStudent).not.toHaveBeenCalled();
  });

  it('should create a new student when form is valid and not editing', fakeAsync(() => {
    component.studentForm.patchValue({ firstName: 'Alice', lastName: 'Brown' });
    component.editingStudentId = null;

    component.onSubmit();
    tick();

    expect(studentServiceMock.createStudent).toHaveBeenCalledWith({ firstName: 'Alice', lastName: 'Brown' });
    expect(studentServiceMock.getStudents).toHaveBeenCalledTimes(2); // ngOnInit + reload
    expect(component.submitted).toBe(false);
    expect(component.editingStudentId).toBeNull();
  }));

  it('should update student when editingStudentId is set', fakeAsync(() => {
    component.studentForm.patchValue({ firstName: 'Alice', lastName: 'Brown' });
    component.editingStudentId = 1;

    component.onSubmit();
    tick();

    expect(studentServiceMock.updateStudent).toHaveBeenCalledWith(1, { firstName: 'Alice', lastName: 'Brown' });
    expect(studentServiceMock.getStudents).toHaveBeenCalledTimes(2);
    expect(component.submitted).toBe(false);
    expect(component.editingStudentId).toBeNull();
  }));

  it('should editStudent populate form and set editingStudentId', () => {
    const student = { id: 1, firstName: 'John', lastName: 'Doe' };
    component.editStudent(student);

    expect(component.editingStudentId).toBe(1);
    expect(component.studentForm.get('firstName')?.value).toBe('John');
    expect(component.studentForm.get('lastName')?.value).toBe('Doe');
  });

  it('should reset form and flags on resetForm', () => {
    component.studentForm.patchValue({ firstName: 'Alice', lastName: 'Brown' });
    component.submitted = true;
    component.editingStudentId = 1;

    component.resetForm();

    expect(component.studentForm.get('firstName')?.value).toBe('');
    expect(component.studentForm.get('lastName')?.value).toBe('');
    expect(component.submitted).toBe(false);
    expect(component.editingStudentId).toBeNull();
  });

  it('should delete student when confirmed', fakeAsync(() => {
    window.confirm = jest.fn().mockReturnValue(true);

    component.deleteStudent(1);
    tick();

    expect(studentServiceMock.deleteStudent).toHaveBeenCalledWith(1);
    expect(studentServiceMock.getStudents).toHaveBeenCalledTimes(2); // ngOnInit + reload
  }));

  it('should not delete student when not confirmed', () => {
    window.confirm = jest.fn().mockReturnValue(false);

    component.deleteStudent(1);

    expect(studentServiceMock.deleteStudent).not.toHaveBeenCalled();
  });
});

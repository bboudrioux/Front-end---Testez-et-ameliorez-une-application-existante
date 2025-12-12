import {Register} from '../models/Register';
import {Observable, of} from 'rxjs';


export class UserMockService {

  register() { jest.fn(() => Promise.resolve())}
  login() { jest.fn(() => Promise.resolve())}
}

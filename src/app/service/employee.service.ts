import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {environment} from "src/environments/environment";
import {Employee} from "../Model/employee";

@Injectable({providedIn: 'root'})
export class EmployeeService {
  constructor(private _http: HttpClient) {
  }
  private urlGetAllEmployee: string = environment.baseUrl + 'Employee/Employees';

  getEmployees(): Observable<Employee[]> {
    return this._http.get<Employee[]>(this.urlGetAllEmployee);
  }
}
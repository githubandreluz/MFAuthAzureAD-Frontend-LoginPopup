import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {Employee} from "../Model/employee";
import {EmployeeService} from "../service/employee.service";

@Injectable({providedIn: 'root'})
export class DataResolverService implements Resolve<Employee[]>{
  constructor(private _employeeService: EmployeeService) {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Employee[]> | Promise<Employee[]> | Employee[] {
    return this._employeeService.getEmployees();
  }
}
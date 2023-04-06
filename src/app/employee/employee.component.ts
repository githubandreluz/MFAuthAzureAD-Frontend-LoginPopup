import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Data} from '@angular/router';
import {Employee} from '../Model/employee';
import {MsalUserService} from '../msaluser.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {

  constructor(private _activatedRoute: ActivatedRoute, private _msaluserService: MsalUserService) {}
  public employeesList: Employee[];

  ngOnInit(): void {
    this._activatedRoute.data.subscribe(
      {
        next: (data: Data) => {
          this.employeesList = data['EmplyeesList'];
        }
      }
    );
  }
  public loginPopup() {
    this._msaluserService.loginPopup();
  }
  public getGruposUsuarioLogado(): string {
    return this._msaluserService.getAllUserGroups().join(" | ");
  }
  ngOnDestroy() {

  }
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeComponent } from './employee.component';
import { RouterModule} from '@angular/router';
import {DataResolverService} from '../Resolver/data-resolver.service';



@NgModule({
  declarations: [
    EmployeeComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class EmployeeModule { }

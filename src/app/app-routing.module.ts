import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MsalGuard} from '@azure/msal-angular';
import {AppComponent} from './app.component';
import {EmployeeComponent} from './employee/employee.component';
import {HomeComponent} from './home/home.component';
import {DataResolverService} from './Resolver/data-resolver.service';

const routes: Routes = [
  {
    path: "employees-list",
    component: EmployeeComponent,
    canActivate: [MsalGuard],
    resolve:
    {
      EmplyeesList: DataResolverService
    }
  },
  {
    path: "home",
    component: HomeComponent,
  }

  ,
  {
    path: "",
    component: HomeComponent,
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

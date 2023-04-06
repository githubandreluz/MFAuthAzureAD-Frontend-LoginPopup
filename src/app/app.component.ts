import {Component, OnInit} from '@angular/core';
import {MsalUserService} from './msaluser.service';
import {MsalBroadcastService, MsalService} from '@azure/msal-angular';
import {AuthenticationResult, EventMessage, EventType, PopupRequest} from '@azure/msal-browser';
import {filter} from 'rxjs/operators';
import {SubSink} from 'subsink';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent implements OnInit {
  title = 'PocFrontendMFAuth';
  constructor(private _msalUserService: MsalUserService, private _msalService: MsalService, private _msalBroadcastService: MsalBroadcastService) {
  }
  subs = new SubSink();

  ngOnInit() {
    this._msalUserService.retrieveLoginInfo();
    console.log("----Passando pelo ngOnInit do app.component");
    this.subs.sink = this._msalBroadcastService.msalSubject$.pipe(
      filter((message: EventMessage) => message.eventType === EventType.LOGIN_SUCCESS)
    ).subscribe((message: EventMessage) => {
      console.log("----Entrou no sbuscribe do login_success");
      const authResult = message.payload as AuthenticationResult;
      this._msalUserService.setAuthenticationStatus(authResult);
      console.log("Resultado da autenticação: ", authResult);
    })

    this.subs.sink = this._msalBroadcastService.msalSubject$.pipe(
      filter((message: EventMessage) => message.eventType === EventType.LOGIN_FAILURE)
    ).subscribe((message: EventMessage) => {
      console.log("----login falhou:", message);
    })
    this.checkPrecisaLogar();
  }
  checkPrecisaLogar() {
    setTimeout(() => {
      if (!this._msalUserService.isAuthenticated)
        this._msalUserService.login();
    }, 1000);
  }
  logout() {
    //this._msalUserService.logout();
    this._msalService.instance.logout();
  }
  isLoggedOn(): boolean {
    return this._msalUserService.isAuthenticated;
  }
  getUserName(): string {
    return this._msalUserService.userAccount.name;
  }
  imprimirObjUsuario() {
    //console.log("Usuario: ", this._msalUserService.clientApplication?.getUser());
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}

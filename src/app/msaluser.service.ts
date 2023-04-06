import {Injectable} from '@angular/core';
//import * as Msal from 'msal';
import {environment} from 'src/environments/environment';
import {Observable} from 'rxjs';
import {MsalBroadcastService, MsalService} from '@azure/msal-angular';
import {AccountInfo, AuthenticationResult, EventMessage, EventType, PopupRequest} from '@azure/msal-browser';
import {filter} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class MsalUserService {
  private accessToken: any;

  constructor(private _msalService: MsalService, private _msalBroadcastService: MsalBroadcastService) {

  }
  private localSessionNameAuthResult: string = "authResult";
  isAuthenticated: boolean = false;
  public userAccount: AccountInfo;
  private authResult: AuthenticationResult;
  private validarUsuarioAtualLogado: string = "";
  private gruposUsuarioLogado: string[] = [];

  public retrieveLoginInfo(): boolean {
    let authResultLocalStorage = this.getAuthResultLocalStorage();

    var activeAccount = this._msalService.instance.getActiveAccount();
    if (activeAccount) {
      this.setAuthenticationStatus(authResultLocalStorage);
      return true;
    } else if (!activeAccount && authResultLocalStorage && this._msalService.instance.getAllAccounts().length > 0) {
      this._msalService.instance.setActiveAccount(authResultLocalStorage.account);
      this.setAuthenticationStatus(authResultLocalStorage);
      return true;
    }
    return false;
  }
  public login() {


    let retrievedLogin = this.retrieveLoginInfo();
    //Caso não tenha contas ativas e nem no cache
    if (!retrievedLogin && this._msalService.instance.getAllAccounts().length == 0) {
      //O parâmetro "prompt=login" força que o usuário tenha que digitar novamente suas credenciais, ainda que já esteja logado com sessão válida no ssitema.
      let request = {scopes: environment.scopeUri, prompt: "login", ResponseMode: "Fragment"} as PopupRequest;
      //redireciona o sistema para a tela de login da microsoft, e após o login efetuado ele volta sozinho para a url que chamou.
      this._msalService.instance.loginRedirect(request);
    }
  }
  private getAuthResultLocalStorage(): AuthenticationResult | null {
    let sAuthResultLocalStorage = localStorage.getItem(this.localSessionNameAuthResult);
    if (!sAuthResultLocalStorage || sAuthResultLocalStorage == '')
      return null;

    return JSON.parse(sAuthResultLocalStorage);
  }
  public setAuthenticationStatus(authResult: AuthenticationResult) {

    this._msalService.instance.setActiveAccount(authResult.account);
    this.userAccount = authResult.account;

    if (authResult != undefined) {
      localStorage.setItem(this.localSessionNameAuthResult, JSON.stringify(authResult));
      this.isAuthenticated = true;
      this.authResult = authResult;
      this.accessToken = authResult.accessToken;
      this.extrairNomesGrupos();
    }
  }
  public GetAccessToken(): Observable<any> {
    return this.accessToken;
  }
  private extrairNomesGrupos(): void {
    //Azure oferece apenas o ID dos grupos criados no portal azure, portanto criei esse metodo para converter os IDs dos grupos em nomes para que possam ser utilizados no frontend.
    let groupsTranslation = [
      {groupId: "6b3c1886-1175-428c-bd80-644957b4b82f", groupName: "HKADMIN"}
    ];
    let userGroupsId: string[] = [];
    if (this.userAccount?.idTokenClaims?.groups != undefined && this.userAccount?.idTokenClaims?.groups != '')
      userGroupsId = this.userAccount?.idTokenClaims?.groups as string[];

    let userGroupsName: string[] = [];
    for (let iUg = 0; iUg < userGroupsId.length; iUg++) {
      let index = groupsTranslation.findIndex(x => x.groupId == userGroupsId[iUg]);
      if (index != -1)
        userGroupsName.push(groupsTranslation[index].groupName);
    }
    this.gruposUsuarioLogado = userGroupsName;
  }

  public getAllUserGroups(): string[] {
    return this.gruposUsuarioLogado;
  }

  public hasGroup(groupName: string): boolean {
    return this.gruposUsuarioLogado && this.gruposUsuarioLogado.findIndex(x => x?.toUpperCase().trim() == groupName.toUpperCase().trim()) != -1;
  }
  public authCallback(errorDesc: string, token: any, error: string, tokenType: any) {
    if (token) {

    } else {
      console.log(error + ':' + errorDesc);
    }
  }

  public logout() {
    setTimeout(() => {window.location.href = environment.redirectUrl}, 4000);
    this._msalService.logout();
  }
  public async loginPopup() {

    this.validarUsuarioAtualLogado = this.userAccount.username;
    let popupRequest: PopupRequest = {scopes: ["User.ReadWrite"], prompt: "login"};
    this._msalService.loginPopup(popupRequest).subscribe((authResult: AuthenticationResult) => {
      console.log("----Entrou no sbuscribe do loginPopup");
      console.log("Resultado da autenticação no popup: ", authResult);
      if (this.validarUsuarioAtualLogado == authResult?.account?.username)
        alert("OK você é o mesmo usuário que já estava logado");
      else
        alert("Erro, você não é o mesmo usuário que estava logado!");
    })

  }
}  
import {HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {tap} from 'rxjs/operators'
import {MsalUserService} from "../msaluser.service";
import {MsalBroadcastService, MsalService} from "@azure/msal-angular";

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private _msalUserService: MsalUserService, private _msalService: MsalService, private _msaBroadcastService: MsalBroadcastService) {

  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let newRequest = req.clone({
      setHeaders: {
        Authorization: 'Bearer ' + this._msalUserService.GetAccessToken()
      }
    });
    console.log('Request is on its way');
    return next.handle(newRequest).pipe(
      tap(
        event => {
          if (event.type === HttpEventType.Response) {
            console.log('Resposta da chamada: ', event.body);
          }
        }
      )
    );
  }
}

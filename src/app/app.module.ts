import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {environment} from "src/environments/environment";
import {MsalModule, MsalInterceptor, MsalInterceptorConfiguration, MsalGuard, MsalBroadcastService, MsalService, MsalRedirectComponent, MsalGuardConfiguration, ProtectedResourceScopes} from "@azure/msal-angular";
import {
  HttpClientModule,
  HttpClient,
  HTTP_INTERCEPTORS,
} from "@angular/common/http";
import {MsalUserService} from "./msaluser.service";
import {AuthInterceptorService} from './Interceptor/auth-Interceptor.service';
import {EmployeeModule} from './employee/employee.module';
import {HomeComponent} from './home/home.component';
import {BrowserCacheLocation, IPublicClientApplication, InteractionType, PublicClientApplication} from '@azure/msal-browser';

export const protectedResourceMap: any = [
  [environment.baseUrl, environment.scopeUri],
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    MsalModule.forRoot(new PublicClientApplication({ // MSAL Configuration
      auth: {
        clientId: environment.uiClientId,
        authority: "https://login.microsoftonline.com/" + environment.tenantId,
        redirectUri: environment.redirectUrl,
      },
      cache: {
        cacheLocation: BrowserCacheLocation.LocalStorage,
        storeAuthStateInCookie: false, // set to true for IE 11
      },
      system: {
        loggerOptions: {
          loggerCallback: () => {},
          piiLoggingEnabled: false
        }
      }
    }), {
      interactionType: InteractionType.Redirect, // MSAL Guard Configuration

    } as MsalGuardConfiguration, {
      interactionType: InteractionType.Redirect, // MSAL Interceptor Configuration
      protectedResourceMap: protectedResourceMap
    } as MsalInterceptorConfiguration),
    EmployeeModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    HttpClient,
    MsalUserService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService, //Meu interceptor custormizado
      multi: true,
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService
  ],
  bootstrap: [AppComponent, MsalRedirectComponent] //para redirecionamento foi necessário colocar a tag </app-redirect> na index.html
})
export class AppModule {}

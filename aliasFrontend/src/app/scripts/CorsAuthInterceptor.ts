import { Injectable, Inject } from '@angular/core';
import { OAuthService, OAuthStorage } from 'angular-oauth2-oidc';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from 'src/app/app.config'
import { filter,tap,map } from 'rxjs/operators';


@Injectable()
export class CorsAuthInterceptor implements HttpInterceptor {

    constructor(private authStorage: OAuthStorage) {}

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let requestToForward = req
        let url = req.url.toLowerCase();

        //add token in request to the backend-api 
        if (url.startsWith(AppSettings.API_ENDPOINT)){
            // if a token exists, add it as a header
            let token = this.authStorage.getItem('access_token');
            if (token && token != ''){
                let header = 'Bearer ' + token;
                requestToForward = req.clone({ setHeaders: { Authorization: header } });
            }
        }
        //request to the OpenID-Connect need the CORS Header in the response
        if (url.startsWith(AppSettings.OPENIDCONNECT_URL)){
            let newUrl = url.replace("https://git.informatik.fh-nuernberg.de","/oidc");
            requestToForward = req.clone({url : newUrl});
        }

        // add the cors header to the response
        return next.handle(requestToForward)
    }
}
import { AuthConfig  } from 'angular-oauth2-oidc';

export class AppSettings {
    public static API_ENDPOINT:string = 'http://localhost:5000/';
    public static FRONTEND_URI:string = 'http://localhost:80';
    public static OPENIDCONNECT_URL:string = 'https://git.informatik.fh-nuernberg.de';
    //public static OPENIDCONNECT_URL:string = '/oidc';

    public static oauthConfig:AuthConfig = {
        issuer: AppSettings.OPENIDCONNECT_URL,
        tokenEndpoint: AppSettings.OPENIDCONNECT_URL + '/oauth/token',
        userinfoEndpoint: AppSettings.OPENIDCONNECT_URL + 'oauth/userinfo',
        redirectUri: AppSettings.FRONTEND_URI +"/home",
        postLogoutRedirectUri:AppSettings.FRONTEND_URI +"/login",
        clientId: '5f3fb8e3039da539f2465f39d10a4aad5336d8c7b4080b5893c97a40db81b8da',
        dummyClientSecret: 'd01d931a4132519919886a33a8665dbb15b3e2a498e049fba88f8b2595e0cdb5',
        responseType: 'code',
        scope: 'email openid',
        showDebugInformation: true,
        oidc: true,
        disablePKCE: true,
        requireHttps: false,
        skipIssuerCheck: true,
        skipSubjectCheck: true,
        strictDiscoveryDocumentValidation: false,
    }      
}

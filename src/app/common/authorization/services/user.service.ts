import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../user';
import { AuthService } from '../../../common/authorization/services/auth.service';
import { UrlHelper } from "../../company/urlHelper";

@Injectable()
export class UserService {
    private user: User = new User();
    private authorizationServerUrl: string;

    constructor(private _http: Http,
        private _authService: AuthService,
        private _urlHelper: UrlHelper) {
        let host: string = location.hostname;
        this.authorizationServerUrl = this._urlHelper.getAuthUrl(host);
    }

    public getUserDetails(): Observable<User> {
        let headers: Headers = this._authService.getHeaders();

        return this._http.get(this.authorizationServerUrl + 'connect/userinfo', {
            headers: headers
        }).map(res => {
            let jsonRes = res.json();

            this.user.name = jsonRes.name;
            this.user.roles = jsonRes.role;

            return this.user;
        });
    }

    private isEmpty(user: User): boolean {
        return typeof (user.name) == 'undefined' || typeof (user.roles) == 'undefined';
    }

    private getUserFromLocalStorage(): User {
        let userInfo: string = localStorage.getItem("userInfo");

        return JSON.parse(userInfo);
    }
}
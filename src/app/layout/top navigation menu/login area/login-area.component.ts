import { Component, OnInit, EventEmitter } from '@angular/core';
import { UserService } from '../../../common/authorization/services/user.service';
import { AuthService } from '../../../common/authorization/services/auth.service';
import { User } from '../../../common/authorization/user';
import { Http, Headers, URLSearchParams, RequestOptions } from '@angular/http';

@Component({
    selector: 'login-area',
    templateUrl: 'login-area.template.html',
    providers: [UserService, AuthService],
    outputs: ['loginClicked']
})

export class LoginAreaComponent {
    public isUserLoggedIn: boolean;
    public loginClicked = new EventEmitter<any>();

    private userName: string;

    constructor(private _authService: AuthService,
        private _http: Http,
        private _userService: UserService) {

        this.isUserLoggedIn = this._authService.isUserLoggedIn();
        this.userName = this.getUserName();
    }

    private getUserName(): string{
        let authDataSerialized = localStorage.getItem("authorizationData");
        if(!authDataSerialized){
            return "";
        }

        let authData = JSON.parse(authDataSerialized);

        return authData.userNameDisplay;
    }
    
    public login(): void {
        this.loginClicked.emit();
    }

    public logoff(): void {
        //this._authService.logout();
        localStorage.removeItem("authorizationData");
		location.href = "/"; 
    }
}
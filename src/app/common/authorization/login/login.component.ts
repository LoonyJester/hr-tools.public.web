import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserLoginData } from './userLoginData';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'login',
    templateUrl: 'login.template.html',
    styleUrls: ['login.style.css'],
    providers: [AuthService]
})

export class LoginComponent{
    public errorMessage: string;
    public loginForm: FormGroup;
    public user: UserLoginData = new UserLoginData();

    constructor(private _authService: AuthService){
        this.loginForm = new FormGroup({
            email: new FormControl({ value: this.user.Email }, Validators.required),
            password: new FormControl({ value: this.user.Password }, Validators.required),
            useRefreshTokens: new FormControl({ value: this.user.UseRefreshTokens }),
        });
    } 

    public onLoginClicked(){
        let that = this;
        this._authService.login(this.user)
            .subscribe(
            response => {
                if (response) {
                    debugger;
                    if (that.user.UseRefreshTokens) {
                        let data = { 
                            token: response.access_token, 
                            userName: this.user.Email,
                            userNameDisplay: response.userNameDisplay,
                            refreshToken: response.refresh_token, 
                            useRefreshTokens: true,
                            expiresAt: response[".expires"] };

                        localStorage.setItem('authorizationData', JSON.stringify(data));
                    }
                    else {
                        let data = { 
                            token: response.access_token, 
                            userName: this.user.Email,
                            userNameDisplay: response.userNameDisplay,
                            refreshToken: "", 
                            useRefreshTokens: false,
                            expiresAt: response[".expires"] };

                        localStorage.setItem('authorizationData', JSON.stringify(data));
                    }

                    localStorage.setItem('roles', response.roles);

                    location.reload();
                } else {
                    debugger;
                    this.errorMessage = "Email or Password is incorrect";
                   // this.showResult(false, "Job Title was not updated", AlertType.Error, false);
                }
            },
            error => {
                debugger;
                this.errorMessage = "Email or Password is incorrect";
                //this.handleError(error);
                //this.cancel();
            });
    }
}
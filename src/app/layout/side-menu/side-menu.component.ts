import { Component, Input } from '@angular/core';
import { TopNavigaitonMenuComponent } from '../top navigation menu/top_nav_menu.component';
import { User } from '../../common/authorization/user';
import { UserService } from '../../common/authorization/services/user.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CompanyHelper } from "../../common/company/companyHelper";
import { UrlHelper } from "../../common/company/urlHelper";
import { ConfigurationService } from '../../common/company/services/configuration.service';
import { ModuleName } from "../../common/company/moduleName";
import { AuthService } from '../../common/authorization/services/auth.service';

@Component({
    selector: 'side-menu',
    templateUrl: 'side-menu.html',
    styleUrls: ['./side-menu.style.css'],
    providers: [CompanyHelper, UrlHelper, UserService, ConfigurationService, AuthService]
})

export class SideMenuComponent {
    public isCoreModuleActive: boolean = false;
    public isPAModuleActive: boolean = false;
    public isATSModuleActive: boolean = false;

    private LogoRelativeUrl: string;
    private stylesUrl: string;
    private secureUrl: any;
    private host: string;

    @Input()
    isOpened: boolean = false;

    constructor(private _userService: UserService,
        private _authService: AuthService,
        private sanitizer: DomSanitizer,
        private _companyHelper: CompanyHelper,
        private _configurationService: ConfigurationService) {
        let host = location.hostname;
        let companyName = this._companyHelper.getCompanyName(host);

        this.LogoRelativeUrl = "assets/img/logo-" + companyName + ".png";
        this.stylesUrl = "app/layout/side-menu/side-menu." + companyName + ".style.css";
        this.secureUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.stylesUrl);

        this.getActiveModulesConfiguration();
    }

    toggleClass(element, className) {
        element.classList.toggle(className);
    }

    isUserLoggedIn(): boolean {
        return this._authService.isUserLoggedIn();
    }

    isUserInRole(roles: Array<string>): boolean {
        return this._authService.isUserInRole(roles);
    }

    private getActiveModulesConfiguration(){
        let result: Array<string>;
        let that = this;

        this._configurationService.getActiveModulesConfiguration()
            .subscribe(response => {
                that.isCoreModuleActive = this.isModuleActive(response, ModuleName.Core);
                that.isPAModuleActive = this.isModuleActive(response, ModuleName.ProjectAssignment);
                that.isATSModuleActive = this.isModuleActive(response, ModuleName.ATS);

                result = response;
            }
            , error => { debugger; result = [] });

        return result;
    }

    private isModuleActive(activeModules: Array<string>, moduleName: ModuleName): boolean{
        if(!activeModules){
            return false;
        }
        
        return activeModules.some(x => x == moduleName);
    }
}
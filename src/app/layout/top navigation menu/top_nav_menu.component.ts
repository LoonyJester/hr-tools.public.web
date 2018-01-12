import { Component, Output, EventEmitter, Input } from '@angular/core';
import { LoginComponent } from '../../common/login/login.component';
import { User } from '../../common/authorization/user';
import { UserService } from '../../common/authorization/services/user.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CompanyHelper } from "../../common/company/companyHelper";
import { UrlHelper } from "../../common/company/urlHelper";

@Component({
    selector: 'top-nav-menu',
    templateUrl: 'top_nav_menu.template.html',
    styleUrls: ["./top_nav_menu.style.css"],
    providers: [CompanyHelper, UrlHelper, UserService],
    outputs: ['menuToggled', 'asideMenuToggled', 'loginClicked']
})

export class TopNavigaitonMenuComponent {
    public isHorizontalMenuOpened: boolean = true;
    public isAsideMenuOpened: boolean = false;
    public menuToggled = new EventEmitter<any>();
    public asideMenuToggled = new EventEmitter<any>();
    public loginClicked = new EventEmitter<any>();
    @Input() isCoreModuleActive: boolean;

    private stylesUrl: string;
    private secureUrl: any;
    private host: string;

    constructor(private sanitizer: DomSanitizer,
        private _companyHelper: CompanyHelper) {
        let host = location.hostname;

        this.stylesUrl = "app/layout/top navigation menu/top_nav_menu." + this._companyHelper.getCompanyName(host) + ".style.css";
        this.secureUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.stylesUrl);
    }

    public toggleMenu(): void {
        this.isHorizontalMenuOpened = !this.isHorizontalMenuOpened;

        this.menuToggled.emit(this.isHorizontalMenuOpened);
    }

    public toggleAsideMenu(): void {
        this.isAsideMenuOpened = !this.isAsideMenuOpened;

        this.asideMenuToggled.emit(this.isAsideMenuOpened);
    }

    public onLoginClicked(event){
        this.loginClicked.emit();
    }
}


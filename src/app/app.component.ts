import { Component, ViewEncapsulation, Pipe, PipeTransform, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ViewContainerRef } from '@angular/core';
import { AuthService } from './common/authorization/services/auth.service';
import { Http, URLSearchParams } from '@angular/http';
import { UrlHelper } from "./common/company/urlHelper";
import { ConfigurationService } from './common/company/services/configuration.service';
import { ModuleName } from "./common/company/moduleName";

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) { }
    transform(url) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
}

@Component({
    selector: 'app',
    templateUrl: 'app.template.html',
    encapsulation: ViewEncapsulation.None,
    providers: [ConfigurationService, AuthService]
})

export class AppComponent {
    private viewContainerRef: ViewContainerRef;
    private isHorizontalMenuOpened: boolean = true;
    private isAsideMenuOpened: boolean = false;
    public showLoginPage: boolean = false;

    public isCoreModuleActive: boolean;


    public constructor(viewContainerRef: ViewContainerRef,
        private _authService: AuthService,
        private _http: Http,
        private _urlHelper: UrlHelper,
        private _configurationService: ConfigurationService
    ) {
    }

    ngOnInit(){
        this.isModulesActive();
    }

    private isModulesActive(): boolean{
        let that = this;

        this._configurationService.getActiveModulesConfiguration()
            .subscribe(response => {
                that.isCoreModuleActive = this.isModuleActive(response, ModuleName.Core);
            }
            , error => { debugger; });

        return that.isCoreModuleActive;
    }

    private isModuleActive(activeModules: Array<string>, moduleName: ModuleName): boolean{
        if(!activeModules){
            return false;
        }
        
        return activeModules.some(x => x == moduleName);
    }

    public onMenuToggled(event: any): void {
        this.isHorizontalMenuOpened = event;
    }

    public onAsideMenuToggled(event: any): void {
        this.isAsideMenuOpened = event;
    }

    public onLoginClicked(event){
        this.showLoginPage = true;
    }
}
import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';


@Component({
    selector: 'app-header',
    templateUrl: './header.page.html'
})
export class HeaderPage implements OnInit {

    @Input() title: string;
    @Input() showLanguage: boolean = true;
    @Input() showBack: boolean = true;

    constructor(private translate: TranslateService,
        private _location: Location) { }

    ngOnInit() {
    }

    back() {
        this._location.back();
    }

    setLanguage(lang: string) {
        this.translate.setDefaultLang(lang);
        this.translate.use(lang);
    }

}

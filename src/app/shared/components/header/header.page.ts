import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';


@Component({
    selector: 'app-header',
    templateUrl: './header.page.html'
})
export class HeaderPage implements OnInit {

    @Input() title: string;
    @Input() showLanguage: boolean = true;
    @Input() showBack: boolean = true;
    @Input() showCurrentPlayer: boolean = false;


    constructor(
        private translate: TranslateService,
        public fAuth: AngularFireAuth,
        private _location: Location,
        private router: Router) { }

    ngOnInit() {
    }

    back() {
        this._location.back();
    }

    setLanguage(lang: string) {
        this.translate.setDefaultLang(lang);
        this.translate.use(lang);
    }

    getCurrentUser() {
        let currentPlayer = JSON.parse(localStorage.getItem('currentPlayer'));
        return `${currentPlayer.firstname} ${currentPlayer.lastname}`;
    }

    logout() {
        localStorage.removeItem('userId');
        localStorage.removeItem('isUserAdmin');
        this.fAuth.auth.signOut();
        return this.router.navigateByUrl('/login');
    }
}

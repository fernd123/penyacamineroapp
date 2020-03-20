import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/services/user.service';
import { PlayerService } from 'src/app/services/player.service';
import { Player } from 'src/app/models/player.model';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public userForm: FormGroup;
  public errorMessage: string;
  private user: User;
  private player: Player;

  constructor(public fAuth: AngularFireAuth,
    public formBuilder: FormBuilder,
    private translateService: TranslateService,
    private userService: UserService,
    private playerService: PlayerService,
    private loadingCtrl: LoadingController,
    private router: Router) {
  }

  ngOnInit() {
    this.userForm = this.buildFormGroup();
  }

  protected buildFormGroup(): FormGroup {
    let mailRember = localStorage.getItem('mail');
    let passwordRemember = localStorage.getItem('password');

    return this.formBuilder.group({
      email: [mailRember, [Validators.required, Validators.email]],
      password: [passwordRemember, Validators.required],
      rememberme: [true, null]
    });
  }

  async login(form: any) {

    let loading = await this.loadingCtrl.create({
      message: this.translateService.instant('loading')
    });

    loading.present();

    let rememberme = this.userForm.get('rememberme').value;
    if (rememberme) {
      localStorage.setItem('mail', this.userForm.get('email').value);
      localStorage.setItem('password', this.userForm.get('password').value)
    } else {
      localStorage.removeItem('mail');
      localStorage.removeItem('password');
    }

    try {
      var response = await this.fAuth.auth.signInWithEmailAndPassword(
        this.userForm.get('email').value,
        this.userForm.get('password').value
      );
      if (response) {
        this.userService.getUserByFirebaseId(response.user.uid).then(snapshot => {
          if (snapshot.empty) {
            loading.dismiss();
            console.log('No matching documents.');
            return;
          }
          let userId = "";
          let isUserAdmin = false;
          snapshot.forEach(doc => {
            userId = doc.id;
            isUserAdmin = doc.data().isAdmin;
          });

          this.playerService.getPlayerByParameterId("userId", userId).then(snapshot => {
            if (snapshot.empty) {
              loading.dismiss();
              console.log('No matching documents.');
              return;
            }
            snapshot.forEach(doc => {
              localStorage.setItem('userId', userId);
              localStorage.setItem('isUserAdmin', isUserAdmin + "");
              localStorage.setItem('playerId', doc.id);
              localStorage.setItem('currentPlayer', JSON.stringify(doc.data()));
            });

            loading.dismiss();
            this.errorMessage = null;
            console.log("Successfully logged in!");
            this.router.navigateByUrl('/home');
          });


        })
          .catch(err => {
            console.log('Error getting documents', err);
            loading.dismiss();
          });
      }

    } catch (err) {
      console.error(err);
      this.errorMessage = this.translateService.instant("login." + err.code);
      loading.dismiss();
    }
  }
}

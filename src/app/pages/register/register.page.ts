import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from 'src/app/models/user.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Player } from 'src/app/models/player.model';
import { PlayerService } from 'src/app/services/player.service';
import { TranslateService } from '@ngx-translate/core';
import { getDate } from 'src/app/models/parent.model';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  public user: User = new User();
  public userForm: FormGroup;
  public errorMessage: string;

  constructor(
    public fAuth: AngularFireAuth,
    public formBuilder: FormBuilder,
    public translateService: TranslateService,
    private playerService: PlayerService,
    private userService: UserService,
    private toastController: ToastController,
    private router: Router,
    private loadingCtrl: LoadingController
  ) {
  }

  ngOnInit() {
    this.userForm = this.buildFormGroup();
  }

  protected buildFormGroup(): FormGroup {
    return this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      nickname: ['', null],
      birthday: [null, Validators.required],
      mainPosition: ['', Validators.required],
      secondPosition: ['', null],
      thirdPosition: ['', null],
      leg: ['leg.right', Validators.required],
      status: ['status.noob', null],
      active: [true, null],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  async onSubmit() {

    let loading = await this.loadingCtrl.create({
      message: this.translateService.instant('loading')
    });
    loading.present();

    // Create the user
    try {
      var response = await this.fAuth.auth.createUserWithEmailAndPassword(
        this.userForm.get('email').value,
        this.userForm.get('password').value
      );
      if (response) {
        // Create the user collection
        let user: User = this.getUserFromForm(response.user.uid);
        this.userService.addUser(user).then(resUser => {
          // Create the player
          let player: Player = this.getPlayerFromForm(resUser.id);
          this.playerService.addPlayer(player).then(async resPlayer => {
            this.errorMessage = null;
            console.log("Successfully registered!");
            const toast = await this.toastController.create({
              message: this.translateService.instant('register.saveSuccess'),
              duration: 2000
            });
            loading.dismiss();
            toast.present();
            this.router.navigateByUrl('/login');
          }, error => {
            loading.dismiss();
            console.log(error);
            this.errorMessage = error.message;
          });
        }, error => {
          loading.dismiss();
          console.log(error);
          this.errorMessage = error.message;
        });
      }
    } catch (err) {
      loading.dismiss();
      console.error(err);
      this.errorMessage = this.translateService.instant("login." + err.code);
    }
  }

  private getUserFromForm(userId: string): any {
    let user: any = {};
    user.creationDate = getDate();
    user.firebaseUserId = userId;
    user.email = this.userForm.get('email').value;
    user.password = this.userForm.get('password').value;
    user.isAdmin = false;
    return user;
  }

  private getPlayerFromForm(userId: string): any {
    let player: any = {};
    player.firstname = this.userForm.get('firstname').value;
    player.lastname = this.userForm.get('lastname').value;
    player.nickname = this.userForm.get('nickname').value;
    player.birthday = this.userForm.get('birthday').value;
    player.status = this.userForm.get('status').value;
    player.leg = this.userForm.get('leg').value;
    player.mainPosition = this.userForm.get('mainPosition').value;
    player.userId = userId;
    player.active = true;
    return player;
  }
}

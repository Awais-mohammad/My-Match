
import { HomePage } from './../home/home.page';
import { AlertController } from "@ionic/angular";
import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { auth } from "firebase";
import { AngularFireAuth } from "angularfire2/auth";
import * as firebase from "firebase/app";
import { Observable } from "rxjs";
import { ActionSheetController } from "@ionic/angular";
import { ToastController } from "@ionic/angular";
import { Message } from '@angular/compiler/src/i18n/i18n_ast';


@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  
  constructor(
    public router: Router,
    private firebaseAuth: AngularFireAuth,
    private actionsheet: ActionSheetController,
    private toastcontroller: ToastController,
    private alertcontroller:AlertController,
    
    
  ) {
    this.firebaseAuth.authState.subscribe((user) => {
      if (user && user.uid && user.emailVerified)
        this.authemail = this.firebaseAuth.auth.currentUser.emailVerified;
    });
  }
  

authemail:boolean;
  email: string;
  pass: string;

 
  gotoSignup() {
    this.router.navigate(["signup"]);
  }

  user: Observable<firebase.User>;

  validator() {
    this.email = this.email.toLowerCase();
    if (!this.email) {
      alert("Email Field Empty!");
    } else if (!this.pass) {
      alert("Password Field Empty!");
    } else if (this.pass.length < 6) {
      alert("Password too short!");
    } else if (
      this.email[this.email.length - 1] != "m" &&
      this.email[this.email.length - 2] != "o" &&
      this.email[this.email.length - 3] != "c" &&
      this.email[this.email.length - 4] != "."
    ) {
      alert("Invalid Email format!");
    } else {
      this.login();
    }
  }
  login() {
    this.firebaseAuth.auth
      .signInWithEmailAndPassword(this.email, this.pass)
      .then((billa) => {
        if(billa.user.emailVerified){
        this.router.navigate(["home"]);
        
        }
        else {
          this.firebaseAuth.auth.signOut();
          this.ConfirmMail();
          
        }
      })
      .catch((billi) => {
        alert(billi.message);
      });
  }
 
 
  async ConfirmMail() {
    const alert = await this.alertcontroller.create({
      header: "Account Unactived",
      message: "Your account is not verified kindly check email for verfication",
      buttons: [
        {
          text: "Cancel",
          role: "destructive",
          cssClass: "secondary",
          handler: (blah) => {},
        },
        {
          text: "Resend",
          handler: () => {
            this.Dophoneauth();
          },
        },
      ],
    });

    await alert.present();
  }
  Dophoneauth(){
    this.firebaseAuth.auth.currentUser.sendEmailVerification();
  }
  checkemail() {
    if (!this.email) {
      alert("Type in your email first");
    } else {
      this.passwordReseter();
    }
  }

  async passwordReseter() {
    const actionSheet = await this.actionsheet.create({
      cssClass: "secondary",
      header: "RESET PASSWORD",
      subHeader: "Click OKAY below to reset your password",
      buttons: [
        {
          text: "OKAY",
          icon: "checkmark-outline",
          cssClass: "secondary",
          handler: () => {
            this.resetPass();
          },
        },
      ],
    });
    await actionSheet.present();
  }

 async resetPass() {
    this.firebaseAuth.auth
      .sendPasswordResetEmail(this.email)
      .then(async (data) => {
        console.log(data);
        const toast = await this.toastcontroller.create({
          message: 'email sent successfully',
          duration: 2000
        });
        toast.present();
      })
      .catch((erro) => {
      alert(erro.message);
    
      });
  }

  
  
ngOnInit(){

}
}

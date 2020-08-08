import { Router } from "@angular/router";
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireModule, FirebaseAuth } from "angularfire2";
import { environment } from "./../environments/environment";
import { AuthService } from "./auth.service";
import { Component } from "@angular/core";
import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { Subscription } from 'rxjs';

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  constructor(
    public authService: AuthService,
    private platform: Platform,
    public fireauth: AngularFireAuth,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router
  ) {
    this.checkLogin();
    this.initializeApp();
  }

  checkLogin() {
    this.fireauth.authState.subscribe((res) => {
      if (res && res.uid) {
        console.log("user Logged in!");
      } else {
        this.router.navigate(["login"]);
      }
    });
  }

  private backDisbale: Subscription;
  initializeApp() {
    this.platform.ready().then(() => {
      this.checkLogin();
      const backDisbale=this.platform.backButton.subscribeWithPriority(999,()=>{})
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnDestroy(){
   this.backDisbale.unsubscribe();
  }
}

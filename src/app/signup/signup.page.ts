import { auth } from "firebase";
import { Message } from "@angular/compiler/src/i18n/i18n_ast";
import { ToastController } from "@ionic/angular";
import { AuthService } from "./../auth.service";
import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { AngularFireAuth } from "angularfire2/auth";
import * as firebase from "firebase/app";
import { AngularFirestore } from "angularfire2/firestore";
import { AlertController, NavController } from "@ionic/angular";
import { Observable } from "rxjs";
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject,
} from "@ionic-native/file-transfer/ngx";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
@Component({
  selector: "app-signup",
  templateUrl: "./signup.page.html",
  styleUrls: ["./signup.page.scss"],
})
export class SignupPage implements OnInit {
  constructor(
    public router: Router,
    private firebaseAuth: AngularFireAuth,
    public toastControll: ToastController,
    private firestore: AngularFirestore,
    private authserve: AuthService,
    public alertcontroller: AlertController,
    public transfer: FileTransfer,
    private camera: Camera
  ) {
    this.database = firebase.firestore;
  }
  email: string;
  password: string;
  alertCtrl: any;
  confirmpassword: string;
  signuping: boolean = false;
  userform: boolean = false;
  phone: string;
  status: string;
  verificationCode: string;
  firstname: string;
  lastname: string;
  username: string;
  adress: string;
  state: string;
  city: string;
  zip: string;
  cellphone: string;
  policy: string;
  updatepassword: boolean;
  database: any;
  authEmail: boolean = false;
  msg: string;
  profImage: boolean = false;
  imageData;
  clickedImage: string;
  ID: string;

  gotoLogin() {
    this.router.navigate(["login"]);
  }
  gotoHome() {
    this.router.navigate(["home"]);
  }

  async validator() {
    this.email = this.email.toLowerCase();
    if (!this.password) {
      this.msg = "Required field password";
      this.presentToast();
    } else if (this.password.length < 6) {
      const toast = await this.toastControll.create({
        message: "Password cannot be less than 6",
        duration: 3000,
      });
      toast.present();
    } else if (!this.email) {
      alert("email required");
    } else if (
      this.email[this.email.length - 1] != "m" &&
      this.email[this.email.length - 2] != "o" &&
      this.email[this.email.length - 3] != "c" &&
      this.email[this.email.length - 4] != "."
    ) {
      const toast = await this.toastControll.create({
        message: "Invalid email format",
        duration: 3000,
      });
      toast.present();
    } else if (!this.confirmpassword) {
      const toast = await this.toastControll.create({
        message: "please confirm your password",
        duration: 3000,
      });
      toast.present();
    } else if (this.confirmpassword != this.password) {
      const toast = await this.toastControll.create({
        message: "Passwords don't match",
        duration: 3000,
      });
      toast.present();
    } else if (!this.status) {
      this.msg = "please provide your status";
      this.presentToast();
    } else {
      this.signup();
    }
  }
  user: Observable<firebase.User>;
  checkVerify() {
    this.firebaseAuth.auth
      .signInWithEmailAndPassword(this.email, this.password)
      .then(() => {
        if (this.firebaseAuth.auth.currentUser.emailVerified) {
          console.log(this.firebaseAuth.auth.currentUser.emailVerified);
          this.router.navigate(["home"]);
        } else {
          this.firebaseAuth.auth.signOut();
          console.log(this.firebaseAuth.auth.currentUser.emailVerified);
          alert("Email not verified");
        }
      });
  }

  signup(){
    
    this.firebaseAuth.auth
    .createUserWithEmailAndPassword(this.email, this.password)
    .then((value) => {
      const authSub = this.firebaseAuth.authState.subscribe((res) => {
        const firstname = this.firstname;
        const lastname = this.lastname;
        const username = this.username;
        const adress = this.adress;
        const state = this.state;
        const city = this.city;
        const email = this.email;
        const password = this.password;
        const status = this.status;
        const zip = this.zip;
        const cellphone = this.cellphone;
        const userID=res.uid;
        const joinedTime = firebase.firestore.Timestamp.fromDate(new Date());
        this.firestore
          .collection("usersdata")
          .doc(res.uid)
          .set({
            firstname,
            lastname,
            username,
            adress,
            joinedTime,
            state,
            city,
            email,
            password,
            userID,
            status,
            zip,
            cellphone,
          })
          .then(() => {
            res.sendEmailVerification().then(() => {
              authSub.unsubscribe();
              this.firebaseAuth.auth.signOut();
              this.signuping=true;
            });
          });
      });
      console.log(value);
     
    })
    .catch((err) => {
      alert(err + Message);
    });
  }

  unameCheck() {
    this.firestore.collection("usersdata", (ref) => ref.where("username", "==", this.username)).get().subscribe((res:any)=>{
      if (res.length>0){
        console.log("user Exists!");
      } else {
        this.signup();
      }
    })
   
  }

  async presentToast() {
    const toast = await this.toastControll.create({
      message: this.msg,
      duration: 4000,
    });
    toast.present();
  }

  takePhoto() {
    let options = {
      quality: 30,
      targetHeight: 1200,
    };
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.imageData = imageData;
      this.imageLoad();
    });
  }

  imageLoad() {
    const fileTransfer: FileTransferObject = this.transfer.create();
    let options1: FileUploadOptions = {
      fileKey: "file",
      fileName: this.ID + ".jpg",
      headers: {},
    };

    fileTransfer
      .upload(this.imageData, "https://fuk.ekniazi.com/upload.php", options1)
      .then(
        (data) => {
          alert("We got yur image in our servers");
          this.clickedImage =
            "https://fuk.ekniazi.com/uploads/" + this.ID + ".jpg";
          const imageURL = this.clickedImage;
          alert("Image url saved" + JSON.stringify(this.clickedImage));
          alert("Image url at firestore" + JSON.stringify(imageURL));
          this.saveImage();
        },
        (err) => {
          // error
          alert("error" + JSON.stringify(err));
        }
      );
  }

  saveImage() {
    const imageURL = this.clickedImage;
    this.firestore
      .collection("usersdata")
      .doc(this.firebaseAuth.auth.currentUser.uid)
      .update({
        imageURL,
      });
    alert("image updated successfully");
    this.signuping = true;
  }
  ngOnInit() {}
}

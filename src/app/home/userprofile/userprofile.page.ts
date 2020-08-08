import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { AngularFireAuth } from "angularfire2/auth";
import { AlertController, NavController } from "@ionic/angular";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { ToastController } from "@ionic/angular";
import { ActionSheetController } from "@ionic/angular";
import { AngularFirestore } from "angularfire2/firestore";
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject,
} from "@ionic-native/file-transfer/ngx";
@Component({
  selector: "app-userprofile",
  templateUrl: "./userprofile.page.html",
  styleUrls: ["./userprofile.page.scss"],
})
export class UserprofilePage implements OnInit {
  userProfileCollection: any;

  constructor(
    private routin: Router,
    private auth: AngularFireAuth,
    public alertController: AlertController,
    public navcontrol: NavController,
    public toastController: ToastController,
    private firestore: AngularFirestore,
    public controlaction: ActionSheetController,
    private firebaseAuth: AngularFireAuth,
    public transfer: FileTransfer,
    private camera: Camera
  ) {}

  userPost: any;
  showposts: boolean = true;
  daysDifference: number;
  hoursDifference: number;
  minutesDifference: number;
  secondsDifference: number;
  timeAgo: string;
  poster: boolean = false;
  otherUsers: any;
  searchusers: any;
  imageURL: any = false;
  search: boolean = false;
  clickedImage: string;
  show: boolean = false;
  selectedPhoto: any;
  ID: string;
  currentImage: any;
  imageData;
  description: string;
  comment: string;
  comdata: any;
  showcomments: boolean = false;
  updatepassword: boolean;
  userData: any;
  newPass: string;
  userprofile: boolean = false;
  onlyshowEdit: boolean = false;

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: "Are you sure?",
      message: "Confirming this will log you out.",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {},
        },
        {
          text: "Accept",
          handler: () => {
            this.auth.auth.signOut();
          },
        },
      ],
    });

    await alert.present();
  }

  check() {}
  async confirmingupdatepasword() {
    const alert = await this.alertController.create({
      header: "Update password verification",
      message: "Are you sure you want to update yur password",
      buttons: [
        {
          text: "No",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {},
        },
        {
          text: "Yes",
          handler: () => {
            this.changepassword();
          },
        },
      ],
    });

    await alert.present();
  }

  changepassword() {
    this.auth.authState.subscribe(async (cuser) => {
      cuser.updatePassword(this.newPass);
      if (!cuser.updatePassword) {
        alert("password not updated");
      } else {
        alert("password updated");
      }
    });
  }

  logout() {
    console.log("loging out");
    this.auth.auth.signOut;
  }

  addcom() {
    const usercomment = this.firebaseAuth.auth.currentUser.uid;
    const comment = this.comment;
    const user = this.firestore
      .collection("posts")
      .doc(this.firebaseAuth.auth.currentUser.uid)
      .update({
        comment,
      });
    alert("comment added successfully");
  }

  updateprof() {
    this.routin.navigate(["editprofile"]);
  }

  async showmore() {
    const actionSheet = await this.controlaction.create({
      header: "Albums",
      buttons: [
        {
          text: "Change Password",
          role: "okay",
          handler: () => {
            this.updatepassword = true;
          },
        },
        {
          text: "Edit Profile",
          role: "okay",
          handler: () => {
            this.routin.navigate(["editprofile"]);
          },
        },
        {
          text: "Logout",
          role: "okay",
          handler: () => {
            this.presentAlertConfirm();
          },
        },

        { text: "Cancel", role: "cancel" },
      ],
    });

    await actionSheet.present();
  }

  resetpasswordfalse() {
    this.updatepassword = false;
  }

  async Delete() {
    const alert = await this.alertController.create({
      header: "Are you sure?",
      message: "Please Contact us for deleting profile data",
      buttons: [
        {
          text: "YES",
          cssClass: "secondary",
          handler: () => {
            this.routin.navigate(["home/aboutus"]);
          },
        },
      ],
    });

    await alert.present();
  }

  timeCalc(timeThen) {
    var date2 = new Date();
    var date = new Date(timeThen);
    var difference = date2.getTime() - date.getTime();
    this.daysDifference = difference / 1000 / 60 / 60 / 24;
    this.hoursDifference = difference / 1000 / 60 / 60;
    this.minutesDifference = difference / 1000 / 60;
    this.secondsDifference = difference / 1000;
    if (this.secondsDifference < 60) {
      this.timeAgo = Math.floor(this.secondsDifference) + " seconds ago";
      return this.timeAgo;
    } else if (this.minutesDifference < 60) {
      this.timeAgo = Math.floor(this.minutesDifference) + " minutes ago";
      return this.timeAgo;
    } else if (this.hoursDifference < 24) {
      this.timeAgo = Math.floor(this.hoursDifference) + " hours ago";
      return this.timeAgo;
    } else {
      this.timeAgo = Math.floor(this.daysDifference) + " days ago";
      return this.timeAgo;
    }
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
    this.firestore.collection("usersdata").doc(this.firebaseAuth.auth.currentUser.uid).update({
      imageURL,
      
    });
    alert('image updated successfully')
  }

  addpost() {
    this.poster = !this.poster;
  }

  getuserdata() {
    const authSub = this.auth.authState.subscribe((res) => {
      const values = this.firestore
        .collection("usersdata")
        .doc(this.ID)
        .valueChanges()
        .subscribe((udata) => {
          this.userData = udata;
          this.userData.joinedAgo = this.timeCalc(
            this.userData.joinedTime.timestampValue
          );
         console.log("usersdata=>",this.userData)
          authSub.unsubscribe();
          values.unsubscribe();
        });
    });
  }
  
  doRefresh(event) {
    console.log('Begin async operation');

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  ngOnInit() {
    const authsub = this.firebaseAuth.authState.subscribe((res) => {
      this.ID = res.uid;
      authsub.unsubscribe();
    });
    this.getuserdata();
   
  }
}

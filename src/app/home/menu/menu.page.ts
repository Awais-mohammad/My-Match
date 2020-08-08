import { CommentsPage } from "./../../comments/comments.page";
import { ShowUserPage } from "./../../show-user/show-user.page";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { Component, OnInit, Input } from "@angular/core";
import { AngularFirestore } from "angularfire2/firestore";
import { AngularFireAuth } from "angularfire2/auth";
import * as firebase from "firebase";
import { ModalController } from "@ionic/angular";
import { firestore } from "firebase/app";
import { FileTransfer, FileUploadOptions, FileTransferObject } from "@ionic-native/file-transfer/ngx";
import { Router } from "@angular/router";
import { ChatPage } from "src/app/chat/chat.page";
import { HostListener } from "@angular/core";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.page.html",
  styleUrls: ["./menu.page.scss"],
})
export class MenuPage implements OnInit {
  scrWidth: any;

  @HostListener("window:resize", ["$event"])
  getScreenSize(event?) {
    this.scrWidth = window.innerWidth;
    console.log("Width", this.scrWidth);
  }

  constructor(private firestore: AngularFirestore, private firebaseAuth: AngularFireAuth, public transfer: FileTransfer, private camera: Camera, private routin: Router, public modalController: ModalController) {
    this.getScreenSize();
  }
  alertController: any;
  otherUsers: any;
  searchusers: any;
  imageURL: any = false;
  search: boolean = false;
  clickedImage: string;
  show: boolean = false;
  selectedPhoto: any;
  ID: string;
  currentImage: any;
  postID: string;
  uname: string;
  searchuser: boolean = false;
  imageData;
  uProf: any;

  async openModel(userData) {
    const modal = await this.modalController.create({
      component: ShowUserPage,
      cssClass: "my-custom-class",
      id: "showuser",
      componentProps: {
        userData: userData,
      },
    });
    return await modal.present();
  }

  async ChatModel(userData) {
    const model = await this.modalController.create({
      component: ChatPage,
      cssClass: "my-custom-class",
      id: "chat",
      componentProps: {
        userData: userData,
      },
    });
    return await model.present();
  }

  async comment(post: any) {
    const model = await this.modalController.create({
      component: CommentsPage,
      cssClass: "my-custom-class",
      id: "comment",
      componentProps: {
        post: post,
      },
    });
    return await model.present();
  }

  showUsers() {
    const userSub = this.firestore
      .collection("usersdata", (ref) => ref.limit(3))
      .valueChanges()
      .subscribe((res1) => {
        this.otherUsers = res1;
        userSub.unsubscribe();
      });
    this.show = !this.show;
  }
  searc: any;

  showsearchcontent() {
    this.search = !this.search;
  }

  searchUsers() {
    const userSearch = this.firestore
      .collection("usersdata", (ref) => ref.where("username", "==", this.uname))
      .valueChanges()
      .subscribe((res1) => {
        this.searchusers = res1;
        console.log(this.searchusers);
        userSearch.unsubscribe();
      });
  }

  Profpage: boolean = true;

  takePhoto() {
    let options = {
      quality: 30,
      targetHeight: 1200,
    };

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.imageData = imageData;
      this.generateKey("posts");
      this.imageLoad();
    });
  }

  generateKey(collName: string) {
    const id = firebase.firestore().collection(collName).doc().id;
    this.postID = id;
  }

  imageLoad() {
    const fileTransfer: FileTransferObject = this.transfer.create();
    let options1: FileUploadOptions = {
      fileKey: "file",
      fileName: this.postID + ".jpg",
      headers: {},
    };

    fileTransfer.upload(this.imageData, "https://fuk.ekniazi.com/upload.php", options1).then(
      (data) => {
        alert("Image Clicked");
        this.clickedImage = "https://fuk.ekniazi.com/uploads/" + this.postID + ".jpg";
      },
      (err) => {
        // error
        alert("error" + JSON.stringify(err));
      }
    );
  }

  poster: boolean = false;

  addpost() {
    this.poster = !this.poster;
  }
  description: string;

  uploadpost() {
    if (!this.description) {
      alert("please add description to yur post");
    } else {
      const descrip = this.description;
      const imageURL = this.clickedImage;
      const ID = this.postID;
      alert(JSON.stringify(this.clickedImage));
      this.firestore
        .collection("posts")
        .doc(this.postID)
        .set({
          ID,
          descrip,
          imageURL,
        })
        .then(() => {
          this.getPosts();
        })
        .catch(function (error) {
          console.log("error adding document");
        });

      this.poster = !this.poster;
    }
  }
  userPost: any[];
  showposts: boolean = true;

  getPosts() {
    this.firestore
      .collection("posts", (refe) => refe.limit(3))
      .valueChanges()
      .subscribe((res1) => {
        this.userPost = res1;
        console.log("The posts are:", this.userPost);
      });
    console.log("The posts are:", this.userPost);
  }

  comdata: any;
  showcomments: boolean = false;

  doRefresh(event) {
    console.log("Begin async operation");

    setTimeout(() => {
      console.log("Async operation has ended");
      event.target.complete();
    }, 2000);
  }

  like: boolean = false;

  addlike(post: any) {
    const liked = this.ID;
    this.firestore
      .collection("posts")
      .doc(post.ID)
      .update({
        likes: firestore.FieldValue.arrayUnion({
          liked,
        }),
      })
      .then(() => {
        console.log("post liked", post.ID);
        this.checkLikes();
      })
      .catch(() => {
        console.log("not liked");
      });
  }

  Posts: any[];

  checkLikes() {
    this.firestore
      .collection("posts")
      .valueChanges()
      .subscribe((res) => {
        this.Posts = res;
        for (var i = 0; i < this.Posts.length; i++) {
          if (this.Posts[i].likes)
            for (var j = 0; j < this.Posts[i].likes.length; j++) {
              console.log("iterating into liked array");
              if (this.Posts[i].likes[j].liked == this.ID) {
                this.Posts[i].like = true;
                console.log(this.Posts[i].like);
                console.log("User Liked posts are:", this.Posts[i].likes[j].liked);
              } else {
                console.log("user didnt liked any post");
              }
            }
        }
      });
  }

  ngOnInit() {
    const authsub = this.firebaseAuth.authState.subscribe((res) => {
      this.ID = res.uid;
      authsub.unsubscribe();
    });
    this.poster = false;
    this.getPosts();
    this.checkLikes();
  }
}

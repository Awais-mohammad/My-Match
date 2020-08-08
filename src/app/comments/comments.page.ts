import { Message } from "@angular/compiler/src/i18n/i18n_ast";
import { AngularFirestore } from "angularfire2/firestore";
import { Component, OnInit, Input } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { firestore, analytics } from "firebase/app";
import { AngularFireAuth } from "angularfire2/auth";
import * as firebase from "firebase";

@Component({
  selector: "app-comments",
  templateUrl: "./comments.page.html",
  styleUrls: ["./comments.page.scss"],
})
export class CommentsPage implements OnInit {
  @Input() post;
  msg: string;
  constructor(
    private modalController: ModalController,
    private firestore: AngularFirestore,
    private fireAuth: AngularFireAuth
  ) {}
  userID: any;
  commentID;
  Comments: any;
  public commen: any;

  closeModal() {
    this.modalController.dismiss();
  }

  generatekey() {
    const id = firebase.firestore().collection("comments").doc().id;
    this.commentID = id;
    this.addComment();
  }

  addComment() {
    const time = new Date();
    const msg = this.msg;
    const postID = this.post.ID;
    if (this.msg) {
      this.firestore
        .collection("comments")
        .doc(this.commentID)
        .set({
          time,
          msg,
          postID,
        })
        .then(() => {
          const commentID = this.commentID;

          this.firestore
            .collection("posts")
            .doc(this.post.ID)
            .update({
              comments: firestore.FieldValue.arrayUnion({
                commentID,
              }),
            });
          this.msg = "";
          this.getcomments();
        });
    } else {
      alert("cannot add an empty comment");
    }
  }

  getcomments() {
    this.firestore
      .collection("comments", (refer) =>
        refer.where("postID", "==", this.post.ID)
      )
      .valueChanges()
      .subscribe((res) => {
        this.commen = res;
        console.log(this.commen);
        this.Comments = this.commen;
      });
  }

  addLike(index: number) {
    const liked = this.userID;
    for (var i = 0; i < this.post.comments.length; i++) {
      console.log(
        "comment id's for this post" +
          JSON.stringify(this.post.comments[i].commentID)
      );
      this.firestore
        .collection("comments")
        .doc(this.post.comments[i].commentID)
        .update({
          likes: firebase.firestore.FieldValue.arrayUnion({
            liked,
          }),
        })
        .then(() => {
          console.log("comment liked");
          this.checkLike();
        })
        .catch((err) => {
          console.log(err + Message);
        });
    }
  }
liked:boolean=false;
  checkLike() {
    this.firestore.collection("comments").valueChanges().subscribe(res=>{
      for (var i=0;i<this.Comments.length;i++){
        console.log("iterating into comments docs")
        if(this.Comments[i].likes){
          for (var k=0;k<this.Comments[i].likes.length;k++){
            console.log("iterating into comment doc")
            if(this.Comments[i].likes[k].liked==this.userID){
              console.log("current userid found")
           this.Comments[i].liked=true;
           console.log(this.Comments[i].liked)
            }
          }
        }
        else {
          this.Comments[i].liked=false;
        }
       
      }
    })
  }

  ngOnInit() {
    const authsub = this.fireAuth.authState.subscribe((res) => {
      this.userID = res.uid;
      console.log("current user id=>", this.userID);
      authsub.unsubscribe();
    });

    this.getcomments();
    console.log("post getted:=>", this.post.ID);
    this.checkLike();
  }
}

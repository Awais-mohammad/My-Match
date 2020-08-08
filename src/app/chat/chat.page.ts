import { FirebaseAuth } from "angularfire2";
import { Message } from "@angular/compiler/src/i18n/i18n_ast";
import { AngularFirestore } from "angularfire2/firestore";
import { AngularFireAuth } from "angularfire2/auth";
import { firestore } from "firebase/app";
import { Observable } from "rxjs";
import { AuthService } from "./../auth.service";

import { Component, OnInit, Input, ChangeDetectionStrategy } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { ActivatedRoute } from "@angular/router";
import * as firebase from "firebase";
import { Console } from "console";
import { variable } from "@angular/compiler/src/output/output_ast";
@Component({
  selector: "app-chat",
  templateUrl: "./chat.page.html",
  styleUrls: ["./chat.page.scss"],
})
export class ChatPage implements OnInit {
  constructor(private ModalController: ModalController, private route: ActivatedRoute, public auth: AuthService, private firestore: AngularFirestore, private firebaseAuth: AngularFireAuth) {
    this.checkBothUsersPreviousChat();
  }

  @Input() userData;
  msg: any[];
  closeModal() {
    this.ModalController.dismiss();
  }
  chat: any[];
  checkBothUsersPreviousChat() {
    this.firestore
      .collection("chats")
      .valueChanges()
      .subscribe((res) => {
        this.chat = res;
        for (var i = 0; i > this.chat.length; i++) {
          if (this.chat[i].userID == this.Id && this.chat[i].secondUser == this.userData.userID) {
            console.log("Users previous chat found");
          } else {
            console.log("Users previous chat not found");
          }
        }
      });
  }

  sendmsg() {
    const userID = this.Id;
    const secondUser = this.userData.userID;
    const Chat = this.msg;
    this.firestore
      .collection("chats")
      .add({
        secondUser,
        userID,
        messages: firebase.firestore.FieldValue.arrayUnion({
          Chat,
        }),
      })
      .then((ref) => {
        console.log(ref.id);
        const docID = ref.id;
        this.firestore.collection("chats").doc(ref.id).update({
          docID,
        });
      });
    console.log("msg will be sent");
  }
  Id: string;
  meesagedata: any;

  getmessages() {}

  ngOnInit() {
    this.getmessages();
    const userSub = this.firebaseAuth.auth.currentUser.uid;
    this.Id = userSub;

    this.checkBothUsersPreviousChat();
  }
}

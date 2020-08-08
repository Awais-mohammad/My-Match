import { ModalController } from "@ionic/angular";
import { Component, OnInit, Input } from "@angular/core";
import * as firebase from "firebase/app";
import { AngularFirestore } from "angularfire2/firestore";
import { AngularFireAuth } from "angularfire2/auth";
import { ChatPage } from '../chat/chat.page';

@Component({
  selector: "app-show-user",
  templateUrl: "./show-user.page.html",
  styleUrls: ["./show-user.page.scss"],
})
export class ShowUserPage implements OnInit {
  constructor(
    private ModalController: ModalController,
    private firestore: AngularFirestore,
    private firebaseAuth: AngularFireAuth
  ) {}

  @Input() userData;

  closeModal() {
    this.ModalController.dismiss();
  }
  
  async ChatModel(){
    const model=await this.ModalController.create({
      component:ChatPage,
      cssClass:"my-custom-class",
      id: "chat",
      componentProps:{
      userData:this.userData,
      }
    })
    return await model.present();
   }
  
  addFriend() {
    const uid = this.userData.fE.kt.proto.mapValue.fields.uid.stringValue;
    const name = this.userData.fE.kt.proto.mapValue.fields.firstname.stringValue;
    this.firestore
      .collection("usersdata")
      .doc(this.firebaseAuth.auth.currentUser.uid)
      .update({
        friends: firebase.firestore.FieldValue.arrayUnion({
          uid,
        }),
      });
  }

  ngOnInit() {
    console.log("GOT DATA", this.userData);
  }
}

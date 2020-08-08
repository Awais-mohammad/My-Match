import { Message } from "@angular/compiler/src/i18n/i18n_ast";
import { AngularFirestore } from "angularfire2/firestore";
import { AngularFireAuth } from "angularfire2/auth";
import { firestore } from "firebase/app";
import { Observable } from "rxjs";
import { AuthService } from "./../auth.service";

import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
} from "@angular/core";
import { ModalController } from "@ionic/angular";
import { ActivatedRoute } from "@angular/router";
import * as firebase from "firebase";
@Component({
  selector: "app-chat",
  templateUrl: "./chat.page.html",
  styleUrls: ["./chat.page.scss"],
})
export class ChatPage implements OnInit {
  constructor(
    private ModalController: ModalController,
    private route: ActivatedRoute,
    public auth: AuthService,
    private firestore: AngularFirestore,
    private firebaseAuth: AngularFireAuth
  ) {}

  @Input() userData;
  msg: any[];
  closeModal() {
    this.ModalController.dismiss();
  }

  sendmsg() {
  
   
  }
  Id: string;
  meesagedata: any;

  getmessages() {
   
  }
/*chk */
  ngOnInit() {
    this.getmessages();
    const userSub=this.firebaseAuth.auth.currentUser.uid;
    this.Id=userSub;
    console.log("user data->", this.userData.userID);
  }
}

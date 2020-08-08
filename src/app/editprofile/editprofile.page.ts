import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AngularFireAuth } from "angularfire2/auth";
import { AlertController, NavController } from "@ionic/angular";
import { Observable, from } from "rxjs";
import { ToastController } from "@ionic/angular";
import { ActionSheetController } from "@ionic/angular";
import { AngularFirestore } from "angularfire2/firestore";

@Component({
  selector: 'app-editprofile',
  templateUrl: './editprofile.page.html',
  styleUrls: ['./editprofile.page.scss'],
})
export class EditprofilePage implements OnInit {

  constructor(  private routin: Router,
    private auth: AngularFireAuth,
    public alertController: AlertController,
    public navcontrol: NavController,
    public toastController: ToastController,
    private firestore: AngularFirestore,
    public controlaction: ActionSheetController) { }
    updateuser:boolean=false;
    firstname: string;
    lastname: string;
    username: string;
    adress: string;
    state: string;
    city: string;
    zip: string;
    cellphone: string;

  ngOnInit() {
  }
  
  changeprof(){
    console.log("updating data")
    const authSu=this.auth.authState.subscribe((res)=>{
      const firstname = this.firstname; 
     const lastname = this.lastname;
      const username = this.username;
      const adress = this.adress;
      const state = this.state;
      const city = this.city;
      const zip = this.zip;
      const cellphone = this.cellphone;
      
      this.firestore.collection("usersdata").doc(res.uid).set({
        firstname,
        lastname,
        username,
        adress,
        state,
        city,
        zip,
        cellphone,
        
      }).then(()=>
      {
       
        alert('data updated successfully')
        authSu.unsubscribe();
      }).catch((erro)=>{
alert("data not updated");
authSu.unsubscribe();
      })
    })
  
  }

}

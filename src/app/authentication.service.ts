import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app'
import {AngularFireAuth} from '@angular/fire/compat/auth'
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  isLoggedIn() {
    throw new Error('Method not implemented.');
  }

  constructor(public ngFireAuth: AngularFireAuth, afAuth: AngularFireAuth) { }

    

  async registerUser(email:string,password:string){
    return await this.ngFireAuth.createUserWithEmailAndPassword(email,password)

  }


  async loginUser(email:string,password:string){
    return await this.ngFireAuth.signInWithEmailAndPassword(email,password)
  }

  async resetPassword(email:string){
    return await this.ngFireAuth.sendPasswordResetEmail(email)
  }
  


  async singOut(){
    return await this.ngFireAuth.signOut()
  }

  async getProfile(){
    return await this.ngFireAuth.currentUser

  }
}

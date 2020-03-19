import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { User } from 'src/app/models/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterUserService {

  public editarPerfil = true;

  constructor(
    private fireauth: AngularFireAuth,
    private firestore: AngularFirestore,
  ) { }

  addUser(user: User): Promise<void> {
    return this.firestore.doc<User>(`users/${user.uid}`).set(user);
  }

  emailSignUp(user: User) {
    return this.fireauth.auth.createUserWithEmailAndPassword(user.email, user.password);
  }

  emailSignIn(email: string, password: string) {
    return this.fireauth.auth.signInWithEmailAndPassword(email, password);
  }

  async isEmailAvailable(email: string) {
    let methods = await this.fireauth.auth.fetchSignInMethodsForEmail(email);
    return methods.length == 0;
  }

  getCurrentUser(): Observable<User> {
    let currentFirebaseUser = this.fireauth.auth.currentUser;
    console.log('Current firebase user: ');
    console.log(currentFirebaseUser);

    let uid = currentFirebaseUser.uid;
    console.log('Current uid: ');
    console.log(uid);

    return this.firestore.doc<User>(`users/${uid}`).valueChanges();
  }

  updateUser(user: User): Promise<void> {
    let userDoc = this.firestore.doc<User>(`users/${user.uid}`);
    return userDoc.update(user);
  }

}

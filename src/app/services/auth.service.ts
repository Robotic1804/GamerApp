import { Injectable } from '@angular/core';

import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Observable, of, delay, map, filter, switchMap } from 'rxjs';

// 🔐 Auth (modular)
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  UserCredential,
} from '@angular/fire/auth';

// 🔥 Firestore (modular)
import {
  Firestore,
  collection,
  CollectionReference,
  doc,
  setDoc,
} from '@angular/fire/firestore';

import IUser from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // En modular usamos CollectionReference<IUser>
  private usersCollection: CollectionReference<IUser>;

  public isAuthenticated$: Observable<boolean>;
  public isAuthenticatedWithDelay$: Observable<boolean>;
  private redirect = false;

  constructor(
    private auth: Auth, // ⬅️ reemplaza AngularFireAuth
    private db: Firestore, // ⬅️ reemplaza AngularFirestore
    private router: Router,
    private route: ActivatedRoute
  ) {
    // db.collection('users') -> collection(db, 'users')
    this.usersCollection = collection(
      this.db,
      'users'
    ) as CollectionReference<IUser>;

    // auth.user -> authState(this.auth)
    this.isAuthenticated$ = authState(this.auth).pipe(map((user) => !!user));
    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(delay(1000));

    // Router guard con data.authOnly
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        map(() => this.route.firstChild),
        switchMap((route) => route?.data ?? of({}))
      )
      .subscribe((data) => {
        this.redirect = (data as { authOnly?: boolean })['authOnly'] ?? false;
      });
  }

  // === Crear usuario (modular) ===
  public async createUser(userData: IUser) {
    if (!userData.password) {
      throw new Error('Password not provided!');
    }

    // this.auth.createUserWithEmailAndPassword -> createUserWithEmailAndPassword(this.auth, ...)
    const userCred: UserCredential = await createUserWithEmailAndPassword(
      this.auth,
      userData.email as string,
      userData.password as string
    );

    if (!userCred.user) {
      throw new Error("User can't be found");
    }

    // this.usersCollection.doc(uid).set(...) -> setDoc(doc(db, 'users', uid), {...})
    await setDoc(doc(this.usersCollection, userCred.user.uid), {
      name: userData.name,
      email: userData.email,
      age: userData.age,
      phoneNumber: userData.phoneNumber,
    });

    // userCred.user.updateProfile(...) -> updateProfile(userCred.user, {...})
    await updateProfile(userCred.user, { displayName: userData.name });
  }

  // === Logout (modular) ===
  public async logout($event?: Event) {
    if ($event) $event.preventDefault();

    await signOut(this.auth); // this.auth.signOut() -> signOut(this.auth)

    if (this.redirect) {
      await this.router.navigateByUrl('/');
    }
  }
}

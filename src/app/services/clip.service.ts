// src/app/services/clip.service.ts
import { Injectable } from '@angular/core';
import {
  Router,
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

import {
  Firestore,
  collection,
  CollectionReference,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  DocumentReference,
  QueryDocumentSnapshot,
} from '@angular/fire/firestore';

import {
  Storage,
  ref as storageRef,
  deleteObject,
} from '@angular/fire/storage';

import { Auth, authState } from '@angular/fire/auth';

import { BehaviorSubject, combineLatest, from, map, of, switchMap } from 'rxjs';
import IClip from '../models/clip.model';

@Injectable({ providedIn: 'root' })
export class ClipService implements Resolve<IClip | null> {
  /** Colección modular tipada */
  public clipsCollection: CollectionReference<IClip>;

  /** Estado de paginación (igual que antes) */
  pageClips: IClip[] = [];
  pendingReq = false;

  constructor(
    private db: Firestore,
    private auth: Auth,
    private storage: Storage,
    private router: Router
  ) {
    this.clipsCollection = collection(
      this.db,
      'clips'
    ) as CollectionReference<IClip>;
  }

  /** === Crear clip (modular) === */
  createClip(data: IClip): Promise<DocumentReference<IClip>> {
    return addDoc(this.clipsCollection, data);
  }

  /** === Clips por usuario con orden dinámico (modular) === */
  getUserClips(sort$: BehaviorSubject<string>) {
    return combineLatest([authState(this.auth), sort$]).pipe(
      switchMap(([user, sort]) => {
        if (!user) return of([] as QueryDocumentSnapshot<IClip>[]);

        const q = query(
          this.clipsCollection,
          where('uid', '==', user.uid),
          orderBy('timestamp', sort === '1' ? 'desc' : 'asc')
        );

        return from(getDocs(q)).pipe(
          map((snap) => snap.docs as QueryDocumentSnapshot<IClip>[])
        );
      })
    );
  }

  /** === Actualizar título === */
  updateClip(id: string, title: string) {
    return updateDoc(doc(this.clipsCollection, id), {
      title,
    } as Partial<IClip>);
  }

  /** === Borrar clip y screenshot del Storage + doc de Firestore === */
  async deleteClip(clip: IClip) {
    const clipRef = storageRef(this.storage, `clips/${clip.fileName}`);
    const screenshotRef = storageRef(
      this.storage,
      `screenshots/${clip.screenshotFileName}`
    );

    await deleteObject(clipRef).catch(() => {});
    await deleteObject(screenshotRef).catch(() => {});
    await deleteDoc(doc(this.clipsCollection, clip.docID!));
  }

  /** === Feed con paginación infinita (6 por página) === */
  async getClips() {
    if (this.pendingReq) return;
    this.pendingReq = true;

    let q = query(this.clipsCollection, orderBy('timestamp', 'desc'), limit(6));

    const { length } = this.pageClips;
    if (length) {
      const lastDocID = this.pageClips[length - 1].docID!;
      const lastSnap = await getDoc(doc(this.clipsCollection, lastDocID));
      q = query(
        this.clipsCollection,
        orderBy('timestamp', 'desc'),
        startAfter(lastSnap),
        limit(6)
      );
    }

    const snapshot = await getDocs(q);
    snapshot.forEach((d) =>
      this.pageClips.push({ docID: d.id, ...(d.data() as IClip) })
    );

    this.pendingReq = false;
  }

  /** === Resolver para ruta /clip/:id === */
  resolve(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) {
    const id = route.params['id'];
    return from(getDoc(doc(this.clipsCollection, id))).pipe(
      map((snap) => {
        if (!snap.exists()) {
          this.router.navigate(['/']);
          return null;
        }
        return { docID: snap.id, ...(snap.data() as IClip) };
      })
    );
  }
}

import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  DocumentData,
  WithFieldValue,
  PartialWithFieldValue,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private firestore: Firestore) {}

  getDocs(path: string) {
    return getDocs(collection(this.firestore, path));
  }

  addDoc(path: string, data: WithFieldValue<DocumentData>) {
    return addDoc(collection(this.firestore, path), data);
  }

  updateDoc(
    path: string,
    id: string,
    data: PartialWithFieldValue<DocumentData>,
  ) {
    const docRef = doc(this.firestore, path, id);
    return updateDoc(docRef, data);
  }

  deleteDoc(path: string, id: string) {
    const docRef = doc(this.firestore, path, id);
    return deleteDoc(docRef);
  }
}

import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  getDocs,
  addDoc,
  CollectionReference,
  DocumentData,
  WithFieldValue,
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
}

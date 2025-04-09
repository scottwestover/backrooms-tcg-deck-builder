import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Firestore, getDoc } from '@angular/fire/firestore';
import { first, from, Observable, of } from 'rxjs';
import {
  IColor,
  ICountCard,
  IDeck,
  IDeckFireStore,
  ISave,
  ISaveFireStore,
} from 'src/models';
import { CARDSET } from '../../models';
import { emptySettings } from '../../models';
import {
  doc,
  query,
  setDoc,
  where,
  collection,
  getDocs,
} from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class BackroomsBackendService {
  private firestore = inject(Firestore);

  constructor(private http: HttpClient) {}

  getDecks(): Observable<IDeck[]> {
    const deckRef = query(collection(this.firestore, 'decks'));
    const decks: IDeck[] = [];
    return from(
      getDocs(deckRef).then((deckDocuments) => {
        deckDocuments.forEach((deckDoc) => {
          decks.push(deckDoc.data() as IDeck);
        });
        return decks;
      }),
    );
  }

  getDeck(id: any): Observable<IDeck> {
    const docRef = doc(this.firestore, 'decks', id);
    return from(
      getDoc(docRef).then((deck) => {
        console.log(deck.data());
        return deck.data() as IDeck;
      }),
    );
  }

  // deleteDeck(id: any): Observable<any> {
  //   return this.http.delete(`${baseUrl}decks/${id}`);
  // }

  getSave(id: any): Observable<ISave> {
    const docRef = doc(this.firestore, 'users', id);
    return from(
      getDoc(docRef).then((userDoc) => {
        const userProfile = userDoc.data() as ISaveFireStore;
        const userProfileCollection: ICountCard[] = JSON.parse(
          userProfile.collection,
        );
        const deckRef = query(
          collection(this.firestore, 'decks'),
          where('userId', '==', id),
        );
        const decks: IDeck[] = [];
        return getDocs(deckRef).then((deckDocuments) => {
          deckDocuments.forEach((deckDoc) => {
            decks.push(deckDoc.data() as IDeck);
          });

          const newSave = {
            ...userProfile,
            collection: userProfileCollection,
            decks,
          } as ISave;
          return newSave;
        });
      }),
    );
  }

  updateSave(save: ISave, lastUpdatedDeckId: string): Observable<any> {
    const modifiedUserSaveData: ISaveFireStore = {
      uid: save.uid as string,
      displayName: save.displayName as string,
      photoURL: save.photoURL,
      version: save.version as number,
      collection: JSON.stringify(save.collection),
    };

    const documentRef = doc(this.firestore, 'users', modifiedUserSaveData.uid);
    return from(
      setDoc(documentRef, modifiedUserSaveData).then(() => {
        if (lastUpdatedDeckId !== '') {
          const deck = save.decks.find((deck) => deck.id === lastUpdatedDeckId);
          if (!deck) {
            return;
          }
          const docId = this.createDeckDocId(
            modifiedUserSaveData.uid,
            lastUpdatedDeckId,
          );
          deck.user = modifiedUserSaveData.displayName;
          deck.userId = modifiedUserSaveData.uid;
          const modifiedDeck: IDeckFireStore = { ...deck, docId };
          const documentRefForDecks = doc(this.firestore, 'decks', docId);
          setDoc(documentRefForDecks, modifiedDeck);
        }
      }),
    );
  }

  checkSaveValidity(save: any, user?: any): ISave {
    let changedSave = false;
    if (user) {
      if (!save.collection) {
        save = { ...save, collection: user.save.collection };
        changedSave = true;
      }
      if (!save.decks) {
        save = { ...save, decks: user.save.decks };
        changedSave = true;
      }
      if (!save.settings) {
        save = { ...save, settings: user.save.settings };
        changedSave = true;
      }
      if (!save.uid) {
        save = { ...save, uid: user.uid };
        changedSave = true;
      }
      if (!save.displayName) {
        save = { ...save, displayName: user.displayName };
        changedSave = true;
      }
      if (!save.photoURL) {
        save = { ...save, photoURL: user.photoURL };
        changedSave = true;
      }
    } else {
      if (!save.collection) {
        save = { ...save, collection: [] };
        changedSave = true;
      }
      if (!save.decks) {
        save = { ...save, decks: [] };
        changedSave = true;
      }
      if (!save.settings) {
        save = { ...save, settings: emptySettings };
        changedSave = true;
      }
      if (!save.uid) {
        save = { ...save, uid: '' };
        changedSave = true;
      }
      if (!save.displayName) {
        save = { ...save, displayName: '' };
        changedSave = true;
      }
      if (!save.photoURL) {
        save = { ...save, photoURL: '' };
        changedSave = true;
      }
    }

    if (
      save.settings.cardSet === undefined ||
      save.settings.cardSet === 'Overwrite' ||
      +save.settings.cardSet >>> 0
    ) {
      save = {
        ...save,
        settings: { ...save.settings, cardSet: CARDSET.English },
      };
      changedSave = true;
    }
    if (save.settings.collectionMinimum === undefined) {
      save = { ...save, settings: { ...save.settings, collectionMinimum: 1 } };
      changedSave = true;
    }
    if (save.settings.showPreRelease === undefined) {
      save = { ...save, settings: { ...save.settings, showPreRelease: true } };
      changedSave = true;
    }
    if (save.settings.showStampedCards === undefined) {
      save = {
        ...save,
        settings: { ...save.settings, showStampedCards: true },
      };
      changedSave = true;
    }
    if (save.settings.showAACards === undefined) {
      save = { ...save, settings: { ...save.settings, showAACards: true } };
      changedSave = true;
    }
    if (save.settings.showUserStats === undefined) {
      save = { ...save, settings: { ...save.settings, showUserStats: true } };
      changedSave = true;
    }

    if (changedSave && user?.uid) {
      this.updateSave(save, '').pipe(first()).subscribe();
    }
    return save;
  }

  private createDeckDocId(userId: string, deckId: string): string {
    return `${deckId}::${userId}`;
  }
}

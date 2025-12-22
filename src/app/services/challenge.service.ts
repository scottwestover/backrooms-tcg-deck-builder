import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, combineLatest, from, map, of, Subject } from 'rxjs';
import { IChallenge } from '../../models';
import { AuthService } from './auth.service';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root',
})
export class ChallengeService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private firestoreService = inject(FirestoreService);

  public refreshChallenges$: Subject<IChallenge> = new Subject<IChallenge>(); // Emit IChallenge

  public getChallenges(): Observable<IChallenge[]> {
    const localChallenges$ = this.http
      .get<IChallenge[]>('assets/randomizer/challenges.json')
      .pipe(
        map((challenges) =>
          challenges.map((c) => ({ ...c, id: c.id.toString() })),
        ),
      );

    const firestoreChallenges$ = from(
      this.firestoreService.getDocs('challenges'),
    ).pipe(
      map((querySnapshot) => {
        const challenges: IChallenge[] = [];
        querySnapshot.forEach((doc) => {
          challenges.push({ id: doc.id, ...doc.data() } as IChallenge);
        });
        return challenges;
      }),
    );

    return combineLatest([localChallenges$, firestoreChallenges$]).pipe(
      map(([local, firestore]) => [...local, ...firestore]),
    );
  }

  public createChallenge(
    data: Omit<IChallenge, 'id' | 'creator'>,
  ): Observable<any> {
    if (!this.authService.isLoggedIn || !this.authService.userData) {
      return of(null);
    }

    const user = this.authService.userData;
    const newChallengeData = {
      ...data,
      creator: user.displayName,
      userId: user.uid,
    };

    return from(
      this.firestoreService.addDoc('challenges', newChallengeData),
    ).pipe(
      map((docRef) => {
        const createdChallenge: IChallenge = {
          id: docRef.id,
          ...newChallengeData,
        };
        this.refreshChallenges$.next(createdChallenge);
        return createdChallenge;
      }),
    );
  }

  public generateChallenges(
    mode: 'all-levels' | 'random',
    challenges: IChallenge[],
    count: number = 4,
  ): IChallenge[] {
    if (mode === 'all-levels') {
      return this.generateAllLevels(challenges);
    } else {
      return this.generateRandom(challenges, count);
    }
  }

  private generateAllLevels(challenges: IChallenge[]): IChallenge[] {
    const groupedByDifficulty = challenges.reduce(
      (acc, challenge) => {
        const diff = challenge.difficulty;
        if (!acc[diff]) {
          acc[diff] = [];
        }
        acc[diff].push(challenge);
        return acc;
      },
      {} as Record<number, IChallenge[]>,
    );

    const result: IChallenge[] = [];
    const difficulties = [1, 2, 3, 4]; // Assuming levels 1-4

    for (const difficulty of difficulties) {
      const group = groupedByDifficulty[difficulty];
      if (group && group.length > 0) {
        const randomIndex = Math.floor(Math.random() * group.length);
        result.push(group[randomIndex]);
      }
    }

    // In case some difficulty levels had no challenges, fill the rest with random ones.
    if (result.length < 4) {
      const existingIds = new Set(result.map((c) => c.id));
      const remainingChallenges = challenges.filter(
        (c) => !existingIds.has(c.id),
      );
      const shuffled = remainingChallenges.sort(() => 0.5 - Math.random());
      result.push(...shuffled.slice(0, 4 - result.length));
    }

    return result;
  }

  private generateRandom(
    challenges: IChallenge[],
    count: number,
  ): IChallenge[] {
    const shuffled = [...challenges].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
}

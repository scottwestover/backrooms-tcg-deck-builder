import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IChallenge } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class ChallengeService {
  private http = inject(HttpClient);

  getChallenges(): Observable<IChallenge[]> {
    return this.http.get<IChallenge[]>('assets/randomizer/challenges.json');
  }

  generateChallenges(
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

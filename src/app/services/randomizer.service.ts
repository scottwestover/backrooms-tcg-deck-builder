import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ICountCard } from '../../models';

export interface Archetype {
  id: number;
  name: string;
  rooms: ICountCard[];
  items: ICountCard[];
  outcomes: ICountCard[];
  entities: ICountCard[];
}

export type ArchetypeData = Archetype[];

export interface GeneratedDeck {
  archetypeName: string;
  cards: ICountCard[];
}

export interface GeneratedMixedDeck {
  archetypeNames: {
    rooms: string;
    items: string;
    outcomes: string;
    entities: string;
  };
  cards: ICountCard[];
}

@Injectable({
  providedIn: 'root',
})
export class RandomizerService {
  private http = inject(HttpClient);

  getArchetypes(): Observable<ArchetypeData> {
    return this.http.get<any[]>('/assets/randomizer/archetypes.json').pipe(
      map((data) => {
        // The user's format has qty, so we map it to count to match ICountCard
        return data.map((archetype) => ({
          id: archetype.id,
          name: archetype.name,
          rooms: archetype.rooms.map((c: any) => ({
            id: c.id,
            count: c.qty,
          })),
          items: archetype.items.map((c: any) => ({
            id: c.id,
            count: c.qty,
          })),
          outcomes: archetype.outcomes.map((c: any) => ({
            id: c.id,
            count: c.qty,
          })),
          entities: archetype.entities.map((c: any) => ({
            id: c.id,
            count: c.qty,
          })),
        }));
      }),
    );
  }

  generateSimpleDeck(archetypes: ArchetypeData): GeneratedDeck {
    if (archetypes.length === 0) {
      return {
        archetypeName: 'Unknown Archetype',
        cards: [],
      };
    }
    const randomIndex = Math.floor(Math.random() * archetypes.length);
    const archetype = archetypes[randomIndex];

    const cards = [
      ...archetype.rooms,
      ...archetype.items,
      ...archetype.outcomes,
      ...archetype.entities,
    ];

    return {
      archetypeName: archetype.name,
      cards: cards,
    };
  }

  generateMixedDeck(archetypes: ArchetypeData): GeneratedMixedDeck {
    if (archetypes.length === 0) {
      return {
        archetypeNames: {
          rooms: 'Unknown Archetype',
          items: 'Unknown Archetype',
          outcomes: 'Unknown Archetype',
          entities: 'Unknown Archetype',
        },
        cards: [],
      };
    }

    const getRandomArchetype = () =>
      archetypes[Math.floor(Math.random() * archetypes.length)];

    const roomsArchetype = getRandomArchetype();
    const itemsArchetype = getRandomArchetype();
    const outcomesArchetype = getRandomArchetype();
    const entitiesArchetype = getRandomArchetype();

    const rooms = roomsArchetype.rooms;
    const items = itemsArchetype.items;
    const outcomes = outcomesArchetype.outcomes;
    const entities = entitiesArchetype.entities;

    const cards = [...rooms, ...items, ...outcomes, ...entities];

    return {
      archetypeNames: {
        rooms: roomsArchetype.name,
        items: itemsArchetype.name,
        outcomes: outcomesArchetype.name,
        entities: entitiesArchetype.name,
      },
      cards: cards,
    };
  }
}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ICountCard } from '../../models';

export interface Archetype {
  name: string;
  rooms: ICountCard[];
  items: ICountCard[];
  outcomes: ICountCard[];
  entities: ICountCard[];
}

export interface ArchetypeData {
  [key: string]: Archetype;
}

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
    return this.http.get<any>('/assets/randomizer/archetypes.json').pipe(
      map((data) => {
        // The user's format has qty, so we map it to count to match ICountCard
        const archetypes: ArchetypeData = {};
        for (const key in data) {
          archetypes[key] = {
            name: data[key].name,
            rooms: data[key].rooms.map((c: any) => ({
              id: c.id,
              count: c.qty,
            })),
            items: data[key].items.map((c: any) => ({
              id: c.id,
              count: c.qty,
            })),
            outcomes: data[key].outcomes.map((c: any) => ({
              id: c.id,
              count: c.qty,
            })),
            entities: data[key].entities.map((c: any) => ({
              id: c.id,
              count: c.qty,
            })),
          };
        }
        return archetypes;
      }),
    );
  }

  generateSimpleDeck(archetypes: ArchetypeData): GeneratedDeck {
    const keys = Object.keys(archetypes);
    if (keys.length === 0) {
      return {
        archetypeName: 'Unknown Archetype',
        cards: [],
      };
    }
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const archetype = archetypes[randomKey];

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
    const keys = Object.keys(archetypes);
    if (keys.length === 0) {
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

    const getRandomKey = () => keys[Math.floor(Math.random() * keys.length)];

    const roomsKey = getRandomKey();
    const itemsKey = getRandomKey();
    const outcomesKey = getRandomKey();
    const entitiesKey = getRandomKey();

    const rooms = archetypes[roomsKey].rooms;
    const items = archetypes[itemsKey].items;
    const outcomes = archetypes[outcomesKey].outcomes;
    const entities = archetypes[entitiesKey].entities;

    const cards = [...rooms, ...items, ...outcomes, ...entities];

    return {
      archetypeNames: {
        rooms: archetypes[roomsKey].name,
        items: archetypes[itemsKey].name,
        outcomes: archetypes[outcomesKey].name,
        entities: archetypes[entitiesKey].name,
      },
      cards: cards,
    };
  }
}

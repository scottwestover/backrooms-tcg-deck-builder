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

  public isMixedDeck(
    deck: GeneratedDeck | GeneratedMixedDeck,
  ): deck is GeneratedMixedDeck {
    return 'archetypeNames' in deck;
  }

  public findArchetypeKeyByName(
    name: string,
    archetypes: ArchetypeData,
  ): string | null {
    return (
      archetypes.find((archetype) => archetype.name === name)?.id.toString() ??
      null
    );
  }

  generateDeck(
    generationMode: 'simple' | 'mixed' | 'manual',
    archetypes: ArchetypeData,
    manualSelections?: {
      rooms: string | null;
      items: string | null;
      entities: string | null;
      outcomes: string | null;
    },
  ): (GeneratedDeck | GeneratedMixedDeck) & { cards: ICountCard[] } {
    if (generationMode === 'simple') {
      return this.generateSimpleDeck(archetypes);
    } else if (generationMode === 'mixed') {
      return this.generateMixedDeck(archetypes);
    } else if (generationMode === 'manual' && manualSelections) {
      const { rooms, items, entities, outcomes } = manualSelections;

      if (rooms && items && entities && outcomes) {
        // Find archetypes by ID (string representation)
        const roomArchetype = archetypes.find((a) => a.id.toString() === rooms);
        const itemArchetype = archetypes.find((a) => a.id.toString() === items);
        const entityArchetype = archetypes.find(
          (a) => a.id.toString() === entities,
        );
        const outcomeArchetype = archetypes.find(
          (a) => a.id.toString() === outcomes,
        );

        if (
          !roomArchetype ||
          !itemArchetype ||
          !entityArchetype ||
          !outcomeArchetype
        ) {
          console.error(
            'One or more archetypes not found for manual selection.',
          );
          // Return a default empty deck or throw an error
          return {
            archetypeName: 'Error Deck',
            cards: [],
          } as GeneratedDeck & { cards: ICountCard[] };
        }

        const roomCards = roomArchetype.rooms;
        const itemCards = itemArchetype.items;
        const entityCards = entityArchetype.entities;
        const outcomeCards = outcomeArchetype.outcomes;
        const allCards = [
          ...roomCards,
          ...itemCards,
          ...entityCards,
          ...outcomeCards,
        ];

        const allSame =
          rooms === items && rooms === entities && rooms === outcomes;

        if (allSame) {
          return {
            archetypeName: roomArchetype.name,
            cards: allCards,
          };
        } else {
          return {
            archetypeNames: {
              rooms: roomArchetype.name,
              items: itemArchetype.name,
              entities: entityArchetype.name,
              outcomes: outcomeArchetype.name,
            },
            cards: allCards,
          };
        }
      }
    }
    // Default return for cases where manual selections are incomplete or mode is not recognized
    return {
      archetypeName: 'Unknown Archetype',
      cards: [],
    };
  }
}

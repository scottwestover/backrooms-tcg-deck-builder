import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

interface DeckAsList {
  id: string;
  name: string;
  count: number;
}

@Component({
  selector: 'backrooms-card-list-table',
  template: `
    @if (deckAsList) {
      <div class="space-y-4 mt-4">
        <div *ngIf="deckAsList.rooms.length > 0">
          <h3 class="mb-2 text-lg font-bold">Rooms</h3>
          <table class="w-full table-fixed text-left">
            <thead class="bg-gray-700">
              <tr>
                <th class="p-2 w-1/5">ID</th>
                <th class="p-2 w-7/10">Name</th>
                <th class="p-2 w-1/10">Qty</th>
              </tr>
            </thead>
            <tbody>
              <tr
                *ngFor="let card of deckAsList.rooms"
                class="border-b border-gray-700">
                <td class="p-2">{{ card.id }}</td>
                <td class="p-2">{{ card.name }}</td>
                <td class="p-2">{{ card.count }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div *ngIf="deckAsList.items.length > 0">
          <h3 class="mb-2 text-lg font-bold">Items</h3>
          <table class="w-full table-fixed text-left">
            <thead class="bg-gray-700">
              <tr>
                <th class="p-2 w-1/5">ID</th>
                <th class="p-2 w-7/10">Name</th>
                <th class="p-2 w-1/10">Qty</th>
              </tr>
            </thead>
            <tbody>
              <tr
                *ngFor="let card of deckAsList.items"
                class="border-b border-gray-700">
                <td class="p-2">{{ card.id }}</td>
                <td class="p-2">{{ card.name }}</td>
                <td class="p-2">{{ card.count }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div *ngIf="deckAsList.entities.length > 0">
          <h3 class="mb-2 text-lg font-bold">Entities</h3>
          <table class="w-full table-fixed text-left">
            <thead class="bg-gray-700">
              <tr>
                <th class="p-2 w-1/5">ID</th>
                <th class="p-2 w-7/10">Name</th>
                <th class="p-2 w-1/10">Qty</th>
              </tr>
            </thead>
            <tbody>
              <tr
                *ngFor="let card of deckAsList.entities"
                class="border-b border-gray-700">
                <td class="p-2">{{ card.id }}</td>
                <td class="p-2">{{ card.name }}</td>
                <td class="p-2">{{ card.count }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div *ngIf="deckAsList.outcomes.length > 0">
          <h3 class="mb-2 text-lg font-bold">Outcomes</h3>
          <table class="w-full table-fixed text-left">
            <thead class="bg-gray-700">
              <tr>
                <th class="p-2 w-1/5">ID</th>
                <th class="p-2 w-7/10">Name</th>
                <th class="p-2 w-1/10">Qty</th>
              </tr>
            </thead>
            <tbody>
              <tr
                *ngFor="let card of deckAsList.outcomes"
                class="border-b border-gray-700">
                <td class="p-2">{{ card.id }}</td>
                <td class="p-2">{{ card.name }}</td>
                <td class="p-2">{{ card.count }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    }
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, NgFor],
})
export class CardListTableComponent {
  @Input() deckAsList: {
    rooms: DeckAsList[];
    items: DeckAsList[];
    entities: DeckAsList[];
    outcomes: DeckAsList[];
  } | null = null;
}

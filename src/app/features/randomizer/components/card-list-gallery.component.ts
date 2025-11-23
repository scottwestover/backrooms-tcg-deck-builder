import { NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { BackroomsCard } from '../../../../models';
import { CardImageComponent } from '../../shared/card-image.component';
import { DialogStore } from '../../../store/dialog.store';

@Component({
  selector: 'backrooms-card-list-gallery',
  template: `
    @if (cards) {
      <div class="space-y-4 mt-4">
        <div *ngIf="cards.rooms.length > 0">
          <h3 class="mb-2 text-lg font-bold">Rooms</h3>
          <div class="card-grid">
            <div
              *ngFor="let card of cards.rooms"
              class="card-item"
              (click)="openCardModal(card)">
              <backrooms-card-image [card]="card"></backrooms-card-image>
            </div>
          </div>
        </div>
        <div *ngIf="cards.items.length > 0">
          <h3 class="mb-2 text-lg font-bold">Items</h3>
          <div class="card-grid">
            <div
              *ngFor="let card of cards.items"
              class="card-item"
              (click)="openCardModal(card)">
              <backrooms-card-image [card]="card"></backrooms-card-image>
            </div>
          </div>
        </div>
        <div *ngIf="cards.entities.length > 0">
          <h3 class="mb-2 text-lg font-bold">Entities</h3>
          <div class="card-grid">
            <div
              *ngFor="let card of cards.entities"
              class="card-item"
              (click)="openCardModal(card)">
              <backrooms-card-image [card]="card"></backrooms-card-image>
            </div>
          </div>
        </div>
        <div *ngIf="cards.outcomes.length > 0">
          <h3 class="mb-2 text-lg font-bold">Outcomes</h3>
          <div class="card-grid">
            <div
              *ngFor="let card of cards.outcomes"
              class="card-item"
              (click)="openCardModal(card)">
              <backrooms-card-image [card]="card"></backrooms-card-image>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .card-grid {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1rem;
      }
      .card-item {
        width: 170px; /* Default for mobile */
        cursor: pointer; /* Indicate clickable */
      }
      @media (min-width: 768px) {
        /* Tailwind's 'md' breakpoint */
        .card-item {
          width: 200px; /* Desktop */
        }
      }
    `,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, NgFor, CardImageComponent],
})
export class CardListGalleryComponent {
  @Input() cards: {
    rooms: BackroomsCard[];
    items: BackroomsCard[];
    entities: BackroomsCard[];
    outcomes: BackroomsCard[];
  } | null = null;

  private dialogStore = inject(DialogStore);

  openCardModal(card: BackroomsCard): void {
    this.dialogStore.updateViewCardDialog({
      show: true,
      card: card,
      width: '50vw',
    });
  }
}

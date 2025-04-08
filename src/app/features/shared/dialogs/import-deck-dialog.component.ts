import { AsyncPipe, NgIf } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { IDeck } from '../../../../models';
import { stringToDeck } from '../../../functions';
import { BackroomsCardStore } from '../../../store/backrooms-card.store';
import { WebsiteStore } from '../../../store/website.store';

@Component({
  selector: 'backrooms-import-deck-dialog',
  template: `
    <div>
      <div>
        <p>
          Copy your deck in the text area and press import or press the "Import
          Text-File" Button to import a file.
        </p>
        <textarea
          pInputTextarea
          [placeholder]="importPlaceholder"
          id="text-import"
          class="border-black-500 min-h-[200px] min-w-full border-2"
          [(ngModel)]="deckText"></textarea>
      </div>

      <div class="mt-5 flex w-full">
        <input
          style="display: none"
          type="file"
          accept=".txt"
          id="file-input"
          (change)="handleFileInput($event.target, currentDeck)"
          #fileUpload />
        <button pButton (click)="fileUpload.click()">Import Text-File</button>
        <button
          pButton
          (click)="importDeck(currentDeck)"
          style="margin-left: 5px">
          Import
        </button>
      </div>
    </div>
  `,
  standalone: true,
  imports: [FormsModule, InputTextareaModule, NgIf, ButtonModule, AsyncPipe],
  providers: [MessageService],
})
export class ImportDeckDialogComponent {
  @Input() show: boolean = false;
  @Output() onClose = new EventEmitter<boolean>();

  websiteStore = inject(WebsiteStore);

  currentDeck = this.websiteStore.deck();

  importPlaceholder =
    '' +
    'Paste Deck here\n' +
    '\n' +
    ' Format:\n' +
    '   Qty Name Id\n' +
    "   The order of the values doesn't matter\n" +
    '   Name is optional. Qty(quantity) must be positive\n' +
    '   Each card can only be declared once\n' +
    '   Import will always pick the regular art card.\n' +
    '\n' +
    ' Example:\n' +
    '   4 Hallway LL-001\n' +
    '   3 LL-002';

  deckText = '';

  private backroomCardStore = inject(BackroomsCardStore);

  constructor(private messageService: MessageService) {}

  handleFileInput(input: any, currentDeck: IDeck) {
    let fileReader = new FileReader();
    fileReader.onload = () => {
      try {
        this.deckText = fileReader.result as string;
        this.importDeck(currentDeck);
      } catch (e) {}
    };
    fileReader.readAsText(input.files[0]);
  }

  importDeck(currentDeck: IDeck) {
    if (this.deckText === '') return;
    let deck: IDeck | null = { ...currentDeck };
    const newDeck = stringToDeck(this.deckText, this.backroomCardStore.cards());
    console.log(newDeck);
    if (!newDeck || newDeck.cards?.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Deck error!',
        detail: 'No card could be found!',
      });
      return;
    }

    deck.cards = newDeck.cards;

    this.websiteStore.updateDeck(deck);
    this.onClose.emit(true);
    this.messageService.add({
      severity: 'success',
      summary: 'Deck imported!',
      detail: 'The deck was imported successfully!',
    });
  }
}

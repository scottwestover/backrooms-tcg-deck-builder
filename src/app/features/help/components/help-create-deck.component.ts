import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'backrooms-help-create-deck',
  template: `
    <div *ngIf="isMobile; else desktopContent">
      <!-- Mobile Content -->
      <p class="how-to-content">
        1. Navigate to the
        <a class="external_link" routerLink="/deckbuilder">Deckbuilder</a>
        page.
      </p>

      <div class="flex flex-row justify-center how-to-content">
        <img
          class="responsive-image"
          alt="navigate to deckbuilder page"
          src="../../../assets/images/help/mobile/navigate_to_deckbuilder.gif" />
      </div>

      <p class="how-to-content">
        2. On the "deckbuilder" page, you can create a deck by clicking on the
        "new" deck button.
      </p>

      <div class="flex flex-row justify-center how-to-content">
        <img
          class="responsive-image"
          alt="create new deck"
          src="../../../assets/images/help/mobile/create_deck.gif" />
      </div>

      <p class="how-to-content">
        3. Click on the right hand side where it shows “Show Card View”. This
        will now show the cards for you to add to your deck. Click on one of the
        cards in this view to add the card to your deck list. Then click on the
        “Hide Card View” button to switch back to the deck list view.
      </p>

      <div class="flex flex-row justify-center how-to-content">
        <img
          class="responsive-image"
          alt="edit custom deck"
          src="../../../assets/images/help/mobile/edit_deck.gif" />
      </div>

      <p class="how-to-content">
        4. Once you have at least 1 card, you can save your deck list. This is a
        good way to test and make sure the deck saves for you before you add all
        of your cards. To save your deck, enter a deck name and description.
        After this, click the save button.
      </p>

      <div class="flex flex-row justify-center how-to-content">
        <img
          class="responsive-image"
          alt="edit deck name"
          src="../../../assets/images/help/mobile/name_deck.gif" />
      </div>

      <div class="flex flex-row justify-center how-to-content">
        <img
          class="responsive-image"
          alt="save deck"
          src="../../../assets/images/help/mobile/save_deck.gif" />
      </div>

      <p class="how-to-content">
        5. If you visit your profile page, you should see your new deck listed.
        Click on your deck to view the card list.
      </p>

      <div class="flex flex-row justify-center how-to-content">
        <img
          class="responsive-image"
          alt="view custom deck"
          src="../../../assets/images/help/mobile/navigate_to_decklist.gif" />
      </div>

      <p class="how-to-content">
        6. Now, if you go back to the deckbuilder page, you should see the deck
        and you can add new cards, remove cards, update the name, etc. Once you
        are done with your changes, click on the save button to update your
        deck.
      </p>

      <div class="flex flex-row justify-center how-to-content">
        <img
          class="responsive-image"
          alt="modify your deck"
          src="../../../assets/images/help/mobile/modify_deck.gif" />
      </div>

      <hr />
      <div class="video-container">
        <iframe
          src="https://www.youtube.com/embed/OMypfIqeCp0?si=O_21PMqtSW7YWroS"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen></iframe>
      </div>
    </div>
    <ng-template #desktopContent>
      <!-- Desktop Content -->
      <p class="how-to-content">
        1. Navigate to the
        <a class="external_link" routerLink="/deckbuilder">Deckbuilder</a>
        page.
      </p>

      <div class="flex flex-row justify-center how-to-content">
        <img
          class="responsive-image"
          alt="navigate to deckbuilder page"
          src="../../../assets/images/help/desktop/navigate_to_deckbuilder.gif" />
      </div>

      <p class="how-to-content">
        2. On the "deckbuilder" page, you can create a deck by clicking on the
        "new" deck button.
      </p>

      <div class="flex flex-row justify-center how-to-content">
        <img
          class="responsive-image"
          alt="create deck"
          src="../../../assets/images/help/desktop/create_deck.gif" />
      </div>

      <p class="how-to-content">
        3. Add cards to a deck by clicking on cards on the right sidebar, which
        will add the cards to the left hand side of the app (which is the deck
        view).
      </p>

      <div class="flex flex-row justify-center how-to-content">
        <img
          class="responsive-image"
          alt="edit custom deck"
          src="../../../assets/images/help/desktop/edit_deck.gif" />
      </div>

      <p class="how-to-content">
        4. Once you have at least 1 card, you can save your deck list. This is a
        good way to test and make sure the deck saves for you before you add all
        of your cards. To save your deck, enter a deck name and description.
        After this, click the save button.
      </p>

      <div class="flex flex-row justify-center how-to-content">
        <img
          class="responsive-image"
          alt="edit deck name"
          src="../../../assets/images/help/desktop/name_deck.gif" />
      </div>

      <div class="flex flex-row justify-center how-to-content">
        <img
          class="responsive-image"
          alt="save deck"
          src="../../../assets/images/help/desktop/save_deck.gif" />
      </div>

      <p class="how-to-content">
        5. If you visit your profile page, you should see your new deck listed.
        Click on your deck to view the card list.
      </p>

      <div class="flex flex-row justify-center how-to-content">
        <img
          class="responsive-image"
          alt="view custom deck"
          src="../../../assets/images/help/desktop/navigate_to_decklist.gif" />
      </div>

      <p class="how-to-content">
        6. Now, if you go back to the deckbuilder page, you should see the deck
        and you can add new cards, remove cards, update the name, etc. Once you
        are done with your changes, click on the save button to update your
        deck.
      </p>

      <div class="flex flex-row justify-center how-to-content">
        <img
          class="responsive-image"
          alt="modify your deck"
          src="../../../assets/images/help/desktop/modify_deck.gif" />
      </div>

      <hr />
      <div class="video-container">
        <iframe
          src="https://www.youtube.com/embed/OMypfIqeCp0?si=O_21PMqtSW7YWroS"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen></iframe>
      </div>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [DividerModule, NgFor, NgIf, RouterModule],
})
export class HelpCreateDeckComponent {
  @Input() isMobile: boolean | null = false;
}

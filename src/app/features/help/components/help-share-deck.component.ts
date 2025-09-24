import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
@Component({
  selector: 'backrooms-help-share-deck',
  template: `
    <div *ngIf="isMobile; else desktopContent">
      <!-- Mobile Content -->
      <p class="how-to-content">
        1. Navigate to the "Profile" page and you should see your saved decks.
        Click on the deck you want to share with others
      </p>

      <div class="flex flex-row justify-center how-to-content">
        <img
          class="responsive-image"
          alt="view profile"
          src="../../../assets/images/help/mobile/navigate_to_decklist.gif" />
      </div>

      <p class="how-to-content">
        2. Click on the "Get Link" button. This will copy the link for you to
        share with others.
      </p>

      <div class="flex flex-row justify-center how-to-content">
        <img
          class="responsive-image"
          alt="share deck"
          src="../../../assets/images/help/mobile/share_deck.gif" />
      </div>

      <p class="how-to-content">
        3. The link will be copied to your clip board for you to share with
        others. Try visiting the link in your browser and you should be taken to
        your deck!
      </p>

      <hr />
      <div class="video-container">
        <iframe
          src="https://www.youtube.com/embed/jYv5hmuYvEI?si=gEmkEsbKbnNCTHX6"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen></iframe>
      </div>
    </div>
    <ng-template #desktopContent>
      <!-- Desktop Content -->
      <p class="how-to-content">
        1. Navigate to the "Profile" page and you should see your saved decks.
        Click on the deck you want to share with others
      </p>

      <div class="flex flex-row justify-center how-to-content">
        <img
          class="responsive-image"
          alt="view profile"
          src="../../../assets/images/help/desktop/navigate_to_decklist.gif" />
      </div>

      <p class="how-to-content">
        2. Click on the "Get Link" button. This will copy the link for you to
        share with others.
      </p>

      <div class="flex flex-row justify-center how-to-content">
        <img
          class="responsive-image"
          alt="share deck"
          src="../../../assets/images/help/desktop/share_deck.gif" />
      </div>

      <p class="how-to-content">
        3. The link will be copied to your clip board for you to share with
        others. Try visiting the link in your browser and you should be taken to
        your deck!
      </p>

      <hr />
      <div class="video-container">
        <iframe
          src="https://www.youtube.com/embed/jYv5hmuYvEI?si=gEmkEsbKbnNCTHX6"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen></iframe>
      </div>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf],
})
export class HelpShareDeckComponent {
  @Input() isMobile: boolean | null = false;
}

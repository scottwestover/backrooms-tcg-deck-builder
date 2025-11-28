import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'backrooms-help-deck-randomizer',
  template: `
    <div>
      <p class="how-to-content how-to-deck-randomizer-title">
        How To Use the Deck Randomizer
      </p>
      <hr />
      <div class="video-container">
        <iframe
          src="https://www.youtube.com/embed/u4VeVBePcQQ?si=OsbleNfjEcS5UWE5"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen></iframe>
      </div>
      <hr class="how-to-deck-randomizer-video-container-spacer" />

      <p class="how-to-content how-to-deck-randomizer-title">
        Randomizer Modes Explained
      </p>
      <hr />
      <div class="video-container">
        <iframe
          src="https://www.youtube.com/embed/C7UZkSnF1Uc?si=r5xJfgVTfWIDLGRa"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen></iframe>
      </div>
      <hr class="how-to-deck-randomizer-video-container-spacer" />

      <p class="how-to-content how-to-deck-randomizer-title">
        How To Use Simple Mode
      </p>
      <hr />
      <div class="video-container">
        <iframe
          src="https://www.youtube.com/embed/hhpvAIfNL6o?si=g77dv02GykPNJ2KK"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen></iframe>
      </div>
      <hr class="how-to-deck-randomizer-video-container-spacer" />

      <p class="how-to-content how-to-deck-randomizer-title">
        How To Use Mixed Mode
      </p>
      <hr />
      <div class="video-container">
        <iframe
          src="https://www.youtube.com/embed/jC8YFMaLXyo?si=CmaTEzrgjj80jllE"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen></iframe>
      </div>
      <hr class="how-to-deck-randomizer-video-container-spacer" />

      <p class="how-to-content how-to-deck-randomizer-title">
        How To Use Manual Mode
      </p>
      <hr />
      <div class="video-container">
        <iframe
          src="https://www.youtube.com/embed/-L5ohVNEFR4?si=qQukoeH98DRNft6o"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen></iframe>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf],
  styleUrls: ['./help-deck-randomizer.component.scss'],
})
export class HelpDeckRandomizerComponent {
  @Input() isMobile: boolean | null = false;
}

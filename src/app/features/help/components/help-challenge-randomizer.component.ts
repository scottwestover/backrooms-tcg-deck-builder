import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'backrooms-help-challenge-randomizer',
  template: `
    <div>
      <p class="how-to-content how-to-challenge-randomizer-title">
        How To Use the Challenge Randomizer
      </p>
      <hr />
      <div class="video-container">
        <iframe
          src="https://www.youtube.com/embed/u3Xx92uSxHY"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen></iframe>
      </div>
      <hr class="how-to-challenge-randomizer-video-container-spacer" />

      <p class="how-to-content how-to-challenge-randomizer-title">
        Challenge Modes Explained
      </p>
      <hr />
      <div class="video-container">
        <iframe
          src="https://www.youtube.com/embed/s6RGKB_pWko"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen></iframe>
      </div>
      <hr class="how-to-challenge-randomizer-video-container-spacer" />

      <p class="how-to-content how-to-challenge-randomizer-title">
        How To Use All Levels Mode
      </p>
      <hr />
      <div class="video-container">
        <iframe
          src="https://www.youtube.com/embed/1XJmouhGbeI"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen></iframe>
      </div>
      <hr class="how-to-challenge-randomizer-video-container-spacer" />

      <p class="how-to-content how-to-challenge-randomizer-title">
        How To Use Random Mode
      </p>
      <hr />
      <div class="video-container">
        <iframe
          src="https://www.youtube.com/embed/Uiob96oLvJ0"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen></iframe>
      </div>
      <hr class="how-to-challenge-randomizer-video-container-spacer" />

      <p class="how-to-content how-to-challenge-randomizer-title">
        How To Use Manual Mode
      </p>
      <hr />
      <div class="video-container">
        <iframe
          src="https://www.youtube.com/embed/DdblVafDLnM"
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
  styleUrls: ['./help-challenge-randomizer.component.scss'],
})
export class HelpChallengeRandomizerComponent {
  @Input() isMobile: boolean | null = false;
}

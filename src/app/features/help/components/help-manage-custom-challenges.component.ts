import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'backrooms-help-manage-custom-challenges-component',
  template: `
    <div>
      <div class="video-container">
        <iframe
          src="https://www.youtube.com/embed/qNJNbNR6KxY"
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
})
export class HelpManageCustomChallengesComponent {
  @Input() isMobile: boolean | null = false;
}

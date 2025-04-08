import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'backrooms-home-intro',
  template: `
    <div class="flex flex-row justify-center">
      <img
        alt="Logo"
        class="cursor-pointer"
        src="../../../assets/images/backrooms-tcg-logo.webp" />
    </div>

    <p-divider class="my-5"></p-divider>

    <h2
      class="mt-1 text-center text-[#e2e4e6] text-sm sm:text-base spacer spacer-top">
      <p class="intro-text">Welcome, Wanderer.</p>
    </h2>
    <h2 class="mt-1 text-[#e2e4e6] text-sm sm:text-base spacer">
      <p class="spacer">
        You have slipped through the cracks of reality once more. The Backrooms
        stretch endlessly before you—dim corridors, flickering lights, the
        distant hum of something unseen. To survive here, preparation is
        essential.
      </p>

      <p>
        This archive is your lifeline. Within these pages, you may catalog your
        findings, assemble the tools you need, and strategize your escape. Use
        it wisely, share your discoveries with others, and perhaps—just
        perhaps—you will find a way out.
      </p>
    </h2>

    <h2
      class="mt-1 text-center text-[#e2e4e6] text-sm sm:text-base spacer spacer-top">
      <p class="intro-text">What is this place?</p>
    </h2>
    <h2 class="mt-1 text-[#e2e4e6] text-sm sm:text-base spacer">
      <p class="spacer">
        If you haven't yet encountered the Backrooms TCG, it is a hauntingly
        unique solitaire trading card game where survival depends on your
        choices. This site exists to help you:
      </p>
      <p>
        🔹 Track your collection – Keep an inventory of the cards you've
        acquired.
      </p>
      <p>
        🔹 Build decks digitally – Arrange your cards into strategic
        combinations for your journey.
      </p>
      <p class="spacer">
        🔹 Share with others – Exchange deck ideas with fellow Wanderers.
      </p>
      <p>
        This tool is still evolving, much like the Backrooms themselves. New
        features will emerge over time, shaped by those who explore this space.
      </p>
    </h2>

    <h2
      class="mt-1 text-center text-[#e2e4e6] text-sm sm:text-base spacer spacer-top">
      <p class="intro-text">Share Your Knowledge</p>
    </h2>
    <h2 class="mt-1 text-[#e2e4e6] text-sm sm:text-base spacer">
      <p class="spacer">
        The Backrooms are vast, and no Wanderer survives alone. If you have
        ideas, feedback, or feature requests, your insights could shape the
        future of this archive.
      </p>

      <p>
        Reach out through
        <a href="https://discord.gg/nzy3HdweTF" target="_target">Discord</a> or
        <a
          href="https://github.com/scottwestover/backrooms-tcg-deck-builder/issues"
          target="_blank"
          >GitHub</a
        >
      </p>
    </h2>

    <p-divider class="my-5"></p-divider>
    <h2
      class="mt-1 text-center text-[#e2e4e6] text-sm sm:text-base spacer spacer-top">
      <p>
        The information presented on this site about Backrooms TCG, both literal
        and graphical, is copyrighted by BACKROOMS TCG LLC. This website is not
        produced, endorsed, supported, or affiliated with BACKROOMS TCG LLC.
      </p>
    </h2>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [DividerModule, AsyncPipe],
  styleUrls: ['./home-intro.component.scss'],
})
export class HomeIntroComponent {
  faq = [];
  images = [
    {
      src: 'assets/images/1.webp',
    },
  ];

  position: string = 'bottom';

  positionOptions = [
    {
      label: 'Bottom',
      value: 'bottom',
    },
    {
      label: 'Top',
      value: 'top',
    },
    {
      label: 'Left',
      value: 'left',
    },
    {
      label: 'Right',
      value: 'right',
    },
  ];

  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5,
    },
    {
      breakpoint: '768px',
      numVisible: 3,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
    },
  ];
}

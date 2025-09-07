import { PageComponent } from '../shared/page.component';
import { HelpIntroComponent } from './components/help-intro.component';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'backrooms-help-page',
  template: `
    <backrooms-page>
      <backrooms-help-intro
        class="p-5 mx-auto self-baseline w-full max-w-7xl h-[calc(100vh-3.5rem)] md:h-[calc(100vh-5rem)] lg:h-screen"></backrooms-help-intro>
    </backrooms-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [HelpIntroComponent, PageComponent],
})
export class HelpPageComponent {
  constructor(
    private meta: Meta,
    private title: Title,
  ) {
    this.makeGoogleFriendly();
  }

  private makeGoogleFriendly() {
    this.title.setTitle('Backrooms DB - Help');

    this.meta.addTags([
      {
        name: 'description',
        content:
          'backrooms-tcg-deckbuilder.web.app is a website to to keep track of your Backrooms card collection, build great decks and keep you posted about the result of any major events.',
      },
      { name: 'author', content: 'scottwestover' },
      {
        name: 'keywords',
        content:
          'Backrooms, decks, deck builder, collection, TCG, community, friends, share, help, guide, faq',
      },
    ]);
  }
}

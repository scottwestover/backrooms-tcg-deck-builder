import { PageComponent } from '../shared/page.component';
import { HomeIntroComponent } from './components/home-intro.component';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'backrooms-home-page',
  template: `
    <backrooms-page>
      <backrooms-home-intro
        class="p-5 max-w-sm sm:max-w-md md:max-w-4xl h-[calc(100vh-3.5rem)] md:h-[calc(100vh-5rem)] lg:h-screen"></backrooms-home-intro>
    </backrooms-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [HomeIntroComponent, PageComponent],
})
export class HomePageComponent {
  constructor(
    private meta: Meta,
    private title: Title,
  ) {
    this.makeGoogleFriendly();
  }

  private makeGoogleFriendly() {
    this.title.setTitle('Backrooms TCG - Home');

    this.meta.addTags([
      {
        name: 'description',
        content:
          'backrooms-tcg.web.app is a website to to keep track of your Backrooms card collection, build great decks and keep you posted about the result of any major events.',
      },
      { name: 'author', content: 'scottwestover' },
      {
        name: 'keywords',
        content:
          'Backrooms, decks, deck builder, collection, TCG, community, friends, share',
      },
    ]);
  }
}

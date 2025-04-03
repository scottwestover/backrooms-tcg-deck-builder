import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { map, of, switchMap } from 'rxjs';
import { emptySave } from '../../../models';
import { BackroomsBackendService } from '../../services/backrooms-backend.service';
import { FilterAndSearchComponent } from '../shared/filter/filter-and-search.component';
import { PageComponent } from '../shared/page.component';
import { PaginationCardListComponent } from './components/pagination-card-list.component';

@Component({
  selector: 'backrooms-collection-page',
  template: `
    <backrooms-page *ngIf="checkUrl$ | async as collection">
      <backrooms-pagination-card-list
        [collectionOnly]="true"
        [inputCollection]="collection"
        class="w-screen lg:w-[calc(100vw-6.5rem)] flex flex-row h-[calc(100vh-3.5rem)] md:h-[calc(100vh-5rem)] lg:h-screen"></backrooms-pagination-card-list>
    </backrooms-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FilterAndSearchComponent,
    PaginationCardListComponent,
    PageComponent,
    AsyncPipe,
    NgIf,
  ],
})
export class CollectionPageComponent {
  meta = inject(Meta);
  title = inject(Title);

  private digimonBackendService = inject(BackroomsBackendService);
  private route = inject(ActivatedRoute);

  // Check the URL if another Save should be loaded
  checkUrl$ = this.route.params.pipe(
    switchMap((params) => {
      if (params['userId']) {
        return this.digimonBackendService.getSave(params['userId']);
      } else {
        return of(emptySave);
      }
    }),
    map((save) => save.collection),
  );

  constructor() {
    this.makeGoogleFriendly();
  }

  private makeGoogleFriendly() {
    this.title.setTitle('Backrooms TCG - Collection');

    this.meta.addTags([
      {
        name: 'description',
        content:
          'Keep track of your Collection of the new Backrooms Card Game. Find missing cards, rulings, erratas and many more information easily.',
      },
      { name: 'author', content: 'scottwestover' },
      {
        name: 'keywords',
        content: 'Collection, Backrooms, Card, Card, Game, rulings, erratas',
      },
    ]);
  }
}

import { AsyncPipe, Location, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { UntypedFormControl } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import {
  filter,
  first,
  merge,
  Observable,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { emptySettings, IDeck, ISave } from '../../../models';
import { AuthService } from '../../services/auth.service';
import { BackroomsBackendService } from '../../services/backrooms-backend.service';
import { SaveStore } from '../../store/save.store';
import { PageComponent } from '../shared/page.component';
import { DeckFilterComponent } from './components/deck-filter.component';
import { DecksComponent } from './components/decks.component';
import { UserStatsComponent } from './components/user-stats.component';

@Component({
  selector: 'backrooms-profile-page',
  template: `
    <backrooms-page *ngIf="save$ | async as save">
      <div
        class="flex flex-col self-baseline px-5 max-w-sm sm:max-w-3xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto">
        <backrooms-user-stats
          *ngIf="showUserStats"
          [save]="save"
          class="mx-auto my-1 w-[calc(100%-3rem)] sm:w-full"></backrooms-user-stats>

        <backrooms-deck-filter
          [searchFilter]="searchFilter"
          [tagFilter]="tagFilter"
          class="mx-auto w-[calc(100%-3rem)] sm:w-full"></backrooms-deck-filter>

        <backrooms-decks
          class="mx-auto mt-1 w-full"
          [editable]="editable"
          [decks]="filteredDecks"></backrooms-decks>
      </div>
    </backrooms-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    DeckFilterComponent,
    DecksComponent,
    UserStatsComponent,
    PageComponent,
  ],
})
export class ProfilePageComponent implements OnInit, OnDestroy {
  saveStore = inject(SaveStore);

  save$: Observable<ISave | null>;
  decks: IDeck[];
  filteredDecks: IDeck[];
  showUserStats = emptySettings.showUserStats;

  searchFilter = new UntypedFormControl('');
  tagFilter = new UntypedFormControl([]);

  editable = true;

  private onDestroy$ = new Subject<boolean>();

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    public authService: AuthService,
    private backroomsBackendService: BackroomsBackendService,
    private meta: Meta,
    private title: Title,
  ) {
    effect(() => {
      this.decks = this.saveStore.decks().sort((a, b) => {
        const aTitle = a.title ?? '';
        const bTitle = b.title ?? '';
        return aTitle.localeCompare(bTitle);
      });
      this.filteredDecks = this.decks;
      this.filterChanges();
    });

    this.save$ = merge(
      toObservable(this.saveStore.save),
      this.authService.authChange.pipe(
        tap(() => this.changeURL()),
        switchMap(() => {
          this.editable = true;
          return this.backroomsBackendService.getSave(
            this.authService.userData!.uid,
          );
        }),
      ),
      this.route.params.pipe(
        filter((params) => {
          if (!params['id']) {
            this.changeURL();
          }
          return !!params['id'];
        }),
        switchMap((params) =>
          this.backroomsBackendService.getSave(params['id']).pipe(first()),
        ),
        tap((save) => {
          this.editable = save.uid === this.authService.userData?.uid;
          this.decks = save?.decks ?? [];
          this.filteredDecks = this.decks;
          this.filterChanges();
        }),
      ),
    );
  }

  ngOnInit() {
    this.makeGoogleFriendly();

    this.searchFilter.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => this.filterChanges());
    this.tagFilter.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => this.filterChanges());
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

  changeURL() {
    if (this.authService.userData?.uid) {
      this.location.replaceState('/user/' + this.authService.userData?.uid);
    } else {
      this.location.replaceState('/user');
    }
  }

  filterChanges() {
    this.filteredDecks = this.searchFilter.value
      ? this.applySearchFilter()
      : this.decks;
    this.filteredDecks =
      this.tagFilter.value.length > 0
        ? this.applyTagFilter()
        : this.filteredDecks;
    this.filteredDecks = this.filteredDecks.sort((a, b) => {
      const aTitle = a.title ?? '';
      const bTitle = b.title ?? '';
      return aTitle.localeCompare(bTitle);
    });
  }

  private makeGoogleFriendly() {
    this.title.setTitle('Backrooms DB - Profile');

    this.meta.addTags([
      {
        name: 'description',
        content:
          'See your Collection and Decks in one view. Share them with your friends, for easy insights in your decks and trading.',
      },
      { name: 'author', content: 'scottwestover' },
      {
        name: 'keywords',
        content: 'Collection, Decks, Share, insights, trading',
      },
    ]);
  }

  private applySearchFilter(): IDeck[] {
    return this.decks.filter((deck) => {
      const search = this.searchFilter.value.toLocaleLowerCase();

      const titleInText =
        deck.title?.toLocaleLowerCase().includes(search) ?? false;
      const descriptionInText =
        deck.description?.toLocaleLowerCase().includes(search) ?? false;
      const cardsInText =
        deck.cards.filter((card) =>
          card.id.toLocaleLowerCase().includes(search),
        ).length > 0;

      return titleInText || descriptionInText || cardsInText;
    });
  }

  private applyTagFilter(): IDeck[] {
    return this.decks.filter((deck) => {
      let isTrue = false;

      return isTrue;
    });
  }
}

import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SidebarModule } from 'primeng/sidebar';
import { ToastModule } from 'primeng/toast';
import { first } from 'rxjs';
import { emptyFilter, IFilter } from '../models';
import { DialogComponent } from './features/shared/dialog.component';
import { NavLinksComponent } from './features/shared/navbar/nav-links.component';
import { NavbarComponent } from './features/shared/navbar/navbar.component';
import { filterCards } from './functions';
import { AuthService } from './services/auth.service';
import { BackroomsBackendService } from './services/backrooms-backend.service';
import { BackroomsCardStore } from './store/backrooms-card.store';
import { FilterStore } from './store/filter.store';
import { SaveStore } from './store/save.store';
import { WebsiteStore } from './store/website.store';
import { LOCAL_STORAGE_KEY } from './config';

@Component({
  selector: 'backrooms-root',
  template: `
    <div class="flex flex-col lg:flex-row main-root">
      <backrooms-navbar (openSideNav)="sideNav = true"></backrooms-navbar>

      @if (saveLoaded()) {
        <div
          class="min-h-[calc(100vh-3.5rem)] md:min-h-[calc(100vh-5rem)] lg:min-h-[100vh]
        w-[100vw] lg:max-w-[calc(100vw-6.5rem)] lg:w-[calc(100vw-6.5rem)]
        flex justify-center items-center">
          <router-outlet></router-outlet>
        </div>
      } @else {
        <div class="h-[calc(100vh-58px)] w-screen"></div>
        <p-blockUI [blocked]="!saveLoaded()"></p-blockUI>
        <p-progressSpinner
          class="absolute left-1/2 top-1/2 z-[5000] -translate-x-1/2 -translate-y-1/2 transform"></p-progressSpinner>
      }

      <backrooms-dialog></backrooms-dialog>

      <p-sidebar
        [(visible)]="sideNav"
        styleClass="w-[6.5rem] overflow-hidden p-0">
        <ng-template pTemplate="content" class="p-0">
          <backrooms-nav-links
            class="flex flex-col w-full justify-center"
            [sidebar]="true"></backrooms-nav-links>
        </ng-template>
      </p-sidebar>

      <p-toast></p-toast>
    </div>
  `,
  standalone: true,
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NavbarComponent,
    NgIf,
    RouterOutlet,
    BlockUIModule,
    ProgressSpinnerModule,
    SidebarModule,
    NavLinksComponent,
    ToastModule,
    DialogComponent,
  ],
})
export class AppComponent {
  backroomCardStore = inject(BackroomsCardStore);
  saveStore = inject(SaveStore);
  filterStore = inject(FilterStore);
  websiteStore = inject(WebsiteStore);

  authService = inject(AuthService);
  backendService = inject(BackroomsBackendService);

  saveLoaded = signal(false);

  sideNav = false;

  cardSet = '';
  settings = this.saveStore.settings();

  constructor() {
    // Check if a save is in local storage from a previous login
    // If this is the case, set the save
    this.saveStore.loadSave();

    effect(
      () => {
        console.debug('Save changed');
        this.saveLoaded.set(
          this.saveStore.save().uid !== '' || this.saveStore.loadedSave(),
        );

        if (!this.saveStore.loadedSave()) {
          return;
        }

        console.debug('Update Save in the Database');
        this.updateDatabase();
        if (this.settings !== this.saveStore.settings()) {
          console.debug('Change Advanced Settings');
          this.settings = this.saveStore.settings();
          this.setAdvancedSettings();
        }
        if (this.cardSet !== this.saveStore.settings().cardSet) {
          this.cardSet = this.saveStore.settings().cardSet;
          this.setBackroomCardSet();
        }
      },
      { allowSignalWrites: true },
    );

    effect(
      () => {
        const cards = this.backroomCardStore.cards();

        if (cards.length === 0) return;

        const filteredCards = filterCards(
          this.backroomCardStore.cards(),
          this.saveStore.save(),
          this.filterStore.filter(),
          this.websiteStore.sort(),
          this.backroomCardStore.cardsMap(),
        );

        this.backroomCardStore.updateFilteredCards(filteredCards);
      },
      { allowSignalWrites: true },
    );

    // Prevent Right Click, that is used for other actions
    document.addEventListener(
      'contextmenu',
      function (e) {
        e.preventDefault();
      },
      false,
    );
  }

  private updateDatabase(): void {
    const save = this.saveStore.save();
    if (this.authService.isLoggedIn) {
      this.backendService
        .updateSave(save, this.saveStore.lastUpdatedDeckId())
        .pipe(first())
        .subscribe(() => {});
    } else {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(save));
    }
  }

  private setAdvancedSettings(): void {
    const settings = this.saveStore.settings();

    if (
      settings.showPreRelease === undefined ||
      settings.showAACards === undefined ||
      settings.showStampedCards === undefined ||
      settings.showReprintCards === undefined ||
      settings.showSpecialRareCards === undefined ||
      settings.showRarePullCards === undefined
    ) {
      return;
    }

    let filter: IFilter = this.filterStore.filter();
    if (filter !== emptyFilter) return;
    filter = { ...filter, versionFilter: [] };

    if (!settings.showFoilCards) {
      let versionFilter = filter.versionFilter.filter(
        (filter) => filter !== 'Foil',
      );
      if (versionFilter.length === 0) {
        versionFilter = [
          'Normal',
          'Alternative Art',
          'Textured',
          'Release',
          'Box Topper',
          'Full Art',
          'Stamp',
          'Special Rare',
          'Rare Pull',
        ];
      }
      filter = { ...filter, versionFilter };
    }
    if (!settings.showTexturedCards) {
      let versionFilter = filter.versionFilter.filter(
        (filter) => filter !== 'Textured',
      );
      if (versionFilter.length === 0) {
        versionFilter = [
          'Normal',
          'Alternative Art',
          'Foil',
          'Release',
          'Box Topper',
          'Full Art',
          'Stamp',
          'Special Rare',
          'Rare Pull',
        ];
      }
      filter = { ...filter, versionFilter };
    }
    if (!settings.showPreRelease) {
      let versionFilter = filter.versionFilter.filter(
        (filter) => filter !== 'Release',
      );
      if (versionFilter.length === 0) {
        versionFilter = [
          'Normal',
          'Alternative Art',
          'Foil',
          'Textured',
          'Box Topper',
          'Full Art',
          'Stamp',
          'Special Rare',
          'Rare Pull',
        ];
      }
      filter = { ...filter, versionFilter };
    }
    if (!settings.showBoxTopper) {
      let versionFilter = filter.versionFilter.filter(
        (filter) => filter !== 'Box Topper',
      );
      if (versionFilter.length === 0) {
        versionFilter = [
          'Normal',
          'Alternative Art',
          'Foil',
          'Textured',
          'Release',
          'Full Art',
          'Stamp',
          'Special Rare',
          'Rare Pull',
        ];
      }
      filter = { ...filter, versionFilter };
    }
    if (!settings.showFullArtCards) {
      let versionFilter = filter.versionFilter.filter(
        (filter) => filter !== 'Full Art',
      );
      if (versionFilter.length === 0) {
        versionFilter = [
          'Normal',
          'Alternative Art',
          'Foil',
          'Textured',
          'Release',
          'Box Topper',
          'Stamp',
          'Special Rare',
          'Rare Pull',
        ];
      }
      filter = { ...filter, versionFilter };
    }
    if (!settings.showStampedCards) {
      let versionFilter = filter.versionFilter.filter(
        (filter) => filter !== 'Stamp',
      );
      if (versionFilter.length === 0) {
        versionFilter = [
          'Normal',
          'Alternative Art',
          'Foil',
          'Textured',
          'Release',
          'Box Topper',
          'Full Art',
          'Special Rare',
          'Rare Pull',
        ];
      }
      filter = { ...filter, versionFilter };
    }
    if (!settings.showAACards) {
      let versionFilter = filter.versionFilter.filter(
        (filter) => filter !== 'Alternative Art',
      );
      if (versionFilter.length === 0) {
        versionFilter = [
          'Normal',
          'Foil',
          'Textured',
          'Release',
          'Box Topper',
          'Full Art',
          'Stamp',
          'Special Rare',
          'Rare Pull',
        ];
      }
      filter = { ...filter, versionFilter };
    }
    if (!settings.showSpecialRareCards) {
      let versionFilter = filter.versionFilter.filter(
        (filter) => filter !== 'Special Rare',
      );
      if (versionFilter.length === 0) {
        versionFilter = [
          'Normal',
          'Alternative Art',
          'Foil',
          'Textured',
          'Release',
          'Box Topper',
          'Full Art',
          'Stamp',
          'Rare Pull',
        ];
      }
      filter = { ...filter, versionFilter };
    }
    if (!settings.showRarePullCards) {
      let versionFilter = filter.versionFilter.filter(
        (filter) => filter !== 'Rare Pull',
      );
      if (versionFilter.length === 0) {
        versionFilter = [
          'Normal',
          'Alternative Art',
          'Foil',
          'Textured',
          'Release',
          'Box Topper',
          'Full Art',
          'Stamp',
          'Special Rare',
        ];
      }
      filter = { ...filter, versionFilter };
    }

    this.filterStore.updateFilter(filter);
  }

  private setBackroomCardSet(): void {
    const cardSet = this.saveStore.settings().cardSet;
    if (cardSet === undefined) {
      return;
    }

    this.backroomCardStore.updateCards();
  }
}

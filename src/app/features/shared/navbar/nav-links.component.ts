import { NgClass, NgIf, NgOptimizedImage } from '@angular/common';
import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogModule } from 'primeng/dialog';
import { Subject, takeUntil } from 'rxjs';
import { IUser } from '../../../../models';
import { AuthService } from '../../../services/auth.service';
import { DialogStore } from '../../../store/dialog.store';
import { SaveStore } from '../../../store/save.store';
import { ChangelogDialogComponent } from '../dialogs/changelog-dialog.component';
import { FilterButtonComponent } from '../filter/filter-button.component';

@Component({
  selector: 'backrooms-nav-links',
  template: `
    <ul
      [ngClass]="{
        'h-[5rem] lg:h-auto lg:w-[6.5rem] lg:py-5 flex-row lg:flex-col pt-5':
          !sidebar,
        'w-[6.5rem] py-5 flex-col': sidebar
      }"
      class="p-0 ml-auto list-none flex justify-between">
      <li
        class="flex flex-col items-center group cursor-pointer"
        [ngClass]="getNavigationBorder('/')"
        (click)="router.navigateByUrl('')">
        <i
          class="pi pi-home group-hover:text-[#FFD54F]"
          style="font-size: 1.5rem"></i>
        <div
          [ngClass]="{ 'text-[#FFD54F]': route === '/' }"
          style="font-size:smaller"
          class="p-2 group-hover:text-[#FFD54F]">
          Home
        </div>
      </li>

      <li
        class="flex flex-col items-center group cursor-pointer"
        [ngClass]="getNavigationBorder('/deckbuilder')"
        (click)="router.navigateByUrl('/deckbuilder')">
        <i
          class="pi pi-pencil group-hover:text-[#FFD54F]"
          style="font-size: 1.5rem"></i>
        <button
          style="font-size:smaller"
          class="p-2 group-hover:text-[#FFD54F]">
          Deckbuilder
        </button>
      </li>

      <li
        class="flex flex-col items-center group cursor-pointer"
        [ngClass]="getNavigationBorder('/collection')"
        (click)="router.navigateByUrl('/collection')">
        <i
          class="pi pi-folder group-hover:text-[#FFD54F]"
          style="font-size: 1.5rem"></i>
        <button
          style="font-size:smaller"
          class="p-2 group-hover:text-[#FFD54F]">
          Collection
        </button>
      </li>

      <li
        class="flex flex-col items-center group cursor-pointer"
        [ngClass]="getNavigationBorder('/user')"
        (click)="router.navigateByUrl('/user')">
        <i
          class="pi pi-user group-hover:text-[#FFD54F]"
          style="font-size: 1.5rem"></i>
        <button
          style="font-size:smaller"
          class="p-2 group-hover:text-[#FFD54F]">
          Profile
        </button>
      </li>

      <li
        class="flex flex-col items-center group cursor-pointer"
        [ngClass]="getNavigationBorder('/decks')"
        (click)="router.navigateByUrl('/decks')">
        <i
          class="pi pi-table group-hover:text-[#FFD54F]"
          style="font-size: 1.5rem"></i>
        <button
          style="font-size:smaller"
          class="p-2 group-hover:text-[#FFD54F]">
          Decks
        </button>
      </li>
    </ul>

    <div
      [ngClass]="{
        'max-lg:ml-auto flex-row lg:flex-col': !sidebar,
        'flex-col': sidebar
      }"
      class="flex justify-center">
      <button
        (click)="loginLogout()"
        [ngClass]="{
          'max-lg:mr-5': !sidebar
        }"
        class="group">
        <ng-container *ngIf="user; else userIcon">
          <div
            class='min-w-auto mx-auto primary-background h-12 w-12 overflow-hidden rounded-full text-[#e2e4e6] group-hover:bg-[#FFD54F]"'>
            <img
              *ngIf="user"
              alt="{{ this.user.displayName }}"
              src="{{ this.user.photoURL }}" />
          </div>
          <span class="text-[#e2e4e6] text-xs">{{
            this.user.displayName
          }}</span>
        </ng-container>
        <ng-template #userIcon>
          <div
            class='min-w-auto mx-auto flex flex-col justify-center primary-background h-12 w-12 overflow-hidden rounded-full text-[#e2e4e6] hover:bg-[#FFD54F]"'>
            <i class="pi pi-user" style="font-size: 1.5rem"></i>
          </div>
          <span class="text-[#e2e4e6] text-xs group-hover:text-[#FFD54F]"
            >Press to Login</span
          >
        </ng-template>
      </button>
      <!--
      <i
        [ngClass]="{
          'max-lg:mr-5': !sidebar
        }"
        class="pi pi-ellipsis-h my-5 text-center text-[#e2e4e6] hover:text-[#FFD54F]"
        style="font-size: 1.5rem"
        (click)="openSettings()"></i>

      <div class="grid grid-cols-2 justify-center items-center">
        <a
          class="mx-auto"
          href="https://github.com/TakaOtaku/Digimon-Card-App"
          target="_blank">
          <i
            class="pi pi-github px-1 text-[#e2e4e6] hover:text-[#FFD54F]"
            style="font-size: 1rem"></i>
        </a>

        <a
          class="mx-auto"
          href="https://twitter.com/digimoncardapp"
          target="_blank">
          <i
            class="pi pi-twitter px-1 text-[#e2e4e6] hover:text-[#FFD54F]"
            style="font-size: 1rem"></i>
        </a>

        <a
          class="mx-auto"
          href="https://discordapp.com/users/189436886744432640"
          target="_blank">
          <i
            class="pi pi-discord px-1 text-[#e2e4e6] hover:text-[#FFD54F]"
            style="font-size: 1rem"></i>
        </a>

        <a
          class="mx-auto"
          href="https://www.paypal.com/donate/?hosted_button_id=WLM58Q785D4H4"
          target="_blank">
          <i
            class="pi pi-paypal px-1 text-[#e2e4e6] hover:text-[#FFD54F]"
            style="font-size: 1rem"></i>
        </a>
        <div class="col-span-2 flex align-center justify-center">
          <p-button
            class="mx-auto"
            [link]="true"
            size="small"
            (onClick)="showChangelog()"
            label="Ver. 4.1.8"></p-button>
        </div>
      </div>
    </div> -->
    </div>
  `,
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    FilterButtonComponent,
    FontAwesomeModule,
    ConfirmPopupModule,
    DialogModule,
    ChangelogDialogComponent,
    NgOptimizedImage,
    ButtonModule,
  ],
})
export class NavLinksComponent implements OnInit, OnDestroy {
  @Input() sidebar = false;
  dialogStore = inject(DialogStore);
  saveStore = inject(SaveStore);

  user: IUser | null;

  mobile = false;
  route: string = '';

  private onDestroy$ = new Subject();

  constructor(
    public router: Router,
    public authService: AuthService,
  ) {}

  ngOnInit() {
    this.user = this.authService.userData;
    this.authService.authChange.subscribe(() => {
      this.user = this.authService.userData;
    });

    this.router.events.pipe(takeUntil(this.onDestroy$)).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.route = event.url;
      }
    });
    this.route = this.router.url;
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

  loginLogout() {
    this.authService.isLoggedIn
      ? this.authService.LogOut(this.saveStore)
      : this.authService.GoogleAuth(this.saveStore);
  }

  getNavigationBorder(route: string): any {
    if (route === '/deckbuilder') {
      const deckOpenOrDeckbuilder =
        this.route === '/deckbuilder' ||
        this.route.includes('/deckbuilder/') ||
        (this.route.includes('/deck/') && this.route.includes('/user/'));
      return {
        'border-l-[3px] border-white': deckOpenOrDeckbuilder && this.sidebar,
        'border-b-[3px] lg:border-b-0 lg:border-l-[3px] border-white':
          deckOpenOrDeckbuilder && !this.sidebar,
        'text-[#ffd54f]': deckOpenOrDeckbuilder,
        'text-[#e2e4e6]': !deckOpenOrDeckbuilder,
      };
    } else if (route === '/user') {
      return {
        'border-l-[3px] border-white':
          this.route.includes(route) &&
          !this.route.includes('deckbuilder') &&
          this.sidebar,
        'border-b-[3px] lg:border-b-0 lg:border-l-[3px] border-white':
          this.route.includes(route) &&
          !this.route.includes('deckbuilder') &&
          !this.sidebar,
        'text-[#ffd54f]':
          this.route.includes(route) && !this.route.includes('deckbuilder'),
        'text-[#e2e4e6]': !this.route.includes(route),
      };
    }
    return {
      'border-l-[3px] border-white': this.route === route && this.sidebar,
      'border-b-[3px] lg:border-b-0 lg:border-l-[3px] border-white':
        this.route === route && !this.sidebar,
      'text-[#ffd54f]': this.route === route,
      'text-[#e2e4e6]': this.route !== route,
    };
  }

  openSettings() {
    this.dialogStore.updateSettingsDialog(true);
  }

  showChangelog() {
    this.dialogStore.updateChangelogDialog(true);
  }
}

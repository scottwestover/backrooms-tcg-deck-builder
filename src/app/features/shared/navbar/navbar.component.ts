import { NgClass, NgIf, NgOptimizedImage } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogModule } from 'primeng/dialog';
import { SidebarModule } from 'primeng/sidebar';
import { DialogStore } from '../../../store/dialog.store';
import { ChangelogDialogComponent } from '../dialogs/changelog-dialog.component';
import { SettingsDialogComponent } from '../dialogs/settings-dialog.component';
import { FilterButtonComponent } from '../filter/filter-button.component';
import { NavLinksComponent } from './nav-links.component';

@Component({
  selector: 'backrooms-navbar',
  template: `
    <nav
      class="flex flex-row lg:flex-col h-[3.5rem] md:h-[5rem] lg:min-h-[100vh] lg:h-full w-[100vw] lg:w-[6.5rem] lg:max-w-[6.5rem] max-w-[100vw]
      border-b lg:border-b-0 lg:border-r border-slate-600 px-5 lg:px-0 lg:py-10 items-center"
      style="backdrop-filter: blur(16px);">
      <a class="z-[5000]" href="#">
        <img
          alt="Logo"
          class="mt-[0.25rem] cursor-pointer max-h-[2.5rem] md:max-h-[4rem]"
          src="../../../../assets/images/DollFace.webp" />
      </a>

      <i
        (click)="openSideNav.emit(true)"
        class="block md:hidden ml-3 pi pi-bars px-1 text-[#e2e4e6] hover:text-[#64B5F6]"
        style="font-size: 1.25rem"></i>

      <backrooms-nav-links
        class="hidden md:flex flex-row lg:flex-col w-full h-full justify-evenly"></backrooms-nav-links>
    </nav>
  `,
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    FilterButtonComponent,
    FontAwesomeModule,
    ConfirmPopupModule,
    DialogModule,
    SettingsDialogComponent,
    ChangelogDialogComponent,
    NgOptimizedImage,
    NavLinksComponent,
    SidebarModule,
  ],
})
export class NavbarComponent {
  @Output() openSideNav = new EventEmitter<boolean>();
}

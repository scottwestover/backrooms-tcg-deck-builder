import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { Router } from '@angular/router';
import { CarouselModule } from 'primeng/carousel';
import { ISave } from '../../../../models';
import { PaginationCardListComponent } from '../../collection/components/pagination-card-list.component';
import { DialogModule } from 'primeng/dialog';
import { CollectionCircleComponent } from './collection-circle.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'backrooms-user-stats',
  template: `
    <div class="flex flex-col py-2 text-[#e2e4e6]">
      <div class="flex flex-col sm:flex-row justify-center">
        <div class="flex flex-row mx-auto sm:ml-0 sm:mr-5">
          <img
            class="my-auto mr-2 h-16 w-auto rounded-full text-xs font-semibold text-[#e2e4e6]"
            *ngIf="save"
            alt="{{ save.displayName ?? 'Username not Found' }}"
            src="{{ save.photoURL }}" />
          <div class="vertical-align my-auto text-center text-2xl font-bold">
            {{ save.displayName ?? 'User' }}
          </div>
        </div>

        <!-- <div class="hidden sm:flex flex-row justify-center">
          <div class="flex flex-col">
            <backrooms-collection-circle
              [type]="'BT'"
              class="mx-2"></backrooms-collection-circle>
            <label class="text-center">BT</label>
          </div>
          <div class="flex flex-col">
            <backrooms-collection-circle
              [type]="'EX'"
              class="mx-2"></backrooms-collection-circle>
            <label class="text-center">EX</label>
          </div>
          <div class="flex flex-col">
            <backrooms-collection-circle
              [type]="'ST'"
              class="mx-2"></backrooms-collection-circle>
            <label class="text-center">ST</label>
          </div>
          <div class="flex flex-col">
            <backrooms-collection-circle
              [type]="'P-'"
              class="mx-2"></backrooms-collection-circle>
            <label class="text-center">P</label>
          </div>
        </div> -->

        <!--<p-carousel
          class="sm:hidden"
          [value]="collectionCircles"
          [numVisible]="1"
          [circular]="true"
          [autoplayInterval]="10000">
          <ng-template let-circle pTemplate="item">
            <backrooms-collection-circle
              [type]="circle.label"></backrooms-collection-circle>
            <div class="text-center w-full mx-auto font-bold">
              {{ circle.label }}
            </div>
          </ng-template>
        </p-carousel>-->
      </div>

      <div class="flex flex-col sm:flex-row w-full">
        <button
          (click)="openCollection()"
          class="surface-ground hover:primary-background text-shadow border flex-grow border-[#304562] p-2 font-bold text-[#e2e4e6] mt-2">
          View Collection
        </button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    CollectionCircleComponent,
    DialogModule,
    PaginationCardListComponent,
    CarouselModule,
  ],
})
export class UserStatsComponent {
  @Input() save: ISave;

  collectionCircles = [
    { label: 'BT' },
    { label: 'EX' },
    { label: 'ST' },
    { label: 'P-' },
  ];

  private router = inject(Router);

  openCollection() {
    this.router.navigateByUrl('/collection/' + this.save.uid);
  }
}

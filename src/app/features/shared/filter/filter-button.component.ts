import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { selectMobileCollectionView } from '../../../store/digimon.selectors';
import { WebsiteActions } from './../../../store/digimon.actions';

@Component({
  selector: 'digimon-filter-button',
  template: `
    <button
      (click)="setMobileCollectionView()"
      class="min-w-auto primary-background ml-2 mt-2 h-8 w-32 rounded p-2 text-xs font-semibold text-[#e2e4e6]">
      Card-List
    </button>
  `,
  standalone: true,
})
export class FilterButtonComponent implements OnInit, OnDestroy {
  mobileCollectionView = false;

  private onDestroy$ = new Subject();

  constructor(private store: Store) {}

  ngOnInit() {
    this.store
      .select(selectMobileCollectionView)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        (mobileCollectionView) =>
          (this.mobileCollectionView = mobileCollectionView),
      );
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
  }

  setMobileCollectionView() {
    this.store.dispatch(
      WebsiteActions.setMobileCollectionView({
        mobileCollectionView: !this.mobileCollectionView,
      }),
    );
  }
}

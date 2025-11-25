import { Injectable, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UrlSyncService {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  getQueryParams(): Observable<any> {
    return this.route.queryParams;
  }

  updateUrlWithSelections(selections: {
    rooms: string | null;
    items: string | null;
    entities: string | null;
    outcomes: string | null;
  }): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: selections,
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}

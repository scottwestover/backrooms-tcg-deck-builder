import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { UrlSyncService } from './url-sync.service';

describe('UrlSyncService', () => {
  let service: UrlSyncService;
  let router: jasmine.SpyObj<Router>;
  let route: ActivatedRoute;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteStub = {
      queryParams: of({ rooms: '1' }),
    };

    TestBed.configureTestingModule({
      providers: [
        UrlSyncService,
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    });

    service = TestBed.inject(UrlSyncService);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    route = TestBed.inject(ActivatedRoute);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getQueryParams', () => {
    it('should return an observable of query params from ActivatedRoute', (done) => {
      service.getQueryParams().subscribe((params) => {
        expect(params).toEqual({ rooms: '1' });
        done();
      });
    });
  });

  describe('updateUrlWithSelections', () => {
    it('should call router.navigate with the correct parameters', () => {
      const selections = {
        rooms: '1',
        items: '2',
        entities: null,
        outcomes: null,
      };

      service.updateUrlWithSelections(selections);

      expect(router.navigate).toHaveBeenCalledWith([], {
        relativeTo: route,
        queryParams: selections,
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    });
  });
});

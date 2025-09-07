import {
  AsyncPipe,
  NgFor,
  NgIf,
  NgSwitch,
  NgSwitchCase,
} from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { AccordionModule } from 'primeng/accordion';
import { HelpCreateDeckComponent } from './help-create-deck.component';
import { HelpShareDeckComponent } from './help-share-deck.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

@Component({
  selector: 'backrooms-help-intro',
  template: `
    <h1
      class="text-shadow mt-6 pb-1 text-2xl md:text-4xl font-black text-[#e2e4e6]">
      Help
    </h1>

    <p-divider class="my-5"></p-divider>

    <ng-container *ngIf="{ isMobile: isMobile$ | async } as data">
      <p-accordion [multiple]="true" styleClass="how-to-accordion">
        <p-accordionTab *ngFor="let faq of faqs" [header]="faq.question">
          <ng-container [ngSwitch]="faq.id">
            <backrooms-help-create-deck
              *ngSwitchCase="'create-deck'"
              [isMobile]="data.isMobile"></backrooms-help-create-deck>
            <backrooms-help-share-deck
              *ngSwitchCase="'share-deck'"
              [isMobile]="data.isMobile"></backrooms-help-share-deck>
          </ng-container>
        </p-accordionTab>
      </p-accordion>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    DividerModule,
    AsyncPipe,
    AccordionModule,
    NgFor,
    NgSwitch,
    NgSwitchCase,
    HelpCreateDeckComponent,
    HelpShareDeckComponent,
    NgIf,
  ],
  styleUrls: ['./help-intro.component.scss'],
})
export class HelpIntroComponent {
  private breakpointObserver = inject(BreakpointObserver);

  isMobile$ = this.breakpointObserver
    .observe('(max-width: 768px)')
    .pipe(map((result) => result.matches));

  faqs = [
    {
      id: 'create-deck',
      question: 'How do I create a deck?',
    },
    {
      id: 'share-deck',
      question: 'How do I share a deck?',
    },
  ];
}

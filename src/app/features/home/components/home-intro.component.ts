import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'backrooms-home-intro',
  template: `
    <div class="flex flex-row justify-center">
      <img
        alt="Logo"
        class="cursor-pointer"
        src="../../../assets/images/logo.webp" />
    </div>

    <p-divider class="my-5"></p-divider>

    <h2 class="mt-1 text-center text-[#e2e4e6] text-sm sm:text-base">
      Coming soon....
    </h2>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [DividerModule, AsyncPipe],
})
export class HomeIntroComponent {
  faq = [];
  images = [
    {
      src: 'assets/images/1.webp',
    },
  ];

  position: string = 'bottom';

  positionOptions = [
    {
      label: 'Bottom',
      value: 'bottom',
    },
    {
      label: 'Top',
      value: 'top',
    },
    {
      label: 'Left',
      value: 'left',
    },
    {
      label: 'Right',
      value: 'right',
    },
  ];

  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5,
    },
    {
      breakpoint: '768px',
      numVisible: 3,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
    },
  ];
}

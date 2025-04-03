import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnInit,
} from '@angular/core';
import {
  addJBeforeWebp,
  addSampleBeforeWebp,
} from 'src/assets/cardlists/BackroomCards';

@Directive({
  selector: 'img[backroomsImgFallback]',
  standalone: true,
})
export class ImgFallbackDirective implements OnInit, OnChanges {
  @Input() backroomsImgFallback: string;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    const element: HTMLImageElement = <HTMLImageElement>this.el.nativeElement;
    element.src = this.backroomsImgFallback;
  }

  ngOnChanges(): void {
    const element: HTMLImageElement = <HTMLImageElement>this.el.nativeElement;
    element.src = this.backroomsImgFallback;
  }

  @HostListener('error')
  loadFallbackOnError(error: any) {
    const element: HTMLImageElement = <HTMLImageElement>this.el.nativeElement;
    const hasJ = this.backroomsImgFallback.includes('-J');
    const currentSrc = 'assets' + element.src.split('assets')[1];

    if (this.backroomsImgFallback && !hasJ) {
      const modifiedSrc = addJBeforeWebp(this.backroomsImgFallback);
      const sampleSrc = addSampleBeforeWebp(this.backroomsImgFallback);
      if (modifiedSrc !== currentSrc && sampleSrc !== currentSrc) {
        element.src = modifiedSrc;
        return;
      } else if (!currentSrc.includes('Sample')) {
        element.src = sampleSrc;
        return;
      }
    } else {
      const indexOfJ = this.backroomsImgFallback.lastIndexOf('-J.webp');
      const sampleJ =
        this.backroomsImgFallback.slice(0, indexOfJ) + '-Sample-J.webp';
      if (sampleJ !== currentSrc) {
        element.src = sampleJ;
        return;
      }
    }
    element.src = '../../../assets/images/digimon-card-back.webp';
  }
}

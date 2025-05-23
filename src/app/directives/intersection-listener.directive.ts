import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';

@Directive({
  selector: '[backroomsIntersectionListener]',
  standalone: true,
})
export class IntersectionListenerDirective implements AfterViewInit, OnInit {
  @Output() backroomsIntersectionListener = new EventEmitter<boolean>();
  observer!: IntersectionObserver;

  constructor(private element: ElementRef) {}

  ngOnInit(): void {
    this.intersectionObserver();
  }

  ngAfterViewInit(): void {
    this.observer.observe(this.element.nativeElement);
  }

  intersectionObserver() {
    let options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };
    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        this.backroomsIntersectionListener.emit(true);
      }
    }, options);
  }
}

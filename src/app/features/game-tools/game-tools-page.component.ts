import { NgClass, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'backrooms-game-tools-page',
  template: `
    <backrooms-page flex="col">
      <div
        class="game-tools-container w-full max-w-md mx-auto px-4 py-8 flex flex-col items-center gap-8 min-h-screen">
        <div class="header-section text-center">
          <h1
            class="text-3xl font-black text-[#FFD54F] uppercase tracking-widest text-shadow">
            Backrooms TCG
          </h1>
          <h2
            class="text-xl font-bold text-[#e2e4e6] uppercase tracking-wider text-shadow">
            Game Tools
          </h2>
        </div>

        <!-- Sanity Tracker -->
        <div class="sanity-section w-full flex flex-col items-center gap-4">
          <div class="section-divider w-full">
            <span class="divider-text">Sanity</span>
          </div>

          <div
            class="sanity-layout flex justify-center items-center gap-6 w-full">
            <!-- Subtract Buttons -->
            <div class="flex flex-col gap-6">
              <button
                (click)="updateSanity(-5)"
                class="control-btn minus-btn hover:scale-105 transition-transform">
                -5
              </button>
              <button
                (click)="updateSanity(-1)"
                class="control-btn minus-btn hover:scale-105 transition-transform">
                -1
              </button>
            </div>

            <!-- Sanity Display -->
            <div
              class="sanity-display border-4 border-black bg-black/40 flex items-center justify-center shadow-inner w-44 h-44">
              <span
                class="text-8xl font-black text-[#FFD54F] text-shadow-white-xs">
                {{ sanity() }}
              </span>
            </div>

            <!-- Add Buttons -->
            <div class="flex flex-col gap-6">
              <button
                (click)="updateSanity(1)"
                class="control-btn plus-btn hover:scale-105 transition-transform">
                +1
              </button>
              <button
                (click)="updateSanity(5)"
                class="control-btn plus-btn hover:scale-105 transition-transform">
                +5
              </button>
            </div>
          </div>
        </div>

        <!-- Painaite Gem / Coin Flip -->
        <div class="gem-section w-full flex flex-col items-center gap-4">
          <div class="section-divider w-full">
            <span class="divider-text">Painite Gem</span>
          </div>

          <div
            class="gem-display relative h-48 flex items-center justify-center">
            @if (isSpinning()) {
              <img
                src="assets/images/gem/gem_spin.gif"
                alt="Spinning Gem"
                class="h-full object-contain drop-shadow-2xl" />
            } @else {
              <img
                [src]="
                  coinResult() === 'Heads'
                    ? 'assets/images/gem/gem_heads.png'
                    : 'assets/images/gem/gem_tails.png'
                "
                alt="Painite Gem"
                class="h-full object-contain drop-shadow-2xl"
                [ngClass]="{ 'animate-pulse-slow': !isSpinning() }" />
            }
          </div>

          <div class="flex flex-col items-center w-full gap-2">
            <button
              (click)="flipCoin()"
              [disabled]="isSpinning()"
              class="backrooms-btn gold-btn w-3/4 py-3 text-xl font-black italic hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100">
              FLIP GEM
            </button>
          </div>

          <div class="result-display text-center min-h-[4rem]">
            @if (!isSpinning() && hasFlipped()) {
              <p
                class="text-gray-400 text-sm font-bold uppercase tracking-widest">
                Result:
              </p>
              <p
                class="text-3xl font-black text-[#FFD54F] uppercase text-shadow">
                {{ coinResult() }}
              </p>
            }
          </div>
        </div>

        <div class="footer-section mt-auto w-full flex justify-center pb-8">
          <button
            (click)="resetGame()"
            class="backrooms-btn black-btn w-3/4 py-2 text-lg font-bold italic hover:scale-105 transition-transform">
            RESET GAME
          </button>
        </div>
      </div>
    </backrooms-page>
  `,
  styleUrls: ['./game-tools-page.component.scss'],
  standalone: true,
  imports: [NgClass, NgIf, PageComponent, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameToolsPageComponent implements OnInit, OnDestroy {
  sanity = signal(20);
  coinResult = signal('Heads');
  isSpinning = signal(false);
  hasFlipped = signal(false);
  private wakeLock: any = null;

  ngOnInit() {
    this.loadSettings();
    this.requestWakeLock();

    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  ngOnDestroy() {
    this.releaseWakeLock();
    document.removeEventListener(
      'visibilitychange',
      this.handleVisibilityChange,
    );
  }

  updateSanity(amount: number) {
    this.sanity.update((v) => Math.min(20, Math.max(0, v + amount)));
    this.saveSettings();
  }

  flipCoin() {
    this.isSpinning.set(true);

    setTimeout(() => {
      this.performFlip();
      this.isSpinning.set(false);
    }, 800);
  }

  private performFlip() {
    const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
    this.coinResult.set(result);
    this.hasFlipped.set(true);
  }

  resetGame() {
    this.sanity.set(20);
    this.coinResult.set('Heads');
    this.hasFlipped.set(false);
    this.saveSettings();
  }

  private saveSettings() {
    localStorage.setItem('backrooms-sanity', this.sanity().toString());
  }

  private loadSettings() {
    const savedSanity = localStorage.getItem('backrooms-sanity');
    if (savedSanity !== null) {
      this.sanity.set(parseInt(savedSanity, 10));
    }
  }

  private async requestWakeLock() {
    if ('wakeLock' in navigator) {
      try {
        this.wakeLock = await (navigator as any).wakeLock.request('screen');
        console.log('Wake Lock is active');
      } catch (err: any) {
        console.log(`${err.name}, ${err.message}`);
      }
    }
  }

  private async releaseWakeLock() {
    if (this.wakeLock !== null) {
      await this.wakeLock.release();
      this.wakeLock = null;
      console.log('Wake Lock released');
    }
  }

  private handleVisibilityChange = async () => {
    if (this.wakeLock !== null && document.visibilityState === 'visible') {
      await this.requestWakeLock();
    }
  };
}

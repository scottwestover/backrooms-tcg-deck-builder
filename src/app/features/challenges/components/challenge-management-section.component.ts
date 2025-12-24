import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AuthService } from 'src/app/services/auth.service';
import { DialogStore } from 'src/app/store/dialog.store';
import { SaveStore } from 'src/app/store/save.store';

@Component({
  selector: 'backrooms-challenge-management-section',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <div class="mt-6">
      <hr class="my-4 border-gray-700" />
      @if (authService.isLoggedIn) {
        <div
          class="flex flex-col items-center justify-center gap-4 py-4 md:flex-row">
          <p-button
            label="My Challenges"
            styleClass="mt-4 rounded-lg bg-yellow-500 px-4 py-2 font-bold text-black transition-transform hover:scale-105"
            (onClick)="openMyChallengesDialog()"></p-button>
          <p-button
            label="Create Challenge"
            styleClass="mt-4 rounded-lg bg-yellow-500 px-4 py-2 font-bold text-black transition-transform hover:scale-105"
            (onClick)="openCreateChallengeDialog()"></p-button>
        </div>
      } @else {
        <div class="py-4 text-center text-gray-400">
          <p>
            Want to create your own custom challenges or manage existing ones?
          </p>
          <p>
            <a
              (click)="login()"
              class="cursor-pointer font-bold text-yellow-500 hover:underline"
              >Login</a
            >
            to get started!
          </p>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChallengeManagementSectionComponent {
  public authService = inject(AuthService);
  public saveStore = inject(SaveStore);
  private dialogStore = inject(DialogStore);

  public login(): void {
    if (!this.authService.isLoggedIn) {
      this.authService.GoogleAuth(this.saveStore);
    }
  }

  public openMyChallengesDialog(): void {
    this.dialogStore.updateMyChallengesDialog(true);
  }

  public openCreateChallengeDialog(): void {
    this.dialogStore.updateCreateChallengeDialog(true);
  }
}

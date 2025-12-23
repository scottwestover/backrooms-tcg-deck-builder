import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ChallengeDisplayCardComponent } from '../../challenges/components/challenge-display-card.component';
import { AuthService } from 'src/app/services/auth.service';
import { ChallengeService } from 'src/app/services/challenge.service';
import { DialogStore } from 'src/app/store/dialog.store';
import { IChallenge } from 'src/models';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'backrooms-my-challenges-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ChallengeDisplayCardComponent,
    ButtonModule,
    ConfirmDialogModule,
  ],
  template: `
    <div class="flex flex-col gap-4 p-4">
      @if (myChallenges.length > 0) {
        @for (challenge of myChallenges; track challenge.id) {
          <backrooms-challenge-display-card
            [challenge]="challenge"
            [showEditDelete]="true"
            (edit)="editChallenge(challenge)"
            (delete)="
              deleteChallenge(challenge)
            "></backrooms-challenge-display-card>
        }
      } @else {
        <p class="text-gray-400">You haven't created any challenges yet.</p>
      }
      <div class="mt-4 flex justify-end">
        <p-button
          label="Close"
          styleClass="p-button-outlined text-white border-white bg-transparent"
          (onClick)="closeDialog()"></p-button>
      </div>
    </div>
    <p-confirmDialog></p-confirmDialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService, ConfirmationService],
})
export class MyChallengesDialogComponent implements OnInit {
  private authService = inject(AuthService);
  private challengeService = inject(ChallengeService);
  private dialogStore = inject(DialogStore);
  private cdr = inject(ChangeDetectorRef);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  myChallenges: IChallenge[] = [];

  ngOnInit(): void {
    this.loadMyChallenges();

    this.challengeService.refreshChallenges$.subscribe((payload) => {
      this.loadMyChallenges();
    });
  }

  loadMyChallenges(): void {
    if (this.authService.userData) {
      this.challengeService.getChallenges().subscribe((allChallenges) => {
        this.myChallenges = allChallenges.filter(
          (challenge) => challenge.userId === this.authService.userData?.uid,
        );
        this.cdr.markForCheck();
      });
    } else {
      this.myChallenges = [];
      this.cdr.markForCheck();
    }
  }

  editChallenge(challenge: IChallenge): void {
    this.dialogStore.updateChallengeToEdit(challenge);
    this.dialogStore.updateCreateChallengeDialog(true);
    this.closeDialog();
  }

  deleteChallenge(challenge: IChallenge): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the challenge "${challenge.name}"? This action cannot be undone.`,
      header: 'Delete Challenge',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.challengeService.deleteChallenge(challenge.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Challenge deleted successfully!',
            });
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'There was an error deleting the challenge.',
            });
            console.error(err);
          },
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelled',
          detail: 'Challenge deletion cancelled.',
        });
      },
    });
  }

  closeDialog(): void {
    this.dialogStore.updateMyChallengesDialog(false);
  }
}

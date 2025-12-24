import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  effect,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ChallengeService } from '../../../services/challenge.service';
import { DialogStore } from '../../../store/dialog.store';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';

@Component({
  selector: 'backrooms-create-challenge-dialog',
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <label htmlFor="name">Name</label>
        <input pInputText id="name" formControlName="name" />
      </div>

      <div class="flex flex-col gap-2">
        <label htmlFor="description">Description</label>
        <textarea
          pInputTextarea
          id="description"
          formControlName="description"
          [autoResize]="true"
          rows="3"></textarea>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="flex flex-col gap-2">
          <label htmlFor="difficulty">Difficulty</label>
          <p-dropdown
            id="difficulty"
            formControlName="difficulty"
            [options]="[1, 2, 3, 4]"
            placeholder="Select a Level"
            appendTo="body"></p-dropdown>
        </div>
        <div class="flex flex-col gap-2">
          <label htmlFor="type">Type</label>
          <p-dropdown
            id="type"
            formControlName="type"
            [options]="['GENERIC', 'CAR_PARK', 'LOBBY_LEVEL']"
            placeholder="Select a Type"
            appendTo="body"></p-dropdown>
        </div>
      </div>

      <div class="mt-4 flex justify-end gap-2">
        <p-button
          label="Cancel"
          styleClass="p-button-outlined text-white border-white bg-transparent"
          (onClick)="closeDialog()"></p-button>
        <p-button
          type="submit"
          [label]="
            dialogStore.challengeToEdit()
              ? 'Update Challenge'
              : 'Save Challenge'
          "
          [disabled]="form.invalid || loading"></p-button>
      </div>
    </form>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
  ],
  providers: [MessageService],
})
export class CreateChallengeDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private challengeService = inject(ChallengeService);
  private messageService = inject(MessageService);
  public dialogStore = inject(DialogStore); // Make public to access in template

  form!: FormGroup;
  loading = false;

  constructor() {
    effect(
      () => {
        const isDialogVisible = this.dialogStore.createChallenge();
        const challenge = this.dialogStore.challengeToEdit();

        if (isDialogVisible) {
          if (challenge) {
            this.form.patchValue(challenge);
          } else {
            this.form?.reset();
          }
        } else {
          // When dialog closes, ensure form is reset and challengeToEdit is cleared
          this.form?.reset();
          this.dialogStore.updateChallengeToEdit(null);
        }
      },
      { allowSignalWrites: true },
    );
  }

  public ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      difficulty: [null, Validators.required],
      type: ['', Validators.required],
    });
  }

  public submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    const challengeData = this.form.value;
    let operation$: Observable<any>;
    let successMessage: string;
    let errorMessage: string;

    const challengeToEdit = this.dialogStore.challengeToEdit(); // Get from store

    if (challengeToEdit) {
      // Update existing challenge
      operation$ = this.challengeService.updateChallenge({
        ...challengeToEdit,
        ...challengeData,
      });
      successMessage = 'Challenge updated successfully!';
      errorMessage = 'There was an error updating the challenge.';
    } else {
      // Create new challenge
      operation$ = this.challengeService.createChallenge(challengeData);
      successMessage = 'Challenge created successfully!';
      errorMessage = 'There was an error creating the challenge.';
    }

    operation$.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: successMessage,
        });
        this.form.reset();
        this.loading = false;
        this.closeDialog();
      },
      error: (err: Error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage,
        });
        console.error(err);
        this.loading = false;
      },
    });
  }

  public closeDialog(): void {
    this.dialogStore.updateCreateChallengeDialog(false);
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
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
            placeholder="Select a Level"></p-dropdown>
        </div>
        <div class="flex flex-col gap-2">
          <label htmlFor="type">Type</label>
          <input pInputText id="type" formControlName="type" />
        </div>
      </div>

      <div class="mt-4 flex justify-end gap-2">
        <p-button
          label="Cancel"
          styleClass="p-button-secondary"
          (onClick)="closeDialog()"></p-button>
        <p-button
          type="submit"
          label="Save Challenge"
          [disabled]="form.invalid"></p-button>
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
  private dialogStore = inject(DialogStore);

  form!: FormGroup;

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

    this.challengeService.createChallenge(this.form.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Challenge created successfully!',
        });
        this.closeDialog();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'There was an error creating the challenge.',
        });
        console.error(err);
      },
    });
  }

  public closeDialog(): void {
    this.dialogStore.updateCreateChallengeDialog(false);
  }
}

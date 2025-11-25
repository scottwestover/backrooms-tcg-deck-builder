import { NgFor } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Archetype, ArchetypeData } from '../../../services/randomizer.service';

@Component({
  selector: 'backrooms-randomizer-manual-controls',
  template: `
    <div
      class="mb-4 grid grid-cols-1 gap-4 rounded-lg bg-gray-800 p-4 md:grid-cols-2 lg:grid-cols-5">
      <div class="flex flex-col lg:col-span-1">
        <label for="overall-select" class="mb-1 text-sm text-gray-400"
          >Overall Deck:</label
        >
        <select
          id="overall-select"
          name="overall-select"
          [ngModel]="overallSelection"
          (ngModelChange)="onOverallSelectionChange($event)"
          class="rounded-md bg-gray-700 p-2 text-white">
          <option [ngValue]="null">Mixed</option>
          @for (archetypeKey of archetypeKeys; track archetypeKey) {
            <option [value]="archetypeKey">
              {{ getArchetypeName(archetypeKey) }}
            </option>
          }
        </select>
      </div>

      <div class="flex flex-col">
        <label for="rooms-select" class="mb-1 text-sm text-gray-400"
          >Rooms Archetype:</label
        >
        <select
          id="rooms-select"
          name="rooms-select"
          [ngModel]="manualSelections.rooms"
          (ngModelChange)="onSelectionChange('rooms', $event)"
          class="rounded-md bg-gray-700 p-2 text-white">
          <option [ngValue]="null" disabled>Select Rooms</option>
          @for (archetypeKey of archetypeKeys; track archetypeKey) {
            <option [value]="archetypeKey">
              {{ getArchetypeName(archetypeKey) }}
            </option>
          }
        </select>
      </div>
      <div class="flex flex-col">
        <label for="items-select" class="mb-1 text-sm text-gray-400"
          >Items Archetype:</label
        >
        <select
          id="items-select"
          name="items-select"
          [ngModel]="manualSelections.items"
          (ngModelChange)="onSelectionChange('items', $event)"
          class="rounded-md bg-gray-700 p-2 text-white">
          <option [ngValue]="null" disabled>Select Items</option>
          @for (archetypeKey of archetypeKeys; track archetypeKey) {
            <option [value]="archetypeKey">
              {{ getArchetypeName(archetypeKey) }}
            </option>
          }
        </select>
      </div>
      <div class="flex flex-col">
        <label for="entities-select" class="mb-1 text-sm text-gray-400"
          >Entities Archetype:</label
        >
        <select
          id="entities-select"
          name="entities-select"
          [ngModel]="manualSelections.entities"
          (ngModelChange)="onSelectionChange('entities', $event)"
          class="rounded-md bg-gray-700 p-2 text-white">
          <option [ngValue]="null" disabled>Select Entities</option>
          @for (archetypeKey of archetypeKeys; track archetypeKey) {
            <option [value]="archetypeKey">
              {{ getArchetypeName(archetypeKey) }}
            </option>
          }
        </select>
      </div>
      <div class="flex flex-col">
        <label for="outcomes-select" class="mb-1 text-sm text-gray-400"
          >Outcomes Archetype:</label
        >
        <select
          id="outcomes-select"
          name="outcomes-select"
          [ngModel]="manualSelections.outcomes"
          (ngModelChange)="onSelectionChange('outcomes', $event)"
          class="rounded-md bg-gray-700 p-2 text-white">
          <option [ngValue]="null" disabled>Select Outcomes</option>
          @for (archetypeKey of archetypeKeys; track archetypeKey) {
            <option [value]="archetypeKey">
              {{ getArchetypeName(archetypeKey) }}
            </option>
          }
        </select>
      </div>
    </div>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgFor, FormsModule],
})
export class RandomizerManualControlsComponent {
  @Input() overallSelection: string | null = null;
  @Input() archetypes: ArchetypeData = [];
  @Input() archetypeKeys: string[] = [];
  @Input() manualSelections: {
    rooms: string | null;
    items: string | null;
    entities: string | null;
    outcomes: string | null;
  } = { rooms: null, items: null, entities: null, outcomes: null };

  @Output() manualSelectionsChange = new EventEmitter<any>();
  @Output() selectionChange = new EventEmitter<void>();
  @Output() overallSelectionChange = new EventEmitter<string | null>();

  onOverallSelectionChange(value: string | null) {
    this.overallSelectionChange.emit(value);
  }

  onSelectionChange(
    type: 'rooms' | 'items' | 'entities' | 'outcomes',
    value: string,
  ) {
    const newSelections = { ...this.manualSelections, [type]: value };
    this.manualSelectionsChange.emit(newSelections);
    this.selectionChange.emit();
  }

  getArchetypeName(archetypeId: string): string {
    const archetype = this.archetypes.find(
      (a: Archetype) => a.id.toString() === archetypeId,
    );
    return archetype ? archetype.name : 'Unknown Archetype';
  }
}

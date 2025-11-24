import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ArchetypeData } from '../../../services/randomizer.service';
import { RandomizerManualControlsComponent } from './randomizer-manual-controls.component';

// Test Host Component
@Component({
  template: `
    <backrooms-randomizer-manual-controls
      [archetypes]="archetypes"
      [archetypeKeys]="archetypeKeys"
      [(manualSelections)]="manualSelections"
      [(overallSelection)]="overallSelection"
      (overallSelectionChange)="onOverallSelectionChange($event)"
      (selectionChange)="
        onSelectionChange()
      "></backrooms-randomizer-manual-controls>
  `,
  standalone: true,
  imports: [RandomizerManualControlsComponent, FormsModule],
})
class TestHostComponent {
  archetypes: ArchetypeData = {
    alpha: { name: 'Alpha', rooms: [], items: [], entities: [], outcomes: [] },
    beta: { name: 'Beta', rooms: [], items: [], entities: [], outcomes: [] },
  };
  archetypeKeys: string[] = ['alpha', 'beta'];
  manualSelections = {
    rooms: 'alpha',
    items: 'beta',
    entities: null,
    outcomes: null,
  };
  overallSelection: string | null = 'alpha';

  selectionChangeSpy = jasmine.createSpy('selectionChange');
  overallSelectionChangeSpy = jasmine.createSpy('overallSelectionChange');

  onSelectionChange() {
    this.selectionChangeSpy();
  }

  onOverallSelectionChange(event: string | null) {
    this.overallSelection = event;
    this.overallSelectionChangeSpy(event);
  }
}

describe('RandomizerManualControlsComponent', () => {
  let hostComponent: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent], // Import the host component
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    nativeElement = fixture.nativeElement;
    fixture.detectChanges(); // Initial binding
  });

  it('should create', () => {
    const controlsComponent = fixture.debugElement.query(
      By.directive(RandomizerManualControlsComponent),
    );
    expect(controlsComponent).toBeTruthy();
  });

  it('should display five select dropdowns', () => {
    const selectElements = nativeElement.querySelectorAll('select');
    expect(selectElements.length).toBe(5);
  });

  it('should populate dropdowns with archetype names', () => {
    const firstSelect = nativeElement.querySelectorAll('select')[1];
    const options = firstSelect?.querySelectorAll('option');
    expect(options?.length).toBe(3); // null option + 2 archetypes
    expect(options?.[1].textContent?.trim()).toBe('Alpha');
    expect(options?.[2].textContent?.trim()).toBe('Beta');
  });

  it('should bind initial selections to dropdowns', () => {
    const selectElements = nativeElement.querySelectorAll('select');
    expect((selectElements[0] as HTMLSelectElement).value).toContain('alpha');
    expect((selectElements[1] as HTMLSelectElement).value).toContain('alpha');
    expect((selectElements[2] as HTMLSelectElement).value).toContain('beta');
    expect((selectElements[3] as HTMLSelectElement).selectedIndex).toBe(0);
  });

  it('should emit selectionChange and update manualSelections on change', async () => {
    const roomsSelect = nativeElement.querySelector(
      'select[name="rooms-select"]',
    ) as HTMLSelectElement;
    roomsSelect.value = 'beta';
    roomsSelect.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    await fixture.whenStable();

    // Check that the spy was called
    expect(hostComponent.selectionChangeSpy).toHaveBeenCalled();

    // Check that the model in the host component was updated
    expect(hostComponent.manualSelections.rooms).toBe('beta');
  });

  it('should emit overallSelectionChange and update overallSelection on change', async () => {
    const overallSelect = nativeElement.querySelector(
      'select[name="overall-select"]',
    ) as HTMLSelectElement;
    overallSelect.value = 'beta';
    overallSelect.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    await fixture.whenStable();

    // Check that the spy was called
    expect(hostComponent.overallSelectionChangeSpy).toHaveBeenCalledWith(
      'beta',
    );

    // Check that the model in the host component was updated
    expect(hostComponent.overallSelection).toBe('beta');
  });
});

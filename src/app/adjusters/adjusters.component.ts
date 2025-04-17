import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'app-adjusters',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModule, NgbTypeaheadModule],
  templateUrl: './adjusters.component.html',
  styleUrl: './adjusters.component.scss'
})
export class AdjustersComponent {
  public adjusterModel: any;
  public selectedAdjuster: { id: number; name: string } | null = null;
  public warning: string | null = null;
  private _prevInput: any = null;

  adjusters = [
    { id: 1, name: 'John Smith' },
    { id: 2, name: 'Jane Doe' },
    { id: 3, name: 'Mike Johnson' },
    { id: 4, name: 'Sarah Williams' },
    { id: 5, name: 'David Brown' },
    { id: 6, name: 'Lisa Davis' },
    { id: 7, name: 'Robert Wilson' },
    { id: 8, name: 'Emily Taylor' }
  ];

  // Angular lifecycle hook: called when the component is initialized
  ngOnInit() {
    // No-op: needed for lifecycle
  }

  // Angular lifecycle hook: called when input properties change
  ngOnChanges() {
    // No-op: needed for lifecycle
  }

  // Angular lifecycle hook: custom change detection for model/selection
  ngDoCheck() {
    if (this.adjusterModel !== this._prevInput) {
      if (typeof this.adjusterModel === 'string' && this.warning) {
        // Only clear warning if the user is typing and a warning was shown
        //this.warning = null;
      }
      this._prevInput = this.adjusterModel;
    }
    if (this.adjusterModel && typeof this.adjusterModel === 'string') {
      // If the model is a string and doesn't match a known adjuster, clear selectedAdjuster
      const match = this.adjusters.find(a => a.name === this.adjusterModel);
      if (!match) {
        this.selectedAdjuster = null;
      }
    }
    if (!this.adjusterModel) {
      this.selectedAdjuster = null;
      //this.warning = null; // Restoring the warning reset functionality
    }
  }

  /**
   * Typeahead search function: returns adjusters matching the search term (min 2 chars)
   */
  searchAdjuster: OperatorFunction<string, readonly { id: number; name: string }[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.adjusters.filter(adjuster => adjuster.name.toLowerCase().includes(term.toLowerCase())).slice(0, 10))
    );

  /**
   * Formatter for displaying adjuster names in the typeahead dropdown and input
   */
  adjusterFormatter = (adjuster: { id: number; name: string }) => adjuster && adjuster.name;

  /**
   * Called when an adjuster is selected from the typeahead dropdown
   */
  onAdjusterSelect(event: any) {
    this.selectedAdjuster = event.item;
    this.warning = null;
  }

  /**
   * Called when the user presses Enter in the typeahead input
   * Shows a warning if no valid adjuster is selected
   */
  onAdjusterEnter(event: Event) {
    let match = null;
    if (typeof this.adjusterModel === 'object' && this.adjusterModel && this.adjusterModel.id) {
      match = this.adjusters.find(a => a.id === this.adjusterModel.id);
    } else if (typeof this.adjusterModel === 'string') {
      match = this.adjusters.find(a => a.name === this.adjusterModel);
    }
    if (!match) {
      this.selectedAdjuster = null;
      this.warning = 'Adjuster selection is required.';
      this.adjusterModel = '';
      console.log(this.warning);
      event.preventDefault();
    } else {
      this.selectedAdjuster = match;
      this.warning = null;
    }
  }
}

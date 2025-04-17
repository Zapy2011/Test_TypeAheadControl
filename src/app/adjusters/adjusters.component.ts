import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { AdjusterProductIntent } from './adjuster-product-intent.model';

@Component({
  selector: 'app-adjusters',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModule, NgbTypeaheadModule],
  templateUrl: './adjusters.component.html',
  styleUrl: './adjusters.component.scss'
})
export class AdjustersComponent {
  public adjusterModel: any;
  public selectedAdjuster: AdjusterProductIntent | null = null;
  public warning: string | null = null;
  private _prevInput: any = null;

  adjusters: AdjusterProductIntent[] = [
    {
      mProductIntentId: 1,
      mInsuranceTypeId: 'A',
      mAdjusterCode: 'JS01',
      mAdjusterName: 'John Smith',
      mStartDate: '2024-01-01',
      mEndDate: '2024-12-31',
      mSpId: 101,
      mSpubId: 201,
      mYearsOfExperience: 10,
      mAssignmentEligibility: 'Eligible',
      mCommentId: 1,
      mComment: 'Senior adjuster',
      mTaxID: 'TX123',
      loggedInUserId: 'user1',
      mInsuranceType: 'Auto',
      copyAdjusterExclutions: false,
      previousProductIntentId: 0
    },
    {
      mProductIntentId: 2,
      mInsuranceTypeId: 'B',
      mAdjusterCode: 'JD02',
      mAdjusterName: 'Jane Doe',
      mStartDate: '2024-02-01',
      mEndDate: '2024-11-30',
      mSpId: 102,
      mSpubId: 202,
      mYearsOfExperience: 8,
      mAssignmentEligibility: 'Eligible',
      mCommentId: 2,
      mComment: 'Experienced',
      mTaxID: 'TX456',
      loggedInUserId: 'user2',
      mInsuranceType: 'Home',
      copyAdjusterExclutions: false,
      previousProductIntentId: 0
    },
    {
      mProductIntentId: 3,
      mInsuranceTypeId: 'C',
      mAdjusterCode: 'MJ03',
      mAdjusterName: 'Mike Johnson',
      mStartDate: '2024-03-01',
      mEndDate: '2024-10-31',
      mSpId: 103,
      mSpubId: 203,
      mYearsOfExperience: 5,
      mAssignmentEligibility: 'Eligible',
      mCommentId: 3,
      mComment: 'Junior adjuster',
      mTaxID: 'TX789',
      loggedInUserId: 'user3',
      mInsuranceType: 'Life',
      copyAdjusterExclutions: false,
      previousProductIntentId: 0
    },
    {
      mProductIntentId: 4,
      mInsuranceTypeId: 'D',
      mAdjusterCode: 'SW04',
      mAdjusterName: 'Sarah Williams',
      mStartDate: '2024-04-01',
      mEndDate: '2024-09-30',
      mSpId: 104,
      mSpubId: 204,
      mYearsOfExperience: 12,
      mAssignmentEligibility: 'Eligible',
      mCommentId: 4,
      mComment: 'Lead adjuster',
      mTaxID: 'TX321',
      loggedInUserId: 'user4',
      mInsuranceType: 'Health',
      copyAdjusterExclutions: false,
      previousProductIntentId: 0
    },
    {
      mProductIntentId: 5,
      mInsuranceTypeId: 'E',
      mAdjusterCode: 'DB05',
      mAdjusterName: 'David Brown',
      mStartDate: '2024-05-01',
      mEndDate: '2024-08-31',
      mSpId: 105,
      mSpubId: 205,
      mYearsOfExperience: 7,
      mAssignmentEligibility: 'Eligible',
      mCommentId: 5,
      mComment: 'Reliable',
      mTaxID: 'TX654',
      loggedInUserId: 'user5',
      mInsuranceType: 'Travel',
      copyAdjusterExclutions: false,
      previousProductIntentId: 0
    }
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
      const match = this.adjusters.find(a => a.mAdjusterName === this.adjusterModel);
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
  searchAdjuster: OperatorFunction<string, readonly AdjusterProductIntent[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.adjusters.filter(adjuster => adjuster.mAdjusterName.toLowerCase().includes(term.toLowerCase())).slice(0, 10))
    );

  /**
   * Formatter for displaying adjuster names in the typeahead dropdown and input
   */
  adjusterFormatter = (adjuster: AdjusterProductIntent) => adjuster && adjuster.mAdjusterName;

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
    if (typeof this.adjusterModel === 'object' && this.adjusterModel && this.adjusterModel.mProductIntentId) {
      match = this.adjusters.find(a => a.mProductIntentId === this.adjusterModel.mProductIntentId);
    } else if (typeof this.adjusterModel === 'string') {
      match = this.adjusters.find(a => a.mAdjusterName === this.adjusterModel);
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

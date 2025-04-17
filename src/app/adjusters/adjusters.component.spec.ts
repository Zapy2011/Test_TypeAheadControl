import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustersComponent } from './adjusters.component';

describe('AdjustersComponent', () => {
  let component: AdjustersComponent;
  let fixture: ComponentFixture<AdjustersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdjustersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdjustersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

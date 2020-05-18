import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackthxComponent } from './feedbackthx.component';

describe('FeedbackthxComponent', () => {
  let component: FeedbackthxComponent;
  let fixture: ComponentFixture<FeedbackthxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedbackthxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackthxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

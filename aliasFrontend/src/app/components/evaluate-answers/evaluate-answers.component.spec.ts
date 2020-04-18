import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluateAnswersComponent } from './evaluate-answers.component';

describe('EvaluateAnswersComponent', () => {
  let component: EvaluateAnswersComponent;
  let fixture: ComponentFixture<EvaluateAnswersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluateAnswersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluateAnswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

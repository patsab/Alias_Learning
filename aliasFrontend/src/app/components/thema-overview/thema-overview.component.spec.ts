import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemaOverviewComponent } from './thema-overview.component';

describe('ThemaOverviewComponent', () => {
  let component: ThemaOverviewComponent;
  let fixture: ComponentFixture<ThemaOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThemaOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemaOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

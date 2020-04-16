import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateThemaComponent } from './create-thema.component';

describe('CreateThemaComponent', () => {
  let component: CreateThemaComponent;
  let fixture: ComponentFixture<CreateThemaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateThemaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateThemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewByDateComponent } from './view-by-date.component';

describe('ViewByDateComponent', () => {
  let component: ViewByDateComponent;
  let fixture: ComponentFixture<ViewByDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewByDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewByDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

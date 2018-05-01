import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCompanyProfileComponent } from './view-company-profile.component';

describe('ViewCompanyProfileComponent', () => {
  let component: ViewCompanyProfileComponent;
  let fixture: ComponentFixture<ViewCompanyProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCompanyProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCompanyProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

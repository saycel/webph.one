import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallStatusComponent } from './call-status.component';

describe('CallStatusComponent', () => {
  let component: CallStatusComponent;
  let fixture: ComponentFixture<CallStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

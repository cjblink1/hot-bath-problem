import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplainDialogComponent } from './explain-dialog.component';

describe('ExplainDialogComponent', () => {
  let component: ExplainDialogComponent;
  let fixture: ComponentFixture<ExplainDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExplainDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExplainDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormInsertPage } from './form-insert.page';

describe('FormInsertPage', () => {
  let component: FormInsertPage;
  let fixture: ComponentFixture<FormInsertPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FormInsertPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

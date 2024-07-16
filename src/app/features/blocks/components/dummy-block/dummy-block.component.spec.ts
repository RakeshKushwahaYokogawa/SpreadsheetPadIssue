/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DummyBlockComponent } from './dummy-block.component';

describe('DummyBlockComponent', () => {
  let component: DummyBlockComponent;
  let fixture: ComponentFixture<DummyBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DummyBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DummyBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

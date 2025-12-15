import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cv } from './cv';

describe('Cv', () => {
  let component: Cv;
  let fixture: ComponentFixture<Cv>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cv]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cv);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

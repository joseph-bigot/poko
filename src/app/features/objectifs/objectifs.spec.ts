import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Objectifs } from './objectifs';

describe('Objectifs', () => {
  let component: Objectifs;
  let fixture: ComponentFixture<Objectifs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Objectifs],
    }).compileComponents();

    fixture = TestBed.createComponent(Objectifs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

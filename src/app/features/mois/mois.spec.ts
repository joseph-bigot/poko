import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Mois } from './mois';

describe('Mois', () => {
  let component: Mois;
  let fixture: ComponentFixture<Mois>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mois],
    }).compileComponents();

    fixture = TestBed.createComponent(Mois);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

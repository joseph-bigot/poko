import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Revenus } from './revenus';

describe('Revenus', () => {
  let component: Revenus;
  let fixture: ComponentFixture<Revenus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Revenus],
    }).compileComponents();

    fixture = TestBed.createComponent(Revenus);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

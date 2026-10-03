import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BonsPlans } from './bons-plans';

describe('BonsPlans', () => {
  let component: BonsPlans;
  let fixture: ComponentFixture<BonsPlans>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BonsPlans],
    }).compileComponents();

    fixture = TestBed.createComponent(BonsPlans);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

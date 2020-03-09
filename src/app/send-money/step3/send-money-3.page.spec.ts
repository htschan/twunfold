import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SendMoney3Page } from './send-money-3.page';

describe('SendMoney3Page', () => {
  let component: SendMoney3Page;
  let fixture: ComponentFixture<SendMoney3Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SendMoney3Page],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SendMoney3Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

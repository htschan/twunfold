import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SendMoney2Page } from './send-money-2.page';

describe('SendMoney2Page', () => {
  let component: SendMoney2Page;
  let fixture: ComponentFixture<SendMoney2Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SendMoney2Page],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SendMoney2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

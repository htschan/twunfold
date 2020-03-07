import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StatusOutboundPage } from './status-outbound.page';

describe('StatusOutboundPage', () => {
  let component: StatusOutboundPage;
  let fixture: ComponentFixture<StatusOutboundPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatusOutboundPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StatusOutboundPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

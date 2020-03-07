import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StatusInboundPage } from './status-inbound.page';

describe('StatusInboundPage', () => {
  let component: StatusInboundPage;
  let fixture: ComponentFixture<StatusInboundPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatusInboundPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StatusInboundPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

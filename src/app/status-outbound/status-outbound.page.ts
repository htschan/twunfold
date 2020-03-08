import { Component, OnInit } from '@angular/core';
import { TwclientService, DtoTransferStatus } from '../services/twclient.service';

@Component({
  selector: 'app-status-outbound',
  templateUrl: './status-outbound.page.html',
  styleUrls: ['./status-outbound.page.scss'],
})
export class StatusOutboundPage implements OnInit {
  states: DtoTransferStatus[];

  constructor(public twClient: TwclientService) { }

  ngOnInit() {
  }
  ionViewDidEnter() {
    this.getTransferStatus(null);
  }

  async getTransferStatus(event) {
    this.twClient.getTransferStatus1('processing').subscribe((data: DtoTransferStatus[]) => {
      this.states = data;
      if (event != null) { event.target.complete(); }
    });
  }

}

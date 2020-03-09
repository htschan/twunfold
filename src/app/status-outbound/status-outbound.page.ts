import { Component, OnInit } from '@angular/core';
import { TwclientService, DtoTransferStatus } from '../services/twclient.service';

@Component({
  selector: 'app-status-outbound',
  templateUrl: './status-outbound.page.html',
  styleUrls: ['./status-outbound.page.scss'],
})
export class StatusOutboundPage implements OnInit {
  states1: DtoTransferStatus[];
  states2: DtoTransferStatus[];

  constructor(public twClient: TwclientService) { }

  ngOnInit() { }

  ionViewDidEnter() {
    this.getTransferStatus(null);
  }

  async getTransferStatus(event) {
    this.twClient.getTransferStatus1('processing').subscribe((data: DtoTransferStatus[]) => {
      this.states1 = data;
      if (event != null) { event.target.complete(); }
    });
    this.twClient.getTransferStatus2('processing').subscribe((data: DtoTransferStatus[]) => {
      this.states2 = data;
      if (event != null) { event.target.complete(); }
    });
  }

}

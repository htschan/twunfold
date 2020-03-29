import { Component, OnInit } from '@angular/core';
import { TwclientService, DtoTransferStatus } from '../services/twclient.service';

@Component({
  selector: 'app-status-inbound',
  templateUrl: './status-inbound.page.html',
  styleUrls: ['./status-inbound.page.scss'],
})
export class StatusInboundPage implements OnInit {

  states1: DtoTransferStatus[];
  states2: DtoTransferStatus[];

  constructor(public twClient: TwclientService) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.getTransferStatus(null);
  }

  async getTransferStatus(event) {
    this.twClient.getTransferStatus('incoming_payment_waiting', 'tw1').subscribe((data: DtoTransferStatus[]) => {
      this.states1 = data;
      if (event != null) { event.target.complete(); }
    });
    this.twClient.getTransferStatus('incoming_payment_waiting', 'tw2').subscribe((data: DtoTransferStatus[]) => {
      this.states2 = data;
      if (event != null) { event.target.complete(); }
    });
  }

}

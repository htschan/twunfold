import { Component, OnInit } from '@angular/core';
import { TwclientService, DtoTransferStatus, DtoResponseCancelTransfer } from '../services/twclient.service';
import { AlertController } from '@ionic/angular';

// const statusfilter1 = 'incoming_payment_waiting';
const statusfilter = 'processing,funds_converted,outgoing_payment_sent';

@Component({
  selector: 'app-status-outbound',
  templateUrl: './status-outbound.page.html',
  styleUrls: ['./status-outbound.page.scss'],
})
export class StatusOutboundPage implements OnInit {
  states1: DtoTransferStatus[];
  states2: DtoTransferStatus[];
  segment = 'Hans';
  select = 'Hans';

  constructor(public twClient: TwclientService, public alertController: AlertController) { }

  ngOnInit() { }

  ionViewDidEnter() {
    this.getTransferStatus(null);
  }

  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
    this.segment = ev.detail.value;
  }

  async getTransferStatus(event) {
    this.twClient.getTransferStatus(statusfilter, 'tw1').subscribe((data: DtoTransferStatus[]) => {
      this.states1 = data;
      if (event != null) { event.target.complete(); }
    });
    this.twClient.getTransferStatus(statusfilter, 'tw2').subscribe((data: DtoTransferStatus[]) => {
      this.states2 = data;
      if (event != null) { event.target.complete(); }
    });
  }

  async cancelTransfer(source: string, transferId: number) {
    const alert = await this.alertController.create({
      header: 'Zahlung abbrechen',
      subHeader: 'สยกเลิกการโอน',
      message: 'Sicher ? / คุณแน่ใจไหม',
      buttons: ['Cancel/ยกเลิก',
        {
          text: 'Einverstanden/ตกลง', handler: data => {
            this.twClient.cancelTransfer(source, transferId).subscribe(
              d => {
                console.log(d);
                this.getTransferStatus(null);
              },
              err => console.log(err),
              () => console.log('yay'));
          }
        }]
    });
    await alert.present();
  }
}

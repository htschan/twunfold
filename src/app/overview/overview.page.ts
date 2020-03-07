import { Component, OnInit } from '@angular/core';
import { TwclientService, DtoRate } from '../services/twclient.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.page.html',
  styleUrls: ['./overview.page.scss'],
})
export class OverviewPage implements OnInit {

  balTw1C1: any;
  balTw1C2: any;
  rate: DtoRate;

  constructor(public twClient: TwclientService, private fb: FormBuilder) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.getBalance(null);
    this.getRate(null);
  }

  async getBalance(event) {
    this.twClient.getBalance('tw1').then(data => {
      this.balTw1C1 = data.balances[0];
      this.balTw1C2 = data.balances[1];
      if (event != null) { event.target.complete(); }
    });

  }

  async getRate(event) {
    this.twClient.getRate('CHF', 'THB').then(data => {
      this.rate = data;
      if (event != null) { event.target.complete(); }
    });
  }

}

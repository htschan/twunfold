import { Component, OnInit } from '@angular/core';
import { TwclientService, DtoRate, DtoBalances, DtoBalance } from '../services/twclient.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.page.html',
  styleUrls: ['./overview.page.scss'],
})
export class OverviewPage implements OnInit {

  balTw1C1: DtoBalance;
  balTw1C2: DtoBalance;
  balTw2C1: DtoBalance;
  rate: DtoRate;

  constructor(public twClient: TwclientService, private fb: FormBuilder) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.getBalance(null);
    this.getRate(null);
  }

  async getBalance(event) {
    this.twClient.getBalance('tw1').subscribe((data: DtoBalances) => {
      this.balTw1C1 = data.balances[0];
      this.balTw1C2 = data.balances[1];
      if (event != null) { event.target.complete(); }
    });
    this.twClient.getBalance('tw2').subscribe((data: DtoBalances) => {
      this.balTw2C1 = data.balances[0];
      if (event != null) { event.target.complete(); }
    });
  }

  async getRate(event) {
    this.twClient.getRate().subscribe((data: DtoRate[]) => {
      this.rate = data[0];
    });
    if (event != null) { event.target.complete(); }
  }
}

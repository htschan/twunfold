import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TwclientService, DtoRate } from '../services/twclient.service';

@Component({
  selector: 'app-rates',
  templateUrl: './rates.page.html',
  styleUrls: ['./rates.page.scss'],
})
export class RatesPage implements OnInit {
  itemForm: FormGroup;
  rates: DtoRate[] = new Array();

  constructor(public twClient: TwclientService, private fb: FormBuilder) {
    this.createForm();
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.getRate(null);
  }

  async getRate(event) {
    this.twClient.getRate('CHF', 'THB').subscribe((data: DtoRate[]) => {
      if (this.rates.length > 0 && this.rates[0].rate === data[0].rate) {
        this.rates[0].time = data[0].time;
      } else {
        if (this.rates.length > 8) {
          this.rates.pop();
        }
        this.rates.push(data[0]);
        this.rates.sort((a, b) => (a.time > b.time) ? -1 : 1);
      }
      if (this.rates.length > 1) {
        if (this.rates[0].rate > this.rates[1].rate) {
          this.rates[0].trend = 1;
        } else if (this.rates[0].rate < this.rates[1].rate) {
          this.rates[0].trend = -1;
        } else {
          this.rates[0].trend = 0;
        }
        this.rates[0].diff = Number(this.rates[0].rate) - Number(this.rates[1].rate);
      }
      if (event != null) { event.target.complete(); }
    });
  }

  createForm() {
    this.itemForm = this.fb.group({
      key: '',
      url: ''
    });
  }

}

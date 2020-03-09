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
    this.twClient.getRate().subscribe((data: DtoRate[]) => {
      this.rates = data;
    });
    if (event != null) { event.target.complete(); }
  }

  createForm() {
    this.itemForm = this.fb.group({
      key: '',
      url: ''
    });
  }

}

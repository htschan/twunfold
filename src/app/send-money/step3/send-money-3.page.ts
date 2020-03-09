import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-send-money-3',
  templateUrl: './send-money-3.page.html',
  styleUrls: ['./send-money-3.page.scss'],
})
export class SendMoney3Page implements OnInit {
  target;
  source;
  amount = 1000;
  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.target = this.activatedRoute.snapshot.paramMap.get('target');
    this.source = this.activatedRoute.snapshot.paramMap.get('source');
  }

}

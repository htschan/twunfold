import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-send-money-2',
  templateUrl: './send-money-2.page.html',
  styleUrls: ['./send-money-2.page.scss'],
})
export class SendMoney2Page implements OnInit {
  target;
  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.target = this.activatedRoute.snapshot.paramMap.get('target');
  }

}

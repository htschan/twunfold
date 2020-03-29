import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TwclientService, DtoBalances } from 'src/app/services/twclient.service';

@Component({
  selector: 'app-send-money-2',
  templateUrl: './send-money-2.page.html',
  styleUrls: ['./send-money-2.page.scss'],
})
export class SendMoney2Page implements OnInit {
  target;
  balance1;
  balance2;
  constructor(private twClient: TwclientService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.target = this.activatedRoute.snapshot.paramMap.get('target');
    this.twClient.getBalance('tw1').subscribe((data: DtoBalances) => {
      this.balance1 = data.balances[0];
    });
    this.twClient.getBalance('tw2').subscribe((data: DtoBalances) => {
      this.balance2 = data.balances[0];
    });
  }
}

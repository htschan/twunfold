import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { TargetAccountService, DtoTargetAccount } from '../services/target-account.service';
import { mergeAll, concatMap } from 'rxjs/operators';
import { from, forkJoin, of } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-send-money',
  templateUrl: './send-money.page.html',
  styleUrls: ['./send-money.page.scss'],
})
export class SendMoneyPage implements OnInit {

  targetAccounts;

  constructor(
    private tas: TargetAccountService,
    private router: Router) {
  }

  ngOnInit() {
    const storage = firebase.storage();
    this.targetAccounts = new Array<DtoTargetAccount>();
    this.tas.targetAccounts
      .pipe(
        mergeAll(),
        concatMap((m1) =>
          forkJoin(
            of(m1),
            from(storage.ref(`/users/${m1.profile.details.avatar}`).getDownloadURL()),
            from(storage.ref(`/assets/${m1.logo}`).getDownloadURL())
          )
        )
      )
      .subscribe((dto: any) => {
        const dto2 = dto[0];
        dto2.avatarUrl = dto[1];
        dto2.logoUrl = dto[2];
        this.targetAccounts.push(dto2);
      });
  }

  navigateNext(key: string) {
    this.router.navigate(['/send-money/step2', key]);
  }
}

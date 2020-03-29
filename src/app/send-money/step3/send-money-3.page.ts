import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { TwclientService, DtoRequestQuote, DtoResponseQuote, DtoBalances, DtoBalance } from 'src/app/services/twclient.service';
import { tap, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-send-money-3',
  templateUrl: './send-money-3.page.html',
  styleUrls: ['./send-money-3.page.scss'],
})
export class SendMoney3Page implements OnInit {
  itemForm: FormGroup;
  sendForm: FormGroup;
  target;
  source;
  balance: DtoBalance = new DtoBalance();
  maxAmount = 3459;
  errorObject = null;
  asyncQuote$: Observable<DtoResponseQuote> = null;
  initPage = false;

  constructor(
    private twClient: TwclientService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public alertController: AlertController) {
    this.createForm();
  }

  ngOnInit() {
    this.target = this.activatedRoute.snapshot.paramMap.get('target');
    this.source = this.activatedRoute.snapshot.paramMap.get('source');
    this.twClient.getBalance(this.source).subscribe((data: DtoBalances) => {
      this.balance = data.balances[0];
    });
  }

  createForm() {
    this.itemForm = this.fb.group({
      amount: ['1', [Validators.required, Validators.min(2),
      (control: AbstractControl) => Validators.max(this.balance.amount.value)(control)]]
    });
    this.sendForm = this.fb.group({
    });
  }

  getQuote() {
    const amount = this.itemForm.get('amount').value;
    this.initPage = true;
    this.asyncQuote$ = this.twClient.getQuote(amount, this.source).pipe(
      catchError(err => {
        this.errorObject = err;
        return throwError(err);
      })
    );
  }

  async send(profile: number, quote: number) {
    const alert = await this.alertController.create({
      header: 'Geld senden/ส่งเงิน',
      subHeader: 'Sicher ? / คุณแน่ใจไหม',
      message: 'Möchtest du Geld senden ? / ต้องการส่งเงินหรือไม่',
      buttons: ['Cancel/ยกเลิก',
        {
          text: 'Ja, senden/ตกลง', handler: data => {
            this.twClient.sendMoney(this.source, this.target, profile, quote).subscribe(d => {
              console.log(d);
            });
          }
        }]
    });
    await alert.present();
  }
}

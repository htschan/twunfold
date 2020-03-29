import { Injectable } from '@angular/core';
import { Observable, of, from, throwError } from 'rxjs';
import { map, switchMap, tap, catchError } from 'rxjs/operators';
import * as firebase from 'firebase';
import { Cacheable } from 'ngx-cacheable';
import { Storage } from '@ionic/storage';
import { HttpErrorResponse } from '@angular/common/http';
import * as uuid from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class TwclientService {
  private rates: DtoRate[] = new Array();

  constructor(private storage: Storage) {
  }

  @Cacheable({ maxAge: 10 * 1000 })
  getProfile(source: string): Observable<DtoProfile> {
    const f = firebase.functions().httpsCallable('getProfile');
    return from(f({ account: source })).pipe(map(result => result.data));
  }

  getRate(): Observable<DtoRate[]> {
    return this.getRateX('CHF', 'THB').pipe(map(data => {
      if (this.rates.length === 0) {
        this.storage.get('rates').then((val: string) => {
          const jsonArr = JSON.parse(val) as DtoRate[];
          if (jsonArr && jsonArr.length > 0) {
            this.rates = jsonArr;
          }
        });
      }
      if (this.rates.length > 0 && this.rates[0].rate === data.rate) {
        this.rates[0].time = data.time;
      } else {
        if (this.rates.length > 8) {
          this.rates.pop();
        }
        data.trend = 0;
        this.rates.push(data);
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
      this.storage.set('rates', JSON.stringify(this.rates));
      return this.rates;
    }));
  }

  @Cacheable({ maxAge: 7 * 1000 })
  getRateX(sourceCurrency: string, targetCurrency: string): Observable<DtoRate> {
    const f = firebase.functions().httpsCallable('getRate');
    return from(f({ sourceCurrency, targetCurrency })).pipe(map(result => result.data));
  }

  @Cacheable({ maxAge: 10 * 1000 })
  getBalance(source): Observable<DtoBalances> {
    const f = firebase.functions().httpsCallable('getBalance');
    return this.getProfile(source).pipe(
      switchMap(profile => from(f({ account: source, profileId: profile.id }))),
      map(result => result.data),
      catchError(this.handleError)
    );
  }

  @Cacheable({ maxAge: 10 * 1000 })
  getTransferStatus(status: string, source: string): Observable<DtoTransferStatus[]> {
    const f = firebase.functions().httpsCallable('getTransferStatus');
    return this.getProfile(source).pipe(
      switchMap(profile => from(f({ account: source, requested_status: status, profileId: profile.id }))),
      map(result => result.data),
      catchError(this.handleError)
    );
  }

  @Cacheable({ maxAge: 10 * 1000 })
  getQuote(val: number, source: string): Observable<DtoResponseQuote> {
    const f = firebase.functions().httpsCallable('getQuote');
    return this.getProfile(source).pipe(
      switchMap(profile => from(f({ account: source, amount: val, profileId: profile.id }))),
      map(result => result.data),
      catchError(this.handleError)
    );
  }

  sendMoney(source: string, target: string, profile: number, quote: number): Observable<string> {
    const f = firebase.functions().httpsCallable('createTransfer');
    const fund = firebase.functions().httpsCallable('postFund');
    const transactionId = uuid.v1();
    return from(f({
      account: source,
      transactionId,
      profileId: profile,
      recpAcctShortcut: target,
      referenceText: 'to my friend',
      quoteId: quote
    })).pipe(
      //      switchMap(result => from(fund({ account: source, profileId: profile, transferId: result.id }))),
      map(result => {
        console.log(result);
        return result.data;
      }));

  }

  addMessage(message) {
    const addMessage = firebase.functions().httpsCallable('addMessage');
    addMessage({ text: message }).then(result => {
      console.log(result);
    });
  }

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }
}

export class DtoProfile {
  id: number;
  name: string;
  email: string;
  active: boolean;
  details: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    occupation: string;
    address: {
      city: string;
      countryCode: string;
      postCode: string;
      state: string;
      firstLine: string
    },
    dateOfBirth: string;
    avatar: string;
    primaryAddress: string;
  };
}

export class DtoRate {
  rate: number;
  source: string;
  target: string;
  time: string;
  trend: number;
  diff: number;
}

export class DtoBankDetail {
  id: number;
  currency: string;
  bankCode: string;
  accountNumber: string;
  swift: string;
  iban: string;
  bankName: string;
  accountHolderName: string;
  bankAddress: {
    addressFirstLine: string;
    postCode: string;
    city: string;
    countr: string;
    stateCode: string;
  };
}

export class DtoBalance {
  constructor() {
    this.amount = { value: 2.0, currency: 'CHF' };
  }
  balanceType: string;
  currency: string;
  amount: {
    value: number;
    currency: string;
  };
  reservedAmount: {
    value: number;
    currency: string;
  };
  bankDetails: DtoBankDetail;
}

export class DtoBalances {
  id: number;
  profileId: number;
  recipientId: number;
  creationTime: Date;
  modificationTime: Date;
  active: boolean;
  eligible: boolean;
  balances: DtoBalance[];
}

export class DtoTransferStatus {
  id: number;
  user: number;
  targetAccount: number;
  sourceAccount: number;
  quote: number;
  status: string;
  reference: string;
  rate: number;
  created: Date;
  business: number;
  transferRequest: number;
  details: {
    reference: string;
  };
  hasActiveIssues: boolean;
  sourceValue: number;
  sourceCurrency: string;
  targetValue: number;
  targetCurrency: string;
  customerTransactionId: string;
}

export class DtoRequestQuote {
  profile: number;
  source: string; // source currency
  target: string; // target currency
  rateType: string; // always 'FIXED'
  targetAmount: number; // either target amount or source amount is necessary, never both
  sourceAmount: number;
  type: string; // BALANCE_PAYOUT funded from borderless accounts
}

export class DtoResponseQuote {
  id: number; // the quote id
  source: string; // source currency
  target: string; // taret currency
  sourceAmount: number; // source amount
  targetAmount: number; // target amount
  type: string;
  rate: number;
  createdTime: Date;
  createdByUserId: number;
  profile: number;
  rateType: string;
  deliveryEstimate: Date;
  fee: number;
  allowedProfileTypes: string[];
  guaranteedTargetAmount: boolean;
  ofSourceAmount: boolean;
}

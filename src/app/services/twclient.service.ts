import { Injectable } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import * as firebase from 'firebase';
import { Cacheable } from 'ngx-cacheable';
import { Storage } from '@ionic/storage';


@Injectable({
  providedIn: 'root'
})
export class TwclientService {
  private rates: DtoRate[] = new Array();

  constructor(private storage: Storage) {
  }

  @Cacheable({ maxAge: 10 * 1000 })
  getProfile1(): Observable<DtoProfile> {
    const f = firebase.functions().httpsCallable('getProfile');
    return from(f({ account: 'tw1' })).pipe(map(result => result.data));
  }

  @Cacheable({ maxAge: 10 * 1000 })
  getProfile2(): Observable<DtoProfile> {
    const f = firebase.functions().httpsCallable('getProfile');
    return from(f({ account: 'tw2' })).pipe(map(result => result.data));
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
  getBalance1(): Observable<DtoBalances> {
    const f = firebase.functions().httpsCallable('getBalance');
    return this.getProfile1().pipe(
      switchMap(profile => from(f({ account: 'tw1', profileId: profile.id }))),
      map(result => result.data)
    );
  }

  @Cacheable({ maxAge: 10 * 1000 })
  getBalance2(): Observable<DtoBalances> {
    const f = firebase.functions().httpsCallable('getBalance');
    return this.getProfile2().pipe(
      switchMap(profile => from(f({ account: 'tw2', profileId: profile.id }))),
      map(result => result.data)
    );
  }

  @Cacheable({ maxAge: 10 * 1000 })
  getTransferStatus1(status: string): Observable<DtoTransferStatus[]> {
    const f = firebase.functions().httpsCallable('getTransferStatus');
    return this.getProfile1().pipe(
      switchMap(profile => from(f({ account: 'tw1', requested_status: status, profileId: profile.id }))),
      map(result => result.data)
    );
  }

  @Cacheable({ maxAge: 10 * 1000 })
  getTransferStatus2(status: string): Observable<DtoTransferStatus[]> {
    const f = firebase.functions().httpsCallable('getTransferStatus');
    return this.getProfile2().pipe(
      switchMap(profile => from(f({ account: 'tw2', requested_status: status, profileId: profile.id }))),
      map(result => result.data)
    );
  }

  addMessage(message) {
    const addMessage = firebase.functions().httpsCallable('addMessage');
    addMessage({ text: message }).then(result => {
      console.log(result);
    });
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    //  this.messageService.add(`youtube.service: ${message}`);
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

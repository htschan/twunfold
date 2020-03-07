import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import * as firebase from 'firebase';


@Injectable({
  providedIn: 'root'
})
export class TwclientService {

  constructor() { }

  getRate(sourceCurrency, targetCurrency): any {
    const f = firebase.functions().httpsCallable('getRate');
    return f({ sourceCurrency, targetCurrency })
      .then(result => {
        return result.data;
      });
  }

  getBalance(acct: string): any {
    const f = firebase.functions().httpsCallable('getBalance');
    return f({account: acct})
      .then(result => {
        return result.data;
      });
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

export class DtoRate {
  rate: number;
  source: string;
  target: string;
  time: string;
  trend: number;
  diff: number;
}

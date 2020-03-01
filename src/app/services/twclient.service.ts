import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { IAppConfig } from '../shared/IAppConfig';
import { APP_CONFIG_DI } from 'src/twappconfig';
import { UrlService } from './url.service';


@Injectable({
  providedIn: 'root'
})
export class TwclientService {
  httpOptions = {};

  constructor(
    @Inject(APP_CONFIG_DI) private appConfig: IAppConfig,
    private urlService: UrlService,
    private http: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: appConfig.Tk1
      })
    };
  }

  getRate(): Observable<DtoRate[]> {
    const url = this.urlService.getRateUrl();
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: url[1]
      })
    };
    return this.http.get<any>(url[0], this.httpOptions).pipe(catchError(this.handleError('getRate', [])));
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
  rate: string;
  source: string;
  target: string;
  time: string;
}
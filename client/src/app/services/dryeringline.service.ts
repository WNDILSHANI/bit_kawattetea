import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Dryeringline} from '../entities/dryeringline';

@Injectable({
  providedIn: 'root'
})
export class DryeringlineService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Dryeringline[]>{
    const dryeringlines = await this.http.get<Dryeringline[]>(ApiManager.getURL('dryeringlines')).toPromise();
    return dryeringlines.map((dryeringline) => Object.assign(new Dryeringline(), dryeringline));
  }

}

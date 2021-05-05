import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Witherline} from '../entities/witherline';

@Injectable({
  providedIn: 'root'
})
export class WitherlineService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Witherline[]>{
    const witherlines = await this.http.get<Witherline[]>(ApiManager.getURL('witherlines')).toPromise();
    return witherlines.map((witherline) => Object.assign(new Witherline(), witherline));
  }

}

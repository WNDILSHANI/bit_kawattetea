import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Teatreetype} from '../entities/teatreetype';

@Injectable({
  providedIn: 'root'
})
export class TeatreetypeService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Teatreetype[]>{
    const teatreetypes = await this.http.get<Teatreetype[]>(ApiManager.getURL('teatreetypes')).toPromise();
    return teatreetypes.map((teatreetype) => Object.assign(new Teatreetype(), teatreetype));
  }

}

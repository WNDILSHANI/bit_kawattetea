import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Tealeaftype} from '../entities/tealeaftype';

@Injectable({
  providedIn: 'root'
})
export class TealeaftypeService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Tealeaftype[]>{
    const tealeaftypes = await this.http.get<Tealeaftype[]>(ApiManager.getURL('tealeaftypes')).toPromise();
    return tealeaftypes.map((tealeaftype) => Object.assign(new Tealeaftype(), tealeaftype));
  }

}

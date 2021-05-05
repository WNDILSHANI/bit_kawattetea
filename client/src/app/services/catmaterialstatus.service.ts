import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Catmaterialstatus} from '../entities/catmaterialstatus';

@Injectable({
  providedIn: 'root'
})
export class CatmaterialstatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Catmaterialstatus[]>{
    const catmaterialstatuses = await this.http.get<Catmaterialstatus[]>(ApiManager.getURL('catmaterialstatuses')).toPromise();
    return catmaterialstatuses.map((catmaterialstatus) => Object.assign(new Catmaterialstatus(), catmaterialstatus));
  }

}

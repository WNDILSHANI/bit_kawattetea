import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Collectionstatus} from '../entities/collectionstatus';

@Injectable({
  providedIn: 'root'
})
export class CollectionstatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Collectionstatus[]>{
    const collectionstatuses = await this.http.get<Collectionstatus[]>(ApiManager.getURL('collectionstatuses')).toPromise();
    return collectionstatuses.map((collectionstatus) => Object.assign(new Collectionstatus(), collectionstatus));
  }

}

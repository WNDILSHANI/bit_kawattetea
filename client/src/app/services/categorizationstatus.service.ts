import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Categorizationstatus} from '../entities/categorizationstatus';

@Injectable({
  providedIn: 'root'
})
export class CategorizationstatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Categorizationstatus[]>{
    const categorizationstatuses = await this.http.get<Categorizationstatus[]>(ApiManager.getURL('categorizationstatuses')).toPromise();
    return categorizationstatuses.map((categorizationstatus) => Object.assign(new Categorizationstatus(), categorizationstatus));
  }

}

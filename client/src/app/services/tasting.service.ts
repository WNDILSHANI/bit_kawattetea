import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Tasting, TastingDataPage} from '../entities/tasting';

@Injectable({
  providedIn: 'root'
})
export class TastingService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<TastingDataPage>{
    const url = pageRequest.getPageRequestURL('tastings');
    const tastingDataPage = await this.http.get<TastingDataPage>(ApiManager.getURL(url)).toPromise();
    tastingDataPage.content = tastingDataPage.content.map((tasting) => Object.assign(new Tasting(), tasting));
    return tastingDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<TastingDataPage>{
    const url = pageRequest.getPageRequestURL('tastings/basic');
    const tastingDataPage = await this.http.get<TastingDataPage>(ApiManager.getURL(url)).toPromise();
    tastingDataPage.content = tastingDataPage.content.map((tasting) => Object.assign(new Tasting(), tasting));
    return tastingDataPage;
  }

  async get(id: number): Promise<Tasting>{
    const tasting: Tasting = await this.http.get<Tasting>(ApiManager.getURL(`tastings/${id}`)).toPromise();
    return Object.assign(new Tasting(), tasting);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`tastings/${id}`)).toPromise();
  }

  async add(tasting: Tasting): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`tastings`), tasting).toPromise();
  }

  async update(id: number, tasting: Tasting): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`tastings/${id}`), tasting).toPromise();
  }

}

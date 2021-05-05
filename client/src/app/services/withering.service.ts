import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Withering, WitheringDataPage} from '../entities/withering';

@Injectable({
  providedIn: 'root'
})
export class WitheringService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<WitheringDataPage>{
    const url = pageRequest.getPageRequestURL('witherings');
    const witheringDataPage = await this.http.get<WitheringDataPage>(ApiManager.getURL(url)).toPromise();
    witheringDataPage.content = witheringDataPage.content.map((withering) => Object.assign(new Withering(), withering));
    return witheringDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<WitheringDataPage>{
    const url = pageRequest.getPageRequestURL('witherings/basic');
    const witheringDataPage = await this.http.get<WitheringDataPage>(ApiManager.getURL(url)).toPromise();
    witheringDataPage.content = witheringDataPage.content.map((withering) => Object.assign(new Withering(), withering));
    return witheringDataPage;
  }

  async get(id: number): Promise<Withering>{
    const withering: Withering = await this.http.get<Withering>(ApiManager.getURL(`witherings/${id}`)).toPromise();
    return Object.assign(new Withering(), withering);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`witherings/${id}`)).toPromise();
  }

  async add(withering: Withering): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`witherings`), withering).toPromise();
  }

  async update(id: number, withering: Withering): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`witherings/${id}`), withering).toPromise();
  }

}

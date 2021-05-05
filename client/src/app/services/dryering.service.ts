import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Dryering, DryeringDataPage} from '../entities/dryering';

@Injectable({
  providedIn: 'root'
})
export class DryeringService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<DryeringDataPage>{
    const url = pageRequest.getPageRequestURL('dryerings');
    const dryeringDataPage = await this.http.get<DryeringDataPage>(ApiManager.getURL(url)).toPromise();
    dryeringDataPage.content = dryeringDataPage.content.map((dryering) => Object.assign(new Dryering(), dryering));
    return dryeringDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<DryeringDataPage>{
    const url = pageRequest.getPageRequestURL('dryerings/basic');
    const dryeringDataPage = await this.http.get<DryeringDataPage>(ApiManager.getURL(url)).toPromise();
    dryeringDataPage.content = dryeringDataPage.content.map((dryering) => Object.assign(new Dryering(), dryering));
    return dryeringDataPage;
  }

  async get(id: number): Promise<Dryering>{
    const dryering: Dryering = await this.http.get<Dryering>(ApiManager.getURL(`dryerings/${id}`)).toPromise();
    return Object.assign(new Dryering(), dryering);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`dryerings/${id}`)).toPromise();
  }

  async add(dryering: Dryering): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`dryerings`), dryering).toPromise();
  }

  async update(id: number, dryering: Dryering): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`dryerings/${id}`), dryering).toPromise();
  }

}

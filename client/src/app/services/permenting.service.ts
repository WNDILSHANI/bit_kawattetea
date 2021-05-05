import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Permenting, PermentingDataPage} from '../entities/permenting';

@Injectable({
  providedIn: 'root'
})
export class PermentingService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<PermentingDataPage>{
    const url = pageRequest.getPageRequestURL('permentings');
    const permentingDataPage = await this.http.get<PermentingDataPage>(ApiManager.getURL(url)).toPromise();
    permentingDataPage.content = permentingDataPage.content.map((permenting) => Object.assign(new Permenting(), permenting));
    return permentingDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<PermentingDataPage>{
    const url = pageRequest.getPageRequestURL('permentings/basic');
    const permentingDataPage = await this.http.get<PermentingDataPage>(ApiManager.getURL(url)).toPromise();
    permentingDataPage.content = permentingDataPage.content.map((permenting) => Object.assign(new Permenting(), permenting));
    return permentingDataPage;
  }

  async get(id: number): Promise<Permenting>{
    const permenting: Permenting = await this.http.get<Permenting>(ApiManager.getURL(`permentings/${id}`)).toPromise();
    return Object.assign(new Permenting(), permenting);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`permentings/${id}`)).toPromise();
  }

  async add(permenting: Permenting): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`permentings`), permenting).toPromise();
  }

  async update(id: number, permenting: Permenting): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`permentings/${id}`), permenting).toPromise();
  }

}

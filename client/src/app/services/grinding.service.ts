import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Grinding, GrindingDataPage} from '../entities/grinding';

@Injectable({
  providedIn: 'root'
})
export class GrindingService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<GrindingDataPage>{
    const url = pageRequest.getPageRequestURL('grindings');
    const grindingDataPage = await this.http.get<GrindingDataPage>(ApiManager.getURL(url)).toPromise();
    grindingDataPage.content = grindingDataPage.content.map((grinding) => Object.assign(new Grinding(), grinding));
    return grindingDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<GrindingDataPage>{
    const url = pageRequest.getPageRequestURL('grindings/basic');
    const grindingDataPage = await this.http.get<GrindingDataPage>(ApiManager.getURL(url)).toPromise();
    grindingDataPage.content = grindingDataPage.content.map((grinding) => Object.assign(new Grinding(), grinding));
    return grindingDataPage;
  }

  async get(id: number): Promise<Grinding>{
    const grinding: Grinding = await this.http.get<Grinding>(ApiManager.getURL(`grindings/${id}`)).toPromise();
    return Object.assign(new Grinding(), grinding);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`grindings/${id}`)).toPromise();
  }

  async add(grinding: Grinding): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`grindings`), grinding).toPromise();
  }

  async update(id: number, grinding: Grinding): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`grindings/${id}`), grinding).toPromise();
  }

}

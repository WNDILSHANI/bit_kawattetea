import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Gradebatch, GradebatchDataPage} from '../entities/gradebatch';

@Injectable({
  providedIn: 'root'
})
export class GradebatchService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<GradebatchDataPage>{
    const url = pageRequest.getPageRequestURL('gradebatches');
    const gradebatchDataPage = await this.http.get<GradebatchDataPage>(ApiManager.getURL(url)).toPromise();
    gradebatchDataPage.content = gradebatchDataPage.content.map((gradebatch) => Object.assign(new Gradebatch(), gradebatch));
    return gradebatchDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<GradebatchDataPage>{
    const url = pageRequest.getPageRequestURL('gradebatches/basic');
    const gradebatchDataPage = await this.http.get<GradebatchDataPage>(ApiManager.getURL(url)).toPromise();
    gradebatchDataPage.content = gradebatchDataPage.content.map((gradebatch) => Object.assign(new Gradebatch(), gradebatch));
    return gradebatchDataPage;
  }

  async get(id: number): Promise<Gradebatch>{
    const gradebatch: Gradebatch = await this.http.get<Gradebatch>(ApiManager.getURL(`gradebatches/${id}`)).toPromise();
    return Object.assign(new Gradebatch(), gradebatch);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`gradebatches/${id}`)).toPromise();
  }

  async add(gradebatch: Gradebatch): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`gradebatches`), gradebatch).toPromise();
  }

  async update(id: number, gradebatch: Gradebatch): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`gradebatches/${id}`), gradebatch).toPromise();
  }

}

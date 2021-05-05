import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Categorization, CategorizationDataPage} from '../entities/categorization';

@Injectable({
  providedIn: 'root'
})
export class CategorizationService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<CategorizationDataPage>{
    const url = pageRequest.getPageRequestURL('categorizations');
    const categorizationDataPage = await this.http.get<CategorizationDataPage>(ApiManager.getURL(url)).toPromise();
    categorizationDataPage.content = categorizationDataPage.content.map((categorization) => Object.assign(new Categorization(), categorization));
    return categorizationDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<CategorizationDataPage>{
    const url = pageRequest.getPageRequestURL('categorizations/basic');
    const categorizationDataPage = await this.http.get<CategorizationDataPage>(ApiManager.getURL(url)).toPromise();
    categorizationDataPage.content = categorizationDataPage.content.map((categorization) => Object.assign(new Categorization(), categorization));
    return categorizationDataPage;
  }

  async get(id: number): Promise<Categorization>{
    const categorization: Categorization = await this.http.get<Categorization>(ApiManager.getURL(`categorizations/${id}`)).toPromise();
    return Object.assign(new Categorization(), categorization);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`categorizations/${id}`)).toPromise();
  }

  async add(categorization: Categorization): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`categorizations`), categorization).toPromise();
  }

  async update(id: number, categorization: Categorization): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`categorizations/${id}`), categorization).toPromise();
  }

}

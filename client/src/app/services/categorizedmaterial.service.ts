import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Categorizedmaterial, CategorizedmaterialDataPage} from '../entities/categorizedmaterial';

@Injectable({
  providedIn: 'root'
})
export class CategorizedmaterialService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<CategorizedmaterialDataPage>{
    const url = pageRequest.getPageRequestURL('categorizedmaterials');
    const categorizedmaterialDataPage = await this.http.get<CategorizedmaterialDataPage>(ApiManager.getURL(url)).toPromise();
    categorizedmaterialDataPage.content = categorizedmaterialDataPage.content.map((categorizedmaterial) => Object.assign(new Categorizedmaterial(), categorizedmaterial));
    return categorizedmaterialDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<CategorizedmaterialDataPage>{
    const url = pageRequest.getPageRequestURL('categorizedmaterials/basic');
    const categorizedmaterialDataPage = await this.http.get<CategorizedmaterialDataPage>(ApiManager.getURL(url)).toPromise();
    categorizedmaterialDataPage.content = categorizedmaterialDataPage.content.map((categorizedmaterial) => Object.assign(new Categorizedmaterial(), categorizedmaterial));
    return categorizedmaterialDataPage;
  }

  async get(id: number): Promise<Categorizedmaterial>{
    const categorizedmaterial: Categorizedmaterial = await this.http.get<Categorizedmaterial>(ApiManager.getURL(`categorizedmaterials/${id}`)).toPromise();
    return Object.assign(new Categorizedmaterial(), categorizedmaterial);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`categorizedmaterials/${id}`)).toPromise();
  }

  async add(categorizedmaterial: Categorizedmaterial): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`categorizedmaterials`), categorizedmaterial).toPromise();
  }

  async update(id: number, categorizedmaterial: Categorizedmaterial): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`categorizedmaterials/${id}`), categorizedmaterial).toPromise();
  }

}

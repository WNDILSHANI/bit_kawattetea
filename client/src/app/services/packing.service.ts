import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Packing, PackingDataPage} from '../entities/packing';

@Injectable({
  providedIn: 'root'
})
export class PackingService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<PackingDataPage>{
    const url = pageRequest.getPageRequestURL('packings');
    const packingDataPage = await this.http.get<PackingDataPage>(ApiManager.getURL(url)).toPromise();
    packingDataPage.content = packingDataPage.content.map((packing) => Object.assign(new Packing(), packing));
    return packingDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<PackingDataPage>{
    const url = pageRequest.getPageRequestURL('packings/basic');
    const packingDataPage = await this.http.get<PackingDataPage>(ApiManager.getURL(url)).toPromise();
    packingDataPage.content = packingDataPage.content.map((packing) => Object.assign(new Packing(), packing));
    return packingDataPage;
  }

  async get(id: number): Promise<Packing>{
    const packing: Packing = await this.http.get<Packing>(ApiManager.getURL(`packings/${id}`)).toPromise();
    return Object.assign(new Packing(), packing);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`packings/${id}`)).toPromise();
  }

  async add(packing: Packing): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`packings`), packing).toPromise();
  }

  async update(id: number, packing: Packing): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`packings/${id}`), packing).toPromise();
  }

}

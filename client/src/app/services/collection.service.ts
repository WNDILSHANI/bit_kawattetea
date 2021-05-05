import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Collection, CollectionDataPage} from '../entities/collection';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<CollectionDataPage>{
    const url = pageRequest.getPageRequestURL('collections');
    const collectionDataPage = await this.http.get<CollectionDataPage>(ApiManager.getURL(url)).toPromise();
    collectionDataPage.content = collectionDataPage.content.map((collection) => Object.assign(new Collection(), collection));
    return collectionDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<CollectionDataPage>{
    const url = pageRequest.getPageRequestURL('collections/basic');
    const collectionDataPage = await this.http.get<CollectionDataPage>(ApiManager.getURL(url)).toPromise();
    collectionDataPage.content = collectionDataPage.content.map((collection) => Object.assign(new Collection(), collection));
    return collectionDataPage;
  }

  async get(id: number): Promise<Collection>{
    const collection: Collection = await this.http.get<Collection>(ApiManager.getURL(`collections/${id}`)).toPromise();
    return Object.assign(new Collection(), collection);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`collections/${id}`)).toPromise();
  }

  async add(collection: Collection): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`collections`), collection).toPromise();
  }

  async update(id: number, collection: Collection): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`collections/${id}`), collection).toPromise();
  }

}

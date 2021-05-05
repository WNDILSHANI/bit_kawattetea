import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Inventory, InventoryDataPage} from '../entities/inventory';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<InventoryDataPage>{
    const url = pageRequest.getPageRequestURL('inventories');
    const inventoryDataPage = await this.http.get<InventoryDataPage>(ApiManager.getURL(url)).toPromise();
    inventoryDataPage.content = inventoryDataPage.content.map((inventory) => Object.assign(new Inventory(), inventory));
    return inventoryDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<InventoryDataPage>{
    const url = pageRequest.getPageRequestURL('inventories/basic');
    const inventoryDataPage = await this.http.get<InventoryDataPage>(ApiManager.getURL(url)).toPromise();
    inventoryDataPage.content = inventoryDataPage.content.map((inventory) => Object.assign(new Inventory(), inventory));
    return inventoryDataPage;
  }

  async get(id: number): Promise<Inventory>{
    const inventory: Inventory = await this.http.get<Inventory>(ApiManager.getURL(`inventories/${id}`)).toPromise();
    return Object.assign(new Inventory(), inventory);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`inventories/${id}`)).toPromise();
  }

  async add(inventory: Inventory): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`inventories`), inventory).toPromise();
  }

  async update(id: number, inventory: Inventory): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`inventories/${id}`), inventory).toPromise();
  }

}

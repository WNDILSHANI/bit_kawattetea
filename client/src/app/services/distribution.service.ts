import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Distribution, DistributionDataPage} from '../entities/distribution';

@Injectable({
  providedIn: 'root'
})
export class DistributionService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<DistributionDataPage>{
    const url = pageRequest.getPageRequestURL('distributions');
    const distributionDataPage = await this.http.get<DistributionDataPage>(ApiManager.getURL(url)).toPromise();
    distributionDataPage.content = distributionDataPage.content.map((distribution) => Object.assign(new Distribution(), distribution));
    return distributionDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<DistributionDataPage>{
    const url = pageRequest.getPageRequestURL('distributions/basic');
    const distributionDataPage = await this.http.get<DistributionDataPage>(ApiManager.getURL(url)).toPromise();
    distributionDataPage.content = distributionDataPage.content.map((distribution) => Object.assign(new Distribution(), distribution));
    return distributionDataPage;
  }

  async get(id: number): Promise<Distribution>{
    const distribution: Distribution = await this.http.get<Distribution>(ApiManager.getURL(`distributions/${id}`)).toPromise();
    return Object.assign(new Distribution(), distribution);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`distributions/${id}`)).toPromise();
  }

  async add(distribution: Distribution): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`distributions`), distribution).toPromise();
  }

  async update(id: number, distribution: Distribution): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`distributions/${id}`), distribution).toPromise();
  }

}

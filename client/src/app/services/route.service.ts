import {Route} from '../entities/route';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Route[]>{
    const routes = await this.http.get<Route[]>(ApiManager.getURL('routes')).toPromise();
    return routes.map((route) => Object.assign(new Route(), route));
  }

}

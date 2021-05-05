import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Grindingnetsize} from '../entities/grindingnetsize';

@Injectable({
  providedIn: 'root'
})
export class GrindingnetsizeService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Grindingnetsize[]>{
    const grindingnetsizes = await this.http.get<Grindingnetsize[]>(ApiManager.getURL('grindingnetsizes')).toPromise();
    return grindingnetsizes.map((grindingnetsize) => Object.assign(new Grindingnetsize(), grindingnetsize));
  }

}

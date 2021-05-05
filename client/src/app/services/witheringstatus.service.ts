import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Witheringstatus} from '../entities/witheringstatus';

@Injectable({
  providedIn: 'root'
})
export class WitheringstatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Witheringstatus[]>{
    const witheringstatuses = await this.http.get<Witheringstatus[]>(ApiManager.getURL('witheringstatuses')).toPromise();
    return witheringstatuses.map((witheringstatus) => Object.assign(new Witheringstatus(), witheringstatus));
  }

}

import {Grade} from '../entities/grade';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';

@Injectable({
  providedIn: 'root'
})
export class GradeService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Grade[]>{
    const grades = await this.http.get<Grade[]>(ApiManager.getURL('grades')).toPromise();
    return grades.map((grade) => Object.assign(new Grade(), grade));
  }

}

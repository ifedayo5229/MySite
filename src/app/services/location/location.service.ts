import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponseObject } from 'src/app/models/api-response-object';
import { environment } from 'src/app/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private httpClient: HttpClient) { }

  getAllLocations(): Observable<ApiResponseObject<Location[]>> {
    debugger
    return this.httpClient.get<ApiResponseObject<Location[]>>(`${environment.apiUrl}/Location/GetAll`);
  }
  
  
}

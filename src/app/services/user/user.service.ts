import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/app/environments/environment.prod';
import { ApiResponseObject } from 'src/app/models/api-response-object';
import { LoginRequest } from 'src/app/models/login-request';
import { LoginResponseData } from 'src/app/models/login-response-data';
import { LoginResponse } from 'src/app/models/loginResponse';
import { User } from 'src/app/models/user';

interface PaginatedResponse<T> {
  pageSize: number;
  pageNumber: number;
  data: T;
  pageCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }
  
  login(loginRequest: LoginRequest): Observable<ApiResponseObject<LoginResponseData>> {
   debugger
    return this.httpClient.post<ApiResponseObject<LoginResponseData>>(`${environment.apiUrl}/Accounts/Login`, loginRequest);
  }

  requestLoginCode(useremail: string): Observable<ApiResponseObject<Boolean>> {
    debugger
    return this.httpClient.get<ApiResponseObject<Boolean>>(`${environment.apiUrl}/Auth/GetLoginCode/${useremail}`);
  }

  validateLoginCode(token: string): Observable<ApiResponseObject<LoginResponse>> {
    return this.httpClient.post<ApiResponseObject<LoginResponse>>(`${environment.apiUrl}/Auth/ValidateLoginCode/${token}`, token );
  }

  // passwordlessSignIn(object: any): Observable<ApiResponseObject<LoginResponseData>> {
   
  //   return this.httpClient.post<ApiResponseObject<LoginResponseData>>(`${environment.apiUrl}/Accounts/PasswordlessSignIn`, object);
  // }

  getAllUsers(pageNumber: number = 1, pageSize: number = 1000000): Observable<ApiResponseObject<User[]>> {
    return this.httpClient.get<PaginatedResponse<User[]>>(`${environment.apiUrl}/User?pageNumber=${pageNumber}&pageSize=${pageSize}`)
      .pipe(
        map(response => ({
          requestSuccessful: true,
          message: 'Users loaded successfully',
          responseData: response.data
        } as ApiResponseObject<User[]>))
      );
  }

}

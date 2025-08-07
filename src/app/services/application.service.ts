import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { ApplicationRequest, ChangeRequest, Analytics, SignOff, Comment, GetApplicationRequest, devs } from '../models/application.model';
import { ApplicationRequestVM } from '../models/ApplicationRequestVm';
import { ApiResponseObject } from '../models/api-response-object';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment.prod';
import { RequestResponse } from '../models/RequestResponse';
import { ApplicationVm } from '../models/applicationrequestdto';
import { ApplicationRequestDetailsVm } from '../models/application-request-details';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  [x: string]: any;

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('AT')}`,
      'Content-Type': 'application/json'
    });
  }

  private request<T>(method: 'GET' | 'POST', url: string, body?: any): Observable<ApiResponseObject<T>> {
    return this.httpClient.request<ApiResponseObject<T>>(method, `${environment.apiUrl}/${url}`, {
      body,
      headers: this.getHeaders()
    });
  }


  private applicationsSubject = new BehaviorSubject<ApplicationRequest[]>([]);
  public applications$ = this.applicationsSubject.asObservable();
  
  private changeRequestsSubject = new BehaviorSubject<ChangeRequest[]>([]);
  public changeRequests$ = this.changeRequestsSubject.asObservable();

 
  constructor(private httpClient: HttpClient)
   {this.initializeMockData(); }

  private initializeMockData(): void {
    const mockApplications: ApplicationRequest[] = [
      {
        id: '1',
        title: 'Customer Portal Application',
        description: 'Web application for customer self-service portal',
        category: 'Web Application',
        department: 'IT',
        location: 'New York',
        priority: 'high',
        status: 'pending-approval',
        requestedBy: '2',
        requestedByName: 'John Doe',
        technicalOwner: '1',
        technicalOwnerName: 'Admin User',
        responseDeadline: new Date('2025-02-15'),
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-10'),
        comments: [
          {
            id: '1',
            text: 'Initial requirements gathered',
            author: '2',
            authorName: 'John Doe',
            createdAt: new Date('2025-01-02')
          }
        ],
        signOffs: [
          {
            id: '1',
            userId: '1',
            userName: 'Admin User',
            userEmail: 'admin@company.com',
            status: 'pending'
          }
        ],
        metadata: {}
      },
      {
        id: '2',
        title: 'Mobile Employee App',
        description: 'Mobile application for employee attendance tracking',
        category: 'Mobile Application',
        department: 'HR',
        location: 'California',
        priority: 'medium',
        status: 'in-progress',
        requestedBy: '2',
        requestedByName: 'John Doe',
        technicalOwner: '1',
        technicalOwnerName: 'Admin User',
        responseDeadline: new Date('2025-03-01'),
        createdAt: new Date('2024-12-15'),
        updatedAt: new Date('2025-01-05'),
        comments: [],
        signOffs: [],
        metadata: {}
      },
      {
        id: '3',
        title: 'Data Analytics Dashboard',
        description: 'Business intelligence dashboard for sales analytics',
        category: 'Dashboard',
        department: 'Sales',
        location: 'Texas',
        priority: 'low',
        status: 'live',
        requestedBy: '2',
        requestedByName: 'John Doe',
        responseDeadline: new Date('2025-01-30'),
        createdAt: new Date('2024-11-01'),
        updatedAt: new Date('2024-12-20'),
        comments: [],
        signOffs: [],
        metadata: {}
      }
    ];

    const mockChangeRequests: ChangeRequest[] = [
      {
        id: '1',
        applicationId: '1',
        applicationTitle: 'Customer Portal Application',
        changeDescription: 'Add multi-language support',
        reason: 'Customer requirement for international expansion',
        requestedBy: '2',
        requestedByName: 'John Doe',
        priority: 'medium',
        status: 'submitted',
        createdAt: new Date('2025-01-05')
      }
    ];

    this.applicationsSubject.next(mockApplications);
    this.changeRequestsSubject.next(mockChangeRequests);
  }

  getApplications(): Observable<ApplicationRequest[]> {
    return this.applications$;
  }



getApplicationRequestById(id: number | string): Observable<ApiResponseObject<any>> {
  return this.request('GET', `Application/GetApplicationRequestById/${id}`);
}



  getUserApplications(userId: string): Observable<ApplicationRequest[]> {
    return this.applications$.pipe(
      map(apps => apps.filter(app => app.requestedBy === userId))
    );
  }

  getPendingApprovals(userId: string): Observable<ApplicationRequest[]> {
    return this.applications$.pipe(
      map(apps => apps.filter(app => 
        app.signOffs.some(signOff => signOff.userId === userId && signOff.status === 'pending')
      ))
    );
  }

  createApplication(application: Partial<ApplicationRequest>): Observable<ApplicationRequest> {
    const newApp: ApplicationRequest = {
      id: Date.now().toString(),
      title: application.title || '',
      description: application.description || '',
      category: application.category || '',
      department: application.department || '',
      location: application.location || '',
      priority: application.priority || 'medium',
      status: 'submitted',
      requestedBy: application.requestedBy || '',
      requestedByName: application.requestedByName || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      comments: [],
      signOffs: [],
      metadata: {}
    };

    return of(newApp).pipe(
      delay(1000),
      map(app => {
        const currentApps = this.applicationsSubject.value;
        this.applicationsSubject.next([...currentApps, app]);
        return app;
      })
    );
  }

  createApplicationRequest(model: FormData){
    debugger;
    return this.httpClient.post(`${environment.apiUrl}/Application/CreateApplicationRequest`, model);
  }

  markAsReviewed(applicationrequestId: number): Observable<any>  {
    debugger
    return this.request('POST', 'Application/MakeAsReviewed', applicationrequestId);
}

approveApplication(applicationRequestId: number): Observable<any> {
  debugger
  return this.request('POST', 'Application/ApproveApplication', applicationRequestId);
}


  addComment(payload: { applicationrequestId: number; comment: string }): Observable<any> {
  debugger;
  console.log('Calling API with:', payload);
  return this.request('POST', 'Application/AddComment', payload);

}


 uploadDocuments(formData: FormData){
    debugger;
    return this.httpClient.post(`${environment.apiUrl}/Documents/UploadDocument`, formData);
  }


 
  GetMyApplicationRequest(): Observable<ApiResponseObject<ApplicationVm[]>> {
debugger
  return this.request('GET', 'Application/GetMyApplicationRequests');
  
}

 GetAllApplicationRequest(): Observable<ApiResponseObject<GetApplicationRequest[]>> {
  return this.request('GET', 'Application/GetAllApplicationRequests');
}

assignTechnicalOwner(payload: any): Observable<any> {
  debugger
    return this.request('POST', 'Application/AssignTechnicalOwner', payload);

}

getTeamMembers(): Observable<ApiResponseObject<devs[]>> {
    return this.request('GET', 'Application/devs');

}


  updateApplicationStatus(id: string, status: ApplicationRequest['status']): Observable<boolean> {
    return of(true).pipe(
      delay(500),
      map(() => {
        const apps = this.applicationsSubject.value;
        const appIndex = apps.findIndex(app => app.id === id);
        if (appIndex > -1) {
          apps[appIndex] = { ...apps[appIndex], status, updatedAt: new Date() };
          this.applicationsSubject.next([...apps]);
          return true;
        }
        return false;
      })
    );
  }

 

  setResponseDeadline(id: string, deadline: Date): Observable<boolean> {
    return of(true).pipe(
      delay(500),
      map(() => {
        const apps = this.applicationsSubject.value;
        const appIndex = apps.findIndex(app => app.id === id);
        if (appIndex > -1) {
          apps[appIndex] = { 
            ...apps[appIndex], 
            responseDeadline: deadline,
            updatedAt: new Date() 
          };
          this.applicationsSubject.next([...apps]);
          return true;
        }
        return false;
      })
    );
  }

  

  initiateSignOff(id: string, signOffs: Omit<SignOff, 'id' | 'status'>[]): Observable<boolean> {
    return of(true).pipe(
      delay(1000),
      map(() => {
        const apps = this.applicationsSubject.value;
        const appIndex = apps.findIndex(app => app.id === id);
        if (appIndex > -1) {
          const newSignOffs: SignOff[] = signOffs.map(signOff => ({
            ...signOff,
            id: Date.now().toString() + Math.random(),
            status: 'pending' as const
          }));
          apps[appIndex].signOffs = [...apps[appIndex].signOffs, ...newSignOffs];
          apps[appIndex].status = 'pending-approval';
          apps[appIndex].updatedAt = new Date();
          this.applicationsSubject.next([...apps]);
          return true;
        }
        return false;
      })
    );
  }

  approveSignOff(applicationId: string, signOffId: string, comment?: string): Observable<boolean> {
    return of(true).pipe(
      delay(500),
      map(() => {
        const apps = this.applicationsSubject.value;
        const appIndex = apps.findIndex(app => app.id === applicationId);
        if (appIndex > -1) {
          const signOffIndex = apps[appIndex].signOffs.findIndex(s => s.id === signOffId);
          if (signOffIndex > -1) {
            apps[appIndex].signOffs[signOffIndex] = {
              ...apps[appIndex].signOffs[signOffIndex],
              status: 'approved',
              comment: comment,
              signedAt: new Date()
            };
            apps[appIndex].updatedAt = new Date();
            this.applicationsSubject.next([...apps]);
            return true;
          }
        }
        return false;
      })
    );
  }

  rejectSignOff(applicationId: string, signOffId: string, comment: string): Observable<boolean> {
    return of(true).pipe(
      delay(500),
      map(() => {
        const apps = this.applicationsSubject.value;
        const appIndex = apps.findIndex(app => app.id === applicationId);
        if (appIndex > -1) {
          const signOffIndex = apps[appIndex].signOffs.findIndex(s => s.id === signOffId);
          if (signOffIndex > -1) {
            apps[appIndex].signOffs[signOffIndex] = {
              ...apps[appIndex].signOffs[signOffIndex],
              status: 'rejected',
              comment: comment,
              signedAt: new Date()
            };
            apps[appIndex].status = 'rejected';
            apps[appIndex].updatedAt = new Date();
            this.applicationsSubject.next([...apps]);
            return true;
          }
        }
        return false;
      })
    );
  }

  getAnalytics(): Observable<Analytics> {
    return this.applications$.pipe(
      map(apps => ({
        pendingApplicationReview : apps.filter(app => app.status === 'live').length,
        totalLiveApplications: apps.filter(app => app.status === 'live').length,
        applicationsInProgress: apps.filter(app => app.status === 'in-progress').length,
        applicationsLive: apps.filter(app => app.status === 'live').length,
        applicationsPendingApproval: apps.filter(app => app.status === 'pending-approval').length
      }))
    );
  }

  createChangeRequest(changeRequest: Partial<ChangeRequest>): Observable<ChangeRequest> {
    const newChangeRequest: ChangeRequest = {
      id: Date.now().toString(),
      applicationId: changeRequest.applicationId || '',
      applicationTitle: changeRequest.applicationTitle || '',
      changeDescription: changeRequest.changeDescription || '',
      reason: changeRequest.reason || '',
      requestedBy: changeRequest.requestedBy || '',
      requestedByName: changeRequest.requestedByName || '',
      priority: changeRequest.priority || 'medium',
      status: 'submitted',
      createdAt: new Date()
    };

    return of(newChangeRequest).pipe(
      delay(1000),
      map(request => {
        const currentRequests = this.changeRequestsSubject.value;
        this.changeRequestsSubject.next([...currentRequests, request]);
        return request;
      })
    );
  }

  getChangeRequests(): Observable<ChangeRequest[]> {
    return this.changeRequests$;
  }
}
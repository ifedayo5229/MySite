import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
}

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  public categories$ = this.categoriesSubject.asObservable();

  private departmentsSubject = new BehaviorSubject<Department[]>([]);
  public departments$ = this.departmentsSubject.asObservable();

  private locationsSubject = new BehaviorSubject<Location[]>([]);
  public locations$ = this.locationsSubject.asObservable();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData(): void {
    const mockCategories: Category[] = [
      { id: '1', name: 'Web Application', description: 'Web-based applications' },
      { id: '2', name: 'Mobile Application', description: 'Mobile apps for iOS and Android' },
      { id: '3', name: 'Dashboard', description: 'Business intelligence dashboards' },
      { id: '4', name: 'API Service', description: 'Backend API services' },
      { id: '5', name: 'Desktop Application', description: 'Desktop software applications' }
    ];

    const mockDepartments: Department[] = [
      { id: '1', name: 'IT', description: 'Information Technology' },
      { id: '2', name: 'HR', description: 'Human Resources' },
      { id: '3', name: 'Sales', description: 'Sales Department' },
      { id: '4', name: 'Marketing', description: 'Marketing Department' },
      { id: '5', name: 'Finance', description: 'Finance Department' },
      { id: '6', name: 'Operations', description: 'Operations Department' }
    ];

    const mockLocations: Location[] = [
      { id: '1', name: 'New York', address: '123 Main St, New York, NY' },
      { id: '2', name: 'California', address: '456 Tech Ave, San Francisco, CA' },
      { id: '3', name: 'Texas', address: '789 Business Blvd, Austin, TX' },
      { id: '4', name: 'Florida', address: '321 Ocean Dr, Miami, FL' }
    ];

    this.categoriesSubject.next(mockCategories);
    this.departmentsSubject.next(mockDepartments);
    this.locationsSubject.next(mockLocations);
  }

  getCategories(): Observable<Category[]> {
    return this.categories$;
  }

  getDepartments(): Observable<Department[]> {
    return this.departments$;
  }

  getLocations(): Observable<Location[]> {
    return this.locations$;
  }

  getAllUsers(): Observable<any[]> {
    // Mock user data for dropdowns
    const mockUsers = [
      { id: '1', email: 'admin@company.com', name: 'Admin User' },
      { id: '2', email: 'user@company.com', name: 'John Doe' },
      { id: '3', email: 'manager@company.com', name: 'Jane Smith' },
      { id: '4', email: 'lead@company.com', name: 'Bob Johnson' },
      { id: '5', email: 'dev@company.com', name: 'Alice Brown' }
    ];
    return of(mockUsers);
  }
}
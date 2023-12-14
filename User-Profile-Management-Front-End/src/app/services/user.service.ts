import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, catchError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  usersUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient, private toastrService: ToastrService) {}

  createUser = (userDetails: IUser): Observable<IUser> | any => {
    return this.http
      .post<IUser>(`${this.usersUrl}/create-user`, userDetails)
      .pipe(
        tap((res: any) => {}),
        catchError((error: any): any => {
          this.toastrService.error(error.error.message);
        })
      );
  };

  getAllUsers = (): Observable<IUser[]> => {
    return this.http.get<IUser[]>(this.usersUrl);
  };

  getSingleUser = (userId: string): Observable<IUser> => {
    return this.http.get<IUser>(`${this.usersUrl}/get-user/${userId}`);
  };

  deleteUser = (userId: string): Observable<void> => {
    return this.http.delete<void>(`${this.usersUrl}/delete-user/${userId}`);
  };

  updateUser = (
    userDetails: IUser,
    userId: string
  ): Observable<IUser> | any => {
    return this.http
      .put<IUser>(`${this.usersUrl}/update-user/${userId}`, userDetails)
      .pipe(
        tap((res: any) => {}),
        catchError((error: any): any => {
          this.toastrService.error(error.error.message);
        })
      );
  };
}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  gender: string;
  strength: string[];
  strengths?: string;
  about: string;
  role?: string;
  password?: string;
}

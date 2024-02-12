import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from "@angular/common/http";
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  throwError,
} from "rxjs";

import { Auth } from "../models/auth";
import { environment } from "src/environments/environment.prod";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
  withCredentials: true,
};

@Injectable({
  providedIn: "root",
})
// /auth/signin
export class AuthService {
  constructor(private http: HttpClient) {}

  headers = new HttpHeaders().set("Content-Type", "application/json");

  login(data: any): Observable<any> {
    let CREATE_URL = `${environment.baseUrl}/soa/auth/signin`;
    return this.http
      .post(CREATE_URL, data, {
        observe: "response",
        headers: this.headers,
        withCredentials: true,
      })
      .pipe(
        map((res) => {
         
          return res || {};
        }),
        
      );
  }
  // .set("username", this.currentUser)
  // .set("otpCode", otpValue);

  verifyOTP(username, otpCode): Observable<any> {
    const OTP_URL = `${environment.baseUrl}/soa/auth/otp/verify`;

    return this.http.get<any>(OTP_URL, {
      params: { username, otpCode },
    });
  }


  
  // Error handling
  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = "";
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `${error.error.message}`;
    }
    return throwError(errorMessage);
  }

  register(user: any): Observable<{ message: string }> {
    const registerUrl = `${environment.baseUrl}/soa/auth/signup`;

    return this.http.post<{ message: string }>(registerUrl, user);
  }

  onboardUser(user): Observable<{ message: string }> {
    const onboardUserUrl = `${environment.baseUrl}/soa/otherusers/signup`;

    return this.http.post<{ message: string }>(onboardUserUrl, user);
  }

  resetPassword(resetPasswordDetails): Observable<{ message: string }> {
    const resetPasswordUrl = `${environment.baseUrl}/soa/reset/change-password`;

    return this.http.post<{ message: string }>(
      resetPasswordUrl,
      resetPasswordDetails
    );
  }

  // forgotPassword(email): Observable<any> {
  //   const resetPasswordUrl = `${environment.baseUrlSelfservice}/erp/suppliers/auth/forgot-password`;

  //   return
  //   this.http.post<any>(resetPasswordUrl, email);
  // }



  forgotPassword(email: string): Observable<any> {
    const resetPasswordUrl = `${environment.baseUrlSelfservice}/erp/suppliers/auth/forgot-password`;
    const requestBody = { emailAddress: email }; // Update the property name to match the backend
    return this.http.post<any>(resetPasswordUrl, requestBody);
  }
}

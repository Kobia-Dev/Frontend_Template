

import { DOCUMENT } from "@angular/common";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { Observable, map, tap } from "rxjs";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { environment } from "src/environments/environment.prod";

const TOKEN_KEY = "auth-token";
const USER_KEY = "auth-user";

@Injectable({
  providedIn: "root",
})
export class TokenCookieService {
  headers = new HttpHeaders().set("Content-Type", "application/json");

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private http: HttpClient,     private _snackBar: MatSnackBar,
  ) {}


  signOut(): Observable<any> {
    const SIGNOUT_URL = `${environment.baseUrl}/soa/auth/logout`;
  
    // Show a message to the user indicating that the page is reloading
    // const snackBarRef = this._snackBar.open(
    //   "Logging out... Please wait.",
    //   null,
    //   {
    //     horizontalPosition: "end",
    //     verticalPosition: "top",
    //     panelClass: ["snackbar-success", "snackbar-success"],
    //   }
    // );
  
    return this.http.post(SIGNOUT_URL, 'data', {
      observe: "response",
      headers: this.headers,
      withCredentials: true,
    }).pipe(
      tap(() => {
        // clear local storage
        localStorage.clear();
  
        // clear cookies
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i];
          const eqPos = cookie.indexOf('=');
          const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
          document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
  
        // Hide the snackbar after a delay of 1.5 seconds
        // setTimeout(() => {
        //   snackBarRef.dismiss();
        // }, 1500);
  
        // Reload the current page after a delay of 2 seconds
        setTimeout(() => {
          location.reload();
        }, 2000);
      })
    );
  }
  
  
  
  public getToken(): string | null {
    // get the name of the cookie to retrieve
    const name = "accessToken";
    // split the document.cookie string into an array of individual cookies
    const cookieArray = document.cookie.split(";");
    // loop through the cookies to find the one with the matching name
    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i];
      //console.log("cookieArray: ", cookieArray)
      // remove any leading spaces from the cookie string
      while (cookie.charAt(0) === " ") {
        cookie = cookie.substring(1);
      }
      // if the cookie name matches the desired name, return the cookie value
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length, cookie.length);
      }
    }
    // if the cookie was not found, return null
    return null;
  }

  public saveUser(user: any): void {
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = window.localStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return null;
  }

  clearCookies() {
    this.document.cookie.split(";").forEach((c) => {
      console.log("Cookie: ", c);
      console.log("this.document.cookie: ", this.document.cookie);
      this.document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
  }
}

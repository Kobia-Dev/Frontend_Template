import { HttpParams } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from "@angular/material/snack-bar";
import { Router } from "@angular/router";

import { AuthService } from "src/app/core/service/auth.service";
import { TokenCookieService } from "src/app/core/service/token-storage-cookies.service";
import { SuplierAuthService } from "../../_service/supplier-auth.service";

@Component({
  selector: "app-otp",
  templateUrl: "./otp.component.html",
  styleUrls: ["./otp.component.scss"],
})
export class OtpComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = "end";
  verticalPosition: MatSnackBarVerticalPosition = "top";

  otpForm: FormGroup;
  currentEmail: any;
  maskedEmail: any;
  currentUser: any;

  constructor(
    private fb: FormBuilder,
    private tokenCookieService: TokenCookieService,
    private router: Router,
    private supauthservice : SuplierAuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    // if (!this.tokenCookieService.getUser()) {
    //   // If not authenticated, navigate to the sign-in page
    //   this.router.navigate(["/authentication/signin"]);
    // }
    this.getEmail();

    this.otpForm = this.fb.group({
      first: ["", Validators.required],
      second: ["", Validators.required],
      third: ["", Validators.required],
      fourth: ["", Validators.required],

    });
  }

  getEmail() {
    
    this.currentEmail = this.tokenCookieService.getUser().email;
    this.currentUser = this.tokenCookieService.getUser().username;

    console.log("this.currentUser: ", this.currentUser);
    const email = this.currentEmail;
    const atIndex = email.indexOf("@");
    const username = email.slice(0, atIndex);
    const domain = email.slice(atIndex);

    const maskedUsername =
      username.charAt(0) +
      "*".repeat(username.length - 2) +
      username.charAt(username.length - 1);
    const maskedEmail = maskedUsername + domain;
    this.maskedEmail = maskedEmail;
    console.log(maskedEmail); // Output: w********s@gmail.com
  }

  // onSubmit() {
  //   this.router.navigate(["/admin/dashboard"]);
  //   if (this.otpForm.invalid) {
  //     return;
  //   }

  //   // TODO: Add logic to validate OTP code

  //   console.log('OTP Code:', this.otpForm.value);
  // }
  loading: boolean = false;
  error: any;
  onSubmit() {
   
    this.loading = true;
    this.error = "";
    if (this.otpForm.invalid) {
      this.error = "Invalid OTP!";
      return;
    } else {


      const otpValue = Number(
        this.otpForm.controls.first.value +
        this.otpForm.controls.second.value +
        this.otpForm.controls.third.value +
        this.otpForm.controls.fourth.value
      );

      console.log(otpValue);

      const params = new HttpParams()
        // .set("format", type)
        .set("username", this.currentUser)
        .set("otpCode", otpValue);

      console.log("params: ", params);



      //this.router.navigate(["/admin/dashboard"]);
      this.supauthservice.verifyOTP(this.currentUser,otpValue).subscribe(res => {
        console.log("Res: ", res)
        this.tokenCookieService.saveUser(res);

        const role = res.roles[0];

        if (res) {

          
          this.router.navigate(["/dashboard/dashboard"]);



        } else {
          this.error = "Invalid Login";
        }


      }, err => {
        console.log(err)
        //this.error = "Invalid Credentials!" ;
        this.error = err;
        console.log(err);
        this.loading = false;
      })

      this.snackBar.open(
        "Login Successful!",
        "X",
        {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 60000,
          panelClass: ["snackbar-success", "snackbar-success"],
        }
      );

      

    }
  }

  ngAfterViewInit() {
    const inputs =
      document.querySelectorAll<HTMLInputElement>('input[type="text"]');

    inputs.forEach((input, index) => {
      input.addEventListener("input", (event) => {
        const target = event.target as HTMLInputElement;
        const maxLength = target.maxLength;
        const inputLength = target.value.length;

        if (inputLength === maxLength) {
          const nextIndex = index + 1;

          if (inputs[nextIndex]) {
            (inputs[nextIndex] as HTMLInputElement).focus();
          }
        }
      });
    });
  }
}

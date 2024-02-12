import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { takeUntil } from "rxjs";
import { AuthService } from "src/app/core/service/auth.service";
import { BaseComponent } from "src/app/shared/components/base/base.component";
import { SnackbarService } from "src/app/shared/services/snackbar.service";

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.sass"],
})
export class ResetPasswordComponent extends BaseComponent implements OnInit {
  resetPasswordForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private snackbar: SnackbarService,
    private authService: AuthService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.resetPasswordForm = this.formBuilder.group({
      token: ["", [Validators.required]],
      password: ["", [Validators.required]],
      confirmpassword: ["", [Validators.required]],
      emailaddress: ["", [Validators.required]],
    });
  }

  resetPassword() {
    if (
      this.resetPasswordForm.value.password !==
      this.resetPasswordForm.value.confirmpassword
    ) {
      this.snackbar.showNotification(
        "snackbar-danger",
        "Passwords don't match, please check and retry!"
      );
    } else {
      console.log({
        token: this.resetPasswordForm.value.token,
        password: this.resetPasswordForm.value.password,
        emailaddress: this.resetPasswordForm.value.emailaddress,
      });
      this.authService
        .resetPassword({
          token: this.resetPasswordForm.value.token,
          password: this.resetPasswordForm.value.password,
          emailaddress: this.resetPasswordForm.value.emailaddress,
        })
        .pipe(takeUntil(this.subject))
        .subscribe((res) => {
          this.snackbar.showNotification("snackbar-success", res.message);
          console.log(res);
        });
    }
  }
}

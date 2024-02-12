import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "src/app/core/service/auth.service";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import { TokenStorageService } from "src/app/core/service/token-storage.service";
import { TokenCookieService } from "src/app/core/service/token-storage-cookies.service";
import { userJSON } from "../_data/userJSON";
import { SuplierAuthService } from "../_service/supplier-auth.service";
import { privileges } from "../_data/privilages";

@Component({
  selector: "app-signin",
  templateUrl: "./signin.component.html",
  styleUrls: ["./signin.component.scss"],
})
export class SigninComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  authForm: FormGroup;
  submitted = false;
  loading = false;
  error = "";
  hide = true;


  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];


  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private tokenCookieService: TokenCookieService,
    private supauthservice : SuplierAuthService
  ) {
    super();
  }

  ngOnInit() {
    this.authForm = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
    });
  }

  onSubmit() {
    this.submitted = true;
    this.loading = true;
    this.error = "";
    if (this.authForm.invalid) {
      this.error = "Username and Password not valid !";
      return;
    } else {
      console.log(this.authForm.value);


      

      console.log(this.authForm.value);
      
      // this.router.navigate(['/dashboard/dashboard'])

      this.supauthservice.login(this.authForm.value).subscribe(res => {
        console.log("Res: ", res)
        this.tokenCookieService.saveUser(res.body);


        if (res) {
          const userId = res.body.id;
          // const privileges = privileges;
          localStorage.setItem(
            `userPrivileges_${userId}`,
            JSON.stringify(privileges)
          );
          // this.router.navigate(['supplier-authentication/otp'])
          this.router.navigate(["/dashboard/dashboard"]);

        } else {
          this.error = res.message;
        }


      }, err => {
        console.log(err)
        //this.error = "Invalid Credentials!" ;
        this.error = err.message;
        console.log(err);
        this.submitted = false;
        this.loading = false;
      })
    }
  }

  

  
}

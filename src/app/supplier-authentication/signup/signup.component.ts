import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";

import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";


@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent implements OnInit {
  error = "";

  authForm: FormGroup;
  submitted = false;
  returnUrl: string;
  hide = true;
  chide = true;
  loading = false;

  categories: any;
  selectedCat: any[] = [];
  selectedCatFormated: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public snackbar: SnackbarService,
    private dialog: MatDialog
  ) {}
  ngOnInit() {
    this.authForm = this.formBuilder.group({
      areasofinterest: new FormControl([]),
      areasofinterestNonFormatted: new FormControl([]),
      companyname: ["", Validators.required],
      country: ["", Validators.required],
      firstname: ["", Validators.required],
      othernames: ["", Validators.required],
      phonenumber: ["", Validators.required],
      physicaladdress: ["", Validators.required],
      supplylocations: ["", Validators.required],
      taxpin: ["", Validators.required],
      emailaddress: [
        "",
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],
      createdOn: [""],
      deleteFlag: [""],
      isAcctActive: [""],
      isAcctLocked: [""],
      isLoggedIn: [""],
      modifiedBy: [""],
      modifiedOn: [""],
      roles: [
        [
          {
            id: 0,
            name: "ADMIN",
          },
        ],
      ],
      supplierid: [""],
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
  }
  get f() {
    return this.authForm.controls;
  }
  onSubmit() {
    console.log("Auth: ", this.authForm.value);
    this.submitted = true;
    this.loading = true;
    // stop here if form is invalid
    if (this.authForm.invalid) {
      return;
    } else {
      // this.router.navigate(["/admin/dashboard/main"]);

      // this.suppAuthService.register(this.authForm.value).subscribe(
      //   (res) => {
      //     this.snackbar.showNotification("snackbar-success", res.message);

      //     console.log(res);
      //     this.router.navigate(["/supplier-authentication/signin"]);
      //   },
      //   (err) => {
      //     console.log(err);
      //     //this.error = "Invalid Credentials!" ;
      //     this.error = err;
      //     console.log(err);
      //     this.submitted = false;
      //     this.loading = false;
      //   }
      // );
    }
  }

  tenderCatLookup() {
    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = false;
    // dialogConfig.autoFocus = true;
    // dialogConfig.width = "600px";
    // dialogConfig.data = {
    //   action: "view categories",
    //   data: this.categories,
    //   selected: this.selectedCat,
    // };

    // const dialogRef = this.dialog.open(
    //   TenderCategoriesLookUpComponent,
    //   dialogConfig
    // );

    // dialogRef.afterClosed().subscribe((result) => {
    //   if (result.data.length != 0) {
    //     //console.log("result: ", result.data);
    //     this.getSelectedCategories(result.data);
    //   }
    // });
  }

  getSelectedCategories(data) {
    data.forEach((element) => {
      this.selectedCat.push(element.name);
      this.selectedCatFormated.push({ tendercategory: element.name });
    });
    this.authForm.patchValue({
      areasofinterest: this.selectedCatFormated,
      areasofinterestNonFormatted: this.selectedCat,
    });
  }
}

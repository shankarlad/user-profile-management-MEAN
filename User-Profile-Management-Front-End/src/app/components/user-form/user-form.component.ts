import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IUser, UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { eLocalSrorage } from '../../sharedenums';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css',
})
export class UserFormComponent {
  userForm!: FormGroup;
  userId!: string;
  strengths!: string[];
  isViewPage: boolean = false;
  isUpdate: boolean = false;
  createUser: boolean = true;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private toastrService:ToastrService
  ) {}

  ngOnInit(): void {
    if (!localStorage.getItem(eLocalSrorage.Token)) {
      this.router.navigate(['/login']);
    }
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['male', Validators.required],
      strength: this.fb.array([]),
      about: [''],
      password: ['', Validators.required],
    });

    this.userId = this.route.snapshot.paramMap.get('id') || '';
    const type = this.route.snapshot.paramMap.get('type');
    if (this.userId && type === 'view') {
      this.viewData(this.userId);
    }

    if (this.userId && type === 'update') {
      this.updateData(this.userId);
    }
  }

  get emailValid() {
    return this.userForm.get('email');
  }
  get nameValid() {
    return this.userForm.get('name');
  }
  get passwordValid() {
    return this.userForm.get('password');
  }

  // Helper method to get the FormArray for strengths
  get strengthControls(): FormArray {
    return this.userForm.get('strength') as FormArray;
  }

  // Add a strength to the FormArray
  addStrength(): void {
    this.strengthControls.push(this.fb.control('', Validators.required));
  }

  // Remove a strength from the FormArray
  removeStrength(index: number): void {
    this.strengthControls.removeAt(index);
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.userService.createUser(this.userForm.value).subscribe((user:IUser) => {
        this.toastrService.success("User Created");
        this.router.navigate(['/dashboard']);
        this.userForm.reset();
        this.userForm.markAsUntouched();
      });
    }
  }

  viewData(userId: string) {
    this.isViewPage = true;
    this.isUpdate = false;
    this.createUser = false;
    this.userService.getSingleUser(userId).subscribe((data) => {
      Object.keys(this.userForm.controls).forEach((key) => {
        //this.userForm.controls[key].disable();
        if (key === 'password') {
          this.userForm.removeControl('password');
        }
      });

      const strengths = data.strength;
      const strengthControls = strengths.map((strength) =>
        this.fb.control(strength, Validators.required)
      );
      strengthControls.forEach((el) => {
        // this.strengthControls.disable();
        this.strengthControls.push(this.fb.control(el.value));
      });

      this.userForm.patchValue({
        name: data.name,
        email: data.email,
        gender: data.gender.toLocaleLowerCase(),
        about: data.about,
        strength: strengths,
      });
    });
  }

  updateData(userId: string) {
    this.isViewPage = false;
    this.isUpdate = true;
    this.createUser = false;
    this.userService.getSingleUser(userId).subscribe((data) => {
      const strengths = data.strength;

      const strengthControls = strengths.map((strength) =>
        this.fb.control(strength, Validators.required)
      );

      strengthControls.forEach((el) => {
        // this.strengthControls.controls['strength'].disable()
        this.strengthControls.push(this.fb.control(el.value));
      });

      this.userForm.patchValue({
        name: data.name,
        email: data.email,
        gender: data.gender.toLocaleLowerCase(),
        about: data.about,
        //password: data.password,
      });
    });
  }

  updateUserDetails() {
    if (this.userForm.valid) {
      this.userService
        .updateUser(this.userForm.value, this.userId)
        .subscribe((user:IUser) => {
          this.toastrService.success("User Updated");
          this.router.navigate(['/dashboard']);
          this.userForm.reset();
          this.userForm.markAsUntouched();
        });
    }
  }
}

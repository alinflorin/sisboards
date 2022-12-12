import { Component, OnInit } from '@angular/core';
import { Auth, createUserWithEmailAndPassword} from '@angular/fire/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../shared/toast/services/toast.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  form = new FormGroup({
    email: new FormControl(undefined, [Validators.email, Validators.required]),
    password: new FormControl(undefined, [Validators.required, Validators.minLength(8)]),
  });
  constructor(private auth: Auth, private toast: ToastService, private router: Router) { }

  ngOnInit(): void {
  }

  signup(): void {
    createUserWithEmailAndPassword(this.auth, this.form.value.email!, this.form.value.password!).then(() => {
      this.toast.showSuccess('Sign up successful. Please login.');
      this.router.navigateByUrl('/');
    }).catch(e => {
      this.toast.showError('Sign up failed: ' + e.message);
    });
  }

}

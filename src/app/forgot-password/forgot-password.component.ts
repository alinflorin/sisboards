import { Component, OnInit } from '@angular/core';
import { Auth, sendPasswordResetEmail } from '@angular/fire/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../shared/toast/services/toast.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  form = new FormGroup({
    email: new FormControl(undefined, [Validators.required, Validators.email])
  });

  constructor(private auth: Auth, private toast: ToastService, private router: Router) { }

  ngOnInit(): void {
  }

  forgot(): void {
    sendPasswordResetEmail(this.auth, this.form.value.email!).then(() => {
      this.toast.showSuccess('Password reset link sent.');
      this.router.navigate(['login']);
    }).catch(e => {
      this.toast.showError('Reset password failed: ' + e.message);
    });
  }
}

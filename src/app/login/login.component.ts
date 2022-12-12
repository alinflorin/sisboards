import { Component, OnDestroy, OnInit } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastService } from '../shared/toast/services/toast.service';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit, OnDestroy {
  private _subs: Subscription[] = [];
  private returnUrl = '/';

  form = new FormGroup({
    email: new FormControl(undefined, [Validators.email, Validators.required]),
    password: new FormControl(undefined, [
      Validators.required,
      Validators.minLength(8),
    ]),
  });
  constructor(private auth: Auth, private router: Router, private actRoute: ActivatedRoute, private toast: ToastService) {}

  ngOnInit(): void {
    this._subs.push(
      this.actRoute.queryParams.subscribe(qp => {
        if (qp['returnUrl']) {
          this.returnUrl = qp["returnUrl"];
        }
      })
    );
  }

  ngOnDestroy(): void {
    this._subs.forEach(s => s.unsubscribe());
  }
  
  login(): void {
    signInWithEmailAndPassword(this.auth, this.form.value.email!, this.form.value.password!).then(() => {
      this.router.navigateByUrl(this.returnUrl);
    }).catch(e => {
      this.toast.showError('Login failed: ' + e.message);
    });
  }
}

import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';

@Injectable()
export class ToastService {
  constructor(private snackbar: MatSnackBar) {}

  success(message: string) {
    return this.show(message, "success");
  }

  warn(message: string) {
    return this.show(message, "warn");
  }

  info(message: string) {
    return this.show(message, "info");
  }

  error(message: string) {
    return this.show(message, "error");
  }

  private show(message: string, className: string) {
    return this.snackbar.open(message, undefined, {
      horizontalPosition: "right",
      verticalPosition: "bottom",
      panelClass: className,
      duration: environment.ui.toast.duration,
    });
  }
}

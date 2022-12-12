import { Component, OnDestroy, OnInit } from "@angular/core";
import { Auth } from "@angular/fire/auth";
import {
  doc,
  Firestore,
  getDoc,
  updateDoc,
  addDoc,
  collection,
} from "@angular/fire/firestore";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { ToastService } from "../shared/toast/services/toast.service";
import { Board } from "../models/board";

@Component({
  selector: "app-add-edit-board",
  templateUrl: "./add-edit-board.component.html",
  styleUrls: ["./add-edit-board.component.scss"],
})
export class AddEditBoardComponent implements OnInit, OnDestroy {
  private _subs: Subscription[] = [];
  id: string | undefined;
  soundsFormArray: FormArray<FormGroup>;
  form: FormGroup;

  constructor(
    private firestore: Firestore,
    private toast: ToastService,
    private auth: Auth,
    private actRoute: ActivatedRoute,
    private router: Router
  ) {
    this.soundsFormArray = new FormArray<FormGroup>([]);
    this.form = new FormGroup({
      email: new FormControl(undefined, [Validators.email]),
      name: new FormControl(undefined, [Validators.required]),
      backgroundUrl: new FormControl(undefined),
      sounds: this.soundsFormArray,
    });
  }

  ngOnInit(): void {
    this.form.get("email")!.setValue(this.auth.currentUser!.email);
    this._subs.push(
      this.actRoute.params.subscribe((p) => {
        this.id = p["id"];
        if (this.id) {
          this.loadBoardForEdit();
        }
      })
    );
  }

  private loadBoardForEdit() {
    getDoc(doc(this.firestore, "boards/" + this.id))
      .then((d) => {
        this.form.patchValue(d.data() as Board);
      })
      .catch((e) => {
        this.toast.showError("Error: " + e.message);
      });
  }

  save() {
    if (this.id) {
      updateDoc(doc(this.firestore, "boards/" + this.id), {
        sounds: this.form.value.sounds,
        backgroundUrl: this.form.value.backgroundUrl,
        name: this.form.value.name,
      })
        .then(() => {
          this.router.navigateByUrl("/my-boards");
          this.toast.showSuccess("Board updated");
        })
        .catch((e) => {
          this.toast.showError("Error: " + e.message);
        });
    } else {
      addDoc(collection(this.firestore, "boards"), this.form.value)
        .then(() => {
          this.router.navigateByUrl("/my-boards");
          this.toast.showSuccess("Board created");
        })
        .catch((e) => {
          this.toast.showError("Error: " + e.message);
        });
    }
  }

  ngOnDestroy(): void {
    this._subs.forEach((s) => s.unsubscribe());
  }
}

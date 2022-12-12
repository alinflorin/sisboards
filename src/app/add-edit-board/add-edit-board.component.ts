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
import { Storage, getDownloadURL, uploadBytes, ref } from '@angular/fire/storage';

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
    private storage: Storage,
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
        const board = d.data() as Board;
        if (board.sounds && board.sounds.length > 0) {
          for (let i = 0; i < board.sounds.length; i++) {
            this.addSound();
          }
        }
        this.form.patchValue(board);
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

  async onBackgroundImageChange(event: Event) {
    const file = (event.target as HTMLInputElement).files!.item(0);
    const data = await file!.arrayBuffer();
    const reference = ref(
      this.storage,
      this.auth.currentUser!.email + "/" + file!.name
    );
    const uploadResult = await uploadBytes(reference, data);
    const downloadUrl = await getDownloadURL(uploadResult.ref);
    this.form.get("backgroundUrl")!.setValue(downloadUrl);
  }

  async onAudioUpload(event: Event, control: FormGroup) {
    const file = (event.target as HTMLInputElement).files!.item(0);
    const data = await file!.arrayBuffer();
    const reference = ref(
      this.storage,
      this.auth.currentUser!.email + "/" + file!.name
    );
    const uploadResult = await uploadBytes(reference, data);
    const downloadUrl = await getDownloadURL(uploadResult.ref);
    control.get("url")!.setValue(downloadUrl);
  }

  deleteSound(i: number) {
    this.soundsFormArray.removeAt(i);
  }

  addSound() {
    const fg = new FormGroup({
      name: new FormControl(undefined, [Validators.required]),
      url: new FormControl(undefined, [Validators.required])
    });
    this.soundsFormArray.push(fg);
  }
}

import { Component, ElementRef, OnDestroy, OnInit, ViewChildren, QueryList } from '@angular/core';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Board } from '../models/board';
import { ToastService } from '../shared/toast/services/toast.service';

@Component({
  selector: "app-view-board",
  templateUrl: "./view-board.component.html",
  styleUrls: ["./view-board.component.scss"],
})
export class ViewBoardComponent implements OnInit, OnDestroy {
  private _subs: Subscription[] = [];
  id: string | undefined;
  board: Board | undefined;
  @ViewChildren('audio') audios: QueryList<ElementRef> | undefined;

  constructor(
    private firestore: Firestore,
    private actRoute: ActivatedRoute,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this._subs.push(
      this.actRoute.params.subscribe((p) => {
        this.id = p["id"];
        getDoc(doc(this.firestore, "boards/" + this.id))
          .then((d) => {
            this.board = { ...d.data(), id: d.id } as Board;
          })
          .catch((e) => {
            this.toast.showError("Error: " + e.message);
          });
      })
    );
  }

  ngOnDestroy(): void {
    this._subs.forEach((s) => s.unsubscribe());
  }

  play(audio: HTMLAudioElement) {
    this.audios?.forEach(a => { 
      (a.nativeElement as HTMLAudioElement).pause();
      (a.nativeElement as HTMLAudioElement).currentTime = 0;
    });
    audio.currentTime = 0;
    audio.play();
  }
}

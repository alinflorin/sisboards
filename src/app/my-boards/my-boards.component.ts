import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, collection, getDocs, query, where, deleteDoc, doc } from '@angular/fire/firestore';
import { Board } from '../models/board';
import { ConfirmationService } from '../shared/confirmation/services/confirmation.service';
import { ToastService } from '../shared/toast/services/toast.service';

@Component({
  selector: 'app-my-boards',
  templateUrl: './my-boards.component.html',
  styleUrls: ['./my-boards.component.scss']
})
export class MyBoardsComponent implements OnInit {
  boards: Board[] = [];
  constructor(private firestore: Firestore, private auth: Auth, private toast: ToastService, private confirm: ConfirmationService) { }

  ngOnInit(): void {
    const col = collection(this.firestore, 'boards');
    const q = query(col, where('email', '==', this.auth.currentUser!.email!));
    getDocs(q).then(rez => {
      this.boards = rez.docs.map(x => ({...(x.data()), id: x.id} as Board));
    }).catch(e => {
      this.toast.showError('Error: ' + e.message);
    });
  }

  deleteBoard(id: string, i: number) {
    this.confirm.confirm().subscribe(x => {
      if (!x) {
        return;
      }
      deleteDoc(doc(this.firestore, 'boards', id)).then(() => {
        this.boards.splice(i, 1);
        this.boards = [...this.boards];
        this.toast.showSuccess('Board deleted');
      }).catch(e => { 
        this.toast.showError('Error: ' + e.message);
      });
    });
  }

}

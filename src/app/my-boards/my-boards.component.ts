import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, collection, getDocs, query, where } from '@angular/fire/firestore';
import { Board } from '../models/board';
import { ToastService } from '../shared/toast/services/toast.service';

@Component({
  selector: 'app-my-boards',
  templateUrl: './my-boards.component.html',
  styleUrls: ['./my-boards.component.scss']
})
export class MyBoardsComponent implements OnInit {
  boards: Board[] = [];
  constructor(private firestore: Firestore, private auth: Auth, private toast: ToastService) { }

  ngOnInit(): void {
    const col = collection(this.firestore, 'boards');
    const q = query(col, where('email', '==', this.auth.currentUser!.email!));
    getDocs(q).then(rez => {
      this.boards = rez.docs.map(x => ({...(x.data()), id: x.id} as Board));
    }).catch(e => {
      this.toast.showError('Error: ' + e.message);
    });
  }

}

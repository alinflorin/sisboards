import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private _subs: Subscription[] = [];
  
  constructor() {

  }

  ngOnInit(): void {
      
  }

  ngOnDestroy(): void {
    this._subs.forEach(s => s.unsubscribe());
  }
}

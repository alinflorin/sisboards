import { Component, Input, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() sidenav: MatSidenav | undefined;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  navigate(url: string, e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    e.stopImmediatePropagation();
    this.router.navigateByUrl(url);
    if (this.sidenav?.mode === 'over') {
      this.sidenav?.close();
    }
  }
}

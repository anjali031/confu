import { Component, OnInit } from '@angular/core';
// dialog open imports
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
// dialog box entry component
import { LoginComponent } from '../login/login.component';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }
  // opening the dialog box
  openLoginForm() {
    this.dialog.open(LoginComponent, {width: '500px', height: '450px'});
  }

}

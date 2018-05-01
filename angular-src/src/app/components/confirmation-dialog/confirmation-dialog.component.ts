import { Component, OnInit, Input,Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent implements OnInit {

  constructor( public dialogRef: ConfirmationDialogComponent,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    
  }
  toggleDialog(){
    
  }
  ngOnInit() {
  }

}

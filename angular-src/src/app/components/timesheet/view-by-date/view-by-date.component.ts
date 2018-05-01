import { Component, OnInit,NgZone } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ValidateService} from '../../../services/validate.service'
import {AuthService} from '../../../services/auth.service'
import {FlashMessagesService} from 'angular2-flash-messages';
import { Observable } from 'rxjs/Observable';
import { Router, RouterModule } from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { DatetimePopupModule } from 'ngx-bootstrap-datetime-popup';
import { NgbDateStruct }      from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';

import {ConfirmationDialogComponent} from '../../confirmation-dialog/confirmation-dialog.component';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { UNIQUE_SELECTION_DISPATCHER_PROVIDER } from '@angular/cdk/collections';

@Component({
  selector: 'app-view-by-date',
  templateUrl: './view-by-date.component.html',
  styleUrls: ['./view-by-date.component.css']
})
export class ViewByDateComponent implements OnInit {

  ts_list: any = {
    hourly_ts:[]
  };
  account: any;
  ts_: any;

  date: any;
  constructor(
    private validateService: ValidateService, 
    private flashMessages:FlashMessagesService,
    private authService:AuthService,
     private router:Router,
     private modalService: NgbModal,
     private zone:NgZone, // <== added
     public dialog: MatDialog
  
  ) { }
  isCompany(){
    if(localStorage.getItem('isCompany')=='true'){
      return true;
    }
    else{
      return false;
    }
  }
  ngOnInit() {
    this.date = new Date();
    if(this.isCompany()){
      
    }
    else{
      this.authService.getProfile().subscribe(data => { 
        this.account = data.employee;
         this.authService.getEmployeeTimesheets(this.account.empUsername).subscribe(data => {
           this.ts_ = data.timesheet;
           console.log(this.ts_);
           for(let i = 0; i<this.ts_.length;i++){
             console.log(this.ts_[i]);
             for(let j = 0; j<this.ts_[i].hourly_ts.length;j++){
               
               // if(this.validateService.isSameDay(this.date,this.validateService.ObjIdtoDate(this.ts_[i].hourly_ts[j]._id))){
                 this.ts_list.hourly_ts.push(this.ts_[i].hourly_ts[j]);
         
               //}
             }
           }
         
         },
         err => {
           console.log(err);
           return false;
         });
         },
         err => {
           console.log(err);
           return false;
         });
       }

       console.log(this.ts_list.hourly_ts);
     }
  nextDay(){
    this.date.setDate(this.date.getDate()-1);
  console.log(this.date.toDateString());
  }
  previousDay(){
    
    this.date.setDate(this.date.getDate()+1);
    console.log(this.date.toDateString());
  }
  updateDateTS(i){

        if(this.validateService.isSameDay(this.date,new Date(this.ts_list.hourly_ts[i].date)))
          return true;
        else
          return false;
      }
  displayDate(){
    return this.date.toDateString();
  }
  toTime(t){
    return parseFloat(t).toFixed(2);
  }
  changeIdtoDate(t){
 
   let date = this.validateService.ObjIdtoDate(t);
   return date.toDateString();
   
  }
}

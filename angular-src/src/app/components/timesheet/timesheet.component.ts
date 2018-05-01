import { Component, OnInit,NgZone } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ValidateService} from '../../services/validate.service'
import {AuthService} from '../../services/auth.service'
import {FlashMessagesService} from 'angular2-flash-messages';
import { Observable } from 'rxjs/Observable';
import { Router, RouterModule } from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { DatetimePopupModule } from 'ngx-bootstrap-datetime-popup';
import { NgbDateStruct }      from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';
import '../../../polyfills';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { UNIQUE_SELECTION_DISPATCHER_PROVIDER } from '@angular/cdk/collections';

const now = new Date();
@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.css']
})
export class TimesheetComponent implements OnInit{
  ts_today:any = {
    hourly_ts:[]
  }
  noProjects: boolean=false;
  selbyProj1:boolean=false;
  selbyProj2:boolean=false;
  time_picked1:boolean = false; 
  time_picked2:boolean = false; 
  pro_picked:boolean = false;
  cli_picked:boolean = false;
  ts_list:any;
  ts_:any;
  date=new Date();
    serializedDate = new FormControl((new Date()).toISOString());
  compid:any;
  closeResult: string;
  isLoggedin: boolean = false;
  setTimeStep:number = 0;
  ts_index:any;
  _id:any;
  account: any;
  project:any = [{Services:{
    stages:[{},{}]
  }}];
  time:object= [8,8.15,8.30,8.45,9,9.15,9.30,9.45,10,10.15,10.30,10.45,11,11.15,11.30,11.45,12,12.15,12.30,12.45,13,13.15,13.30,13.45,14,14.15,14.30,14.45,15,15.15,15.30,15.45,16,16.15,16.30,16.45,17,17.15,17.30,17.45,18];
  times:any = 
  {
    Date:"",
    hourly_ts:[],
    empUsername:""
  };
  ts1:any = [];
  ts:any = {
    hour:0,
    clientId:"",
    projectId:"",
    stageId:"",
    Details:""
  };
 client:any;
 sta_i:number = 0;
 proj_i:number = 0;
cli_i:number = 0;
 public clients;
  dialog_title:any;
  dialog_msg:any;
 

  constructor(
    private validateService: ValidateService, 
    private flashMessages:FlashMessagesService,
    private authService:AuthService,
     private router:Router,
     private modalService: NgbModal,
     private zone:NgZone, // <== added
     public dialog: MatDialog
  
  ) { }
  
  
  ngOnInit() {
    this.getDateToday();
    if(localStorage.getItem('isCompany') == 'true'){
      this.authService.getCompany().subscribe(profile => {
        this.account = profile.company;
        this.times.empUsername = this.account.empUsername;
        console.log(this.account);
        this.authService.getClients(this.account._id).subscribe(profile => {
          this.client = profile.client;
          console.log(this.client);
        
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
    else{
      this.authService.getProfile().subscribe(profile => {
        this.account = profile.employee;
        console.log("it has made it into auth.getprofile subscription"+JSON.stringify(profile));
        this._id = profile.employee._id;
        this.authService.getEmployeeTimesheets(this.account.empUsername).subscribe(data => {
          this.ts_ = data.timesheet;
          console.log(this.ts_);
          for(let i = 0; i<this.ts_.length;i++){
            console.log(this.ts_[i]);
            for(let j = 0; j<this.ts_[i].hourly_ts.length;j++){
              console.log(this.ts_[i].hourly_ts[j]);
             // if(this.validateService.isSameDay(new Date(),this.validateService.ObjIdtoDate(this.ts_[i].hourly_ts[j]._id))){
                this.ts_today.hourly_ts.push(this.ts_[i].hourly_ts[j]);

             // }
            }
          }
          

          this.authService.getProjectbyComp(this.account.compId).subscribe(data => {
            if(data.project.length===0)
              this.noProjects=true;
            else
              this.noProjects=false;

              console.log(this.noProjects);
          }, 
          err=>{

          });
        },
        err => {
          console.log(err);
          return false;
        });
        
        console.log(this.account.compId);
        this.authService.getClients(this.account.compId).subscribe(profile => {
          this.client = profile.client;
          console.log(this.client);
        
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
  }
  model: NgbDateStruct;
  isNoProject(){
    return this.noProjects;
  }
  checkhour(){
    console.log(this.times);
  }
  toTime(t){
   
    return parseFloat(t).toFixed(2);
  }
  
  selectToday() {
    this.model = {
      year: now.getFullYear(), 
      month: now.getMonth() + 1, 
      day: now.getDate(),
    };
  } 
  setDate(d,m,y) {
    this.model = {
      year: d, 
      month: m + 1, 
      day: y,
    };
  } 
  isWeekend(date: NgbDateStruct) {
    const d = new Date(date.year, date.month - 1, date.day);
    return d.getDay() === 0 || d.getDay() === 6;
  }
  isCompany(){
    if(localStorage.getItem('isCompany') == 'true')
      return true;
    else
      return false;
  }
  isEmpRelated(i){
  
    if(this.project[i].EmpInvolved != undefined){
      for(let j = 0; j<this.project[i].createdBy.length;j++){
        if(this.project[i].createdBy[j]===this.account.empUsername)
        {
      
          return false;
        }
      }
     
      
        for(let y=0;y<this.project[i].EmpInvolved.length;y++){
          if(this.project[i].EmpInvolved[y]===this.account.empUsername){
           
            return false;
          }
        }
      
     
      return true;
    }
    else{
      
      return true;
    }
      
  }
  saveTS(l){
    console.log(this.times);
    this.times.Date = this.getDateSubmit();
    // let d = new Date(l.value.date.year, l.value.date.month - 1, l.value.date.day);
    // console.log(d);
    // const ts = {
    //   empId:this._id,
    //   date:d,
    //   hours: new Array(l.value.day1,l.value.day2,l.value.day3,l.value.day4,l.value.day5,l.value.day6,l.value.day7),
    //   note:l.value.note,
    // }
    // console.log(ts);
    // // if(!this.validateService.ValidateCompRegister(company)){
    // //     console.log('Please fill in all fields');
    // //     this.flashMessages.show('Please fill in all the fields',{cssClass: 'alert-danger',timeout:3000});
    // // }

    

    
  
      this.authService.registerTimesheets(this.times).subscribe(data=>{
      
          console.log(data);
          this.flashMessages.show('You have added a new timesheet ',{cssClass: 'alert-success',timeout:3000});
          this.ngOnInit();
          this.times ={
            Date:"",
            hourly_ts:[],
            empUsername:""
          };
          this.ts_today = {
            hourly_ts:[]
          }
      }
      ,err=>{

        this.flashMessages.show(err,{cssClass: 'alert-danger',timeout:3000});
      });
    
    
  }
  removeTS(i){
  
    this.authService.removeTimesheet(this.ts_list.timesheet[i]).subscribe(data => {
      console.log(data.success);
      this.flashMessages.show(data.msg,{cssClass: 'alert-success',timeout:3000});
      this.ngOnInit();
    },
    err => {
      this.flashMessages.show('Something went wrong, timesheet did not remove. Please try again!',{cssClass: 'alert-danger',timeout:3000});
  
      return false;
  });
  }
  
  getTotalHrs(i){
    return this.ts_list.timesheet[i].hours[0] + this.ts_list.timesheet[i].hours[1] + this.ts_list.timesheet[i].hours[2] + this.ts_list.timesheet[i].hours[3] + this.ts_list.timesheet[i].hours[4] + this.ts_list.timesheet[i].hours[5] + this.ts_list.timesheet[i].hours[6];
  }

  onTimesheetUpdate(f){
    let d = new Date(f.value.dates.year, f.value.dates.month - 1, f.value.dates.day);
    
    
    
    const ts = {
      _id:    this.ts_list.timesheet[this.ts_index]._id,
      empId:  this._id,
      weekEnding:d,
      hours: new Array(f.value.upday1,f.value.upday2,f.value.upday3,f.value.upday4,f.value.upday5,f.value.upday6,f.value.upday7),
      note:f.value.note,
    }
    this.authService.updateTimesheet(ts).subscribe(data=>{
      if(data.success){
          
          this.flashMessages.show('You have update a new timesheet ',{cssClass: 'alert-success',timeout:3000});
          this.ngOnInit();
      }
      else {
       
        this.flashMessages.show('Something went wrong, timesheet did not update. Please try again!',{cssClass: 'alert-danger',timeout:3000});
      }
    });
  }
  addTS(){
    if(this.ts.clientId==""||this.ts.hour==""||this.ts.projectId==""||this.ts.stageId==""||this.ts.Details==""){
      this.flashMessages.show('You have not fully filled out the timesheet logger! Please fill all areas to submit.',{cssClass: 'alert-danger',timeout:3000});
      return;
    }
    
 
    console.log(this.project[this.proj_i].Services.stages[this.sta_i]._id);
    let d = {
      
      hour:this.ts.hour,
      client:{clId:this.client[this.cli_i]._id,clTitle:this.ts.clientId},
      project:{prId:this.project[this.proj_i]._id,prTitle:this.ts.projectId},
      stage:{stId:this.project[this.proj_i].Services.stages[this.sta_i]._id,stTitle:this.ts.stageId},
      Details:this.ts.Details,
      empUsername:this.account.empUsername,
      date:this.date
    }
 
    let flag = false;
    console.log(this.ts_today);
    for(let i = 0; i< this.ts_today.hourly_ts.length;i++){

      if(this.ts_today.hourly_ts[i].hour==d.hour && this.validateService.isSameDay(new Date(this.ts_today.hourly_ts[i].date),d.date) ===true){
        flag=true;
      }

    }
    
    for(let i = 0; i< this.times.hourly_ts.length;i++){

      if(
        this.times.hourly_ts.length>=0
        &&this.times.hourly_ts[i].hour==d.hour
        &&this.times.hourly_ts[i].empUsername == this.account.empUsername 
        && this.validateService.isSameDay(this.times.hourly_ts[i].date,this.date)===true
      ){
        flag=true;
       
      }

    }
   // console.log(this.times.hourly_ts[i].hour);
    if(flag===false)
      this.times.hourly_ts.push(d);
    else
      this.flashMessages.show('You have already entered in work for this hour.',{cssClass: 'alert-danger',timeout:3000});

  }
  upProInd(i){
    this.proj_i=i.target.selectedIndex-1;

  }
  upCliInd(i){
    this.cli_i= i.target.selectedIndex-1;
  
  }
  upStaInd(i){
    this.sta_i =i.target.selectedIndex-1;
  
  }
  toggleNewTimesheetModal(){
    if(document.getElementById("addTimesheetForm").style.opacity == "1"){ 
      document.getElementById("addTimesheetForm").style.opacity = "0";
      document.getElementById("addTimesheetForm").style.display = "none";
      }
    else 
    {
      document.getElementById("addTimesheetForm").style.display = "block";
      document.getElementById("addTimesheetForm").style.opacity = "1";
    }
  }



  toggleUpdateTimesheetModal(i){
    this.ts_index = i;
    if(document.getElementById("updateTimesheetForm").style.opacity == "1"){ 
      document.getElementById("updateTimesheetForm").style.opacity = "0";
      document.getElementById("updateTimesheetForm").style.display = "none";
      }
    else 
    {

      // this.model = {
      //   year: new Date(this.ts_list.timesheet[this.ts_index].weekEnding).getFullYear, 
      //   month: new Date(this.ts_list.timesheet[this.ts_index].weekEnding).getMonth, 
      //   day: new Date(this.ts_list.timesheet[this.ts_index].weekEnding).getDate,
      // };
    
      let d = this.ts_list.timesheet[i].weekEnding.split("/");
      this.setDate(d[0],d[1], d[2]);

      document.getElementById("updateTimesheetForm").style.display = "block";
      document.getElementById("updateTimesheetForm").style.opacity = "1";
    }
  }

  disabled (date,mode){
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 1 ||  date.getDay() === 2 || date.getDay() === 3 || date.getDay() === 4 || date.getDay() === 5));
  }

  checkProj(i){
    if(this.times.hourly_ts[i].projectId =="" || this.times.hourly_ts[i].projectId ==null || this.times.hourly_ts[i].projectId ==undefined || this.times.hourly_ts[i].projectId =="0"){
      return true;
    }else{
      return false;
    }
  }
  checkCli(i){
    if(this.times.hourly_ts[i].clientId =="" || this.times.hourly_ts[i].clientId ==null || this.times.hourly_ts[i].clientId ==undefined || this.times.hourly_ts[i].clientId =="0"){
      return true;
    }else{
      return false;
    }
  }


toggleStaFlag(i){
  this.sta_i = i.target.selectedIndex-1;

}
getDateSubmit(){
  let today = new Date();
//  let date = new Date(today.getFullYear(),today.getMonth(),today.getDay(),0,0,0);
  today.setHours(0);
  today.setMinutes(0);
  today.setMilliseconds(0);
  return today;
}

getDateToday(){
  let today = new Date();
  
//  let date = new Date(today.getFullYear(),today.getMonth(),today.getDay(),0,0,0);
  today.setHours(0);
  today.setMinutes(0);
  today.setMilliseconds(0);
  this.date=today;
  //return today.toDateString();
}
maxDayDiff(){
  let today = new Date();
  today.setHours(0);
  today.setMinutes(0);
  today.setMilliseconds(0);

  if(this.datediff(this.date,today)>14)
    return true;
  else 
    return false;
}

getProj(i){

  this.cli_i =i.target.selectedIndex-1;

  this.authService.getProjectsbyClient(this.client[this.cli_i]._id).subscribe(profile => {
    this.project=profile.project;

    	console.log(this.project)
  
  },
  err => {

    return false;
  });
}
viewTS(i){
  console.log(i);
  this.router.navigate(['/timesheets',i.value.selProject])
}
  viewDateTS(){
    this.router.navigate(['/tsbydate'])
  }

  parseDate(str) {
    var mdy = str.split('/');
    return new Date(mdy[2], mdy[0]-1, mdy[1]);
  }

  datediff(first, second) {
    // Take the difference between the dates and divide by milliseconds per day.
    // Round to nearest whole number to deal with DST.
    return Math.round((second-first)/(1000*60*60*24));
  }
  nextDay(){
    let today =new Date();
    let temp = new Date(this.date.getFullYear(),this.date.getMonth(),this.date.getDate(),0,0,0);
    temp.setDate(temp.getDate()+1);

    if(new Date(temp)< new Date(today) )
       this.date.setDate(this.date.getDate()+1)
     else
       this.flashMessages.show("You can go to date that hasn't happened yet",{cssClass: 'alert-danger',timeout:3000});


  }
  viewEmpTS(i){
    console.log(i);
    this.router.navigate(['/timesheets',i.value.selEmployee])
  }

  previousDay(){
    
    this.date.setDate(this.date.getDate()-1);
 
  }
  updateDateTS(i){
   
        if(this.validateService.isSameDay(this.date,new Date(this.ts_today.hourly_ts[i].date)))
          return true;
        else
          return false;
      }
  displayDate(){
    return this.date.toDateString();
  }
  changeIdtoDate(t){
 
   let date = this.validateService.ObjIdtoDate(t);
   return date.toDateString();
   
  }
  addTSType(){
    if(this.ts.entryType==""||this.ts.hour==""||this.ts.Details==""){
      this.flashMessages.show('You have not fully filled out the timesheet logger! Please fill all areas to submit.',{cssClass: 'alert-danger',timeout:3000});
      return;
    }
    
 
    console.log(this.project[this.proj_i].Services.stages[this.sta_i]._id);
    let d = {
      
      hour:this.ts.hour,
      entryType:this.ts.entryType,
      Details:this.ts.Details,
      empUsername:this.account.empUsername,
      date:this.date
    }
 
    let flag = false;
    console.log(this.ts_today);
    for(let i = 0; i< this.ts_today.hourly_ts.length;i++){

      if(this.ts_today.hourly_ts[i].hour==d.hour && this.validateService.isSameDay(new Date(this.ts_today.hourly_ts[i].date),d.date) ===true){
        flag=true;
      }

    }
    
    for(let i = 0; i< this.times.hourly_ts.length;i++){

      if(
        this.times.hourly_ts.length>=0
        &&this.times.hourly_ts[i].hour==d.hour
        &&this.times.hourly_ts[i].empUsername == this.account.empUsername 
        && this.validateService.isSameDay(this.times.hourly_ts[i].date,this.date)===true
      ){
        flag=true;
       
      }

    }
   // console.log(this.times.hourly_ts[i].hour);
    if(flag===false)
      this.times.hourly_ts.push(d);
    else
      this.flashMessages.show('You have already entered in work for this hour.',{cssClass: 'alert-danger',timeout:3000});

  }
}

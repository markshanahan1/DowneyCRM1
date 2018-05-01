import { Component, OnInit, Inject,NgZone } from '@angular/core';
import {ValidateService} from '../../../services/validate.service'
import {AuthService} from '../../../services/auth.service'
import {FlashMessagesService} from 'angular2-flash-messages';
import { Observable } from 'rxjs/Observable';
import { Router,ActivatedRoute } from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { DatetimePopupModule } from 'ngx-bootstrap-datetime-popup';
import { NgbDateStruct }      from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {ConfirmationDialogComponent} from '../../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-view-timesheet',
  templateUrl: './view-timesheet.component.html',
  styleUrls: ['./view-timesheet.component.css'],
  providers: [
    { provide: 'Window',  useValue: window }
  ]
})
export class ViewTimesheetComponent implements OnInit {

  constructor(
    @Inject('Window') private window: Window,
    private validateService: ValidateService, 
    private flashMessages:FlashMessagesService,
    private authService:AuthService,
     private router:Router,
     private route:ActivatedRoute,
     private modalService: NgbModal,
     private zone:NgZone, // <== added
     public dialog: MatDialog
  ) { }

  project:any = {Services:{
    stages:[{},{}]
  }};
  account:any;
  ts:any;
  ts_budget:any =[];
  ts_stages:any=[];
  ngOnInit() {
    if(localStorage.getItem('isCompany')=="true"){
      this.authService.getCompany().subscribe(data => {
        for(let i = 0; i > data.company.employees.length;i++){
          if(data.company.employees[i]._id==this.route.snapshot.params['id']){
            this.account = data.company.employees[i];
          }
        }
        this.authService.getProjectbyId(this.route.snapshot.params['id']).subscribe(profile => {
          this.project = profile.project[0];
       //   console.log(this.project);
         
          this.authService.getBudgetTimesheets(this.project._id).subscribe(data => {
            this.ts = data.timesheet;
        //    console.log(this.ts);
  
  
              //looping through stages of services 
              for (let i = 0; i<this.project.Services.stages.length;i++){
                let tsi=0;
                let arr=[];
            //    console.log('it got in');
                //looping through the array of timesheet days
                for (let j = 0; j<this.ts.length;j++){
              //    console.log(this.ts[j]);
                  //looping through the array of timesheet hours
                  for (let k = 0; k<this.ts[j].hourly_ts.length;k++){
                //    console.log(this.project.Services.stages[i]._id +"////"+this.ts[j].hourly_ts[k].stage.stId);
                    if(this.project.Services.stages[i]._id === this.ts[j].hourly_ts[k].stage.stId){
                      tsi++;
                      arr.push(
                       this.ts[j].hourly_ts[k]
                      );
                //      console.log("arr: "+arr);
                    }
                  }
                 
                }
                this.ts_stages.push(arr);
           //     console.log(this.ts_stages); 
                tsi=tsi * parseFloat(this.account.empHrRate);
           //     console.log(tsi)
                this.ts_budget.push(tsi);
              }
            
            
     //       console.log(this.ts_budget);
          },
          err => {
    //        console.log(err);
            
            return false;
          });
          
      },
      err => {
     //   console.log(err);
        this.router.navigate(['/timesheets']);
        return false;
      });
      });
    }
    else
    {
      this.authService.getProfile().subscribe(data => {
      this.account = data.employee;
   //   console.log(this.route.snapshot.params['id']);
      
      this.authService.getProjectbyId(this.route.snapshot.params['id']).subscribe(profile => {
        this.project = profile.project[0];
     //   console.log(this.project);
       
        this.authService.getBudgetTimesheets(this.project._id).subscribe(data => {
          this.ts = data.timesheet;
      //    console.log(this.ts);


            //looping through stages of services 
            for (let i = 0; i<this.project.Services.stages.length;i++){
              let tsi=0;
              let arr=[];
          //    console.log('it got in');
              //looping through the array of timesheet days
              for (let j = 0; j<this.ts.length;j++){
            //    console.log(this.ts[j]);
                //looping through the array of timesheet hours
                for (let k = 0; k<this.ts[j].hourly_ts.length;k++){
              //    console.log(this.project.Services.stages[i]._id +"////"+this.ts[j].hourly_ts[k].stage.stId);
                  if(this.project.Services.stages[i]._id === this.ts[j].hourly_ts[k].stage.stId){
                    tsi++;
                    arr.push(
                     this.ts[j].hourly_ts[k]
                    );
              //      console.log("arr: "+arr);
                  }
                }
               
              }
              this.ts_stages.push(arr);
         //     console.log(this.ts_stages); 
              tsi=tsi * parseFloat(this.account.empHrRate);
         //     console.log(tsi)
              this.ts_budget.push(tsi);
            }
          
          
   //       console.log(this.ts_budget);
        },
        err => {
  //        console.log(err);
          
          return false;
        });
        
    },
    err => {
   //   console.log(err);
      this.router.navigate(['/timesheets']);
      return false;
    });
    },
    err => {
  //    console.log(err);
      
      return false;
    });}
  }
  budgetIndicator(i){
  //  console.log("index:"+i+"\n budget[i]:"+this.ts_budget[i]+"\n STAGE-BUDGET: "+this.project.Services.stages[i].budget)
    let budget_perc = (this.ts_budget[i]/this.project.Services.stages[i].budget) *100;
   // console.log(budget_perc);
    if(budget_perc >95){
     return 'red';
    }
    else if(budget_perc >80){
      return 'yellow'
   }
   else{
     return 'green';
   }
   }

   changeIdtoDate(t){
   
    return new Date(t).toDateString();
    
   }
   isUserLead(){
    let flag =false;
    for(let i=0;i<=this.project.createdBy.length;i++) 
    {    
        
      if(this.account.empUsername === this.project.createdBy[i] ){
        flag= true;
      }
     
    }
    if(flag)
      return true;
    else 
      return false;
  }
}

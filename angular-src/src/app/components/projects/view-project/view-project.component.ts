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

// import * as jsPDF from 'jspdf';
declare let jsPDF;
const now = new Date();
@Component({
  selector: 'app-view-project',
  templateUrl: './view-project.component.html',
  styleUrls: ['./view-project.component.css'],
  providers: [
    { provide: 'Window',  useValue: window }
  ]
})
export class ViewProjectComponent implements OnInit {
  public date = new FormControl(new Date());
    serializedDate = new FormControl((new Date()).toISOString());
  id:any;
  selEmployee:any;
  dialog_title:any='';
  dialog_msg:any;
timesheets:any;
  client:any;
  index_h:any=0;
  project:any ;
  ts:any;
  public upBudget:number = 0.00;
  account:any;
  ts_budget:any =[];
    stage_i:any=0;
  service_i:any =0;
  public upFee = 0.00;
  public upNote = 'No Notes Yet';
  public todayDate:boolean = true;
  updateflag:Boolean=false;
  	employees:any;
  empList:String[];
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

  ngOnInit() {
    if(localStorage.getItem('isCompany') == 'true'){
      this.authService.getCompany().subscribe(data => {
        this.account = data.company;
        this.authService.getProjectbyId(this.route.snapshot.params['id']).subscribe(profile => {
          this.project = profile.project[0];
         
          for(let i = 0;i<this.account.employees.length;i++){
            if(this.account.employees[i].empUsername == this.project.createdBy){
              this.selEmployee=this.account.employees[i];
           //   console.log(this.selEmployee);
            }
          }
          this.employees=this.account.employees;
         // console.log(this.project);
          this.project.projectProgress=this.project.projectProgress.toFixed(2);
          //GETTING CLIENT INFORMATION
          document.getElementById('progressBar').style.width =this.project.projectProgress+'%';
          
          this.authService.getClientbyId(this.project.clientId).subscribe(client => {
            this.client = client.client;
         //   console.log(this.client);
            for(let i = 0 ; i<this.employees.length;i++){
              if(this.selEmployee.empUsername === this.employees[i].empUsername ){
                this.employees.splice(i, 1);
              }
            //  console.log(this.project);
             
            }
            this.authService.getBudgetTimesheets(this.project._id).subscribe(data => {
              this.ts = data.timesheet;
            
              if(this.timesheets !== null || this.timesheets !== undefined){
                for (let i = 0; i<this.project.Services.stages.length;i++){
                  let tsi=0;
                  for (let j = 0; j<this.ts.length;j++){
                  
                    //looping through the array of timesheet hours
                    for (let k = 0; k<this.ts[j].hourly_ts.length;k++){
                    
                      if(this.project.Services.stages[i]._id === this.ts[j].hourly_ts[k].stage.stId){
                        tsi+=15;
                       
                      
                      }
                    }
                   
                  }
                 
                 
                  tsi=(tsi/60) * parseFloat(this.account.empHrRate);
               //   console.log(tsi)
                  this.ts_budget.push(tsi);
                }
              }
            //  console.log(this.ts_budget);
            },
            err => {
           //   console.log(err);
              
              return false;
            });
          },
          err => {
        //    console.log(err);
            
            return false;
          });
     //   console.log(this.employees);
       
      },err=>{

      });
      },
      err=>{

      });
    }
    else{
      this.authService.getProfile().subscribe(data => {
      this.account = data.employee;
      
      this.authService.getCompanybyEmpId(this.account.compId).subscribe(data=>{
        this.employees = data.company;
        this.authService.getProjectbyId(this.route.snapshot.params['id']).subscribe(profile => {
          this.project = profile.project[0];
       //   console.log(this.project);
          this.project.projectProgress=this.project.projectProgress.toFixed(2);
          //GETTING CLIENT INFORMATION
          document.getElementById('progressBar').style.width =this.project.projectProgress+'%';
          
          this.authService.getClientbyId(this.project.clientId).subscribe(client => {
            this.client = client.client;
        //    console.log(this.client);
            for(let i = 0 ; i<this.employees.length;i++){
              if(this.account.empUsername === this.employees[i].empUsername ){
                this.employees.splice(i, 1);
              }
        //      console.log(this.project);
             
            }
            this.authService.getBudgetTimesheets(this.project._id).subscribe(data => {
              this.ts = data.timesheet;
            
              if(this.timesheets !== null || this.timesheets !== undefined){
                for (let i = 0; i<this.project.Services.stages.length;i++){
                  let tsi=0;
                  for (let j = 0; j<this.ts.length;j++){
                  
                    //looping through the array of timesheet hours
                    for (let k = 0; k<this.ts[j].hourly_ts.length;k++){
                    
                      if(this.project.Services.stages[i]._id === this.ts[j].hourly_ts[k].stage.stId){
                        tsi+=15;
                       
                      
                      }
                    }
                   
                  }
                 
                 
                  tsi=(tsi/60) * parseFloat(this.account.empHrRate);
            //      console.log(tsi)
                  this.ts_budget.push(tsi);
                }
              }
          //    console.log(this.ts_budget);
            },
            err => {
        //      console.log(err);
              
              return false;
            });
          },
          err => {
       //     console.log(err);
            
            return false;
          });
    //    console.log(this.employees);
       
      },err=>{

      });
      
        
        
    },
    err => {
  //    console.log(err);
      this.router.navigate(['/projects']);
      return false;
    });
    },
    err => {
  //    console.log(err);
      
      return false;
    });
   // if(this.route.snapshot.params['id']!=undefined){
      
  //}
  // else{
  //   this.router.navigate(['/projects']);
  // }
    }
    
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
  calcTotalBudget(){
    let totBudget=0;
    for(let i = 0; i<this.project.Services.stages.length;i++){
        totBudget+= this.project.Services.stages[i].budget;
    }
    return totBudget;
  }
  checkStageComplete(){
    
       
  }
  updateProgress(){
 //   console.log(this.project.Services);
    let totServices=0,completeServices=0,projectCompletion=0;
    for(let i = 1;i<this.project.Services.stages.length;i++){
      
      for(let k = 0;k<this.project.Services.stages[i].services.length;k++){
        if(this.project.Services.stages[i].services[k].isActive){
          totServices++;
        }
        if(this.project.Services.stages[i].services[k].complete){
          completeServices++;
        }

      }

    }
    this.checkStageComplete();
    projectCompletion=(completeServices/totServices)*100;
  //  console.log(projectCompletion+"% is the current completion percentage");
    
    this.project.projectProgress = projectCompletion;
  //  console.log(this.project.projectProgress+"% is the current completion percentage");

    this.authService.updateProject(this.project).subscribe(data => {
      this.project = data.project;
   
      this.flashMessages.show('Update was successful!',{cssClass: 'alert-success',timeout:3000});
    this.ngOnInit();
    },
    err => {
  //    console.log(err);
      this.flashMessages.show('Update was not successful!',{cssClass: 'alert-danger',timeout:3000});
      return false;
    });
  }
  model: NgbDateStruct;

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
  getStageBudget(i){
    console.log("€"+this.ts_budget[i].toFixed(2)+" / €"+this.project.Services.stages[i].budget.toFixed(2));
    return "€"+this.ts_budget[i].toFixed(2)+" / €"+this.project.Services.stages[i].budget.toFixed(2);
  }
  onServicesChange(){
 //   console.log('fff');
    let projCompletion=0;
    for(let i = 0;i<this.project.Services.stages.length;i++){
      let totServices=0,completeServices=0,projectCompletion=0;
      for(let k = 0;k<this.project.Services.stages[i].services.length;k++){
        if(this.project.Services.stages[i].services[k].isActive){
          totServices++;
        }
        if(this.project.Services.stages[i].services[k].complete){
          completeServices++;
        }

      }
      
      if(this.project.Services.stages[i].completed){
        projCompletion++;
      }

      if(totServices===completeServices)
        this.project.Services.stages[i].completed=true;
      else{
        this.project.Services.stages[i].completed=false;
      }
    } 
    if( this.project.projectProgress==100.00){
      this.project.projectComplete=true;
      this.project.projectCompletionDate = new Date();
    }
    else{
      this.project.projectComplete=false;
      this.project.projectCompletionDate = null;
    }
    
   // console.log(this.project);
    this.updateflag =true;
  }
  addEmpToProj(j){
    let f = false;
    for(let i = 0; i< this.project.EmpInvolved.length;i++){
      if(j.value.employee==this.project.EmpInvolved[i]){
        f=true;
      }
    }
    if(!f)
      this.project.EmpInvolved.push(j.value.employee);
    else{
      this.flashMessages.show('employee already in list',{cssClass: 'alert-danger',timeout:3000});

    }
  //  console.log(this.project);
    this.updateflag=true;
  }
  addProjLead(j){
    let f = false;
    for(let i = 0; i< this.project.createdBy.length;i++){
      if(j.value.employee==this.project.createdBy[i]){
        f=true;
      }
    }
    if(!f)
      this.project.createdBy.push(j.value.employee);
    else{
      this.flashMessages.show('employee already in list',{cssClass: 'alert-danger',timeout:3000});

    }
  //  console.log(this.project);
    this.updateflag=true;
  }
  budgetIndicator(i){
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
  updateFee(f){
    this.project.Services.stages[this.stage_i].services[this.service_i].fee = f.value.upFee;
    //console.log(this.project.Services.stages[this.stage_i].services[this.service_i].fee);
    this.updateflag =true;

    this.closeModal();
  }
  updateNote(f){
    this.project.Services.stages[this.stage_i].services[this.service_i].notes = f.value.upNote;
    console.log(this.project.Services.stages[this.stage_i].services[this.service_i].notes);
    this.updateflag =true;

    this.closeModal();
  }
  toggleFeeBtn(stage_i,service_i){
    this.stage_i = stage_i;
    this.service_i = service_i;
    this.dialog_title = this.getTitleforService();
    if(document.getElementById("ModalBoxFee").style.opacity == "1"){ 
      document.getElementById("ModalBoxFee").style.opacity = "0";
      document.getElementById("ModalBoxFee").style.display = "none";
      }
    else 
    {
      this.upFee=this.project.Services.stages[this.stage_i].services[this.service_i].fee;
    //  console.log(this.upFee);
    //  console.log("-----------------------------");
    //  console.log(this.project.Services.stages[this.stage_i].services[this.service_i].fee);
      document.getElementById("ModalBoxFee").style.display = "block";
      document.getElementById("ModalBoxFee").style.opacity = "1";
    }
  }
  getTitleforService(){
    return this.project.Services.stages[this.stage_i].services[this.service_i].title;
  }
  toggleNoteBtn(stage_i,service_i){
    this.stage_i = stage_i;
    this.service_i = service_i;
    this.dialog_title = this.getTitleforService();
    if(document.getElementById("ModalBoxNote").style.opacity == "1"){ 
      document.getElementById("ModalBoxNote").style.opacity = "0";
      document.getElementById("ModalBoxNote").style.display = "none";
      }
    else 
    {
      this.upNote=this.project.Services.stages[this.stage_i].services[this.service_i].notes;
      document.getElementById("ModalBoxNote").style.display = "block";
      document.getElementById("ModalBoxNote").style.opacity = "1";
    }
  }
  closeModal(){
    document.getElementById("ModalBoxFee").style.opacity = "0";
    document.getElementById("ModalBoxFee").style.display = "none";
    document.getElementById("ModalBoxNote").style.opacity = "0";
    document.getElementById("ModalBoxNote").style.display = "none";
    document.getElementById("addEmployeeForm").style.opacity = "0";
    document.getElementById("addEmployeeForm").style.display = "none";
    document.getElementById("BudgetModal").style.opacity = "0";
    document.getElementById("BudgetModal").style.display = "none";
    document.getElementById("addLeadForm").style.opacity = "0";
    document.getElementById("addLeadForm").style.display = "none";
  }

  genInvoice() {
    setTimeout(3000);
    let p = this.client;
    let doc = new jsPDF('p', 'pt');
  
    let res = doc.autoTableHtmlToJson(document.getElementById("basic-table"));
 
    let pos=50;
    let header = function(data) {
      doc.setFontSize(28);
      doc.setTextColor(40);
      doc.setFontStyle('normal');
//      doc.addImage('../../../../assets/images/logo_smalll_white.png', 'png', data.settings.margin.left, 20, 50, 50);
      doc.text("Client Invoice", data.settings.margin.left, pos);
      doc.setFontSize(10);
      doc.text("Date: "+ new Date().toString(), data.settings.margin.left, pos+15);
      doc.setFontSize(14);

     
  
      doc.text("Downey Planning And Architecture", data.settings.margin.left, pos+30);
      

      doc.text("1 Westland Square,", data.settings.margin.left, pos+45);
      doc.text("Pearse Street,", data.settings.margin.left, pos+60);
      doc.text("Co. Dublin.", data.settings.margin.left, pos+75);
      doc.setFontSize(20);
      doc.text("BILLING TO", data.settings.margin.left, pos+115);
      doc.setFontSize(14);
      doc.text(p.Name, data.settings.margin.left, pos+130);
     let gg:String = p.Address;

     let ss = gg.split(',');
      let dr = 20;
      for(let i = 0; i < ss.length;i++){
        doc.text(ss[i]+',', data.settings.margin.left, pos+130 + dr);
        dr+=20;
      }
    };
  
    let options = {
      beforePageContent: header,
      margin: {
        top: 250
      },
      startY: doc.autoTableEndPosY() + 260
    };
    let td = new Date();
    let dd = td.getDate();
    let mm = td.getMonth();
    let yy = td.getFullYear();
    doc.autoTable(res.columns, res.data, options);
    doc.text("Client Signature", 40, doc.autoTableEndPosY() + 40);
    doc.text("____________________________", 40, doc.autoTableEndPosY() + 60);
    doc.save("invoice_"+dd+"_"+(mm+1)+"_"+yy+".pdf",(err,callback)=>{
        if (err) throw err;
        console.log(callback);
    });
  }
  genEstimate() {
    setTimeout(3000);
    let p = this.client;
    let doc = new jsPDF('p', 'pt');
  
    let res = doc.autoTableHtmlToJson(document.getElementById("basic-table"));
 
    let pos=50;
    let header = function(data) {
      doc.setFontSize(28);
      doc.setTextColor(40);
      doc.setFontStyle('normal');
//      doc.addImage('../../../../assets/images/logo_smalll_white.png', 'png', data.settings.margin.left, 20, 50, 50);
      doc.text("Client Estimate", data.settings.margin.left, pos);
      doc.setFontSize(10);
      doc.text("Date: "+ new Date().toString(), data.settings.margin.left, pos+15);
      doc.setFontSize(14);

     
  
      doc.text("Downey Planning And Architecture", data.settings.margin.left, pos+30);
      

      doc.text("1 Westland Square,", data.settings.margin.left, pos+45);
      doc.text("Pearse Street,", data.settings.margin.left, pos+60);
      doc.text("Co. Dublin.", data.settings.margin.left, pos+75);
      doc.setFontSize(20);
      doc.text("BILLING TO", data.settings.margin.left, pos+115);
      doc.setFontSize(14);
      doc.text(p.Name, data.settings.margin.left, pos+130);
     let gg:String = p.Address;

     let ss = gg.split(',');
      let dr = 20;
      for(let i = 0; i < ss.length;i++){
        doc.text(ss[i]+',', data.settings.margin.left, pos+130 + dr);
        dr+=20;
      }
    };
  
    let options = {
      beforePageContent: header,
      margin: {
        top: 250
      },
      startY: doc.autoTableEndPosY() + 260
    };
    let td = new Date();
    let dd = td.getDate();
    let mm = td.getMonth();
    let yy = td.getFullYear();
    doc.autoTable(res.columns, res.data, options);
    doc.text("Client Signature", 40, doc.autoTableEndPosY() + 40);
    doc.text("____________________________", 40, doc.autoTableEndPosY() + 60);
    doc.save("estimate_"+dd+"_"+(mm+1)+"_"+yy+".pdf",(err,callback)=>{
        if (err) throw err;
        console.log(callback);
    });
  }
  toggleBudgetModal(stage_i){
    this.stage_i = stage_i;

    if(document.getElementById("BudgetModal").style.opacity == "1"){ 
      document.getElementById("BudgetModal").style.opacity = "0";
      document.getElementById("BudgetModal").style.display = "none";
      }
    else 
    {
      this.upBudget=this.project.Services.stages[this.stage_i].budget;
      document.getElementById("BudgetModal").style.display = "block";
      document.getElementById("BudgetModal").style.opacity = "1";
    }
  }
  toggleEmployeeModal(){
    

    if(document.getElementById("addEmployeeForm").style.opacity == "1"){ 
      document.getElementById("addEmployeeForm").style.opacity = "0";
      document.getElementById("addEmployeeForm").style.display = "none";
      }
    else 
    {

      document.getElementById("addEmployeeForm").style.display = "block";
      document.getElementById("addEmployeeForm").style.opacity = "1";
    }
  }
  toggleLeadModal(){
    

    if(document.getElementById("addLeadForm").style.opacity == "1"){ 
      document.getElementById("addLeadForm").style.opacity = "0";
      document.getElementById("addLeadForm").style.display = "none";
      }
    else 
    {

      document.getElementById("addLeadForm").style.display = "block";
      document.getElementById("addLeadForm").style.opacity = "1";
    }
  }
  toggleNewTimesheetModal(){
    this.router.navigate(['timesheets']);
  }
  onBudgetSubmit(l){
    this.project.Services.stages[this.stage_i].budget = this.upBudget;
    this.updateflag =true;
    this.closeModal();

    // this.authService.updateProject(this.project).subscribe(data=>{
    //   if(data.success){
          
    //       console.log(data);
    //       this.flashMessages.show('You have added a new timesheet ',{cssClass: 'alert-success',timeout:3000});
    //       this.ngOnInit();
    //   }
    //   else {
    //     console.log(data);
    //     this.flashMessages.show(data,{cssClass: 'alert-danger',timeout:3000});

    //   }
    // });
   // console.log(l.value);
  
  }
  onTimesheetSubmit(l){
    let emp;
    this.authService.getProfile().subscribe(data => {
      emp = data.employee;
  //    console.log(emp);
      let d;
    if(l.value.todayDate){
      d = new Date();
    }
    else{
      d = new Date(l.value.date.year, l.value.date.month - 1, l.value.date.day);
    }
  //  console.log(d);
    const ts = {
      empUsername:emp.empUsername,
      projectId:this.project._id,
      clientId:this.client._id,
      stageId: this.project.Services.stages[this.index_h]._id,
      date:d,
      timeSpent:l.value.time,
      note:l.value.note,
    }
 //   console.log(ts);

    this.authService.registerTimesheets(ts).subscribe(data=>{
      if(data.success){
          
 //         console.log(data);
          this.flashMessages.show('You have added a new timesheet ',{cssClass: 'alert-success',timeout:3000});
          this.ngOnInit();
      }
      else {
  //      console.log(data);
        this.flashMessages.show(data,{cssClass: 'alert-danger',timeout:3000});

      }
    });
    },
    err => {
 //     console.log(err);
      
      return false;
    });
 //   console.log(l.value);
    
  }
}

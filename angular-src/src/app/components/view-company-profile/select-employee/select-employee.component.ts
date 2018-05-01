import { Component, OnInit } from '@angular/core';
import {ValidateService} from '../../../services/validate.service'
import {AuthService} from '../../../services/auth.service'
import {FlashMessagesService} from 'angular2-flash-messages';
import { Observable } from 'rxjs/Observable';
import { Router, RouterModule,ActivatedRoute } from '@angular/router';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
} from '@angular/material';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { Directive } from '@angular/core';

@Component({
  selector: 'app-select-employee',
  templateUrl: './select-employee.component.html',
  providers: [AuthService],
  styleUrls: ['./select-employee.component.css']
})
export class SelectEmployeeComponent implements OnInit {
  account:any;
  editMode:boolean=false;
  edited:boolean=false;
  updateFlag:boolean=false;
  public fullname:string;
  public ememail:string;
  public emposition:string;
  public empPhone:string;
  public empHrRate:string;
  public dob:string;
  compId:any;
  constructor(
    private validateService: ValidateService, 
    private flashMessages:FlashMessagesService,
    private authService:AuthService,
    private route:ActivatedRoute,
     private router:Router
  ) { }

  ngOnInit() {

    this.authService.getCompany().subscribe(profile => {
      for(let i = 0; i<profile.company.employees.length;i++){
        if(this.route.snapshot.params['id'] === profile.company.employees[i]._id)
          this.account=profile.company.employees[i];
         
      }
      this.compId = profile.company._id;
      console.log(this.account);
    },
    err => {
      console.log(err);
      return false;
    });
  }
  EditUser(){
    this.editMode=!this.editMode;
    console.log(this.editMode);
  }
  onEmployeeUpdate(i){
    let update = {
      compId:this.compId,
      emp:this.account
    }
    this.authService.updateEmployee(update).subscribe(data => {
      this.flashMessages.show('Your employee is now updated! ',{cssClass: 'alert-success',timeout:3000});
      this.ngOnInit();
      this.editMode=false;
    },
    err => {
      console.log(err);
      this.flashMessages.show('Your employee was not updated! ',{cssClass: 'alert-danger',timeout:3000});
      
      return false;
    });
  }
  checkPass(f){
  
    if(!this.validateService.ValidatePassword(f)){

      return '2px solid red'
    }
    else{
     
      return '2px solid green'
    }
  }
  checkEmail(f){
  
    if(!this.validateService.ValidateEmail(f)){

      return '2px solid red'
    }
    else{
     
      return '2px solid green'
    }
  }
  checkInput(f){
  
    if(!this.validateService.ValidateInput(f)){

      return '2px solid red'
    }
    else{
     
      return '2px solid green'
    }
  }
  checkDOB(f){
  
    if( this.validateService.dobFormat(f)){

      return '2px solid red'
    }
    else{
     
      return '2px solid green'
    }
  }
}

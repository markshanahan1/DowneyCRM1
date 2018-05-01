import { Component, OnInit } from '@angular/core';
import {ValidateService} from '../../services/validate.service'
import {AuthService} from '../../services/auth.service'
import {FlashMessagesService} from 'angular2-flash-messages';
import { Observable } from 'rxjs/Observable';
import { Router, RouterModule } from '@angular/router';
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
  selector: 'app-view-employee-profile',
  templateUrl: './view-employee-profile.component.html',

  providers: [AuthService],
  styleUrls: ['./view-employee-profile.component.css'],
  
})
@Directive({
  selector: '[TAB_COMPONENTS]'
})
export class ViewEmployeeProfileComponent implements OnInit {
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
  constructor(
    private validateService: ValidateService, 
    private flashMessages:FlashMessagesService,
    private authService:AuthService,
     private router:Router
  ) { }

  ngOnInit() {

    this.authService.getProfile().subscribe(profile => {
      this.account = profile.employee;
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
    let error_flag=false;
    let update = {
      compId:this.account.compId,
      emp:this.account
    }
    if(!this.validateService.ValidateEmployee(update.emp)){
      console.log('Please fill in all fields');
      this.flashMessages.show('Please fill in all the fields',{cssClass: 'alert-danger',timeout:3000});
      error_flag=true;
    }
    
    if(!this.validateService.ValidateEmail(update.emp.empEmail)){
      console.log('Please fill in valid Email Address');
      this.flashMessages.show('Please enter valid Email Address',{cssClass: 'alert-danger',timeout:3000});
      error_flag=true;
    }
    if(!this.validateService.dobFormat(update.emp.empDob)){
      console.log('Please correctly input you Date of birth');
      this.flashMessages.show('Please enter valid Email Address',{cssClass: 'alert-danger',timeout:3000});
      error_flag=true;
    }
  
    if(!this.validateService.ValidatePassword(update.emp.empPassword)){
      console.log('Please use a valid Password');
        this.flashMessages.show('Please use a valid Password - Mixed use of UPPER CASE, LOWER CASE & NUMBERS',{cssClass: 'alert-danger',timeout:3000});
        error_flag=true;
      }
    
    if(error_flag==false)
    {  
    console.log();
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
    console.log(f);
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
    console.log(f);
    if( !this.validateService.dobFormat(f)){

      return '2px solid red'
    }
    else{
     
      return '2px solid green'
    }
  }
}

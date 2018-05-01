import { Component, OnInit,NgZone } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ValidateService} from '../../services/validate.service'
import {AuthService} from '../../services/auth.service'
import {FlashMessagesService} from 'angular2-flash-messages';
import { Observable } from 'rxjs/Observable';
import { Router, RouterModule } from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-view-company-profile',
  templateUrl: './view-company-profile.component.html',
  styleUrls: ['./view-company-profile.component.css']
})
export class ViewCompanyProfileComponent implements OnInit {
  compid:Object;
  closeResult: string;
  isLoggedin: boolean = false;
  account: Object;
  constructor(
    private validateService: ValidateService, 
    private flashMessages:FlashMessagesService,
    private authService:AuthService,
     private router:Router,
     private modalService: NgbModal,
     private zone:NgZone, // <== added
) {}

     

  ngOnInit() {
     
    if(localStorage.getItem('isCompany')=='true'){
      this.authService.getCompany().subscribe(profile => {
        this.account = profile.company;
        
        console.log(this.account);
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
      },
      err => {
        console.log(err);
        return false;
      });
    }
  }
  toggleNewEmployeeModal(){
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
  onEmployeeSubmit(f){
    console.log(f);
    
    const employee={
      details:this.account,
      empName:f.form.value.fullname,
    empEmail:f.form.value.ememail,
    empUsername:f.form.value.username,
    empPosition:f.form.value.emposition,
    empHrRate:f.form.value.empHrRate,
    empDob:f.form.value.dob,
    empPhone:f.form.value.empPhone,
    empPassword:f.form.value.empPassword,
    }
    console.log(employee);
    //employee is unchecked/false
    //company is checked/true
    
      this.authService.registerEmployee(employee).subscribe(data =>{
        if(data.success){
          this.flashMessages.show('New Employee Added',{cssClass: 'success-danger',timeout:3000});
          this.ngOnInit();
          //this.router.navigate(['view-company-profile']);
        }
        else{
          this.flashMessages.show(data.msg,{cssClass: 'alert-danger',timeout:3000});
         // this.router.navigate(['']);
        }
      });
     
  }
  selectEmployee(i){
    console.log(i); 
    localStorage.setItem('id',i);
    this.router.navigate(['select-employee']);
  }
  isLoggedIn() {
    if (localStorage.getItem("id_token") == null) {
        this.isLoggedin = false;

        return this.isLoggedin;
    }
    else {

        return true;
    }
  }
}

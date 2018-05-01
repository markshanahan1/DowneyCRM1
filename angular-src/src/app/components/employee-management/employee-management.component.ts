import { Component, OnInit, Inject,NgZone } from '@angular/core';
import {ValidateService} from '../../services/validate.service';
import {AuthService} from '../../services/auth.service';
import {FlashMessagesService} from 'angular2-flash-messages';
import { Observable } from 'rxjs/Observable';
import { Router,ActivatedRoute } from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {EmployeePipe} from '../../pipes/employee.pipe';
@Component({
  selector: 'app-employee-management',
  templateUrl: './employee-management.component.html',
  styleUrls: ['./employee-management.component.css']
})
export class EmployeeManagementComponent implements OnInit {

  constructor(
 
    private validateService: ValidateService, 
    private flashMessages:FlashMessagesService,
    private authService:AuthService,
     private router:Router,
     private route:ActivatedRoute,
     private modalService: NgbModal,
  ) { }
  compid:Object;
  isRemoving:boolean=false;
  emp_i:any;
  closeResult: string;
  isLoggedin: boolean = false;
  account:any=[];
  
  isCompany(){
    if(localStorage.getItem('isCompany')=='true') return true;
    else return false;
  }
  ngOnInit() {
    if(this.isCompany()){
      this.authService.getCompany().subscribe(profile => {
        this.account = profile.company;
        
        console.log(this.account.employees);
      },
      err => {
        console.log(err);
        return false;
      });
    }
    else{
      this.authService.getProfile().subscribe(profile => {
        this.router.navigate(['/dashboard']);
        this.flashMessages.show('You have no permission to view this page! You have been redirected to Dashboard.',{cssClass: 'alert-danger',timeout:3000});
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
    let error_flag=false;
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
    };
    console.log(employee);
    //employee is unchecked/false
    //company is checked/true
    if(!this.validateService.ValidateEmployee(employee)){
      console.log('Please fill in all fields');
      this.flashMessages.show('Please fill in all the fields',{cssClass: 'alert-danger',timeout:3000});
      error_flag=true;
    }
    
    if(!this.validateService.ValidateEmail(employee.empEmail)){
      console.log('Please fill in all fields');
      this.flashMessages.show('Please enter valid Email Address',{cssClass: 'alert-danger',timeout:3000});
      error_flag=true;
    }
    if(!this.validateService.dobFormat(employee.empDob)){
      console.log('Please fill in all fields');
      this.flashMessages.show('Please enter valid Email Address',{cssClass: 'alert-danger',timeout:3000});
      error_flag=true;
    }
  
    if(!this.validateService.ValidatePassword(employee.empPassword)){
      console.log('Please use a valid Password');
        this.flashMessages.show('Please use a valid Password - Mixed use of UPPER CASE, LOWER CASE & NUMBERS',{cssClass: 'alert-danger',timeout:3000});
        error_flag=true;
      }
    for(let i = 0; i<this.account.employees.length;i++){
      if(this.account.employees[i].empUsername === employee.empUsername)
      {
        console.log('Please use a valid Username');
        this.flashMessages.show('This username is already taken, please try again.',{cssClass: 'alert-danger',timeout:3000});
        error_flag=true;
      }else if(this.account.employees[i].empEmail === employee.empEmail)
      {
        console.log('Please use a valid Email');
        this.flashMessages.show('This Email is already taken, please try again.',{cssClass: 'alert-danger',timeout:3000});
        error_flag=true;
      }
    }
    if(error_flag==false)
    {  
      this.authService.registerEmployee(employee).subscribe(data =>{
        if(data.success){
          this.flashMessages.show('New Employee Added',{cssClass: 'alert-success',timeout:3000});
          this.ngOnInit();
          //this.router.navigate(['view-company-profile']);
        }
        else{
          this.flashMessages.show(data.msg,{cssClass: 'alert-danger',timeout:3000});
          // this.router.navigate(['']);
        }
      });
    }
     
  }
  closeModal(){
    document.getElementById("addEmployeeForm").style.opacity = "0";
    document.getElementById("addEmployeeForm").style.display = "none";

    document.getElementById("RemoveEmpModal").style.opacity = "0";
    document.getElementById("RemoveEmpModal").style.display = "none";
  }
  removeEmp(){
    console.log(this.emp_i);

    console.log(this.account);

    this.authService.removeEmp(this.account.employees[this.emp_i]._id,this.account._id).subscribe(data => {
      console.log(data);
        this.flashMessages.show('Employee is now removed!',{cssClass: 'alert-success',timeout:3000});
        this.closeModal();
        this.ngOnInit();
    },
    err => {
      this.flashMessages.show('Error! Employee was not removed!',{cssClass: 'alert-danger',timeout:3000});
      console.log(err);
      return false;
    });
  }
  toggleRemoveModal(i){
    this.emp_i=i;
    console.log(this.emp_i);
    if(document.getElementById("RemoveEmpModal").style.opacity == "1"){ 
      document.getElementById("RemoveEmpModal").style.opacity = "0";
      document.getElementById("RemoveEmpModal").style.display = "none";
      }
    else 
    {

      document.getElementById("RemoveEmpModal").style.display = "block";
      document.getElementById("RemoveEmpModal").style.opacity = "1";
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
    console.log(f)
    if(!this.validateService.ValidateEmail(f)){

      return '2px solid red'
    }
    else{
     
      return '2px solid green'
    }
  }
  checkDob(f){
  
    if(!this.validateService.dobFormat(f)){

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
  selectEmployee(i){
    console.log(i); 
    
    this.router.navigate(['employees-manager',this.account.employees[i]._id]);
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

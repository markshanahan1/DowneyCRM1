import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {ValidateService} from '../../services/validate.service'
import {AuthService} from '../../services/auth.service'
import {FlashMessagesService} from 'angular2-flash-messages';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  providers: [AuthService],
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  user:any;
 
  newCompany:any;
  compname:String;
  username:String;
  email:String;
  website:String;
  phone:String;
  street:String;
  town:String;
  county:String;
  country:String;
  companyRegNum:String;
  position:String;
  fullname:String;
  empemail:String;

  constructor(
    private validateService: ValidateService, 
    private flashMessages:FlashMessagesService,
    private authService:AuthService,
    private router:Router
  ) { }

  ngOnInit() {
  }
  
  onCompanySubmit(f){
    console.log(f.value);

    let company = {
        name:f.value.compname,
        title:f.value.comptitle,
        street:f.value.street,
        town:f.value.town,
        county:f.value.county,
        country:f.value.country,
        website:f.value.website,
        email:f.value.email,
        companyRegNum:f.value.companyRegNum,
        phone:f.value.phone,
        password:f.value.password,
       
      
      
    }
  
    console.log(company);
    if(!this.validateService.ValidateCompRegister(company)){
        console.log('Please fill in all fields');
        this.flashMessages.show('Please fill in all the fields',{cssClass: 'alert-danger',timeout:3000});
    }

    if(!this.validateService.ValidateEmail(company.email)){
        console.log('Please use a valid email address');
        this.flashMessages.show('Please use a valid email address',{cssClass: 'alert-danger',timeout:3000});
    }

    if(!this.validateService.ValidatePassword(company.password)){
      console.log('Please use a valid Password');
        this.flashMessages.show('Please use a valid Password - Mixed use of UPPER CASE, LOWER CASE & NUMBERS',{cssClass: 'alert-danger',timeout:3000});
    }

    this.authService.registerCompany(company).subscribe(data=>{
      if(data.success){
          let iddd = data.company;
          console.log(data.company);
          this.flashMessages.show('Your company is now registered ',{cssClass: 'alert-success',timeout:3000});
          this.router.navigate(['login']);
      }
      else {
        console.log(data);
        this.flashMessages.show('Something went wrong, you are not registered. Please try again!',{cssClass: 'alert-danger',timeout:3000});
        this.router.navigate(['register']);
      }
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
  
    if(!this.validateService.ValidateInput(f) && !this.validateService.dobFormat(f)){

      return '2px solid red'
    }
    else{
     
      return '2px solid green'
    }
  }
}

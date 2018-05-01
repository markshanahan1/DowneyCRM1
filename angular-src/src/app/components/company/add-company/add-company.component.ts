import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {ValidateService} from '../../../services/validate.service'
import {AuthService} from '../../../services/auth.service'
import {FlashMessagesService} from 'angular2-flash-messages';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.css']
})
export class AddCompanyComponent implements OnInit {
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
  empPosition:String;
  empType:String;


  constructor(
    private validateService: ValidateService, 
    private flashMessages:FlashMessagesService,
    private authService:AuthService,
    private router:Router
  ) { }

  ngOnInit() {
   
    this.authService.getProfile().subscribe(profile => {
      
        this.user = profile.user;
       console.log(profile);
    },
    err => {
      console.log(err);
      return false;
    });
  }
  
  onCompanySubmit(f){
    console.log(f.value);
    const company = {
      name:f.value.compname,
      street:f.value.street,
      town:f.value.town,
      county:f.value.county,
      country:f.value.country,
     
      website:f.value.website,
       email:f.value.email,
      companyRegNum:f.value.companyRegNum,
      phone:f.value.phone,
      employees:{
        empId:this.user._id,
        empName:this.user.fullname,
        empPosition:f.value.empPosition,
        empType:f.value.empType
      }
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

    this.authService.registerCompany(company).subscribe(data=>{
      if(data.success){
          let iddd = data.company;
          console.log(data.company);
          this.flashMessages.show('Your company is now registered ',{cssClass: 'alert-success',timeout:3000});
          this.router.navigate(['ViewCompany']);
      }
      else {
        console.log(data);
        this.flashMessages.show('Something went wrong, you are not registered. Please try again!',{cssClass: 'alert-danger',timeout:3000});
        this.router.navigate(['AddCompany']);
      }
    });
  }
}
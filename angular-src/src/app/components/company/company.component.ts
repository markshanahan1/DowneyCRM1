import { Component, OnInit } from '@angular/core';
import {ValidateService} from '../../services/validate.service';
import {AuthService} from '../../services/auth.service';
import {FlashMessagesService} from 'angular2-flash-messages';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
  isRegistered:boolean;
  isEmpty:boolean;
  isSearched:boolean;
  searched:any;
company:any;
companyArr:any;
user:any;
  constructor(
    private validateService: ValidateService, 
    private flashMessages:FlashMessagesService,
    private authService:AuthService,
     private router:Router
  ) { }

  ngOnInit() {
    this.isEmpty = false;
    this.isSearched = false;
    this.authService.getProfile().subscribe(profile => {
        this.user = profile.user;
        this.company = profile.user.companyid;
       console.log(this.company);
       if(this.company == undefined) this.isRegistered=false;
       else this.isRegistered=true;
    },
    err => {
      console.log(err);
      return false;
    });
  }


  isCompanyRegistered(){
    return this.isRegistered;
  }
  isListEmpty(){
    return this.isEmpty;
  }
  isCompaniesSearched(){
    return this.isSearched;
  }

  joinCompany(i){
    console.log(this.companyArr[i]._id);
    
    // this.authService.addmoreUser({compid:this.companyArr[i]._id,userid:this.user._id}).subscribe(data =>{
    //   if(data.success){
    //     this.router.navigate(['dashboard']);
    //   }
    //   else{
    //     this.flashMessages.show(data.msg,{cssClass: 'alert-danger',timeout:6000});
       
    //   }
    // })
  }

}
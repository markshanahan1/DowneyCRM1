import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {ValidateService} from '../../services/validate.service'
import {AuthService} from '../../services/auth.service'
import {FlashMessagesService} from 'angular2-flash-messages';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  providers: [AuthService],
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  logname:String;
  password:String;
  mtoggle:boolean;
  constructor(
    private validateService: ValidateService, 
    private flashMessages:FlashMessagesService,
    private authService:AuthService,
    private router:Router
  ) { }

  ngOnInit() {
    this.mtoggle=false;
  }
 
  onLoginSubmit(f){
    console.log(f);
    const login={
      username:f.form.value.logname,
      password:f.form.value.password
    }
    console.log(f.form.value);
    //employee is unchecked/false
    //company is checked/true
    console.log(this.mtoggle)
    if(!this.mtoggle){
      
      this.authService.authenticateEmployee(login).subscribe(data =>{
        console.log(data);
        if(data.success){
          this.authService.storeData(data.token,false);
          this.flashMessages.show('You are now logged in!',{cssClass: 'alert-success',timeout:3000});
          this.router.navigate(['/dashboard']);
        }
        else{
          console.log(data);
          this.flashMessages.show('Something went Wrong, Please try Again.',{cssClass: 'alert-danger',timeout:3000});
          this.router.navigate(['/login']);
        }
      });
    }
    else{
      console.log("COMP");
      this.authService.authenticateCompany(login).subscribe(data =>{
        //console.log(data.company.employees);
        if(data.success){
          this.authService.storeData(data.token,true);
          this.flashMessages.show('You are now logged in!',{cssClass: 'success-danger',timeout:3000});
          this.router.navigate(['/dashboard']);
        }
        else{
          this.flashMessages.show('Something went Wrong. ' +data.msg,{cssClass: 'alert-danger',timeout:3000});
          this.router.navigate(['/login']);
        }
      });
    }
    
 

     
  }
}

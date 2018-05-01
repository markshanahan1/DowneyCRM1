import { Component, OnInit } from '@angular/core';
import {ValidateService} from '../../services/validate.service'
import {AuthService} from '../../services/auth.service'
import {FlashMessagesService} from 'angular2-flash-messages';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  providers: [AuthService],
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedin: boolean = false;
  isNavOpen:boolean = false;
  account: Object;
  name:any;
  constructor(
    private validateService: ValidateService, 
    private flashMessages:FlashMessagesService,
    private authService:AuthService,
     private router:Router
  ) { }
           // {1}

  ngOnInit() {
    
  }

  openNav() {
    
      document.getElementById("mySidenav").style.width = "250px";
      document.getElementById("main").style.marginLeft = "250px";
  }

  /* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
  toggleNav() {
    if(!this.isNavOpen){
      if(localStorage.getItem('isCompany')=='true'){
        this.authService.getCompany().subscribe(profile => {
          this.account = profile.company;
          console.log(this.account);
           this.name= profile.company.name;
        },
        err => {
          console.log(err);
          return false;
        });
      }
      else{
        this.authService.getProfile().subscribe(profile => {
          this.account = profile.employee;
        
          this.name= profile.employee.empName;
        },
        err => {
          console.log(err);
          return false;
        });
      }
      document.getElementById("mySidenav").style.width = "250px";
      document.getElementById("main").style.marginLeft = "250px";
      this.isNavOpen=true;
      
    } else{
      document.getElementById("mySidenav").style.width = "0";
      document.getElementById("main").style.marginLeft = "0";
      this.isNavOpen=false;
    }
  }
  isCompanyLogged(){

    if(localStorage.getItem('isCompany')=='true'){
      return true;
    }
    else{
      return false;
    }
  }
  openProfile(){
    if(localStorage.getItem('isCompany')=='true'){
      console.log("this");
      this.router.navigate(['/view-company-profile']);
    }
    else {
      console.log("that");
      this.router.navigate(['/view-employee-profile']);
    }
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
   onLogoutClick() {
     if(this.isNavOpen) this.toggleNav();
    this.authService.logout();
    this.flashMessages.show('You are logged out', {
      cssClass: 'alert-success', timeout: 3000
    });
    this.router.navigate(['/login']);
    return false;
  }
}

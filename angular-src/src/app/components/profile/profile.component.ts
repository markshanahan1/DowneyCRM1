import { Component, OnInit } from '@angular/core';
import {ValidateService} from '../../services/validate.service'
import {AuthService} from '../../services/auth.service'
import {FlashMessagesService} from 'angular2-flash-messages';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    account:any;
    constructor(
    private validateService: ValidateService, 
    private flashMessages:FlashMessagesService,
    private authService:AuthService,
     private router:Router
  ) { }

  ngOnInit() {


  }
  isCompanyLogged(){
    return localStorage.getItem('isCompany');
  }
}

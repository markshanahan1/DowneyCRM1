import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {ValidateService} from '../../services/validate.service'
import {AuthService} from '../../services/auth.service'
import {FlashMessagesService} from 'angular2-flash-messages';
import {OrderByPipe} from '../../pipes/order-by.pipe';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  providers: [AuthService],
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {
  account:any;
  name:String;
  clients:any;
  stage_i:Number=0;
  togClient:Boolean = false;
  togRemove:Boolean = false;
  cli_i:number=0;
  constructor(
    private validateService: ValidateService, 
    private flashMessages:FlashMessagesService,
    private authService:AuthService,
    private router:Router
  ) { }

  isCompany(){
    if(localStorage.getItem('isCompany') == 'true')
      return true;
    else
      return false;
  }
  ngOnInit() {
    if(this.isCompany()){
      this.authService.getCompany().subscribe(profile => {
        this.account = profile.company;
      //  console.log(this.account.compId);
         this.name= profile.company.name;
         this.authService.getClients(this.account._id).subscribe(data=>{
         this.clients=data.client;
          },err => {
          
        });
      },
      err => {
      //  console.log(err);
        return false;
      });
    }
    else{
      this.authService.getProfile().subscribe(profile => {
        this.account = profile.employee;
      //  console.log(this.account.compId);
        this.name= profile.employee.empName;
        this.authService.getClients(this.account.compId).subscribe(profile => {
          this.clients = profile.client;
      //    console.log(this.clients);
        
        },
        err => {
      //    console.log(err);
          return false;
        });
      },
      err => {
     //   console.log(err);
        return false;
      });
    }
    
  }
  getNextIDref(){
    console.log(this.clients.length+1);
    return this.makeRef(this.clients.length+1);
  }

  onClientSubmit(f){
 //   console.log(f.value);
    let flag = false;
    
    let n = 1;

      if(f.value.ref == null || f.value.ref ==""|| f.value.ref==undefined){

        for(let i =0; i<this.clients.length;i++){
          if(this.clients[i].ref ===n){
            n++;
            i=0;
          }
          else{
            f.value.ref=n;
          }
         
        
        }
        
          
      }
      else{
       n = f.value.ref;
      }
    let client;
    if(this.isCompany()){
      client = {
        ref:n,
        compId:this.account._id,
        Name:f.value.name,
        Address:f.value.address,
        MobileTel:f.value.mobile,
        OfficeTel:f.value.office,
        Email:f.value.Email
      } 
    }
    else{
      client = {
        ref:n,
        compId:this.account.compId,
        Name:f.value.name,
        Address:f.value.address,
        MobileTel:f.value.mobile,
        OfficeTel:f.value.office,
        Email:f.value.Email
      } 
    }
    for(let i =0; i>this.clients.length;i++){
        if(this.clients[i].Email == client.Email){
          this.flashMessages.show('Please use a different email, this one is taken.',{cssClass: 'alert-danger',timeout:3000});
          return;
        }
    }
  
    
 //   console.log(client);
    if(!this.validateService.ValidateClientRegister(client)){
 //       console.log('Please fill in all fields');
        this.flashMessages.show('Please fill in all the fields',{cssClass: 'alert-danger',timeout:3000});
    }

    if(!this.validateService.ValidateEmail(client.Email)){
   //     console.log('Please use a valid email address');
        this.flashMessages.show('Please use a valid email address',{cssClass: 'alert-danger',timeout:3000});
    }
  //  console.log(client);
    this.authService.addClient(client).subscribe(data=>{
        if(data.success)
        {
          console.log(data);
          this.flashMessages.show("New Client has been added!",{cssClass: 'alert-success',timeout:3000});
          this.ngOnInit();
        }
          
        else{
          this.flashMessages.show('Something went wrong, Client is not registered. Please try again! ',{cssClass: 'alert-danger',timeout:3000});
        }
    }, err=>{
      
    //    console.log(data);
        this.flashMessages.show('Something went wrong, Client is not registered. Please try again! '+ err,{cssClass: 'alert-danger',timeout:3000});

      
    });
  }
  toggleRemoveModal(i){
    console.log(i);
    this.cli_i=i;

    if(document.getElementById("RemoveCliModal").style.opacity == "1"){ 
      document.getElementById("RemoveCliModal").style.opacity = "0";
      document.getElementById("RemoveCliModal").style.display = "none";
      }
    else 
    {

      document.getElementById("RemoveCliModal").style.display = "block";
      document.getElementById("RemoveCliModal").style.opacity = "1";
    }
  }
  removeClient(){
    console.log(this.cli_i);
    this.authService.removeClient(this.clients[this.cli_i]._id).subscribe(profile => {
      this.flashMessages.show('Success, Client is now removed. !',{cssClass: 'alert-success',timeout:3000});
      this.ngOnInit();
    },
    err => {
      this.flashMessages.show('Something went wrong, Client is not remove. Please try again!',{cssClass: 'alert-danger',timeout:3000});
  //    console.log(err);
      return false;
    });
  }
  viewClient(i){
 //   console.log(i);
    this.router.navigate(['/clients',this.clients[i].ref])
  }
  makeRef(i){
    return ("0000" + (i)).slice(-4);
  }
  checkEmail(f){
  
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
}

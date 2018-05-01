import { Component, OnInit,NgZone } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ValidateService} from '../../services/validate.service'
import {AuthService} from '../../services/auth.service'
import {FlashMessagesService} from 'angular2-flash-messages';
import { Observable } from 'rxjs/Observable';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-stages',
  providers:[AuthService],
  templateUrl: './stages.component.html',
  styleUrls: ['./stages.component.css']
})
export class StagesComponent implements OnInit {
  exStages:any;
  gname:string='';
  newInfo:string='';
  account: Object;
  SaveDisBtn:Boolean = false;
  constructor(
    private validateService: ValidateService, 
    private flashMessages:FlashMessagesService,
    private authService:AuthService,
     private router:Router
  ) { }
  inputs = [];
  isEmpty(){
    if(this.exStages==[] || this.exStages == undefined || this.exStages == null){
      return true;
    }
    else{
      console.log(this.exStages.length <=0);
      return this.exStages.length <=0;
    }
    
  }
  ngOnInit() {
    // let test=localStorage.getItem('isCompany');
    // if(test === 'false'){
    //   this.router.navigate(['/dashboard'])
    //   this.flashMessages.show('You have no access to Company Services.',{cssClass: 'alert-danger',timeout:3000});
    // }
    // else{
    //   this.authService.getCompany().subscribe(profile => {
    //     this.account = profile
    //     console.log(this.account);
    //   },
    //   err => {
    //     console.log(err);
    //     return false;
    //   });
    // }
    if(localStorage.getItem('isCompany')=='true'){
      this.authService.getCompany().subscribe(profile => {
        this.account = profile.company;
        this.authService.getStages("").subscribe(profile => {
          this.exStages = profile.stage;
          
          console.log(this.exStages);
        },
        err => {
          console.log(err);
          return false;
        });
        console.log(this.account);
      },
      err => {
        console.log(err);
        return false;
      });
    }
    else{
      this.flashMessages.show('Employees have no permission to view/edit/delete/update Stages.',{cssClass: 'alert-danger',timeout:3000});
      this.router.navigate(['dashboard']);
    }

  }
  public services:any= [{}];
  public stages= [];



  addInputtoGroup(newInfo:string,i){
    if(newInfo)
     {this.stages[i].services.push({title:newInfo});
      console.log(this.stages);
      newInfo='';
    } 
    else{
      this.flashMessages.show('Error Null Value, Please try again. ',{cssClass: 'alert-danger',timeout:3000});
    }
  }
  addGroup(newValue){
    if(newValue)
    {
      this.stages.push({
        stage_title:newValue,
        services:[]
      });
      this.flashMessages.show('You have added a new Stage Group',{cssClass: 'alert-success',timeout:3000});
    }
    else{
      this.flashMessages.show('Error Null Value, Please try again.',{cssClass: 'alert-danger',timeout:3000});
    }
    newValue='';
    console.log(this.stages);
  }
  changes(){
    console.log(this.inputs);
  }
 
  clearGroup(i){
    if (i > -1) {
      this.stages.splice(i, 1);
    }
    
  }
  clearItemfromGroup(h,i){
    if (i > -1) {
      this.stages[h].services.splice(i, 1);
    }
  }
  saveStages(){
    let ss = {
      stages:this.stages,
      compId:this.account
    }
    this.authService.addServices(ss).subscribe(data=>{
      if(data.success){
          
          console.log(data);
          this.flashMessages.show('Completed, You have set up Company Services.',{cssClass: 'alert-success',timeout:3000});
          this.ngOnInit();
      }
      else {
        console.log(data);
        this.flashMessages.show(data.msg,{cssClass: 'alert-danger',timeout:3000});

      }
    });
  }
  updateStages(){
  
  }
  removeStage(){
    this.authService.removeServices(this.exStages._id).subscribe(data=>{
      this.flashMessages.show('Completed, You have removed Company Services.',{cssClass: 'alert-success',timeout:3000});
    },
    err=>{
      this.flashMessages.show(err,{cssClass: 'alert-danger',timeout:3000});
    });
    this.ngOnInit
  }
  setBtnDis(){
    this.SaveDisBtn = true;
  }
  isSaveDisabled(){
    if(( this.stages[0] == undefined || this.stages[0]== null) && !this.stages.hasOwnProperty('services') )
     {

        return true;

    }
    else{
      return false;
    }

  }
  toggleRemoveStageModal(){
    if(document.getElementById("RemoveStageModal").style.opacity == "1"){ 
      document.getElementById("RemoveStageModal").style.opacity = "0";
      document.getElementById("RemoveStageModal").style.display = "none";
      }
    else 
    {
      document.getElementById("RemoveStageModal").style.display = "block";
      document.getElementById("RemoveStageModal").style.opacity = "1";
    }
  }

}

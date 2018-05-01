import { Component, OnInit } from '@angular/core';
import {ValidateService} from '../../../services/validate.service'
import {AuthService} from '../../../services/auth.service'
import {FlashMessagesService} from 'angular2-flash-messages';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import {ProjectsComponent} from '../projects.component';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css']
})
export class CreateProjectComponent implements OnInit {
  account:any;
  name:String;
  clients:any;
  stages:any;
  stagesClone:any;
  
  constructor(
    private validateService: ValidateService, 
    private flashMessages:FlashMessagesService,
    private authService:AuthService,
     private router:Router
  ) { }
  public proj = new ProjectsComponent(this.validateService,this.flashMessages,this.authService,this.router);
  ngOnInit() {
    if(localStorage.getItem('isCompany')=='true'){
      this.authService.getCompany().subscribe(profile => {
        this.account = profile.company;
        console.log(this.account);
         this.name= profile.company.name;
         this.authService.getStages(this.account._id).subscribe(profile => {
          if(profile.stage[0]){ 
            this.stages = profile.stage[0].stages;
            this.stagesClone = profile.stage[0].stages;
            console.log(this.account);
             this.name= profile.company.name;
          }
         
        },
        err => {
          console.log(err);
          return false;
        });
        this.authService.getClients(this.account._id).subscribe(profile => {
          
          this.clients = profile.company;
          console.log(this.account);
           this.name= profile.company.name;
        },
        err => {
          console.log(err);
          return false;
        });
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
        this.authService.getStages(this.account.compId).subscribe(profile => {
          if(profile.stage[0]){ 
            this.stages = profile.stage[0].stages;
            this.stagesClone = profile.stage[0].stages;
            console.log(this.stages);
          }
        },
        err => {
          console.log(err);
          return false;
        });
        this.authService.getClients(this.account.compId).subscribe(profile => {
          this.clients = profile;
          console.log(this.clients);
        },
        err => {
          console.log(err);
          return false;
        });
      },
      err => {
        console.log(err);
        return false;
      });
    }
  }
  onProjectCreate(f){
    
    const newProject = {
      ref:this.clients.ref,
      compId:this.account.compId,
      createdBy:this.account.empUsername,
      title:f.value.title,
      clientId:f.value.client,
      SiteAddress:f.value.address,
      Services: {stages:this.stages}
  
    }
    console.log(newProject);

    this.authService.addProject(newProject).subscribe(data=>{
      if(data.success){
          console.log(data);
          this.flashMessages.show('Your project is now created! '+ data,{cssClass: 'alert-success',timeout:3000});
          this.proj.ngOnInit();
      }
      else {
        console.log(data);
        this.flashMessages.show('Something went wrong, project was not created. Please try again!',{cssClass: 'alert-danger',timeout:3000});
        //this.router.navigate(['register']);
      }
    });
    

  }

}

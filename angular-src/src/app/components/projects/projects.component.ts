import { Component, OnInit } from '@angular/core';
import {ValidateService} from '../../services/validate.service'
import {AuthService} from '../../services/auth.service'
import {FlashMessagesService} from 'angular2-flash-messages';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {SearchPipePipe} from '../../pipes/search-pipe.pipe';
import {OrderByPipe} from '../../pipes/order-by.pipe';
@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  account:any;
  projects:any;
 proj_i:any;
 stages:any;
 stagesClone:any;
  togProject:Boolean=false;
  clients:any;
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
        this.authService.getProjectbyComp(this.account._id).subscribe(data => {
          this.projects = data.project;
          this.authService.getStages(this.account._id).subscribe(profile => {
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
          console.log(this.projects);
          this.authService.getClients(this.account._id).subscribe(profile => {
            this.clients = profile;
            
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
      },
      err => {
        console.log(err);
        return false;
      });
    }
    else{
      this.authService.getProfile().subscribe(profile => {
        this.account = profile.employee;
        this.authService.getProjectbyComp(this.account.compId).subscribe(data => {
          this.projects = data.project;
          console.log(this.projects);
          this.authService.getStages(this.account.compId).subscribe(profile => {
            if(profile.stage[0]){ 
              this.stages = profile.stage[0].stages;
              this.stagesClone = profile.stage[0].stages;
              console.log(this.stages);
            }
            this.authService.getProjectbyComp(this.account.compId).subscribe(data => {
              for(let o = 0;o<data.project.length;o++){
                for(let u = 0;u<data.project[o].EmpInvolved.length;u++){
                  if(data.project[o].EmpInvolved[u] == this.account.empUsername){
                    this.projects.push(data.project[o]);
                  }
                }
              }
              
            },
            err=>{

            });
          },
          err => {
            console.log(err);
            return false;
          });
          this.authService.getClients(this.account.compId).subscribe(profile => {
            this.clients = profile.client;
            console.log(this.clients)
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
      },
      err => {
        console.log(err);
        return false;
      });
    }
  }
  toggleNew(){
    console.log(this.togProject);
    this.togProject= !this.togProject;
  }
  viewProject(i){
    console.log(i);
    this.router.navigate(['/projects',this.projects[i].ref])
  }
  removeProject(){
    console.log(this.projects[this.proj_i]);
    this.authService.removeProject(this.projects[this.proj_i]._id).subscribe(data => {
      console.log(data);
      this.flashMessages.show('Removing project was successful!',{cssClass: 'alert-success',timeout:3000});
      this.closeModal();
      this.ngOnInit();
      this.router.navigate(['/projects']);
    },
    err => {
      console.log(err);
      this.flashMessages.show('Removing project was not successful!',{cssClass: 'alert-danger',timeout:3000});
      return false;
    });
   }
   onProjectCreate(f){
     let ref=0;
    for (let i =0; i< this.clients.length;i++){
      if(this.clients[i]._id == f.value.cli)
        ref=this.clients[i].ref;
    }
    console.log(ref);
    const newProject = {
      ref:ref,
      compId:this.account.compId,
      createdBy:[this.account.empUsername],
      title:f.value.title,
      clientId:f.value.cli,
      SiteAddress:f.value.address,
      Services: {stages:this.stages}
    }
    console.log(newProject);

    this.authService.addProject(newProject).subscribe(data=>{
      if(data.success){
          console.log(data);
          this.flashMessages.show('Your project is now created! '+ data,{cssClass: 'alert-success',timeout:3000});
          this.togProject = false;
          this.ngOnInit();
      }
      else {
        console.log(data);
        this.flashMessages.show('Something went wrong, project was not created. Please try again!',{cssClass: 'alert-danger',timeout:3000});
        //this.router.navigate(['register']);
      }
    });
    

  }
   toggleRemoveModal(i){
    this.proj_i = i;

    if(document.getElementById("RemoveProjModal").style.opacity == "1"){ 
      document.getElementById("RemoveProjModal").style.opacity = "0";
      document.getElementById("RemoveProjModal").style.display = "none";
      }
    else 
    {

      document.getElementById("RemoveProjModal").style.display = "block";
      document.getElementById("RemoveProjModal").style.opacity = "1";
    }
  }
  closeModal(){
    document.getElementById("RemoveProjModal").style.opacity = "0";
      document.getElementById("RemoveProjModal").style.display = "none";
  }
}

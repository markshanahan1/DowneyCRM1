import { Component, OnInit, Inject,NgZone } from '@angular/core';
import {ValidateService} from '../../services/validate.service'
import {AuthService} from '../../services/auth.service'
import {FlashMessagesService} from 'angular2-flash-messages';
import { Observable } from 'rxjs/Observable';
import { Router,ActivatedRoute } from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { DatetimePopupModule } from 'ngx-bootstrap-datetime-popup';
import { NgbDateStruct }      from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [
    { provide: 'Window',  useValue: window }
  ]
})
export class DashboardComponent implements OnInit {
projects:any;
account:any;
clients:any;
total_projects:number=0;
total_complete_projects:number=0;
total_clients:number=0;
total_empProjects:number=0;
total_emps:number=0;

  constructor(
    @Inject('Window') private window: Window,
    private validateService: ValidateService, 
    private flashMessages:FlashMessagesService,
    private authService:AuthService,
     private router:Router,
     private route:ActivatedRoute,
     private modalService: NgbModal,
     private zone:NgZone, // <== added
     public dialog: MatDialog
  ) { }

  ngOnInit() {
    if(this.isCompany()){
      this.authService.getCompany().subscribe(profile => {
        this.account = profile.company;
        this.total_emps=this.account.employees.length;
        this.authService.getProjectbyComp(this.account._id).subscribe(data => {
          this.projects = data.project;
          console.log(this.projects);
          for(let i=0;i<this.projects.length;i++){
            this.total_projects++;
            if(this.projects[i].projectComplete)
              this.total_complete_projects++;

            if(this.projects[i].createdBy ===this.account.empUsername)
              this.total_empProjects++;
          }
          console.log(this.projects);
          this.authService.getClients(this.account._id).subscribe(profile => {
            this.clients = profile.client;
            console.log(this.clients);
            this.total_clients = this.clients.length;
           // console.log('total Proj: '+this.total_complete_projects+'\ntotal cli: '+this.total_clients+'\n project comp: '+ this.total_complete_projects);
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
          for(let i=0;i<this.projects.length;i++){
            this.total_projects++;
            if(this.projects[i].projectComplete)
              this.total_complete_projects++;

            if(this.projects[i].createdBy ===this.account.empUsername)
              this.total_empProjects++;
          }
          console.log(this.projects);
          this.authService.getClients(this.account.compId).subscribe(profile => {
            this.clients = profile.client;
            this.total_clients = this.clients.length;
            console.log('total Proj: '+this.total_complete_projects+'\ntotal cli: '+this.total_clients+'\n project comp: '+ this.total_complete_projects);
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
  isCompany(){
    if(localStorage.getItem('isCompany') == 'true')
      return true;
    else
      return false;
  }
}

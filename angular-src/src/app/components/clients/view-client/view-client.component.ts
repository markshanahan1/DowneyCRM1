import { Component, OnInit, Inject,NgZone } from '@angular/core';
import {ValidateService} from '../../../services/validate.service'
import {AuthService} from '../../../services/auth.service'
import {FlashMessagesService} from 'angular2-flash-messages';
import { Observable } from 'rxjs/Observable';
import { Router,ActivatedRoute } from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { DatetimePopupModule } from 'ngx-bootstrap-datetime-popup';
import { NgbDateStruct }      from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {ConfirmationDialogComponent} from '../../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-view-client',
  templateUrl: './view-client.component.html',
  styleUrls: ['./view-client.component.css']
})
export class ViewClientComponent implements OnInit {
  client:any;
  projects:any;
  proj_i:any;
  constructor(

    private validateService: ValidateService, 
    private flashMessages:FlashMessagesService,
    private authService:AuthService,
     private router:Router,
     private route:ActivatedRoute,
     private modalService: NgbModal,
     private zone:NgZone // <== added

  ) { }
  makeRef(i){
    return ("0000" + (i)).slice(-4);
  }
  ngOnInit() {
    let id = this.route.snapshot.params['id'];
  
  this.authService.getOneClient(id).subscribe(client => {
    this.client = client.client[0];
   // console.log(this.client);
    this.authService.getProjectsbyClient(this.client._id).subscribe(data => {
      this.projects = data.project;
   //   console.log(this.projects);
    },
    err => {
   //   console.log(err);
      
      return false;
    });
  },
  err => {
  //  console.log(err);
    this.router.navigate(['/projects']);
    return false;
  });
  
  }
  viewProject(i){
  //  console.log(i);
    this.router.navigate(['/projects',this.projects[i].ref])
  }
  removeProject(){
    
    this.authService.removeProject(this.projects[this.proj_i]._id).subscribe(data => {
   //   console.log(data);
      this.flashMessages.show('Removing project was successful!',{cssClass: 'alert-success',timeout:3000});
      this.closeModal();
      this.ngOnInit();
      this.router.navigate(['/projects']);
    },
    err => {
   //   console.log(err);
      this.flashMessages.show('Removing project was not successful!',{cssClass: 'alert-danger',timeout:3000});
      return false;
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

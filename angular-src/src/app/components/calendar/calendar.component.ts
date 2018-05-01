import { Component, OnInit } from '@angular/core';
import {ValidateService} from '../../services/validate.service'
import {AuthService} from '../../services/auth.service'
import {FlashMessagesService} from 'angular2-flash-messages';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import {
 
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { Subject } from 'rxjs/Subject';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent
} from 'angular-calendar';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({

  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})


export class CalendarComponent implements OnInit {

  @ViewChild('modalContent') modalContent: TemplateRef<any>;

  view: string = 'month';
  account:any;
  origEvents: Object;
  viewDate: Date = new Date();
  updateable:Boolean = false;
  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="glyphicon glyphicon-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        
      }
    },
    {
      label: '<i class="glyphicon glyphicon-time"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [
    
  ];

  activeDayIsOpen: boolean = true;
  constructor(
    private validateService: ValidateService, 
    private flashMessages:FlashMessagesService,
    private authService:AuthService,
     private router:Router,
     private modal: NgbModal
  ) { }

  logit(i){
    this.authService.removeEvents(this.events[i]).subscribe(eve => {
      this.flashMessages.show(eve.msg, {
        cssClass: 'alert-success', timeout: 3000
      });
      this.ngOnInit();
    },
    err => {
      this.flashMessages.show('You failed to delete the calendar event. ' +err, {
        cssClass: 'alert-danger', timeout: 3000
      });
      console.log(err);
      return false;
    });
   
  }
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }
  removeEvent(i){
    this.authService.removeEvents(this.events[i]).subscribe(eve => {
      this.flashMessages.show(eve.msg, {
        cssClass: 'alert-success', timeout: 3000
      });
      this.ngOnInit();
    },
    err => {
      this.flashMessages.show('You failed to delete the calendar event. ' +err, {
        cssClass: 'alert-danger', timeout: 3000
      });
      console.log(err);
      return false;
    });
  }

  updateEvent(i): void{
    this.authService.updateEvent(this.events[i]).subscribe(events => {
      this.flashMessages.show("Your Event is now updated", {
        cssClass: 'alert-success', timeout: 3000
      });
      
      this.ngOnInit();
    },
    err => {
      this.flashMessages.show('You failed update a calendar event!! '+ err, {
        cssClass: 'alert-danger', timeout: 3000
      });
      console.log(err);
      return false;
    });
  }

  addEvent(): void {
    const event = {
      empId: this.account._id,
      title: 'New event',
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
      color: colors.red,
      draggable: true,
    }
    this.authService.addEvents(event).subscribe(events => {
      this.flashMessages.show(events.msg, {
        cssClass: 'alert-success', timeout: 3000
      });
      
      this.ngOnInit();
    },
    err => {
      this.flashMessages.show('You failed adding a calendar event', {
        cssClass: 'alert-warning', timeout: 3000
      });
      console.log(err);
      return false;
    });

    this.refresh.next();
  }

  ngOnInit() {
    this.authService.getProfile().subscribe(profile => {
      this.account = profile.employee;
  
      this.authService.getEvents(profile.employee).subscribe(eve => {
        console.log(eve.event);
        this.events = eve.event;
        this.origEvents = eve;
        this.refresh.next();
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

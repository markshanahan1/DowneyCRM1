import { Injectable } from '@angular/core';
import {Http, Headers, URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {HttpClientModule} from '@angular/common/http';
import { CanActivate} from '@angular/router';
import {FlashMessagesModule} from 'angular2-flash-messages';
import { JwtModule } from '@auth0/angular-jwt';
@Injectable()
export class AuthService{
  authToken:any;
  employee:any;
  company:any;
   prof:any;
   item:any;
    isLoggedin: boolean = false;
   constructor(private http:Http) { }

    //checking is anyone logged in.
   isLoggedIn() {
     if (localStorage.getItem("id_token") == null) {
        this.isLoggedin = false;
        console.log(this.isLoggedIn);
        return this.isLoggedin;
     }
     else {
        console.log(this.isLoggedIn);
        return true;
     }
   }

   //log out
   logout(){
    this.authToken = null;
    this.employee=null;
    this.company=null;
    localStorage.clear();
  }
  //return JWT auth token
  loadToken(){
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }


  //Employee Auth Services
  registerEmployee(employee){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:3000/employees/register',employee,{headers:headers})
    .map(res => res.json());
  }
  getUserProfile() {
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:3000/employees/profile', {headers: headers})
      .map(res => res.json());
  }
  getProfile() {
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:3000/employees/profile', {headers: headers})
      .map(res => res.json());
  }
  updateEmployee(employee){
      let headers = new Headers();
      console.log(employee);
      headers.append('Content-Type','application/json');
      return this.http.put('http://localhost:3000/employees/update',employee,{headers:headers})
      .map(res => res.json());  
      
    } 
    
  authenticateEmployee(employee){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:3000/employees/authenticate',employee,{headers:headers})
    .map(res => res.json());  
    
  }
  storeEmployeeData(token, employee){
    localStorage.setItem('id_token', token);
    localStorage.setItem('employee', JSON.stringify(employee));
    this.authToken = token;
    this.employee = employee;

  }



  //Company Auth Services
  authenticateCompany(company){
    console.log(company);
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:3000/companies/authenticate',company,{headers:headers})
    .map(res => res.json());  
    
  }
 
  registerCompany(company){
    let headers = new Headers();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:3000/companies/register',company,{headers:headers})
    .map(res => res.json());
  }
  getCompany() {
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:3000/companies/profile', {headers: headers})
      .map(res => res.json());
  }
  getCompanybyEmpId(ts) {
    let headers = new Headers();
    let search = new URLSearchParams();
    search.set('name',ts);
    this.loadToken();
    
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:3000/companies/getCompanyEmpsbyId', {headers: headers,search:search})
      .map(res => res.json());
  }
  getAllEmployees(compName) {
    let headers = new Headers();
    let search = new URLSearchParams();
    search.set('name',compName);
    this.loadToken();
    
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:3000/companies/searchCompanies', {headers: headers,search:search })
      .map(res => res.json());
  }
  removeEmp(id,id2){
      let headers = new Headers();
      let search = new URLSearchParams();

      search.set('id',id+"///"+id2);
      console.log(id);
      headers.append('Authorization', this.authToken);
      headers.append('Content-Type','application/json');
      return this.http.delete('http://localhost:3000/employees/removeEmp',{headers:headers,search:search})
      .map(res => res.json());  
  } 
  storeData(token, data){
    console.log(data);
    localStorage.setItem('id_token', token);
    localStorage.setItem('isCompany', data);
    this.authToken = token;
    // this.company = company;

  }


  /*/////////////////////////////////////
                Timesheets
  ////////////////////////////////////*/
  getEmployeeTimesheets(empId) {
    let headers = new Headers();
    let search = new URLSearchParams();
    search.set('id',empId);
    this.loadToken();
    
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    if(localStorage.getItem('isCompany')=='true'){
      return this.http.get('http://localhost:3000/timesheets/getEmployeeTimesheetsforComp', {headers: headers,search:search })
      .map(res => res.json());
    }
    else{
      return this.http.get('http://localhost:3000/timesheets/getEmployeeTimesheets', {headers: headers,search:search })
      .map(res => res.json());
    }
    
  }
  getBudgetTimesheets(id) {
    let headers = new Headers();
    let search = new URLSearchParams();
    search.set('id',id);
    this.loadToken();
    
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');

      return this.http.get('http://localhost:3000/timesheets/getProjectBudgetfromTS', {headers: headers,search:search })
      .map(res => res.json());
  }
  registerTimesheets(timesheet){
    let headers = new Headers();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:3000/timesheets/register',timesheet,{headers:headers})
    .map(res => res.json());
  }


  updateTimesheet(ts){
    let headers = new Headers();
    console.log(ts);
    headers.append('Content-Type','application/json');
    return this.http.put('http://localhost:3000/timesheets/update',ts,{headers:headers})
    .map(res => res.json());  
    
  } 
  removeTimesheet(ts){
    let headers = new Headers();
    let search = new URLSearchParams();
    search.set('id',ts._id);
    console.log(ts);
    headers.append('Content-Type','application/json');
    return this.http.delete('http://localhost:3000/timesheets/remove',{headers:headers, search:search})
    .map(res => res.json());  
    
  } 

  /*/////////////////////////////////////
            Calendar & Events
  ////////////////////////////////////*/

  getEvents(ts){
    let headers = new Headers();
    let search = new URLSearchParams();
    search.set('id',ts._id);
    console.log(ts);
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type','application/json');
    return this.http.get('http://localhost:3000/calendars/getEvents',{headers:headers, search:search})
    .map(res => res.json());  
  }

  addEvents(ts){
    let headers = new Headers();

    console.log(ts);
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:3000/calendars/addEvent',ts,{headers:headers})
    .map(res => res.json());  
  }
  removeEvents(ts){
    let headers = new Headers();
    let search = new URLSearchParams();
    search.set('id',ts._id);
    console.log(ts);
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type','application/json');
    return this.http.delete('http://localhost:3000/calendars/removeEvent',{headers:headers, search:search})
    .map(res => res.json());  
  }
  updateEvent(ts){
    let headers = new Headers();
    console.log(ts);
    headers.append('Content-Type','application/json');
    return this.http.put('http://localhost:3000/calendars/updateEvent',ts,{headers:headers})
    .map(res => res.json());  
    
  } 

 /*/////////////////////////////////////
            Stage
  ////////////////////////////////////*/

  getStages(ts){
    let headers = new Headers();
    let search = new URLSearchParams();
    search.set('id',ts);
    console.log(ts);
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type','application/json');
    return this.http.get('http://localhost:3000/stages/getStages',{headers:headers, search:search})
    .map(res => res.json());  
  }

  addServices(ts){
    let headers = new Headers();

    console.log(ts);
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:3000/stages/addStage',ts,{headers:headers})
    .map(res => res.json());  
  }
  removeServices(id){
    let headers = new Headers();
    let search = new URLSearchParams();
    search.set('id',id);
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type','application/json');
    return this.http.delete('http://localhost:3000/stages/removeStage',{headers:headers, search:search})
    .map(res => res.json());  
  }
  updateServices(ts){
    let headers = new Headers();
    console.log(ts);
    headers.append('Content-Type','application/json');
    return this.http.put('http://localhost:3000/calendars/updateEvent',ts,{headers:headers})
    .map(res => res.json());  
    
  } 

  /*/////////////////////////////////////
            Clients
  ////////////////////////////////////*/
  getOneClient(id) {
    let headers = new Headers();
    let search = new URLSearchParams();
    search.set('id',id);
    this.loadToken();
    
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');

      return this.http.get('http://localhost:3000/clients/getClientOne', {headers: headers,search:search })
      .map(res => res.json());
  }
  getClients(ts){
    let headers = new Headers();
    let search = new URLSearchParams();
    search.set('id',ts);
    console.log(ts);
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type','application/json');
    return this.http.get('http://localhost:3000/clients/getClients',{headers:headers, search:search})
    .map(res => res.json());  
  }
  getClientbyId(ts){
    let headers = new Headers();
    let search = new URLSearchParams();
    search.set('id',ts);
    console.log(ts);
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type','application/json');
    return this.http.get('http://localhost:3000/clients/getClientbyId',{headers:headers, search:search})
    .map(res => res.json());  
  }


  addClient(ts){
    let headers = new Headers();

    console.log(ts);
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:3000/clients/addClient',ts,{headers:headers})
    .map(res => res.json());  
  }
  removeClient(ts){
    let headers = new Headers();
    let search = new URLSearchParams();
    search.set('id',ts);
    console.log(ts);
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type','application/json');
    return this.http.delete('http://localhost:3000/clients/removeClient',{headers:headers, search:search})
    .map(res => res.json());  
  }
  updateClient(ts){
    let headers = new Headers();
    console.log(ts);
    headers.append('Content-Type','application/json');
    return this.http.put('http://localhost:3000/clients/updateClient',ts,{headers:headers})
    .map(res => res.json());  
    
  } 
/*/////////////////////////////////////
            Projects
  ////////////////////////////////////*/
  getProjectbyId(ts){
    let headers = new Headers();
    let search = new URLSearchParams();
    search.set('id',ts);
    console.log(ts);
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type','application/json');
    return this.http.get('http://localhost:3000/projects/getProjectsbyId',{headers:headers, search:search})
    .map(res => res.json());  
  }
  getProjectbyComp(ts){
    let headers = new Headers();
    let search = new URLSearchParams();
    search.set('id',ts);
    console.log(ts);
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type','application/json');
    return this.http.get('http://localhost:3000/projects/getProjectsbyComp',{headers:headers, search:search})
    .map(res => res.json());  
  }
  updateStageBudget(ts){
    let headers = new Headers();

    headers.append('Content-Type','application/json');
    return this.http.put('http://localhost:3000/projects/updateBudget',ts,{headers:headers})
    .map(res => res.json());  
    
  }
  getProjectbyUser(ts){
    let headers = new Headers();
    let search = new URLSearchParams();
    search.set('id',ts);
    console.log(ts);
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type','application/json');
    return this.http.get('http://localhost:3000/projects/getProjectsbyUser',{headers:headers, search:search})
    .map(res => res.json());  
  }
  getProjectsbyClient(ts){
    let headers = new Headers();
    let search = new URLSearchParams();
    search.set('id',ts);
    console.log(ts);
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type','application/json');
    return this.http.get('http://localhost:3000/projects/getProjectsbyClient',{headers:headers, search:search})
    .map(res => res.json());  
  }
  addProject(ts){
    let headers = new Headers();
    console.log(ts);
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:3000/projects/addProject',ts,{headers:headers})
    .map(res => res.json());  
  }
  removeProject(ts){
    let headers = new Headers();
    let search = new URLSearchParams();
    search.set('id',ts);
    console.log(ts);
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type','application/json');
    return this.http.delete('http://localhost:3000/projects/removeProject',{headers:headers, search:search})
    .map(res => res.json());  
  }
  updateProject(ts){
    let headers = new Headers();
    console.log(ts);
    headers.append('Content-Type','application/json');
    return this.http.put('http://localhost:3000/projects/updateProject',ts,{headers:headers})
    .map(res => res.json());  
    
  } 

}

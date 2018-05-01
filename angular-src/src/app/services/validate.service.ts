import { Injectable } from '@angular/core';

@Injectable()
export class ValidateService {

  constructor() { }

  ValidateEmployeeRegister(user){
    if(user.website == undefined || user.companyRegNum == undefined || user.name == undefined  || user.fullname == undefined || user.password == undefined || user.username == undefined || user.dob == undefined || user.addressline == undefined || user.town == undefined || user.county == undefined || user.country == undefined){
      return false;
    }
    else{
      return true;
    }
  }

  ValidateCompRegister(user){
    if(user.website == undefined || user.companyRegNum == undefined || user.name == undefined || user.street == undefined || user.town == undefined || user.county == undefined || user.country == undefined || user.title == undefined || user.email == undefined || user.phone == undefined || user.password == undefined){
      return false;
    }
    else{
      return true;
    }
  }

  ValidateProjectRegister(user){
    if(user.createdBy == undefined || user.createDate == undefined || user.title == undefined || user.clientId == undefined || user.companyId == undefined || user.SiteAddress == undefined || user.projectProgress == undefined || user.projectComplete == undefined ){
      return false;
    }
    else{
      return true;
    }
  }

  ValidateClientRegister(user){
    if(user.Email == undefined || user.OfficeTel == undefined || user.MobileTel == undefined || user.Address == undefined || user.Name == undefined ){
      return false;
    }
    else{
      return true;
    }
  }

  ValidateEmployee(user){
    if(user.empName == undefined || user.empEmail == undefined || user.empUsername == undefined || user.empPosition == undefined || user.empDob == undefined || user.empPhone == undefined || user.empHrRate == undefined || user.empPassword == undefined || user.empName == "" || user.empEmail == "" || user.empUsername == "" || user.empPosition == "" || user.empDob == "" || user.empPhone == "" || user.empHrRate == "" || user.empPassword == ""){
      return false;
    }
    else{
      return true;
    }
  }
  ValidateInput(f){
    if(f==undefined || f=="" || f==null || f==0) return false
    else return true;
  }

  ValidatePassword(password){
    const mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
    return mediumRegex.test(password)&& password.length >=8;
  }

  twoInputsSame(s1,s2){
    if(s1 === s2){
      return true;
    }
    else{
      return false;
    }
  }

  ValidateEmail(email){
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toString().toLowerCase());
  }

  NoSpecialCharacters(input){
    const re = /^[_A-z0-9]*((-|\s)*[_A-z0-9])*$/;
    return re.test(input.toLowerCase());
  }
  dobFormat(dob){
    const re = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
    return re.test(dob);
  }

  ObjIdtoDate(object){
    let timestamp =object.toString().substring(0,8);
    return new Date( parseInt( timestamp, 16 ) * 1000 );
    
  }
  isSameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
  }
}

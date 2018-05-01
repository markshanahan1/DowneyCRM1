import { Injectable } from '@angular/core';
import {Router, CanActivate, CanActivateChild } from '@angular/router';
import {AuthService} from '../services/auth.service'

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        authService:AuthService,
        private router: Router
    ){}

    canActivate() {
        if (localStorage.getItem("id_token") == null) {
            this.router.navigate(['/login']);
            return false;
        }
        else
            return true;
     
    }
}
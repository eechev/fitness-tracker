import { AuthService } from './../auth.service';
import { NgForm } from '@angular/forms';
import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(private authService: AuthService) {}

  onSubmit(form: NgForm) {
    this.authService.loging({
      email: form.value.email,
      password: form.value.password,
    });
  }
}

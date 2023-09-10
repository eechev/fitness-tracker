import { NgModule } from '@angular/core';
import { provideAuth, getAuth } from '@angular/fire/auth';

import { SharedModule } from '../shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';

import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [SignupComponent, LoginComponent],
  imports: [SharedModule, AuthRoutingModule, provideAuth(() => getAuth())],
  exports: [],
})
export class AuthModule {}

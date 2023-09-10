import { NgModule, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { AuthService } from './auth/auth.service';

const routes: Routes = [
  { path: '', component: WelcomeComponent },
  {
    path: 'training',
    canMatch: [() => inject(AuthService).isAuth()],
    loadChildren: () =>
      import('./training/training.module').then((m) => m.TrainingModule),
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}

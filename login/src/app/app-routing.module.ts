import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeauthComponent } from './homeauth/homeauth.component';
import { ConfigurepyscanComponent } from './configurepyscan/configurepyscan.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'homeauth', component: HomeauthComponent },
  { path: 'configurepyscan', component: ConfigurepyscanComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

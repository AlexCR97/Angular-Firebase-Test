import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from 'src/app/components/login/login.component';
import { SignInComponent} from 'src/app/components/sign-in/sign-in.component';
import { HomeComponent } from 'src/app/components/home/home.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { PostsComponent } from './components/posts/posts.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'sign-in',
    component: SignInComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      {
        path: 'user-profile',
        component: UserProfileComponent,
      },
      {
        path: 'posts',
        component: PostsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

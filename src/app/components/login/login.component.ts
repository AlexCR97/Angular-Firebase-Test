import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterUserService } from 'src/app/services/register-user.service';
import { forkJoin, timer } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  public formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private registerUserService: RegisterUserService,
  ) {
    this.formGroup = this.formBuilder.group({
      correo: '',
      contrasena: '',
    });
  }

  ngOnInit() { }

  onSubmit() {
    console.log('signing in...');

    let correo: string = this.formGroup.value.correo;
    let contrasena: string = this.formGroup.value.contrasena;

    if (correo.trim().length == 0) {
      alert('Debes ingresar tu correo');
      return;
    }

    if (contrasena.trim().length == 0) {
      alert('Debes ingresar tu contraseña');
      return;
    }

    this.registerUserService.emailSignIn(correo, contrasena)
    .then(userCredential => {
      console.log('success signing in');
      console.log(userCredential);
      this.router.navigateByUrl('home');
    })
    .catch(error => {
      console.error('error signing in');
      console.error(error);

      switch (error.code) {
        case 'auth/user-not-found': {
          alert('No se encontro al usuario');
          break;
        }

        case 'auth/wrong-password': {
          alert('Tu contraseña es incorrecta');
          break;
        }
      }
    });
  }

  testAsync() {
    console.log('Testing...');

    let tasks = [
      timer(1000),
      timer(2000),
      timer(3000),
      timer(4000),
    ];

    forkJoin(...tasks).subscribe(
      result => {
        console.log('Success!');
        console.log(result);
      },
      error => {
        console.error('Error!');
        console.error(error);
      }
    );
  }

}

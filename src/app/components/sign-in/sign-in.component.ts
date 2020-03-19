import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterUserService } from 'src/app/services/register-user.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  public switchCard = 'correo';
  public formGroup: FormGroup;
  public isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private registerUserService: RegisterUserService,
  ) {
    this.formGroup = this.formBuilder.group({
      correo: '',
      contrasena: '',
      confirmarContrasena: '',
    });
  }

  ngOnInit() { }

  setCard(cardName: string) {
    this.switchCard = cardName;
  }

  async onSubmitCorreo() {
    let correo: string = this.formGroup.value.correo;

    if (correo.trim().length == 0) {
      alert('Debes proporcionar un correo');
      return;
    }
    
    let isEmailAvailable = await this.registerUserService.isEmailAvailable(correo);

    if (!isEmailAvailable) {
      alert('Ese correo ya no esta disponible');
      return;
    }

    this.setCard('contrasena');
  }

  onSubmitContrasena() {
    let contrasena: string = this.formGroup.value.contrasena;
    let confirmarContrasena: string = this.formGroup.value.confirmarContrasena;

    if (contrasena.trim().length == 0) {
      alert('Debes proporcionar una contraseña');
      return;
    }

    if (contrasena.trim().length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (confirmarContrasena.trim().length == 0) {
      alert('Debes confirmar tu contraseña');
      return;
    }

    if (contrasena != confirmarContrasena) {
      alert('Las contraseñas no coinciden');
      return;
    }

    this.registerUser();
  }

  registerUser() {
    this.isLoading = true;

    let formData: any = this.formGroup.value;
    console.log(formData);

    let user: User = {
      email: formData.correo,
      password: formData.contrasena,
    };

    // sign up
    this.registerUserService.emailSignUp(user)
    .then(userCredentials => {
      console.log('success signing up');
      console.log(userCredentials);

      user.uid = userCredentials.user.uid;

      // add user to firestore
      this.registerUserService.addUser(user)
      .then(docRef => {
        console.log('success adding user');
        console.log(docRef);
        this.isLoading = false;
        this.router.navigateByUrl('home');
      })
      // add user to firestore failed
      .catch(error => {
        console.error('error adding user');
        console.error(error);
        this.isLoading = false;
      });
    })
    // sign up failed
    .catch(error => {
      console.error('error signing up');
      console.error(error);
      this.isLoading = false;
    });
  }

}

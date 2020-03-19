import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { RegisterUserService } from 'src/app/services/register-user.service';
import { User } from 'src/app/models/user';
import { Observable } from 'rxjs';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  public editProfile = false;
  public formGroup: FormGroup;
  public imgUrl: any;
  public userObservable: Observable<User>;
  public user: User;
  public uploadingImg = false;

  constructor(
    private formBuilder: FormBuilder,
    private storageService: StorageService,
    private registerUserService: RegisterUserService,
  ) {

  }

  ngOnInit() {
    this.userObservable = this.registerUserService.getCurrentUser();
    this.userObservable.subscribe(user => {
      this.user = user;
      
      console.log('getting img url...');
      this.storageService.getImageUrl(`img/${this.user.uid}`).subscribe(url => {
        console.log(url);
        this.imgUrl = url;
      });
      
      this.formGroup = this.formBuilder.group({
        username: this.user.username,
        aboutme: this.user.aboutme,
      });
    });
  }

  onInputSelectImage($event: any) {
    console.log($event);

    const selectedFiles = $event.target.files;

    // no img selected
    if (selectedFiles.length == 0) {
      return;
    }

    // get selected img
    const img = $event.target.files[0];
    console.log(img);

    /*const fileReader = new FileReader();
    fileReader.onload = (e) => this.user.imgUrl = fileReader.result.toString();
    fileReader.readAsDataURL(img);*/

    console.log('uploading file...');

    this.uploadingImg = true;

    this.storageService.uploadFile(`img/${this.user.uid}`, img)
    .percentageChanges().subscribe(percentage => {
      console.log(percentage);
      this.uploadingImg = false;
    });
  }

  onSubmitEditProfile() {
    console.log('updating profile...');
    let formData = this.formGroup.value;

    let userCopy: User = {
      uid: this.user.uid,
      email: this.user.email,
      password: this.user.password,
      username: formData.username,
      aboutme: formData.aboutme,
    };

    this.registerUserService.updateUser(userCopy)
    .then(state => {
      console.log('success updating user');
      console.log(state);

      this.editProfile = false;
    })
    .catch(error => {
      console.error('error updating user');
      console.error(error);

      this.editProfile = false;
    });
  }

  setEditProfile(editProfile: boolean) {
    this.editProfile = editProfile;
  }

}

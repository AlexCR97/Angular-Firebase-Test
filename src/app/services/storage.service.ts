import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import 'firebase/storage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private storage: AngularFireStorage,
  ) { }

  getImageUrl(filePath: string): Observable<any> {
    const storageRef = this.storage.ref(filePath);
    return storageRef.getDownloadURL();
  }

  uploadFile(filePath: string, file: Blob): AngularFireUploadTask {
    const storageRef = this.storage.ref(filePath);
    return storageRef.put(file);
  }
}

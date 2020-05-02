import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { DtoProfile, DtoBank } from './twclient.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TargetAccountService {

  targetAccounts = new BehaviorSubject<DtoTargetAccount[]>([]);

  constructor() {
    this.loadTargetAccounts();
  }

  loadTargetAccounts() {
    const ref1 = firebase.database().ref('/targetAccounts/');
    ref1.once('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val();
        const key = childSnapshot.key;
        const ref3 = firebase.database().ref(`/profiles/${childData.profileRef}`);
        ref3.once('value', () => { })
          .then((profileSnapshot) => {
            const profileData = profileSnapshot.val();
            const profile = new DtoProfile();
            if (profileData != null) {
              profile.details = {
                avatar: profileData.avatar
              };
            }
            const ref2 = firebase.database().ref(`/banks/${childData.bankRef}`);
            ref2.once('value', (bankSnapshot) => {
              const dto = new DtoTargetAccount();
              dto.key = key;
              dto.bankKey = bankSnapshot.key;
              dto.profileKey = profileSnapshot.key;
              dto.profile = profile;
              const bankData = bankSnapshot.val();
              dto.bank = new DtoBank();
              dto.bank.title = bankData.name;
              dto.logo = bankData.logo;
              const dtos: DtoTargetAccount[] = new Array();
              dtos.push(dto);
              this.targetAccounts.next(dtos);
            });
          });
      });
    });
  }
}

export class DtoTargetAccount {
  key: string;
  avatarUrl?: string; // config: full url to storage
  profileKey?: string;
  bankKey?: string; // config: key
  logo?: string; // config: image name
  logoUrl: string; // config: image full url
  profile: DtoProfile;
  bank: DtoBank;
}

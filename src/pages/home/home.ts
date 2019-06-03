import { Component, ElementRef, ViewChild, OnInit, enableProdMode } from '@angular/core';
import { PushObject, Push, PushOptions } from '@ionic-native/push';

// import { MapComponent } from '../../components/map/map';



enableProdMode()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',

})
export class HomePage {
  texto = "";
  url = "";
  obj = {
    "to" : "BLN9vf3gbPfoTtmefz3syvTOsyjFr32blnWmIBRbTEI4D6CaLu17EGDyBRluDjkDM0COF07n7jckgmTzfZzfw6c",
    "notification" : {
    "title" : "Mensagem para o Firebase",
    "body" : "Teste firebase"
    }, 
    "data" : {
    "nome" : "Ricardo",
    "sobrenome" : "Lecheta"
    }
   }

  constructor(private push: Push) {
    
     this.pushsetup();
  }

  pushsetup() {
    // to check if we have permission
    this.push.hasPermission()
    .then((res: any) => {

      if (res.isEnabled) {
        alert('We have permission to send push notifications');
        const options: PushOptions = {
          android: {
            senderID: '341665036055'
          },
          ios: {
              alert: 'true',
              badge: true,
              sound: 'false'
          },
          windows: {},
          browser: {
              pushServiceURL: 'http://push.api.phonegap.com/v1/push'
          }
        };

        const pushObject: PushObject = this.push.init(options);
   
   
        pushObject.on('notification').subscribe((notification: any) => {
          alert(notification.message);
        });
        
        
        pushObject.on('registration').subscribe((registration: any) => {
          this.texto = registration.registrationId;
          alert(registration.registrationId);
          this.push.createChannel({
            id: registration.registrationId,
            description: registration.registrationId,
            // The importance property goes from 1 = Lowest, 2 = Low, 3 = Normal, 4 = High and 5 = Highest.
            importance: 3
           }).then(() => alert('Channel created'));
        });
        
        pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));

      } else {
        alert('We do not have permission to send push notifications');
      }

    });
    
   
  

   
  }
}

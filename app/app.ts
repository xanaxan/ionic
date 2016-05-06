import {App, Platform} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {FIREBASE_PROVIDERS, defaultFirebase, AngularFire} from 'angularfire2';
import {TabsPage} from './pages/tabs/tabs';
import {DateUtil} from './commons/dateutil';


@App({
  template: '<ion-nav [root]="rootPage"></ion-nav>',
  providers: [FIREBASE_PROVIDERS, defaultFirebase('https://blistering-heat-8491.firebaseio.com/'), DateUtil],
  config: {} // http://ionicframework.com/docs/v2/api/config/Config/
})
export class MyApp {
  rootPage: any = TabsPage;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }
}

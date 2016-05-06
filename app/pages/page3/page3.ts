import {Page, ActionSheet, NavController, Platform, Toast} from 'ionic-angular';
import {DatePicker} from 'ionic-native';
import {DateUtil} from '../../commons/dateutil';

@Page({
  templateUrl: 'build/pages/page3/page3.html'
})
export class Page3 {
  selectedSpendingCategory: String = '';
  selectedDate: string;
  amount = '';
  spendingsRef: Firebase;
  
  constructor(public platform: Platform, public nav: NavController, private dateutil: DateUtil) {
    this.selectedDate = this.dateutil.formatDate(new Date());
    this.spendingsRef = new Firebase('https://blistering-heat-8491.firebaseio.com/spendings');
  }
  
  showDatePicker() {
    DatePicker.show({
      date: this.dateutil.parseString(this.selectedDate),
      mode: 'date'
    }).then(
      date => this.selectedDate = this.dateutil.formatDate(date),
      err => console.log("Error occurred while getting date:", err)
      );
  }

  submitSpending() {
    var refYearMonth = this.spendingsRef.child(this.dateutil.makeFBDateChild(this.selectedDate));
    refYearMonth.push().set({
      category: this.selectedSpendingCategory,
      date: this.selectedDate,
      amount: this.amount
    });

    this.selectedSpendingCategory = '';
    this.amount = '';

    this.nav.present(Toast.create({
      message: 'Added to Firebase!',
      duration: 1000,
      cssClass: 'toast-light'
    }));
  }

  openSpendingCategory() {
    let actionSheet = ActionSheet.create({
      buttons: [
        {
          text: 'Lebensmittel',
          role: 'destructive',
          handler: () => {
            this.selectedSpendingCategory = 'Lebensmittel';
          }
        }, {
          text: 'Fortgehen',
          handler: (text) => {
            this.selectedSpendingCategory = 'Fortgehen';
          }
        }, {
          text: 'Mittag',
          role: 'cancel',
          handler: () => {
            this.selectedSpendingCategory = 'Mittagessen';
            this.openLunchCategories();
          }
        }
      ]
    });
    this.nav.present(actionSheet);
  }

  openLunchCategories() {
    let actionSheet = ActionSheet.create({
      buttons: [
        {
          text: 'Evi',
          handler: () => {
            this.selectedSpendingCategory += ' - Evi';
          }
        }, {
          text: 'Kantine',
          handler: (text) => {
            this.selectedSpendingCategory += ' - Kantine';
          }
        }, {
          text: 'Supperioer',
          handler: () => {
            this.selectedSpendingCategory += ' - Supperioer';
          }
        }, {
          text: 'Mitgenommen',
          handler: () => {
            this.selectedSpendingCategory += ' - Mitgenommen';
          }
        }
      ]
    });
    this.nav.present(actionSheet);
  }
}

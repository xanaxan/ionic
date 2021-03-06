import {Page, ActionSheet, NavController, Platform, Toast} from 'ionic-angular';
import {DatePicker} from 'ionic-native';
import {DateUtil} from '../../commons/dateutil';
// import {NgClass} from 'angular2/common';

@Page({
  templateUrl: 'build/pages/page3/page3.html'
})
export class Page3 {
  selectedSpendingCategory: string = '';
  selectedSpendingSubCategory: string = '';
  selectedDate: string;
  amount = '';
  recordsRef: Firebase;
  spendingCategoriesRef: Firebase;
  categories: Array<any> = [];
  subCategories: Array<any> = [];
  subCategoriesObjects: Object = [];
  
  constructor(public platform: Platform, public nav: NavController, private dateutil: DateUtil) {
    this.selectedDate = this.dateutil.formatDate(new Date());
    this.recordsRef = new Firebase('https://blistering-heat-8491.firebaseio.com/spendings/records');
    
    this.spendingCategoriesRef = new Firebase('https://blistering-heat-8491.firebaseio.com/spendings/administration/spending-categories');
    this.spendingCategoriesRef.on("value", (data: FirebaseDataSnapshot) => {
      var cats = data.exportVal();
      this.categories = [];
      this.subCategoriesObjects = {};
      for (var key1 in cats) {
        if (Number.isInteger(parseInt(key1))) {
          this.categories.push(cats[key1]);
        } else {
          this.categories.push(key1);
          this.subCategoriesObjects[key1] = cats[key1];
        }
      }
    });
  }
  
  selectCategory(category: string) {
    console.log(this.subCategoriesObjects[category]);
    this.subCategories = [];
    var data = this.subCategoriesObjects[category];
    for (var key in data) {
      this.subCategories.push(data[key]);
      console.log(this.subCategories);
      console.log(this.categories);
    }
    this.selectedSpendingCategory = category;
  }
  
  selectSubCategory(category: string) {
    console.log(category);
    this.selectedSpendingSubCategory = category;
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
    var refYearMonth = this.recordsRef.child(this.dateutil.makeFBDateChild(this.selectedDate));
    var cat = this.selectedSpendingCategory;
    if (this.selectedSpendingSubCategory != '') {
      cat += ' - ' + this.selectedSpendingSubCategory;
    }
    refYearMonth.push().set({
      category: cat,
      date: this.selectedDate,
      amount: this.amount
    });

    this.selectedSpendingCategory = '';
    this.selectedSpendingSubCategory = '';
    this.subCategories = [];
    this.amount = '';

    this.nav.present(Toast.create({
      message: 'Added to Firebase!',
      duration: 1000,
      cssClass: 'toast-light'
    }));
  }
}

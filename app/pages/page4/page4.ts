import {Page, ActionSheet, NavController, Platform, Toast} from 'ionic-angular';
import {DatePicker} from 'ionic-native';
import {DateUtil} from '../../commons/dateutil';
import {Category} from '../../commons/category';
// import {NgClass} from 'angular2/common';

@Page({
  templateUrl: 'build/pages/page4/page4.html'
})
export class Page4 {
  newCategory: string = '';
  selectedCategory: Category;
  selectedSpendingSubCategory: string = '';
  spendingCategoriesRef: Firebase;
  categories: Array<Category> = [];
  subCategories: Array<any> = [];
  subCategoriesObjects: Object = [];
  
  constructor(public platform: Platform, public nav: NavController, private dateutil: DateUtil) {  
    this.spendingCategoriesRef = new Firebase('https://blistering-heat-8491.firebaseio.com/spendings/administration/spending-categories');
    this.spendingCategoriesRef.on("value", (data: FirebaseDataSnapshot) => {
      var cats = data.exportVal();
      this.categories = [];
      this.subCategoriesObjects = {};
      var hightestKey = 0;
      for (var key1 in cats) {
        if (Number.isInteger(parseInt(key1))) {
          this.categories.push({text: cats[key1], path: '/' + key1, subcategories: null});
        } else {
          var text = key1 + ' -';
          var subs = cats[key1];
          var subArr: Array<Category> = [];
          for (var key2 in subs) {
            subArr.push({text: subs[key2], path: '/' + key1 + '/' + key2, subcategories: null});
            text += ' ' + subs[key2];
            console.log(subs[key2]);
          }
          this.categories.push({text: key1, path: '/' + key1, subcategories: subArr});
          this.subCategoriesObjects[key1] = cats[key1];
        }
      }
    });
  }
  
  select(category: Category) {
    console.log(category);
    this.selectedCategory = category;
  }
  
  delete() {
    var removeRef = this.spendingCategoriesRef.child(this.selectedCategory.path);
    removeRef.remove(this.onComplete);
    this.selectedCategory = null;
  }

  save(inputCategory, inputSubcategory) {
    console.log(inputCategory);
    var highestKey = 0;
    var tempRef = this.spendingCategoriesRef;
    var cats;
    
    if (inputSubcategory != undefined) {
      console.log('inputSubcategory: ' + inputSubcategory);
      tempRef = this.spendingCategoriesRef.child('/' + inputCategory);
    }
    
    tempRef.once("value", (data: FirebaseDataSnapshot) => {
      cats = data.exportVal();
    });
    
    for (var key1 in cats) {
      if (Number.isInteger(parseInt(key1)) && parseInt(key1) > highestKey) {
        highestKey = parseInt(key1);
      }
    }

    highestKey++;
    console.log(highestKey);
    if (inputSubcategory != undefined) {
      console.log('bb');
      var o = {[highestKey]: inputSubcategory};
    } else {
      var o = {[highestKey]: inputCategory};
    }
    tempRef.update(o);
    
    this.nav.present(Toast.create({
      message: 'Added to Firebase!',
      duration: 500,
      cssClass: 'toast-light'
    }));
  }
  
  onComplete = function(error) {
    if (error) {
      console.log('Synchronization failed');
    } else {
      console.log('Synchronization succeeded');
    }
  };
}
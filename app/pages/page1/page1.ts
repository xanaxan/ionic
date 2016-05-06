import {Page} from 'ionic-angular';
import {Observable} from 'rxjs/Observable';
import {AngularFire,FirebaseListObservable} from 'angularfire2';
import {NgZone} from 'angular2/core';
import {OrderBy} from '../../pipes/orderby.pipe';
import {Spending} from '../../commons/spending';
import {DateUtil} from '../../commons/dateutil';

import * as Firebase from 'firebase';


@Page({
  templateUrl: 'build/pages/page1/page1.html',
  pipes: [OrderBy]
})
export class Page1 {
  items: Observable<any[]>;
  allspendings: FirebaseListObservable<any[]>;
  spendingsTemp: Array<Spending> = [];
  spendings: Array<Spending> = [];
  questions: FirebaseListObservable<any[]>;
  spendingsRef: Firebase = new Firebase("https://blistering-heat-8491.firebaseio.com/spendings");
  
  sortingColumnCounter: number = 0;
  columns: string[] = ['date','category','amount'];
  sortingDirection: string = '-';
  sortingColumn = this.columns[this.sortingColumnCounter];

  constructor(private af: AngularFire, private ngZone: NgZone, private dateutil: DateUtil) {

  }
  
  ngAfterViewInit() {
    this.spendingsRef.on("value", (snapshot: FirebaseDataSnapshot) => {
      this.extract(snapshot.exportVal());
      // console.log(snapshot.val());
      // snapshot.forEach((childSnapshot: FirebaseDataSnapshot) => {
      //   childSnapshot.forEach((itemSnapshot: FirebaseDataSnapshot) => {
      //     var key = itemSnapshot.key();
      //     var item = itemSnapshot.val();
      //     this.spendings.push({
      //       key: key,
      //       date: item.date,
      //       category: item.category,
      //       amount: item.amount
      //     });
      //     console.log(item);
        // });
      // });
    });
  }
  
  extract(obj) {
    this.spendings = []
    for (var monthKey in obj) {
      var month = obj[monthKey];
      console.log(monthKey); console.log(month);
      for (var itemKey in month) {
        var item = month[itemKey];
        console.log(itemKey); console.log(item);
        this.spendings.push({key:itemKey, date:item.date, category:item.category, amount:item.amount});
      }
    }
  }
  
  deleteItem(spending) {
    var removePath = this.dateutil.makeFBDateChild(spending.date);
    console.log(removePath);
    var removeRef = this.spendingsRef.child(removePath + '/' + spending.key);
    removeRef.remove(this.onComplete);
  }
  
  onComplete = function(error) {
    if (error) {
      console.log('Synchronization failed');
    } else {
      console.log('Synchronization succeeded');
    }
  };
  
  sorting(): string {
    return this.sortingDirection + this.sortingColumn;
  }
  
  changeSortingColumn() {
    if (++this.sortingColumnCounter > this.columns.length - 1) {
      this.sortingColumnCounter = 0;
    }
    this.sortingColumn = this.columns[this.sortingColumnCounter];
  }
  
  changeSortingDirection() {
    if (this.sortingDirection === '-') {
      this.sortingDirection = '';
    } else {
      this.sortingDirection = '-';
    }
  }
}

import {Page} from 'ionic-angular';
import {Http, HTTP_PROVIDERS} from 'angular2/http';
import 'rxjs/add/operator/map';
import {NgZone, Input, OnInit} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import {Spending} from '../../commons/spending'
import * as c3 from 'c3-windows';

@Page({
  templateUrl: 'build/pages/page2/page2.html'
})
export class Page2 {
  // spendings: FirebaseListObservable<any[]>;
  spendings: Array<Spending> = [];
  columns = []['data1', 20];
  chart: c3.ChartAPI;

  constructor(private af: AngularFire, private ngZone: NgZone) {

  }

  // ngOnInit() {
  dodo() {
    this.doFirebase();
  }

  doFirebase() {
    var ref: Firebase = new Firebase("https://blistering-heat-8491.firebaseio.com/spendings");
    this.giveittome(ref);
  }

  giveittome(ref: Firebase) {
    this.spendings = [];
    ref.once("value", (snapshot) => {
      var obj = snapshot.exportVal();
      for (var monthKey in obj) {
        var month = obj[monthKey];
        console.log(monthKey); console.log(month);
        for (var itemKey in month) {
          var item = month[itemKey];
          console.log(itemKey); console.log(item);
          this.spendings.push({ key: itemKey, date: item.date, category: item.category, amount: item.amount });
        }
      }
    });
  }

  /*giveittome(ref) {
    this.spendings = [];
    ref.once("value", (snapshot) => {
      // The callback function will get called twice, once for "fred" and once for "barney"
      snapshot.forEach((childSnapshot) => {
        // key will be "fred" the first time and "barney" the second time
        var key = childSnapshot.key();
        // childData will be the actual contents of the child
        var childData = childSnapshot.val();
        console.log(this);
        this.spendings.push({
          key: key,
          date: childData.date,
          category: childData.category,
          amount: childData.amount
        });
        console.log(key);
        console.log(childData.category);
        // console.log(this.items);
        // debugger;
      });
    });
  }*/

  //    this.no.forEach((nos) =>{  // foreach statement
  //             document.write(" number=:"+nos);
  //               })
  fuck() {
    console.log('fuck');
    this.dodo();
    this.doit();
  }

  ngAfterViewInit() {
    console.log('afterviewinit');
  }
  doit() {
    var consolidated = this.spendings.reduce((result: Array<Spending>, curr) => {
      var exists = false;
      result.forEach(function (valueFE, key) {
        if (!exists && valueFE.category === curr.category) {
          exists = true;
          valueFE.amount = parseInt(valueFE.amount) + parseInt(curr.amount) + '';
        }
      });
      if (!exists) {
        result.push(curr);
      }
      return result;
    }, []);

    if (consolidated.length < 2) {
      console.error('not enough items to draw graph');
    } else {
      this.generateChart(consolidated);
      for (var i = 1; i < consolidated.length; i++) {
        this.chart.load({ columns: [[consolidated[i].category, consolidated[i].amount]] });
      }
    }
  }

  generateChart(arr: Array<Spending>) {
    this.chart = c3.generate({
      data: {
        columns: [
          [arr[0].category, arr[0].amount]
        ]
        ,
        type: 'pie'
        // onclick: function (d, i) { console.log("onclick", d, i); },
        // onmouseover: function (d, i) { console.log("onmouseover", d, i); },
        // onmouseout: function (d, i) { console.log("onmouseout", d, i); }
      }
    });

  }
}

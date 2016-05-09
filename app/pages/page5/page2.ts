import {Page} from 'ionic-angular';
import {Http, HTTP_PROVIDERS} from 'angular2/http';
import 'rxjs/add/operator/map';
import {NgZone, Input} from 'angular2/core';
import {PaginatePipe, PaginationControlsCmp, PaginationService, IPaginationInstance} from 'ng2-pagination';


@Page({
  templateUrl: 'build/pages/page2/page2.html',
  directives: [PaginationControlsCmp],
  pipes: [PaginatePipe],
  providers: [PaginationService]
})
export class Page2 {
  @Input('data') data: Object;
  list: Object;
    constructor(private http: Http, private ngZone: NgZone) {
      this.ngZone.run(() => {
      http.get('MovieCollection.json')
        .map((res) => res.json())
        .subscribe(data => this.data = data['movies 2015'],
                    err => console.log('scheisse: ' + err));
      });
      console.log(this.data);
    }
    
    public config: IPaginationInstance = {
        id: 'custom',
        itemsPerPage: 10,
        currentPage: 1
    };
}

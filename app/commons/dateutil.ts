export class DateUtil {
  formatDate(date: Date) : string {
    var weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";
    var month = (date.getMonth() + 1) < 10 ? ('0' + (date.getMonth() + 1)) : ('' + (date.getMonth() + 1));
    var day = date.getDate() < 10 ? '0' + date.getDate() : '' + date.getDate();
    return date.getFullYear() + '-' + month + '-' + day;
  }

  parseString(str: string) : Date {
    var dateArr = str.split("-");
    var date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    date.setFullYear(parseInt(dateArr[0]));
    date.setMonth(parseInt(dateArr[1]) - 1);
    date.setDate(parseInt(dateArr[2]));
    return date;
  }
  
  makeFBDateChild(str: string): string {
    var d = this.parseString(str);  
    return d.getFullYear() + this.fillUpToTwoDigits(d.getMonth() + 1);
  }
  
  fillUpToTwoDigits(number: number): string {
    return number < 10 ? '0' + number : '' + number;
  }
}
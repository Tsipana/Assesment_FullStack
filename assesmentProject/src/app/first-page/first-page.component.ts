import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
declare var gapi: any;


@Component({
  selector: 'app-first-page',
  templateUrl: './first-page.component.html',
  styleUrls: ['./first-page.component.css']
})
export class FirstPageComponent {
  EmpLeaveArr: any[] = [];
  isResultLoaded = false;
  isUpdateFormActive = false;

  first_name: string ="";
  last_name: string ="";
  leave_start: string ="";
  leave_end: string ="";
  leave_type: string ="";
  reason: string ="";
  EmploeeID = "";
  TotLeaveTaken = 0;
  TotLeaveLefts = 0;
  options = ["Sick Leave", "Maternity Leave", "Vacation Leave:"];

  constructor(private http: HttpClient, private router: Router){
    this.getAllEmpLeave();
    //initiate google api request
    this.initClient();
  }

  ngOnInit(): void {
    gapi.load('client', this.initClient);
  }
 
  getAllEmpLeave()
  {
    this.http.get("http://localhost:8085/api/tbleadays/")
    .subscribe((resultData: any)=>
    {
        this.isResultLoaded = true;
        console.log(resultData.data);
        this.EmpLeaveArr = resultData.data;
    });
  }

  register()
  {
   // this.isLogin = false;
   // alert("hi");
    let bodyData = {
      "first_name" : this.first_name,
      "last_name" : this.last_name,
      "leave_start" : this.leave_start,
      "leave_end" : this.leave_end,
      "leave_type" : this.leave_type,
      "reason" : this.reason,
    };
 
    this.http.post("http://localhost:9002/api/tbleadays/add",bodyData).subscribe((resultData: any)=>
    {
        console.log(resultData);
        alert("Employee Registered Successfully")
        this.createEvent();
        this.router.navigate(['SecondPageComponent']);
        this.getAllEmpLeave();
    });
  }
  //Submit information to the database
  save()
  {
    if(this.EmploeeID == '')
    {
        this.register();
    }  
  }

  //Calculate dates taken
  TotLeaveTake(Sdatee:string, Edate:string) : number{
    let dateStart = new Date(Sdatee);
    let dateEnd = new Date(Edate);
    const oneDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.round(Math.abs((dateStart.getTime() - dateEnd.getTime()) / oneDay));

    return diffDays;
  }

  //Calculate the dayes left
  TotLeaveLeft(Edate:string): number{
    let dateEnd = new Date(this.leave_start);
    const currentDate = new Date();
    const daysLeft = Math.ceil((dateEnd.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft;
  }

  //Google API
  initClient() {
    gapi.client.init({
      apiKey: 'YOUR_API_KEY',
      clientId: 'YOUR_CLIENT_ID',
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
      scope: 'https://www.googleapis.com/auth/calendar.events'
    }).then(() => {
      console.log('Google API client initialized');
    }, (error: any) => {
      console.error('Error initializing Google API client', error);
    });
  }
  //Submi information to google
  createEvent() {
    const event = {
      'summary': this.leave_type,
      'description': this.reason,
      'start': {
        'dateTime': this.leave_start,
        'timeZone': 'America/Los_Angeles'
      },
      'end': {
        'dateTime': this.leave_end,
        'timeZone': 'America/Los_Angeles'
      },
      'reminders': {
        'useDefault': true
      }
    };
  
    const request = gapi.client.calendar.events.insert({
      'calendarId': 'primary',
      'resource': event
    });
  
    request.execute((event) => {
      console.log('Event created: %s', event.htmlLink);
    });
  }
}

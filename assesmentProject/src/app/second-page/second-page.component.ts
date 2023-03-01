import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-second-page',
  templateUrl: './second-page.component.html',
  styleUrls: ['./second-page.component.css']
})
export class SecondPageComponent {
  EmpLeaveArr: any[] = [];
  isResultLoaded = false;
  isUpdateFormActive = false;

  first_name: string ="";
  last_name: string ="";
  leave_start: string ="";
  leave_end: string ="";
  leave_type: string ="";
  reason: string ="";
  TotLeaveTaken = 0;
  TotLeaveLefts = 0;

  constructor(private http: HttpClient){
    this.getAllEmpLeave();
  }

  ngOnInit(): void {
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
        this.getAllEmpLeave();
    });
  }

  TotLeaveTake() : number{
    let dateStart = new Date(this.leave_start);
    let dateEnd = new Date(this.leave_start);
    const oneDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.round(Math.abs((dateStart.getTime() - dateEnd.getTime()) / oneDay));

    return diffDays;
  }

  TotLeaveLeft(): number{
    let dateEnd = new Date(this.leave_start);
    const currentDate = new Date();
    const daysLeft = Math.ceil((dateEnd.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft;
  }
}

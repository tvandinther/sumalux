import { NgModule, Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";

import { Yeelight } from '../yeelight';
import { YeelightService } from '../yeelight.service'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

	lights: Yeelight[];

  constructor(
		private yeelightService: YeelightService
	) { }

  ngOnInit(): void {
		this.getYeelights();
	}
	
	getYeelights(): void {
		this.yeelightService.getAll()
			.subscribe(yeelights => {
				this.lights = yeelights;
				console.log(this.lights);
			});
	}

	scan(): void {
		this.yeelightService.scan()
			.subscribe(lights => {
				this.lights = lights;
			})
	}

}

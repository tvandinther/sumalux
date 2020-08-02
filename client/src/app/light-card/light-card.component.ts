import { NgModule, Component, OnInit, Input } from '@angular/core';
import { Observable } from "rxjs";

import { Yeelight } from '../yeelight';
import { YeelightService } from '../yeelight.service'

@Component({
  selector: 'app-light-card',
  templateUrl: './light-card.component.html',
  styleUrls: ['./light-card.component.scss']
})
export class LightCardComponent implements OnInit {

	@Input('light') light: Yeelight;
	ext_state: {
		brightness: number,
		rgb: number,
		hue: number,
		sat: number,
	}

  constructor(
		private yeelightService: YeelightService
	) { }

  ngOnInit(): void { 
		console.log(this.light);
		this.ext_state = this.light.state;
		this.ext_state.rgb = this.rgbToHex(this.ext_state.rgb);
	}

	toggle(): void {
		const prev_state = this.light.state.on;
		this.yeelightService.command(this.light, "set_power", { power: prev_state ? "off" : "on" })
			.subscribe(
				(data: string[]) => {
				console.log(data);
				this.light.state.on = !prev_state;
				this.light.error = null;
			},
				(error: any) => {
					this.light.state.on = prev_state;
					this.light.error = error;
				}
			)
	}

	setBrightness() {
		const prev_state = this.light.state.brightness;
		this.yeelightService.command(this.light, "set_brightness", { brightness: this.ext_state.brightness })
			.subscribe(
				(data: string[]) => {
					console.log(data);
					this.light.state.on = !prev_state;
					this.light.error = null;
				},
				(error: any) => {
					this.light.state.brightness = prev_state;
					this.light.error = error;
				}
			)
	}

	setRGB() {
		const prev_state = this.light.state.rgb;
		this.yeelightService.command(this.light, "set_rgb", { rgb: this.hexToRgb(this.ext_state.rgb) })
			.subscribe(
				(data: string[]) => {
					console.log(data);
					this.light.state.on = !prev_state;
					this.light.error = null;
				},
				(error: any) => {
					this.light.state.brightness = prev_state;
					this.light.error = error;
				}
			)
	}

	hexToRgb(hex) {
    let bigint = parseInt(hex.replace('#', ''), 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;

    return [r, g, b];
	}

	rgbToHex(rgb) {
		let r = rgb >> 16 & 255;
		let g = rgb >> 8 & 255;
		let b = rgb & 255;
		return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
	}
}

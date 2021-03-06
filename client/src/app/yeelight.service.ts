import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'

import { Yeelight, Method } from './yeelight'

@Injectable({
  providedIn: 'root'
})
export class YeelightService {

	private apiUrl = '/api/light';
	private httpOptions = {
		headers: new HttpHeaders({ 'Content-Type': 'application/json' })
	};

	constructor(
		private http: HttpClient
	) { }
	
	getAll(): Observable<Yeelight[]> {
		return this.http.get<Yeelight[]>(`${this.apiUrl}/get_all`);
	}

	scan(): Observable<Yeelight[]> {
		return this.http.get<Yeelight[]>(`${this.apiUrl}/scan`);
	}

	command(light: Yeelight, method, parameters?: any): Observable<any> {
		const source = this.http.post<any>(`${this.apiUrl}/command`, {
			target: light.ip,
			method: method,
			parameters: parameters,
		}, this.httpOptions);

		return source.pipe(map(res => {
			if (res.success) return res
			else if (!res.success) throw(res)
		}))
	}
}

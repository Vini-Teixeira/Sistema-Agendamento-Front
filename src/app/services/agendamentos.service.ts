import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Agendamentos } from '../componentes/home/home.component';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class AgendamentosService {
  private apiUrl = 'https://sistema-agendamento-back.onrender.com/agendamentos'

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken')
    return new HttpHeaders().set('Authorization', `Bearer ${token}`)
  }

  getAgendamentos(): Observable<Agendamentos[]> {
    return this.http.get<Agendamentos[]>(`${this.apiUrl}`, { headers: this.getAuthHeaders() })
  }

  saveAgendamento(agendamento: Agendamentos): Observable<Agendamentos> {
    return this.http.post<Agendamentos>(`${this.apiUrl}`, agendamento, { headers: this.getAuthHeaders() } )
  }

  updateAgendamento(id: string, agendamento: Agendamentos): Observable<Agendamentos> {
    return this.http.put<Agendamentos>(`${this.apiUrl}/${id}`, agendamento, { headers: this.getAuthHeaders() })
  }

  deleteAgendamento(ids: string[]): Observable<any> {
    return this.http.delete(`${this.apiUrl}`, { 
      headers: this.getAuthHeaders(),
      body: { ids } })
  }
}
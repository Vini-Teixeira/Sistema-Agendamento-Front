import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Agendamentos } from '../componentes/home/home.component';

@Injectable({
  providedIn: 'root'
})

export class AgendamentosService {
  private apiUrl = 'http://localhost:3000/agendamentos'

  constructor(private http: HttpClient) { }

  getAgendamentos(): Observable<Agendamentos[]> {
    return this.http.get<Agendamentos[]>(`${this.apiUrl}`)
  }

  saveAgendamento(agendamento: Agendamentos): Observable<Agendamentos> {
    return this.http.post<Agendamentos>(`${this.apiUrl}`, agendamento)
  }

  updateAgendamento(id: string, agendamento: Agendamentos): Observable<Agendamentos> {
    return this.http.put<Agendamentos>(`${this.apiUrl}/${id}`, agendamento)
  }

  deleteAgendamento(ids: string[]): Observable<any> {
    return this.http.delete(`${this.apiUrl}`, { body: { ids } })
  }
}
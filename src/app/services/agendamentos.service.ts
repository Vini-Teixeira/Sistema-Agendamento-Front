import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Agendamentos } from '../componentes/home/home.component';

@Injectable({
  providedIn: 'root'
})

export class AgendamentosService {
  private apiUrl = 'https://https://sistema-agendamento-back.onrender.com/agendamentos'

  constructor(private http: HttpClient) { }

  getAgendamentos(): Observable<Agendamentos[]> {
    return this.http.get<Agendamentos[]>(this.apiUrl)
  }

  saveAgendamento(agendamento: any): Observable<any> {
    return this.http.post(this.apiUrl, agendamento)
  }

  updateAgendamento(id: string, agendamento: Agendamentos) {
    return this.http.put(`${this.apiUrl}/${id}`, agendamento)
  }

  deleteAgendamento(ids: string[]): Observable<any> {
    return this.http.delete(`http://localhost:3000/agendamentos`, { body: { ids } })
  }
}
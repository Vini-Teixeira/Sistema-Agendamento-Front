import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  isLoggedIn: boolean = false
  private baseUrl = 'http://localhost:3000'

  constructor(private http: HttpClient) { }

  login(email: string, senha: string): Observable<any> {
    const url = `${this.baseUrl}/auth/loginUsuario`
    const body = { email, senha }
    return this.http.post(url, body)
  }

  storeToken(token: string): void {
    localStorage.setItem('authToken', token)
    this.isLoggedIn = true
  }

  isUserLoggedIn(): boolean {
    if(typeof localStorage !== 'undefined') {
      return !!localStorage.getItem('authToken')
    }
    return false
  }

  logout(): void {
    localStorage.removeItem('authToken')
    this.isLoggedIn = false
  }

  register(email: string, senha: string, confirmeSenha: string): Observable<any> {
    const url = `${this.baseUrl}/auth/registroUsuario`
    const body = { email, senha, confirmeSenha }
    return this.http.post(url, body)
  }
}

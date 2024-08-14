import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router'; 

import { RegistroUsuarioComponent } from "../registro-usuario/registro-usuario.component";
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgOptimizedImage, RegistroUsuarioComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit, OnDestroy {

  formLogin: FormGroup;
  errorMessage: string | null = null

  currentWord: string = ''
  words: string[] = ['AGENDAMENTOS', 'ORÇAMENTOS']  // Palavras dispostas para animação
  currentWordIndex: number = 0 // termo para identificar qual palavra está sendo disposta atualmente
  letterIndex: number = 0 // responsável por identificar a posição da letra atual
  isDeleting: boolean = false // verificar se o modo "apagar" está ativo ou não
  interval: any
  timeout: any

  constructor(private ngZone: NgZone, private router: Router,private authService: AuthService) {
    this.formLogin = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      senha: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.startAnimation()
  }

  ngOnDestroy(): void{
    this.clearTimes()
  }

  clearTimes():void {
    if(this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
    if(this.timeout) {
      clearTimeout(this.timeout)
      this.timeout = null
    }
  }

  startAnimation(): void {
    this.clearTimes(); // Certificador para verificar os intervalos anteriores sendo limpos
    this.ngZone.runOutsideAngular(() => { // Usado quando funções ou operações precisam ser executadas no início da aplicação.
      this.interval = setInterval(() => {
        this.ngZone.run(() => {
          const currentFullWord = this.words[this.currentWordIndex];
          if (this.isDeleting) {
            if (this.letterIndex > 0) {
              this.currentWord = currentFullWord.substring(0, --this.letterIndex);
            } else {
              this.isDeleting = false;
              this.currentWordIndex = (this.currentWordIndex + 1) % this.words.length;
              this.timeout = setTimeout(() => {
                this.startAnimation();
              }, 1000);
            }
          } else {
            if (this.letterIndex < currentFullWord.length) {
              this.currentWord = currentFullWord.substring(0, ++this.letterIndex);
            } else {
              this.isDeleting = true;
              this.timeout = setTimeout(() => {
                this.startAnimation();
              }, 1000);
            }
          }
        });
      }, 200);
    });
  }

  openModal(): void {
    const modal = document.getElementById('registroModal')
    if (modal) {
      modal.style.display = 'block'
    }
  }

  closeModal(): void {
    const modal = document.getElementById('registroModal')
    if(modal){
      modal.style.display = 'none'
    }
  }

  onSubmit() {
    const email = this.formLogin.get('email')?.value
    const senha = this.formLogin.get('senha')?.value

    this.authService.login(email, senha).subscribe(
      response => {
        const token = response.token
        this.authService.storeToken(token)
        this.errorMessage = null
        this.router.navigate(['/home'])
      },
      error => {
        console.log('Falha no login', error)
        if(error.status === 404) {
          this.errorMessage = 'Usuário ou senha inválidos.'
        } else {
          this.errorMessage = 'Erro ao realizar o login. Tente novamente mais tarde!'
        }
      }
    )
  }

}
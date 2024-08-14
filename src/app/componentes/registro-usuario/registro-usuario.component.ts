import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro-usuario',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './registro-usuario.component.html',
  styleUrl: './registro-usuario.component.scss'
})
export class RegistroUsuarioComponent implements OnInit{
  formRegister!: FormGroup;

  constructor(private authService: AuthService) {}

  ngOnInit(): void{
    this.formRegister =  new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      senha: new FormControl('',),
      confirmeSenha: new FormControl('')
    })
  }

  closeModal(): void {
    const modal= document.getElementById('registroModal')
    if(modal) {
      modal.style.display= 'none'
    }
  }

  onSubmit() {
    const email = this.formRegister.get('email')?.value;
    const senha = this.formRegister.get('senha')?.value;
    const confirmeSenha = this.formRegister.get('confirmeSenha')?.value;

    this.authService.register(email, senha, confirmeSenha).subscribe(
      response => {
        console.log('Usuário criado com sucesso.', response);
        // Redirecione ou realize outras ações
      },
      error => {
        console.error('Erro detectado. Tente novamente mais tarde!', error);
      }
    );
  }
}

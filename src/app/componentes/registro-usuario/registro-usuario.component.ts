import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-registro-usuario',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './registro-usuario.component.html',
  styleUrl: './registro-usuario.component.scss'
})
export class RegistroUsuarioComponent implements OnInit{
  formRegister!: FormGroup;

  ngOnInit(): void{
    this.formRegister =  new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      senha: new FormControl('',),
      confirmPassword: new FormControl('')
    })
  }

  closeModal(): void {
    const modal= document.getElementById('registroModal')
    if(modal) {
      modal.style.display= 'none'
    }
  }
}

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RegistroUsuarioComponent } from './registro-usuario.component';
import { AuthService } from '../../services/auth.service';
import { of, throwError} from 'rxjs';

describe('RegistroUsuarioComponent', () => {
  let component: RegistroUsuarioComponent;
  let fixture: ComponentFixture<RegistroUsuarioComponent>;
  let authServiceMock: any

  beforeEach(() => {
    authServiceMock  = {
      register: jest.fn(),
    }

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [RegistroUsuarioComponent],
      providers: [
        {provide: AuthService, useValue: authServiceMock},
      ],
    }).compileComponents

    fixture = TestBed.createComponent(RegistroUsuarioComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('deve exibir mensagem de confirmação ao finalizar registro com sucesso', () => {
    const sucessMessage = 'Usuário registrado com sucesso!'
    authServiceMock.register.mockReturnValue(of({message: sucessMessage }))
    component.formRegister.setValue({
      email: 'teste@teste.com',
      senha: '123456',
      confirmeSenha: '123456'
    })

    component.onSubmit()
    fixture.detectChanges()

    const confirmationMessage = fixture.nativeElement.querySelector('.success-message')
    expect(confirmationMessage).toBeTruthy()
    expect(confirmationMessage.textContent).toContain(sucessMessage)
  })

  it('não deve exibir mensagem de confirmação em caso de erro', () => {
    authServiceMock.register.mockReturnValue(throwError(() => new Error('Erro ao registrar')))
    component.formRegister.setValue({
      email: 'teste@teste.com',
      senha: '123456',
      confirmeSenha: '123456',
    })

    component.onSubmit()
    fixture.detectChanges()

    const confirmationMessage = fixture.nativeElement.querySelector('.success-message')
    expect(confirmationMessage).toBeFalsy
  })
});
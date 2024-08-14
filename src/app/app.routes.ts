import { Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { RegistroUsuarioComponent } from './componentes/registro-usuario/registro-usuario.component';
import { HomeComponent } from './componentes/home/home.component';
import { CanActivateGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', component:LoginComponent, pathMatch: 'full', title:'Login - Sistema' },
    { path: 'registro-usuario', component: RegistroUsuarioComponent, title: 'Registro de Usuário' },
    { path: 'home', component: HomeComponent, title: 'Home', canActivate: [CanActivateGuard] }
];
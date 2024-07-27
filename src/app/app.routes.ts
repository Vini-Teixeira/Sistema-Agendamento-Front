import { Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { RegistroUsuarioComponent } from './componentes/registro-usuario/registro-usuario.component';

export const routes: Routes = [
    { path: '', component:LoginComponent, pathMatch: 'full' },
    { path: 'registro-usuario', component: RegistroUsuarioComponent }
];

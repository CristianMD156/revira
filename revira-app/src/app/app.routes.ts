import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home.page';
import { CadastroOfertaPage } from './pages/cadastro-oferta/cadastro-oferta.page';
import { ReservasPage } from './pages/reservas/reservas.page';
export const routes: Routes = [
 { path: '', component: HomePage },
 { path: 'nova-oferta', component: CadastroOfertaPage },
 { path: 'reservas', component: ReservasPage },
 { path: '**', redirectTo: '' }
];

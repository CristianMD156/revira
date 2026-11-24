import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonRouterOutlet, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, addCircleOutline, bookmarkOutline } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonApp, IonRouterOutlet, IonIcon, IonLabel, RouterLink, RouterLinkActive],
  template: `
    <ion-app>
      <ion-router-outlet></ion-router-outlet>
      <nav class="app-bottom-nav" aria-label="Navegação principal">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" aria-label="Início">
          <ion-icon name="home-outline"></ion-icon><ion-label>Início</ion-label>
        </a>
        <a routerLink="/nova-oferta" routerLinkActive="active" aria-label="Anunciar">
          <ion-icon name="add-circle-outline"></ion-icon><ion-label>Anunciar</ion-label>
        </a>
        <a routerLink="/reservas" routerLinkActive="active" aria-label="Reservas">
          <ion-icon name="bookmark-outline"></ion-icon><ion-label>Reservas</ion-label>
        </a>
      </nav>
    </ion-app>
  `,
})
export class AppComponent {
  constructor() {
    addIcons({ homeOutline, addCircleOutline, bookmarkOutline });
  }
}

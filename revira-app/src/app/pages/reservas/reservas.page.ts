import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader,
  IonCardTitle, IonCardContent, IonChip, IonButton,
} from '@ionic/angular/standalone';
import { DadosService } from '../../services/dados.service';
import { Reserva } from '../../models';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [
    CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonCard,
    IonCardHeader, IonCardTitle, IonCardContent, IonChip, IonButton,
  ],
  template: `
    <ion-header><ion-toolbar><ion-title>Minhas reservas</ion-title></ion-toolbar></ion-header>
    <ion-content class="ion-padding">
      <div class="intro">
        <h1>Suas escolhas fazem a diferença.</h1>
        <p>Acompanhe os alimentos que você reservou e confira as orientações de retirada.</p>
      </div>
      <p *ngIf="erro" class="notice">{{ erro }}</p>
      <ion-card *ngFor="let r of reservas">
        <ion-card-header><ion-card-title>{{ r.titulo }}</ion-card-title></ion-card-header>
        <ion-card-content>
          <p>Quantidade: {{ r.quantidade }}</p>
          <p>Data: {{ r.data | date:'dd/MM/yyyy HH:mm' }}</p>
          <ion-chip [color]="r.status === 'reservada' ? 'success' : 'medium'">{{ r.status }}</ion-chip>
          <ion-button *ngIf="r.status === 'reservada'" expand="block" fill="outline" color="danger"
            [disabled]="cancelandoId === r.id" (click)="cancelar(r)">
            {{ cancelandoId === r.id ? 'Cancelando...' : 'Cancelar reserva' }}
          </ion-button>
        </ion-card-content>
      </ion-card>
      <div *ngIf="!reservas.length && !erro" class="empty">
        Você ainda não possui reservas. Explore as ofertas na tela inicial.
      </div>
    </ion-content>
  `,
})
export class ReservasPage {
  reservas: Reserva[] = [];
  erro = '';
  cancelandoId: number | null = null;

  constructor(private dados: DadosService) {}

  async ionViewWillEnter(): Promise<void> {
    await this.carregar();
  }

  async carregar(): Promise<void> {
    this.erro = '';
    try {
      this.reservas = await this.dados.listarReservas();
    } catch (e) {
      this.erro = e instanceof Error ? e.message : 'Não foi possível carregar as reservas.';
    }
  }

  async cancelar(reserva: Reserva): Promise<void> {
    if (this.cancelandoId !== null) return;
    const confirmar = window.confirm(`Deseja cancelar a reserva de "${reserva.titulo}"? A quantidade voltará a ficar disponível.`);
    if (!confirmar) return;

    this.cancelandoId = reserva.id;
    try {
      await this.dados.cancelarReserva(reserva);
      await this.carregar();
      alert('Reserva cancelada. A quantidade foi devolvida à oferta.');
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Não foi possível cancelar a reserva.');
    } finally {
      this.cancelandoId = null;
    }
  }
}

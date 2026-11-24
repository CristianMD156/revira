import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from '@capacitor-community/sqlite';
import { Oferta, Reserva } from '../models';

const OFERTAS_INICIAIS: Oferta[] = [
  {
    id: 1,
    titulo: 'Cesta de frutas da estação',
    descricao: 'Frutas selecionadas que estão maduras e prontas para consumo.',
    categoria: 'Frutas',
    quantidade: 5,
    unidade: 'cestas',
    validade: '2026-11-30',
    local: 'Mercado do Bairro',
    retirada: 'Retirar até 18h',
    preco: 8,
    status: 'disponivel',
  },
  {
    id: 2,
    titulo: 'Pães artesanais do dia',
    descricao: 'Pães produzidos hoje, armazenados corretamente.',
    categoria: 'Padaria',
    quantidade: 8,
    unidade: 'unidades',
    validade: '2026-11-30',
    local: 'Padaria Pão Quente',
    retirada: 'Retirar até 19h',
    preco: 3.5,
    status: 'disponivel',
  },
  {
    id: 3,
    titulo: 'Legumes para sopa',
    descricao: 'Mix de legumes frescos, higienizar antes do consumo.',
    categoria: 'Verduras e legumes',
    quantidade: 4,
    unidade: 'porções',
    validade: '2026-11-30',
    local: 'Hortifruti Central',
    retirada: 'Retirar até 17h',
    preco: 6,
    status: 'disponivel',
  },
];

@Injectable({ providedIn: 'root' })
export class DadosService {
  private readonly sqlite = new SQLiteConnection(CapacitorSQLite);
  private db?: SQLiteDBConnection;
  private inicializacao?: Promise<void>;
  private readonly web = Capacitor.getPlatform() === 'web';

  inicializar(): Promise<void> {
    if (!this.inicializacao) {
      this.inicializacao = this.configurarBanco().catch((erro) => {
        this.inicializacao = undefined;
        throw erro;
      });
    }
    return this.inicializacao;
  }

  private async configurarBanco(): Promise<void> {
    if (this.web) {
      if (!localStorage.getItem('revira_ofertas')) {
        localStorage.setItem('revira_ofertas', JSON.stringify(OFERTAS_INICIAIS));
      }
      if (!localStorage.getItem('revira_reservas')) {
        localStorage.setItem('revira_reservas', '[]');
      }
      return;
    }

    this.db = await this.sqlite.createConnection('revira', false, 'no-encryption', 1, false);
    await this.db.open();
    await this.db.execute(`
      PRAGMA foreign_keys = ON;
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT UNIQUE,
        telefone TEXT,
        tipo_usuario TEXT NOT NULL DEFAULT 'comum',
        criado_em TEXT DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS categorias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL UNIQUE,
        descricao TEXT
      );
      CREATE TABLE IF NOT EXISTS ofertas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER,
        categoria_id INTEGER,
        titulo TEXT NOT NULL,
        descricao TEXT,
        quantidade INTEGER NOT NULL,
        unidade TEXT NOT NULL,
        validade TEXT NOT NULL,
        local_retirada TEXT NOT NULL,
        instrucoes_retirada TEXT,
        preco REAL DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'disponivel',
        criado_em TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(usuario_id) REFERENCES usuarios(id),
        FOREIGN KEY(categoria_id) REFERENCES categorias(id)
      );
      CREATE TABLE IF NOT EXISTS reservas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        oferta_id INTEGER NOT NULL,
        usuario_id INTEGER,
        quantidade INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'reservada',
        criada_em TEXT DEFAULT CURRENT_TIMESTAMP,
        observacao TEXT,
        FOREIGN KEY(oferta_id) REFERENCES ofertas(id),
        FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
      );
    `);

    await this.db.run(
      `INSERT OR IGNORE INTO categorias(nome, descricao) VALUES
       ('Frutas', 'Frutas e cestas'),
       ('Padaria', 'Pães e massas'),
       ('Verduras e legumes', 'Hortifruti'),
       ('Laticínios', 'Leite e derivados'),
       ('Outros', 'Outros alimentos')`,
    );

    const total = await this.db.query('SELECT COUNT(*) AS total FROM ofertas');
    if (Number(total.values?.[0]?.['total'] ?? 0) === 0) {
      for (const oferta of OFERTAS_INICIAIS) {
        await this.inserirOfertaNoBanco(oferta);
      }
    }
  }

  async listarOfertas(): Promise<Oferta[]> {
    await this.inicializar();
    if (this.web) {
      const ofertas = JSON.parse(localStorage.getItem('revira_ofertas') || '[]') as Oferta[];
      return ofertas.filter((oferta) => oferta.status === 'disponivel' && oferta.quantidade > 0);
    }

    const resultado = await this.db!.query(`
      SELECT o.id, o.titulo, o.descricao, COALESCE(c.nome, 'Outros') AS categoria,
             o.quantidade, o.unidade, o.validade,
             o.local_retirada AS local,
             o.instrucoes_retirada AS retirada,
             o.preco, o.status
      FROM ofertas o
      LEFT JOIN categorias c ON c.id = o.categoria_id
      WHERE o.status = 'disponivel' AND o.quantidade > 0
      ORDER BY o.id DESC
    `);

    return (resultado.values || []).map((item) => ({
      id: Number(item['id']),
      titulo: String(item['titulo'] ?? ''),
      descricao: String(item['descricao'] ?? ''),
      categoria: String(item['categoria'] ?? 'Outros'),
      quantidade: Number(item['quantidade'] ?? 0),
      unidade: String(item['unidade'] ?? ''),
      validade: String(item['validade'] ?? ''),
      local: String(item['local'] ?? ''),
      retirada: String(item['retirada'] ?? ''),
      preco: Number(item['preco'] ?? 0),
      status: String(item['status'] ?? 'disponivel'),
    }));
  }

  async cadastrarOferta(oferta: Omit<Oferta, 'id' | 'status'>): Promise<void> {
    await this.inicializar();
    if (this.web) {
      // Preserve também ofertas esgotadas; listarOfertas() retorna apenas as disponíveis.
      const ofertas = JSON.parse(localStorage.getItem('revira_ofertas') || '[]') as Oferta[];
      ofertas.unshift({ ...oferta, id: Date.now(), status: 'disponivel' });
      localStorage.setItem('revira_ofertas', JSON.stringify(ofertas));
      return;
    }
    await this.inserirOfertaNoBanco({ ...oferta, id: 0, status: 'disponivel' });
  }

  private async inserirOfertaNoBanco(oferta: Oferta): Promise<void> {
    const categoria = await this.db!.query('SELECT id FROM categorias WHERE nome = ?', [oferta.categoria]);
    let categoriaId = Number(categoria.values?.[0]?.['id'] ?? 0);

    if (!categoriaId) {
      const inserida = await this.db!.run(
        'INSERT INTO categorias(nome, descricao) VALUES (?, ?)',
        [oferta.categoria, 'Categoria cadastrada no aplicativo'],
      );
      categoriaId = Number(inserida.changes?.lastId ?? 0);
    }

    await this.db!.run(
      `INSERT INTO ofertas
       (titulo, descricao, categoria_id, quantidade, unidade, validade,
        local_retirada, instrucoes_retirada, preco, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'disponivel')`,
      [oferta.titulo, oferta.descricao, categoriaId, oferta.quantidade,
       oferta.unidade, oferta.validade, oferta.local, oferta.retirada, oferta.preco],
    );
  }

  async listarReservas(): Promise<Reserva[]> {
    await this.inicializar();
    if (this.web) {
      return JSON.parse(localStorage.getItem('revira_reservas') || '[]') as Reserva[];
    }

    const resultado = await this.db!.query(`
      SELECT r.id, r.oferta_id AS ofertaId, o.titulo, r.quantidade,
             r.criada_em AS data, r.status
      FROM reservas r
      LEFT JOIN ofertas o ON o.id = r.oferta_id
      ORDER BY r.id DESC
    `);
    return (resultado.values || []).map((item) => ({
      id: Number(item['id']),
      ofertaId: Number(item['ofertaId']),
      titulo: String(item['titulo'] ?? 'Oferta indisponível'),
      quantidade: Number(item['quantidade']),
      data: String(item['data'] ?? ''),
      status: String(item['status'] ?? ''),
    }));
  }

  async reservar(oferta: Oferta, quantidade = 1): Promise<void> {
    await this.inicializar();
    if (!Number.isInteger(quantidade) || quantidade < 1 || quantidade > oferta.quantidade) {
      throw new Error('Quantidade indisponível. Atualize a lista e tente novamente.');
    }

    const ofertas = await this.listarOfertas();
    const atual = ofertas.find((item) => item.id === oferta.id);
    if (!atual || atual.quantidade < quantidade) {
      throw new Error('Esta oferta não está mais disponível na quantidade solicitada.');
    }

    if (this.web) {
      const reservas = await this.listarReservas();
      reservas.unshift({
        id: Date.now(), ofertaId: oferta.id, titulo: oferta.titulo,
        quantidade, data: new Date().toISOString(), status: 'reservada',
      });
      localStorage.setItem('revira_reservas', JSON.stringify(reservas));
      this.atualizarQuantidadeWeb(oferta.id, -quantidade);
      return;
    }

    await this.db!.run(
      'INSERT INTO reservas(oferta_id, quantidade, status) VALUES (?, ?, ?)',
      [oferta.id, quantidade, 'reservada'],
    );
    await this.db!.run('UPDATE ofertas SET quantidade = quantidade - ? WHERE id = ?', [quantidade, oferta.id]);
    await this.db!.run(
      "UPDATE ofertas SET status = 'esgotada' WHERE quantidade <= 0 AND id = ?",
      [oferta.id],
    );
  }

  async cancelarReserva(reserva: Reserva): Promise<void> {
    await this.inicializar();
    if (reserva.status !== 'reservada') {
      throw new Error('Esta reserva não pode mais ser cancelada.');
    }

    if (this.web) {
      const reservas = await this.listarReservas();
      const indice = reservas.findIndex((item) => item.id === reserva.id);
      if (indice < 0 || reservas[indice].status !== 'reservada') {
        throw new Error('A reserva não foi encontrada ou já foi cancelada.');
      }
      reservas[indice].status = 'cancelada';
      localStorage.setItem('revira_reservas', JSON.stringify(reservas));
      this.atualizarQuantidadeWeb(reserva.ofertaId, reserva.quantidade);
      return;
    }

    const atualizacao = await this.db!.run(
      "UPDATE reservas SET status = 'cancelada' WHERE id = ? AND status = 'reservada'",
      [reserva.id],
    );
    if (Number(atualizacao.changes?.changes ?? 0) === 0) {
      throw new Error('A reserva já foi cancelada ou não foi encontrada.');
    }
    await this.db!.run(
      "UPDATE ofertas SET quantidade = quantidade + ?, status = 'disponivel' WHERE id = ?",
      [reserva.quantidade, reserva.ofertaId],
    );
  }

  private atualizarQuantidadeWeb(ofertaId: number, variacao: number): void {
    const ofertas = JSON.parse(localStorage.getItem('revira_ofertas') || '[]') as Oferta[];
    const oferta = ofertas.find((item) => item.id === ofertaId);
    if (!oferta) return;
    oferta.quantidade += variacao;
    oferta.status = oferta.quantidade <= 0 ? 'esgotada' : 'disponivel';
    localStorage.setItem('revira_ofertas', JSON.stringify(ofertas));
  }
}

export interface Oferta { id: number; titulo: string; descricao: string; categoria: string; quantidade: number; unidade: string; validade: string; local: string; retirada: string; preco: number; status: string; }
export interface Reserva { id: number; ofertaId: number; titulo: string; quantidade: number; data: string; status: string; }

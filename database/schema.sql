PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL CHECK (length(trim(nome)) > 0),
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    telefone TEXT,
    tipo_usuario TEXT NOT NULL DEFAULT 'AMBOS'
        CHECK (tipo_usuario IN ('DOADOR', 'INTERESSADO', 'AMBOS')),
    criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categorias (
    id_categoria INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL UNIQUE COLLATE NOCASE,
    descricao TEXT
);

CREATE TABLE IF NOT EXISTS ofertas (
    id_oferta INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario INTEGER NOT NULL,
    id_categoria INTEGER NOT NULL,
    titulo TEXT NOT NULL CHECK (length(trim(titulo)) > 0),
    descricao TEXT,
    quantidade REAL NOT NULL CHECK (quantidade > 0),
    unidade TEXT NOT NULL,
    validade TEXT NOT NULL,
    retirada_ate TEXT NOT NULL,
    instrucoes_retirada TEXT NOT NULL,
    condicoes_conservacao TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'ATIVA'
        CHECK (status IN ('ATIVA', 'RESERVADA', 'ENCERRADA', 'VENCIDA')),
    criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE RESTRICT,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS reservas (
    id_reserva INTEGER PRIMARY KEY AUTOINCREMENT,
    id_oferta INTEGER NOT NULL,
    id_usuario INTEGER NOT NULL,
    quantidade REAL NOT NULL CHECK (quantidade > 0),
    status TEXT NOT NULL DEFAULT 'ATIVA'
        CHECK (status IN ('ATIVA', 'CANCELADA', 'RETIRADA')),
    criada_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    observacao TEXT,
    FOREIGN KEY (id_oferta) REFERENCES ofertas(id_oferta) ON DELETE RESTRICT,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_ofertas_status_validade
    ON ofertas(status, validade);

CREATE INDEX IF NOT EXISTS idx_ofertas_usuario
    ON ofertas(id_usuario);

CREATE INDEX IF NOT EXISTS idx_reservas_oferta_status
    ON reservas(id_oferta, status);

CREATE INDEX IF NOT EXISTS idx_reservas_usuario
    ON reservas(id_usuario);

-- Categorias iniciais. INSERT OR IGNORE evita duplicações em novas inicializações.
INSERT OR IGNORE INTO categorias (nome, descricao) VALUES
    ('Hortifruti', 'Frutas, verduras e legumes'),
    ('Padaria', 'Pães e produtos de padaria'),
    ('Refeições prontas', 'Alimentos preparados e conservados adequadamente'),
    ('Outros', 'Outros alimentos próprios para consumo');

-- Observação: a lógica da aplicação deve validar a data de validade,
-- a janela de retirada e a soma das reservas ativas dentro de uma transação.
-- SQLite não oferece um tipo DATE dedicado; datas ISO (YYYY-MM-DD) facilitam
-- ordenação e comparação quando armazenadas em formato consistente.

PRAGMA foreign_keys = ON;
CREATE TABLE usuarios (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 nome TEXT NOT NULL,
 email TEXT UNIQUE,
 telefone TEXT,
 tipo_usuario TEXT NOT NULL DEFAULT 'comum',
 criado_em TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE categorias (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 nome TEXT NOT NULL UNIQUE,
 descricao TEXT
);
CREATE TABLE ofertas (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 usuario_id INTEGER,
 categoria_id INTEGER,
 titulo TEXT NOT NULL,
 descricao TEXT,
 quantidade INTEGER NOT NULL CHECK(quantidade >= 0),
 unidade TEXT NOT NULL,
 validade TEXT NOT NULL,
 local_retirada TEXT NOT NULL,
 instrucoes_retirada TEXT,
 preco REAL DEFAULT 0 CHECK(preco >= 0),
 status TEXT NOT NULL DEFAULT 'disponivel',
 criado_em TEXT DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(usuario_id) REFERENCES usuarios(id),
 FOREIGN KEY(categoria_id) REFERENCES categorias(id)
);
CREATE TABLE reservas (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 oferta_id INTEGER NOT NULL,
 usuario_id INTEGER,
 quantidade INTEGER NOT NULL CHECK(quantidade > 0),
 status TEXT NOT NULL DEFAULT 'reservada',
 criada_em TEXT DEFAULT CURRENT_TIMESTAMP,
 observacao TEXT,
 FOREIGN KEY(oferta_id) REFERENCES ofertas(id),
 FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
);
CREATE INDEX idx_ofertas_status_validade ON ofertas(status, validade);
CREATE INDEX idx_reservas_oferta ON reservas(oferta_id);

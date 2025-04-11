CREATE TABLE IF NOT EXISTS representantes_autorizados (
    id SERIAL PRIMARY KEY,
    rm VARCHAR(20) NOT NULL UNIQUE,
    nome VARCHAR(100) NOT NULL,
    ano VARCHAR(10) NOT NULL,
    curso VARCHAR(100) NOT NULL,
    data_cadastro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO representantes_autorizados (rm, nome, ano, curso)
VALUES 
    ('25252', 'Maria Eduarda Nogueira Silva', '1º', 'Desenvolvimento de Sistemas AMS'),
    ('24152', 'Ana Luísa Marques de Mello', '2º', 'Eletrotécnica'),
    ('24228', 'Maria Isabela de Lima Cruz', '2º', 'Eletrotécnica'),
    ('25160', 'Sophia Borgheti Romboli Carvalho', '1º', 'Desenvolvimento de Sistemas PI'),
    ('24169', 'Micaela Giglio Pedreti', '2º', 'Mecatrônica PI'),
    ('23313', 'Nykolly Barbosa De Abreu', '3º', 'Eletrotécnica PI'),
    ('24015', 'Gustavo Lima Ferreira dos Santos', '2º', 'Desenvolvimento de Sistemas AMS'),
    ('25105', 'Esther Noemi Victorino de Miranda', '1º', 'Desenvolvimento de Sistemas AMS'),
    ('23230', 'Ana Marcela Maria Inácio do Prado Goldschmidt', '1º', 'Desenvolvimento de Sistemas AMS'),
    ('24005', 'Nícolas Sidnei Oliveira', '2º', 'Automação Industrial'),
    ('24165', 'João Lucas Perboni da Costa', '2º', 'Mecatrônica'),
    ('23258', 'Sônia Clara Carvalho', '3º', 'Automação Industrial'),
    ('23024', 'Gabriel Souza Smargiassi', '3º', 'Mecatrônica'),
    ('23071', 'Rafael Barros Fante', '3º', 'Desenvolvimento de Sistemas AMS'),
    ('23223', 'Kerolaine Vitória Rosa Molina', '3º', 'Automação Industrial'),
    ('24062', 'Rafael Corrêa Candido', '1º', 'Desenvolvimento de Sistemas PI'),
    ('24058', 'Leonardo Gabriel Tomaz dos Reis', '3º', 'Desenvolvimento de Sistemas PI'),
    ('12345', 'Teste', '3º', 'Desenvolvimento de Sistemas AMS')
ON CONFLICT (rm) DO NOTHING;

CREATE TABLE IF NOT EXISTS inscricoes_interclasse (
    id SERIAL PRIMARY KEY,
    rm_representante VARCHAR(20) NOT NULL,
    nome_representante VARCHAR(100) NOT NULL,
    ano VARCHAR(10) NOT NULL,
    curso VARCHAR(100) NOT NULL,
    modalidade VARCHAR(20) NOT NULL,
    categoria VARCHAR(20) NOT NULL,
    jogadores JSONB NOT NULL,
    data_envio TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(rm_representante, modalidade, categoria)
);

CREATE INDEX IF NOT EXISTS idx_representantes_rm ON representantes_autorizados(rm);
CREATE INDEX IF NOT EXISTS idx_inscricoes_rm ON inscricoes_interclasse(rm_representante);
CREATE INDEX IF NOT EXISTS idx_inscricoes_modalidade ON inscricoes_interclasse(modalidade);
CREATE INDEX IF NOT EXISTS idx_inscricoes_categoria ON inscricoes_interclasse(categoria);
CREATE INDEX IF NOT EXISTS idx_inscricoes_ano_curso ON inscricoes_interclasse(ano, curso);
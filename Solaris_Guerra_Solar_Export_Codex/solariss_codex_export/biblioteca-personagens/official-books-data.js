/* Gerado a partir das versões finais dos Livros 1, 2, 3 e 5. */
globalThis.SOLARIS_OFFICIAL_BOOKS = {
  "schemaVersion": 2,
  "sources": {
    "book1": "Livro 1 base do jogador.docx",
    "book2": "Livro_2_Guia_do_Mestre_rifles_corrigido.docx",
    "book3": "Livro_3_Bestiario_Guerra_Solar_revisado_coerencia_fichas.docx",
    "book4": "Livro_4_Cenarios_e_Historia_Guerra_Solar_formatado_revisado.docx",
    "book5": "Livro_5_Itens_Equipamentos_Habilidades_punhos_corrigido.docx"
  },
  "sourceGovernance": {
    "sourceStatus": "current-source-needs-review",
    "sourceLastReconciledAt": "2026-06-23",
    "dataStability": "provisional",
    "needsReview": true,
    "reviewReason": "Metadados de fonte reconciliados para os cinco livros oficiais atuais; conteudo legado ainda precisa conferencia manual por livro e tabela.",
    "sourceFilesCurrent": {
      "book1": "Livro 1 base do jogador.docx",
      "book2": "Livro_2_Guia_do_Mestre_rifles_corrigido.docx",
      "book3": "Livro_3_Bestiario_Guerra_Solar_revisado_coerencia_fichas.docx",
      "book4": "Livro_4_Cenarios_e_Historia_Guerra_Solar_formatado_revisado.docx",
      "book5": "Livro_5_Itens_Equipamentos_Habilidades_punhos_corrigido.docx"
    },
    "sourceFilesPrevious": {
      "book1": "livro 1 base para jogadores.docx",
      "book2": "Livro_2_Guia_do_Mestre_Guerra_Solar_formatado_enumerado.docx",
      "book3": "Livro_3_Bestiario_Guerra_Solar_Edicao_Visual.docx",
      "book5": "Livro_5_Guerra_Solar_COMPILADO_COMPLETO_FINAL.docx"
    }
  },
  "templates": [
    {
      "id": "equipment",
      "label": "Equipamento geral",
      "source": "Livro 5, Tabela 212",
      "schemaVersion": 2,
      "fields": [
        {
          "id": "nome-do-equipamento",
          "label": "Nome do equipamento",
          "type": "text",
          "wide": false
        },
        {
          "id": "categoria",
          "label": "Categoria",
          "type": "text",
          "wide": false
        },
        {
          "id": "tier",
          "label": "Tier",
          "type": "text",
          "wide": false
        },
        {
          "id": "legalidade",
          "label": "Legalidade",
          "type": "text",
          "wide": false
        },
        {
          "id": "peso-ou-carga",
          "label": "Peso ou carga",
          "type": "text",
          "wide": false
        },
        {
          "id": "ocupa-cubo",
          "label": "Ocupa cubo?",
          "type": "select-yes-no",
          "wide": false
        },
        {
          "id": "preco-base-em-luzentis",
          "label": "Preço base em Luzentis",
          "type": "text",
          "wide": false
        },
        {
          "id": "preco-local-em-luzentis",
          "label": "Preço local em Luzentis",
          "type": "text",
          "wide": false
        },
        {
          "id": "descricao",
          "label": "Descrição",
          "type": "textarea",
          "wide": true
        },
        {
          "id": "funcao",
          "label": "Função",
          "type": "text",
          "wide": true
        },
        {
          "id": "requisito-de-uso",
          "label": "Requisito de uso",
          "type": "text",
          "wide": false
        },
        {
          "id": "teste-associado",
          "label": "Teste associado",
          "type": "text",
          "wide": false
        },
        {
          "id": "bonus-concedido",
          "label": "Bônus concedido",
          "type": "text",
          "wide": false
        },
        {
          "id": "penalidade",
          "label": "Penalidade",
          "type": "text",
          "wide": false
        },
        {
          "id": "usos-por-cena",
          "label": "Usos por cena",
          "type": "text",
          "wide": false
        },
        {
          "id": "usos-por-descanso",
          "label": "Usos por descanso",
          "type": "text",
          "wide": false
        },
        {
          "id": "usos-totais",
          "label": "Usos totais",
          "type": "text",
          "wide": false
        },
        {
          "id": "bateria-ou-carga",
          "label": "Bateria ou carga",
          "type": "text",
          "wide": false
        },
        {
          "id": "manutencao",
          "label": "Manutenção",
          "type": "text",
          "wide": false
        },
        {
          "id": "rachaduras",
          "label": "Rachaduras",
          "type": "text",
          "wide": false
        },
        {
          "id": "jammed",
          "label": "Jammed?",
          "type": "select-yes-no",
          "wide": false
        },
        {
          "id": "pode-receber-mods",
          "label": "Pode receber mods?",
          "type": "select-yes-no",
          "wide": false
        },
        {
          "id": "risco",
          "label": "Risco",
          "type": "text",
          "wide": false
        },
        {
          "id": "observacoes",
          "label": "Observações",
          "type": "textarea",
          "wide": true
        }
      ]
    },
    {
      "id": "weapon",
      "label": "Arma",
      "source": "Livro 5, Tabela 213",
      "schemaVersion": 1,
      "fields": [
        {
          "id": "nome-da-arma",
          "label": "Nome da arma",
          "type": "text",
          "wide": false
        },
        {
          "id": "tipo",
          "label": "Tipo",
          "type": "text",
          "wide": false
        },
        {
          "id": "tier",
          "label": "Tier",
          "type": "text",
          "wide": false
        },
        {
          "id": "dano",
          "label": "Dano",
          "type": "text",
          "wide": false
        },
        {
          "id": "tipo-de-dano",
          "label": "Tipo de dano",
          "type": "text",
          "wide": false
        },
        {
          "id": "alcance",
          "label": "Alcance",
          "type": "text",
          "wide": false
        },
        {
          "id": "municao",
          "label": "Munição",
          "type": "text",
          "wide": false
        },
        {
          "id": "cadencia",
          "label": "Cadência",
          "type": "text",
          "wide": false
        },
        {
          "id": "propriedades",
          "label": "Propriedades",
          "type": "text",
          "wide": false
        },
        {
          "id": "requisito-de-atributo",
          "label": "Requisito de atributo",
          "type": "text",
          "wide": false
        },
        {
          "id": "requisito-de-profissao",
          "label": "Requisito de profissão",
          "type": "text",
          "wide": false
        },
        {
          "id": "mods-instalados",
          "label": "Mods instalados",
          "type": "text",
          "wide": false
        },
        {
          "id": "espacos-de-mod",
          "label": "Espaços de mod",
          "type": "text",
          "wide": false
        },
        {
          "id": "rachaduras",
          "label": "Rachaduras",
          "type": "text",
          "wide": false
        },
        {
          "id": "jammed",
          "label": "Jammed?",
          "type": "select-yes-no",
          "wide": false
        },
        {
          "id": "legalidade",
          "label": "Legalidade",
          "type": "text",
          "wide": false
        },
        {
          "id": "preco-em-luzentis",
          "label": "Preço em Luzentis",
          "type": "text",
          "wide": false
        },
        {
          "id": "manutencao",
          "label": "Manutenção",
          "type": "text",
          "wide": false
        },
        {
          "id": "critico-sugerido",
          "label": "Crítico sugerido",
          "type": "text",
          "wide": false
        },
        {
          "id": "erro-critico-sugerido",
          "label": "Erro crítico sugerido",
          "type": "text",
          "wide": false
        },
        {
          "id": "descricao-visual",
          "label": "Descrição visual",
          "type": "textarea",
          "wide": true
        },
        {
          "id": "historia-da-arma",
          "label": "História da arma",
          "type": "textarea",
          "wide": true
        }
      ]
    },
    {
      "id": "armor",
      "label": "Armadura",
      "source": "Livro 5, Tabela 214",
      "schemaVersion": 1,
      "fields": [
        {
          "id": "nome-da-armadura",
          "label": "Nome da armadura",
          "type": "text",
          "wide": false
        },
        {
          "id": "tipo",
          "label": "Tipo",
          "type": "text",
          "wide": false
        },
        {
          "id": "tier",
          "label": "Tier",
          "type": "text",
          "wide": false
        },
        {
          "id": "ca-concedida",
          "label": "CA concedida",
          "type": "text",
          "wide": false
        },
        {
          "id": "reducao-de-dano",
          "label": "Redução de dano",
          "type": "text",
          "wide": false
        },
        {
          "id": "resistencias",
          "label": "Resistências",
          "type": "text",
          "wide": false
        },
        {
          "id": "vulnerabilidades",
          "label": "Vulnerabilidades",
          "type": "text",
          "wide": false
        },
        {
          "id": "penalidades",
          "label": "Penalidades",
          "type": "text",
          "wide": false
        },
        {
          "id": "movimento-alterado",
          "label": "Movimento alterado",
          "type": "text",
          "wide": false
        },
        {
          "id": "integracao-com-interface-medular-artificial",
          "label": "Integração com Interface Medular Artificial",
          "type": "text",
          "wide": false
        },
        {
          "id": "sistema-eletronico",
          "label": "Sistema eletrônico",
          "type": "text",
          "wide": false
        },
        {
          "id": "bateria",
          "label": "Bateria",
          "type": "text",
          "wide": false
        },
        {
          "id": "mods-instalados",
          "label": "Mods instalados",
          "type": "text",
          "wide": false
        },
        {
          "id": "espacos-de-mod",
          "label": "Espaços de mod",
          "type": "text",
          "wide": false
        },
        {
          "id": "rachaduras",
          "label": "Rachaduras",
          "type": "text",
          "wide": false
        },
        {
          "id": "jammed",
          "label": "Jammed?",
          "type": "select-yes-no",
          "wide": false
        },
        {
          "id": "legalidade",
          "label": "Legalidade",
          "type": "text",
          "wide": false
        },
        {
          "id": "preco-em-luzentis",
          "label": "Preço em Luzentis",
          "type": "text",
          "wide": false
        },
        {
          "id": "manutencao",
          "label": "Manutenção",
          "type": "text",
          "wide": false
        },
        {
          "id": "descricao-visual",
          "label": "Descrição visual",
          "type": "textarea",
          "wide": true
        },
        {
          "id": "observacoes",
          "label": "Observações",
          "type": "textarea",
          "wide": true
        }
      ]
    },
    {
      "id": "mod",
      "label": "Mod",
      "source": "Livro 5, Tabela 215",
      "schemaVersion": 1,
      "fields": [
        {
          "id": "nome-do-mod",
          "label": "Nome do mod",
          "type": "text",
          "wide": false
        },
        {
          "id": "tipo",
          "label": "Tipo",
          "type": "text",
          "wide": false
        },
        {
          "id": "tier",
          "label": "Tier",
          "type": "text",
          "wide": false
        },
        {
          "id": "efeito",
          "label": "Efeito",
          "type": "text",
          "wide": true
        },
        {
          "id": "custo-de-ativacao",
          "label": "Custo de ativação",
          "type": "text",
          "wide": false
        },
        {
          "id": "usos",
          "label": "Usos",
          "type": "text",
          "wide": false
        },
        {
          "id": "requisitos",
          "label": "Requisitos",
          "type": "text",
          "wide": false
        },
        {
          "id": "espacos-ocupados",
          "label": "Espaços ocupados",
          "type": "text",
          "wide": false
        },
        {
          "id": "compatibilidade",
          "label": "Compatibilidade",
          "type": "text",
          "wide": false
        },
        {
          "id": "risco",
          "label": "Risco",
          "type": "text",
          "wide": false
        },
        {
          "id": "erro-critico",
          "label": "Erro crítico",
          "type": "text",
          "wide": false
        },
        {
          "id": "instalacao-necessaria",
          "label": "Instalação necessária",
          "type": "text",
          "wide": false
        },
        {
          "id": "teste-de-instalacao",
          "label": "Teste de instalação",
          "type": "text",
          "wide": false
        },
        {
          "id": "dificuldade-de-instalacao",
          "label": "Dificuldade de instalação",
          "type": "text",
          "wide": false
        },
        {
          "id": "preco-em-luzentis",
          "label": "Preço em Luzentis",
          "type": "text",
          "wide": false
        },
        {
          "id": "legalidade",
          "label": "Legalidade",
          "type": "text",
          "wide": false
        },
        {
          "id": "manutencao",
          "label": "Manutenção",
          "type": "text",
          "wide": false
        },
        {
          "id": "observacoes",
          "label": "Observações",
          "type": "textarea",
          "wide": true
        }
      ]
    },
    {
      "id": "cube",
      "label": "Cubo",
      "source": "Livro 5, Tabela 216",
      "schemaVersion": 1,
      "fields": [
        {
          "id": "nome-ou-numero-do-cubo",
          "label": "Nome ou número do cubo",
          "type": "text",
          "wide": false
        },
        {
          "id": "tipo",
          "label": "Tipo",
          "type": "text",
          "wide": false
        },
        {
          "id": "capacidade",
          "label": "Capacidade",
          "type": "text",
          "wide": false
        },
        {
          "id": "conteudo-atual",
          "label": "Conteúdo atual",
          "type": "text",
          "wide": false
        },
        {
          "id": "item-1",
          "label": "Item 1",
          "type": "text",
          "wide": false
        },
        {
          "id": "item-2",
          "label": "Item 2",
          "type": "text",
          "wide": false
        },
        {
          "id": "item-3",
          "label": "Item 3",
          "type": "text",
          "wide": false
        },
        {
          "id": "item-4",
          "label": "Item 4",
          "type": "text",
          "wide": false
        },
        {
          "id": "item-5",
          "label": "Item 5",
          "type": "text",
          "wide": false
        },
        {
          "id": "peso-ou-volume-total",
          "label": "Peso ou volume total",
          "type": "text",
          "wide": false
        },
        {
          "id": "rachaduras",
          "label": "Rachaduras",
          "type": "text",
          "wide": false
        },
        {
          "id": "vedacao",
          "label": "Vedação",
          "type": "text",
          "wide": false
        },
        {
          "id": "sistema-eletronico",
          "label": "Sistema eletrônico",
          "type": "text",
          "wide": false
        },
        {
          "id": "jammed",
          "label": "Jammed?",
          "type": "select-yes-no",
          "wide": false
        },
        {
          "id": "legalidade-do-conteudo",
          "label": "Legalidade do conteúdo",
          "type": "text",
          "wide": false
        },
        {
          "id": "risco-do-conteudo",
          "label": "Risco do conteúdo",
          "type": "text",
          "wide": false
        },
        {
          "id": "dono",
          "label": "Dono",
          "type": "text",
          "wide": false
        },
        {
          "id": "observacoes",
          "label": "Observações",
          "type": "textarea",
          "wide": true
        }
      ]
    },
    {
      "id": "special-item",
      "label": "Item especial",
      "source": "Livro 5, Tabela 217",
      "schemaVersion": 1,
      "fields": [
        {
          "id": "nome",
          "label": "Nome",
          "type": "text",
          "wide": false
        },
        {
          "id": "origem",
          "label": "Origem",
          "type": "text",
          "wide": false
        },
        {
          "id": "descricao",
          "label": "Descrição",
          "type": "textarea",
          "wide": true
        },
        {
          "id": "funcao-conhecida",
          "label": "Função conhecida",
          "type": "text",
          "wide": true
        },
        {
          "id": "funcao-oculta",
          "label": "Função oculta",
          "type": "text",
          "wide": true
        },
        {
          "id": "quem-quer-este-item",
          "label": "Quem quer este item",
          "type": "text",
          "wide": false
        },
        {
          "id": "quem-teme-este-item",
          "label": "Quem teme este item",
          "type": "text",
          "wide": false
        },
        {
          "id": "preco-estimado",
          "label": "Preço estimado",
          "type": "text",
          "wide": false
        },
        {
          "id": "pode-ser-vendido",
          "label": "Pode ser vendido?",
          "type": "select-yes-no",
          "wide": false
        },
        {
          "id": "pode-ser-destruido",
          "label": "Pode ser destruído?",
          "type": "select-yes-no",
          "wide": false
        },
        {
          "id": "pode-ser-rastreado",
          "label": "Pode ser rastreado?",
          "type": "select-yes-no",
          "wide": false
        },
        {
          "id": "efeito-mecanico",
          "label": "Efeito mecânico",
          "type": "text",
          "wide": true
        },
        {
          "id": "efeito-narrativo",
          "label": "Efeito narrativo",
          "type": "text",
          "wide": true
        },
        {
          "id": "risco",
          "label": "Risco",
          "type": "text",
          "wide": false
        },
        {
          "id": "requisito-de-estudo",
          "label": "Requisito de estudo",
          "type": "text",
          "wide": false
        },
        {
          "id": "teste-para-entender",
          "label": "Teste para entender",
          "type": "text",
          "wide": false
        },
        {
          "id": "consequencia-de-uso-errado",
          "label": "Consequência de uso errado",
          "type": "textarea",
          "wide": true
        },
        {
          "id": "gancho-futuro",
          "label": "Gancho futuro",
          "type": "textarea",
          "wide": true
        }
      ]
    },
    {
      "id": "crafting",
      "label": "Projeto de crafting",
      "source": "Livro 5, Tabela 218",
      "schemaVersion": 1,
      "fields": [
        {
          "id": "projeto",
          "label": "Projeto",
          "type": "text",
          "wide": false
        },
        {
          "id": "criador",
          "label": "Criador",
          "type": "text",
          "wide": false
        },
        {
          "id": "local-de-criacao",
          "label": "Local de criação",
          "type": "text",
          "wide": false
        },
        {
          "id": "oficina-usada",
          "label": "Oficina usada",
          "type": "text",
          "wide": false
        },
        {
          "id": "tier-do-projeto",
          "label": "Tier do projeto",
          "type": "text",
          "wide": false
        },
        {
          "id": "item-final-desejado",
          "label": "Item final desejado",
          "type": "text",
          "wide": false
        },
        {
          "id": "material-1",
          "label": "Material 1",
          "type": "text",
          "wide": false
        },
        {
          "id": "quantidade-1",
          "label": "Quantidade 1",
          "type": "text",
          "wide": false
        },
        {
          "id": "material-2",
          "label": "Material 2",
          "type": "text",
          "wide": false
        },
        {
          "id": "quantidade-2",
          "label": "Quantidade 2",
          "type": "text",
          "wide": false
        },
        {
          "id": "material-3",
          "label": "Material 3",
          "type": "text",
          "wide": false
        },
        {
          "id": "quantidade-3",
          "label": "Quantidade 3",
          "type": "text",
          "wide": false
        },
        {
          "id": "material-raro",
          "label": "Material raro",
          "type": "text",
          "wide": false
        },
        {
          "id": "ferramentas-necessarias",
          "label": "Ferramentas necessárias",
          "type": "text",
          "wide": false
        },
        {
          "id": "tempo-base",
          "label": "Tempo base",
          "type": "text",
          "wide": false
        },
        {
          "id": "teste-principal",
          "label": "Teste principal",
          "type": "text",
          "wide": false
        },
        {
          "id": "dificuldade-principal",
          "label": "Dificuldade principal",
          "type": "text",
          "wide": false
        },
        {
          "id": "teste-secundario",
          "label": "Teste secundário",
          "type": "text",
          "wide": false
        },
        {
          "id": "dificuldade-secundaria",
          "label": "Dificuldade secundária",
          "type": "text",
          "wide": false
        },
        {
          "id": "ajuda-possivel",
          "label": "Ajuda possível",
          "type": "text",
          "wide": false
        },
        {
          "id": "custo-em-luzentis",
          "label": "Custo em Luzentis",
          "type": "text",
          "wide": false
        },
        {
          "id": "risco-de-falha",
          "label": "Risco de falha",
          "type": "text",
          "wide": false
        },
        {
          "id": "resultado-em-sucesso",
          "label": "Resultado em sucesso",
          "type": "textarea",
          "wide": true
        },
        {
          "id": "resultado-em-falha",
          "label": "Resultado em falha",
          "type": "textarea",
          "wide": true
        },
        {
          "id": "resultado-em-critico",
          "label": "Resultado em crítico",
          "type": "textarea",
          "wide": true
        },
        {
          "id": "resultado-em-erro-critico",
          "label": "Resultado em erro crítico",
          "type": "textarea",
          "wide": true
        },
        {
          "id": "rachaduras-iniciais",
          "label": "Rachaduras iniciais",
          "type": "text",
          "wide": false
        },
        {
          "id": "mods-possiveis",
          "label": "Mods possíveis",
          "type": "text",
          "wide": false
        },
        {
          "id": "observacoes",
          "label": "Observações",
          "type": "textarea",
          "wide": true
        }
      ]
    },
    {
      "id": "vehicle",
      "label": "Veiculo",
      "source": "Livro 5, Tabela 219",
      "schemaVersion": 1,
      "fields": [
        {
          "id": "nome-do-veiculo",
          "label": "Nome do veículo",
          "type": "text",
          "wide": false
        },
        {
          "id": "tipo",
          "label": "Tipo",
          "type": "text",
          "wide": false
        },
        {
          "id": "tier",
          "label": "Tier",
          "type": "text",
          "wide": false
        },
        {
          "id": "dono",
          "label": "Dono",
          "type": "text",
          "wide": false
        },
        {
          "id": "tripulacao-minima",
          "label": "Tripulação mínima",
          "type": "text",
          "wide": false
        },
        {
          "id": "passageiros",
          "label": "Passageiros",
          "type": "text",
          "wide": false
        },
        {
          "id": "carga",
          "label": "Carga",
          "type": "text",
          "wide": false
        },
        {
          "id": "cubos-suportados",
          "label": "Cubos suportados",
          "type": "text",
          "wide": false
        },
        {
          "id": "pv",
          "label": "PV",
          "type": "text",
          "wide": false
        },
        {
          "id": "ca",
          "label": "CA",
          "type": "text",
          "wide": false
        },
        {
          "id": "velocidade",
          "label": "Velocidade",
          "type": "text",
          "wide": false
        },
        {
          "id": "manobrabilidade",
          "label": "Manobrabilidade",
          "type": "text",
          "wide": false
        },
        {
          "id": "combustivel-atual",
          "label": "Combustível atual",
          "type": "text",
          "wide": false
        },
        {
          "id": "combustivel-maximo",
          "label": "Combustível máximo",
          "type": "text",
          "wide": false
        },
        {
          "id": "consumo",
          "label": "Consumo",
          "type": "text",
          "wide": false
        },
        {
          "id": "blindagem",
          "label": "Blindagem",
          "type": "text",
          "wide": false
        },
        {
          "id": "armas-instaladas",
          "label": "Armas instaladas",
          "type": "text",
          "wide": false
        },
        {
          "id": "mods",
          "label": "Mods",
          "type": "text",
          "wide": false
        },
        {
          "id": "sistemas",
          "label": "Sistemas",
          "type": "text",
          "wide": false
        },
        {
          "id": "sensores",
          "label": "Sensores",
          "type": "text",
          "wide": false
        },
        {
          "id": "comunicacao",
          "label": "Comunicação",
          "type": "text",
          "wide": false
        },
        {
          "id": "rachaduras",
          "label": "Rachaduras",
          "type": "text",
          "wide": false
        },
        {
          "id": "falhas-do-sistema",
          "label": "Falhas do Sistema",
          "type": "text",
          "wide": false
        },
        {
          "id": "jammed",
          "label": "Jammed?",
          "type": "select-yes-no",
          "wide": false
        },
        {
          "id": "manutencao-pendente",
          "label": "Manutenção pendente",
          "type": "text",
          "wide": false
        },
        {
          "id": "legalidade",
          "label": "Legalidade",
          "type": "text",
          "wide": false
        },
        {
          "id": "preco-em-luzentis",
          "label": "Preço em Luzentis",
          "type": "text",
          "wide": false
        },
        {
          "id": "historico",
          "label": "Histórico",
          "type": "textarea",
          "wide": true
        },
        {
          "id": "observacoes",
          "label": "Observações",
          "type": "textarea",
          "wide": true
        }
      ]
    },
    {
      "id": "pursuit",
      "label": "Perseguicao",
      "source": "Livro 5, Tabela 220",
      "schemaVersion": 1,
      "fields": [
        {
          "id": "cena",
          "label": "Cena",
          "type": "text",
          "wide": false
        },
        {
          "id": "veiculo-do-grupo",
          "label": "Veículo do grupo",
          "type": "text",
          "wide": false
        },
        {
          "id": "velocidade-do-grupo",
          "label": "Velocidade do grupo",
          "type": "text",
          "wide": false
        },
        {
          "id": "veiculo-inimigo",
          "label": "Veículo inimigo",
          "type": "text",
          "wide": false
        },
        {
          "id": "velocidade-inimiga",
          "label": "Velocidade inimiga",
          "type": "text",
          "wide": false
        },
        {
          "id": "diferenca-de-velocidade",
          "label": "Diferença de velocidade",
          "type": "text",
          "wide": false
        },
        {
          "id": "avancos-necessarios",
          "label": "Avanços necessários",
          "type": "text",
          "wide": false
        },
        {
          "id": "avancos-atuais",
          "label": "Avanços atuais",
          "type": "text",
          "wide": false
        },
        {
          "id": "terreno",
          "label": "Terreno",
          "type": "text",
          "wide": false
        },
        {
          "id": "obstaculos",
          "label": "Obstáculos",
          "type": "text",
          "wide": false
        },
        {
          "id": "rodada-1-acao-teste-resultado",
          "label": "Rodada 1: ação/teste/resultado",
          "type": "textarea",
          "wide": true
        },
        {
          "id": "rodada-2-acao-teste-resultado",
          "label": "Rodada 2: ação/teste/resultado",
          "type": "textarea",
          "wide": true
        },
        {
          "id": "rodada-3-acao-teste-resultado",
          "label": "Rodada 3: ação/teste/resultado",
          "type": "textarea",
          "wide": true
        },
        {
          "id": "complicacoes",
          "label": "Complicações",
          "type": "text",
          "wide": false
        },
        {
          "id": "combustivel-gasto",
          "label": "Combustível gasto",
          "type": "text",
          "wide": false
        },
        {
          "id": "dano-sofrido",
          "label": "Dano sofrido",
          "type": "text",
          "wide": false
        },
        {
          "id": "carga-perdida",
          "label": "Carga perdida",
          "type": "text",
          "wide": false
        },
        {
          "id": "condicao-de-fuga",
          "label": "Condição de fuga",
          "type": "text",
          "wide": false
        },
        {
          "id": "condicao-de-captura",
          "label": "Condição de captura",
          "type": "text",
          "wide": false
        },
        {
          "id": "consequencia-final",
          "label": "Consequência final",
          "type": "textarea",
          "wide": true
        }
      ]
    },
    {
      "id": "drone",
      "label": "Drone",
      "source": "Livro 5, Tabela 221",
      "schemaVersion": 1,
      "fields": [
        {
          "id": "nome",
          "label": "Nome",
          "type": "text",
          "wide": false
        },
        {
          "id": "tipo",
          "label": "Tipo",
          "type": "text",
          "wide": false
        },
        {
          "id": "tier",
          "label": "Tier",
          "type": "text",
          "wide": false
        },
        {
          "id": "pv",
          "label": "PV",
          "type": "text",
          "wide": false
        },
        {
          "id": "ca",
          "label": "CA",
          "type": "text",
          "wide": false
        },
        {
          "id": "movimento",
          "label": "Movimento",
          "type": "text",
          "wide": false
        },
        {
          "id": "voo",
          "label": "Voo",
          "type": "text",
          "wide": false
        },
        {
          "id": "autonomia",
          "label": "Autonomia",
          "type": "text",
          "wide": false
        },
        {
          "id": "bateria",
          "label": "Bateria",
          "type": "text",
          "wide": false
        },
        {
          "id": "controlador",
          "label": "Controlador",
          "type": "text",
          "wide": false
        },
        {
          "id": "alcance-de-controle",
          "label": "Alcance de controle",
          "type": "text",
          "wide": false
        },
        {
          "id": "sensores",
          "label": "Sensores",
          "type": "text",
          "wide": false
        },
        {
          "id": "acao-principal",
          "label": "Ação principal",
          "type": "text",
          "wide": false
        },
        {
          "id": "ataque-se-houver",
          "label": "Ataque, se houver",
          "type": "text",
          "wide": false
        },
        {
          "id": "dano",
          "label": "Dano",
          "type": "text",
          "wide": false
        },
        {
          "id": "modulos",
          "label": "Módulos",
          "type": "text",
          "wide": false
        },
        {
          "id": "rachaduras",
          "label": "Rachaduras",
          "type": "text",
          "wide": false
        },
        {
          "id": "jammed",
          "label": "Jammed?",
          "type": "select-yes-no",
          "wide": false
        },
        {
          "id": "vulnerabilidade-a-emp",
          "label": "Vulnerabilidade a EMP",
          "type": "text",
          "wide": false
        },
        {
          "id": "sr-para-hack",
          "label": "SR para hack",
          "type": "text",
          "wide": false
        },
        {
          "id": "explode-ao-destruir",
          "label": "Explode ao destruir?",
          "type": "text",
          "wide": false
        },
        {
          "id": "loot",
          "label": "Loot",
          "type": "text",
          "wide": false
        },
        {
          "id": "observacoes",
          "label": "Observações",
          "type": "textarea",
          "wide": true
        }
      ]
    },
    {
      "id": "turret",
      "label": "Torreta",
      "source": "Livro 5, Tabela 222",
      "schemaVersion": 1,
      "fields": [
        {
          "id": "nome",
          "label": "Nome",
          "type": "text",
          "wide": false
        },
        {
          "id": "tipo",
          "label": "Tipo",
          "type": "text",
          "wide": false
        },
        {
          "id": "tier",
          "label": "Tier",
          "type": "text",
          "wide": false
        },
        {
          "id": "pv",
          "label": "PV",
          "type": "text",
          "wide": false
        },
        {
          "id": "ca",
          "label": "CA",
          "type": "text",
          "wide": false
        },
        {
          "id": "alcance",
          "label": "Alcance",
          "type": "text",
          "wide": false
        },
        {
          "id": "dano",
          "label": "Dano",
          "type": "text",
          "wide": false
        },
        {
          "id": "area-de-cobertura",
          "label": "Área de cobertura",
          "type": "text",
          "wide": false
        },
        {
          "id": "municao",
          "label": "Munição",
          "type": "text",
          "wide": false
        },
        {
          "id": "bateria",
          "label": "Bateria",
          "type": "text",
          "wide": false
        },
        {
          "id": "modo-de-disparo",
          "label": "Modo de disparo",
          "type": "text",
          "wide": false
        },
        {
          "id": "iff-ou-identificacao-de-aliados",
          "label": "IFF ou identificação de aliados",
          "type": "text",
          "wide": false
        },
        {
          "id": "controlador",
          "label": "Controlador",
          "type": "text",
          "wide": false
        },
        {
          "id": "sr-para-hack",
          "label": "SR para hack",
          "type": "text",
          "wide": false
        },
        {
          "id": "rachaduras",
          "label": "Rachaduras",
          "type": "text",
          "wide": false
        },
        {
          "id": "jammed",
          "label": "Jammed?",
          "type": "select-yes-no",
          "wide": false
        },
        {
          "id": "fraqueza",
          "label": "Fraqueza",
          "type": "text",
          "wide": false
        },
        {
          "id": "legalidade",
          "label": "Legalidade",
          "type": "text",
          "wide": false
        },
        {
          "id": "observacoes",
          "label": "Observações",
          "type": "textarea",
          "wide": true
        }
      ]
    },
    {
      "id": "robot",
      "label": "Robo",
      "source": "Livro 5, Tabela 223",
      "schemaVersion": 1,
      "fields": [
        {
          "id": "nome",
          "label": "Nome",
          "type": "text",
          "wide": false
        },
        {
          "id": "tipo",
          "label": "Tipo",
          "type": "text",
          "wide": false
        },
        {
          "id": "chassi",
          "label": "Chassi",
          "type": "text",
          "wide": false
        },
        {
          "id": "tier",
          "label": "Tier",
          "type": "text",
          "wide": false
        },
        {
          "id": "pv",
          "label": "PV",
          "type": "text",
          "wide": false
        },
        {
          "id": "ca",
          "label": "CA",
          "type": "text",
          "wide": false
        },
        {
          "id": "movimento",
          "label": "Movimento",
          "type": "text",
          "wide": false
        },
        {
          "id": "locomocao",
          "label": "Locomoção",
          "type": "text",
          "wide": false
        },
        {
          "id": "nucleo-de-energia",
          "label": "Núcleo de energia",
          "type": "text",
          "wide": false
        },
        {
          "id": "autonomia",
          "label": "Autonomia",
          "type": "text",
          "wide": false
        },
        {
          "id": "processador",
          "label": "Processador",
          "type": "text",
          "wide": false
        },
        {
          "id": "nivel-de-autonomia",
          "label": "Nível de autonomia",
          "type": "text",
          "wide": false
        },
        {
          "id": "controlador",
          "label": "Controlador",
          "type": "text",
          "wide": false
        },
        {
          "id": "alcance-de-controle",
          "label": "Alcance de controle",
          "type": "text",
          "wide": false
        },
        {
          "id": "slots-totais",
          "label": "Slots totais",
          "type": "text",
          "wide": false
        },
        {
          "id": "slots-usados",
          "label": "Slots usados",
          "type": "text",
          "wide": false
        },
        {
          "id": "modulos",
          "label": "Módulos",
          "type": "text",
          "wide": false
        },
        {
          "id": "armas",
          "label": "Armas",
          "type": "text",
          "wide": false
        },
        {
          "id": "ferramentas",
          "label": "Ferramentas",
          "type": "text",
          "wide": false
        },
        {
          "id": "sensores",
          "label": "Sensores",
          "type": "text",
          "wide": false
        },
        {
          "id": "blindagem",
          "label": "Blindagem",
          "type": "text",
          "wide": false
        },
        {
          "id": "carga-maxima",
          "label": "Carga máxima",
          "type": "text",
          "wide": false
        },
        {
          "id": "cubos-carregados",
          "label": "Cubos carregados",
          "type": "text",
          "wide": false
        },
        {
          "id": "resistencias",
          "label": "Resistências",
          "type": "text",
          "wide": false
        },
        {
          "id": "vulnerabilidades",
          "label": "Vulnerabilidades",
          "type": "text",
          "wide": false
        },
        {
          "id": "sr-para-hack",
          "label": "SR para hack",
          "type": "text",
          "wide": false
        },
        {
          "id": "rachaduras",
          "label": "Rachaduras",
          "type": "text",
          "wide": false
        },
        {
          "id": "falhas",
          "label": "Falhas",
          "type": "text",
          "wide": false
        },
        {
          "id": "jammed",
          "label": "Jammed?",
          "type": "select-yes-no",
          "wide": false
        },
        {
          "id": "explosao-ao-0-pv",
          "label": "Explosão ao 0 PV",
          "type": "text",
          "wide": false
        },
        {
          "id": "loot",
          "label": "Loot",
          "type": "text",
          "wide": false
        },
        {
          "id": "personalidade-de-ia",
          "label": "Personalidade de IA",
          "type": "text",
          "wide": false
        },
        {
          "id": "protocolo",
          "label": "Protocolo",
          "type": "text",
          "wide": false
        },
        {
          "id": "observacoes",
          "label": "Observações",
          "type": "textarea",
          "wide": true
        }
      ]
    },
    {
      "id": "hacking",
      "label": "Hacking",
      "source": "Livro 5, Tabela 224",
      "schemaVersion": 1,
      "fields": [
        {
          "id": "operador",
          "label": "Operador",
          "type": "text",
          "wide": false
        },
        {
          "id": "dispositivo-usado",
          "label": "Dispositivo usado",
          "type": "text",
          "wide": false
        },
        {
          "id": "rede-alvo",
          "label": "Rede alvo",
          "type": "text",
          "wide": false
        },
        {
          "id": "sr-da-rede",
          "label": "SR da rede",
          "type": "text",
          "wide": false
        },
        {
          "id": "deteccao-atual",
          "label": "Detecção atual",
          "type": "text",
          "wide": false
        },
        {
          "id": "deteccao-maxima",
          "label": "Detecção máxima",
          "type": "text",
          "wide": false
        },
        {
          "id": "ram-disponivel",
          "label": "RAM disponível",
          "type": "text",
          "wide": false
        },
        {
          "id": "ice-presente",
          "label": "ICE presente",
          "type": "text",
          "wide": false
        },
        {
          "id": "nos-conhecidos",
          "label": "Nós conhecidos",
          "type": "text",
          "wide": false
        },
        {
          "id": "objetivo-da-invasao",
          "label": "Objetivo da invasão",
          "type": "text",
          "wide": false
        },
        {
          "id": "teste-principal",
          "label": "Teste principal",
          "type": "text",
          "wide": false
        },
        {
          "id": "dificuldade",
          "label": "Dificuldade",
          "type": "text",
          "wide": false
        },
        {
          "id": "falhas-acumuladas",
          "label": "Falhas acumuladas",
          "type": "text",
          "wide": false
        },
        {
          "id": "sucessos-acumulados",
          "label": "Sucessos acumulados",
          "type": "text",
          "wide": false
        },
        {
          "id": "error-403",
          "label": "ERROR 403?",
          "type": "text",
          "wide": false
        },
        {
          "id": "contra-invasao-ativa",
          "label": "Contra-invasão ativa?",
          "type": "text",
          "wide": false
        },
        {
          "id": "rastro-deixado",
          "label": "Rastro deixado",
          "type": "text",
          "wide": false
        },
        {
          "id": "dados-obtidos",
          "label": "Dados obtidos",
          "type": "textarea",
          "wide": false
        },
        {
          "id": "consequencia-se-vencer",
          "label": "Consequência se vencer",
          "type": "textarea",
          "wide": true
        },
        {
          "id": "consequencia-se-falhar",
          "label": "Consequência se falhar",
          "type": "textarea",
          "wide": true
        },
        {
          "id": "observacoes",
          "label": "Observações",
          "type": "textarea",
          "wide": true
        }
      ]
    },
    {
      "id": "network",
      "label": "Rede digital",
      "source": "Livro 5, Tabela 225",
      "schemaVersion": 1,
      "fields": [
        {
          "id": "nome-da-rede",
          "label": "Nome da rede",
          "type": "text",
          "wide": false
        },
        {
          "id": "local",
          "label": "Local",
          "type": "text",
          "wide": false
        },
        {
          "id": "dono",
          "label": "Dono",
          "type": "text",
          "wide": false
        },
        {
          "id": "tipo",
          "label": "Tipo",
          "type": "text",
          "wide": false
        },
        {
          "id": "sr-base",
          "label": "SR base",
          "type": "text",
          "wide": false
        },
        {
          "id": "deteccao-inicial",
          "label": "Detecção inicial",
          "type": "text",
          "wide": false
        },
        {
          "id": "deteccao-maxima",
          "label": "Detecção máxima",
          "type": "text",
          "wide": false
        },
        {
          "id": "ice-1",
          "label": "ICE 1",
          "type": "text",
          "wide": false
        },
        {
          "id": "efeito-ice-1",
          "label": "Efeito ICE 1",
          "type": "text",
          "wide": true
        },
        {
          "id": "ice-2",
          "label": "ICE 2",
          "type": "text",
          "wide": false
        },
        {
          "id": "efeito-ice-2",
          "label": "Efeito ICE 2",
          "type": "text",
          "wide": true
        },
        {
          "id": "no-1",
          "label": "Nó 1",
          "type": "text",
          "wide": false
        },
        {
          "id": "funcao-do-no-1",
          "label": "Função do nó 1",
          "type": "text",
          "wide": true
        },
        {
          "id": "no-2",
          "label": "Nó 2",
          "type": "text",
          "wide": false
        },
        {
          "id": "funcao-do-no-2",
          "label": "Função do nó 2",
          "type": "text",
          "wide": true
        },
        {
          "id": "no-3",
          "label": "Nó 3",
          "type": "text",
          "wide": false
        },
        {
          "id": "funcao-do-no-3",
          "label": "Função do nó 3",
          "type": "text",
          "wide": true
        },
        {
          "id": "dados-disponiveis",
          "label": "Dados disponíveis",
          "type": "text",
          "wide": false
        },
        {
          "id": "alarmes",
          "label": "Alarmes",
          "type": "text",
          "wide": false
        },
        {
          "id": "defesas-fisicas-conectadas",
          "label": "Defesas físicas conectadas",
          "type": "text",
          "wide": false
        },
        {
          "id": "drones-conectados",
          "label": "Drones conectados",
          "type": "text",
          "wide": false
        },
        {
          "id": "torretas-conectadas",
          "label": "Torretas conectadas",
          "type": "text",
          "wide": false
        },
        {
          "id": "portas-conectadas",
          "label": "Portas conectadas",
          "type": "text",
          "wide": false
        },
        {
          "id": "falha-critica-da-rede",
          "label": "Falha crítica da rede",
          "type": "text",
          "wide": false
        },
        {
          "id": "segredo",
          "label": "Segredo",
          "type": "textarea",
          "wide": true
        }
      ]
    },
    {
      "id": "shop",
      "label": "Loja",
      "source": "Livro 5, Tabela 226",
      "schemaVersion": 1,
      "fields": [
        {
          "id": "nome-da-loja",
          "label": "Nome da loja",
          "type": "text",
          "wide": false
        },
        {
          "id": "dono",
          "label": "Dono",
          "type": "text",
          "wide": false
        },
        {
          "id": "tipo",
          "label": "Tipo",
          "type": "text",
          "wide": false
        },
        {
          "id": "localizacao",
          "label": "Localização",
          "type": "text",
          "wide": false
        },
        {
          "id": "faccao-ligada",
          "label": "Facção ligada",
          "type": "text",
          "wide": false
        },
        {
          "id": "preco-normal",
          "label": "Preço normal",
          "type": "text",
          "wide": false
        },
        {
          "id": "desconto-possivel",
          "label": "Desconto possível",
          "type": "text",
          "wide": false
        },
        {
          "id": "o-que-vende",
          "label": "O que vende",
          "type": "text",
          "wide": false
        },
        {
          "id": "o-que-compra",
          "label": "O que compra",
          "type": "text",
          "wide": false
        },
        {
          "id": "o-que-nunca-vende",
          "label": "O que nunca vende",
          "type": "text",
          "wide": false
        },
        {
          "id": "item-especial",
          "label": "Item especial",
          "type": "text",
          "wide": false
        },
        {
          "id": "item-em-falta",
          "label": "Item em falta",
          "type": "text",
          "wide": false
        },
        {
          "id": "segredo-do-dono",
          "label": "Segredo do dono",
          "type": "textarea",
          "wide": true
        },
        {
          "id": "problema-atual",
          "label": "Problema atual",
          "type": "text",
          "wide": false
        },
        {
          "id": "relacao-com-o-grupo",
          "label": "Relação com o grupo",
          "type": "text",
          "wide": false
        },
        {
          "id": "gancho-de-missao",
          "label": "Gancho de missão",
          "type": "textarea",
          "wide": true
        }
      ]
    },
    {
      "id": "black-market",
      "label": "Mercado negro",
      "source": "Livro 5, Tabela 227",
      "schemaVersion": 1,
      "fields": [
        {
          "id": "contato",
          "label": "Contato",
          "type": "text",
          "wide": false
        },
        {
          "id": "local-de-encontro",
          "label": "Local de encontro",
          "type": "text",
          "wide": false
        },
        {
          "id": "especialidade",
          "label": "Especialidade",
          "type": "text",
          "wide": false
        },
        {
          "id": "itens-disponiveis",
          "label": "Itens disponíveis",
          "type": "text",
          "wide": false
        },
        {
          "id": "preco-base",
          "label": "Preço base",
          "type": "text",
          "wide": false
        },
        {
          "id": "risco-padrao",
          "label": "Risco padrão",
          "type": "text",
          "wide": false
        },
        {
          "id": "fiscalizacao-proxima",
          "label": "Fiscalização próxima",
          "type": "text",
          "wide": false
        },
        {
          "id": "faccao-envolvida",
          "label": "Facção envolvida",
          "type": "text",
          "wide": false
        },
        {
          "id": "item-rastreado",
          "label": "Item rastreado?",
          "type": "text",
          "wide": false
        },
        {
          "id": "item-falso",
          "label": "Item falso?",
          "type": "text",
          "wide": false
        },
        {
          "id": "item-danificado",
          "label": "Item danificado?",
          "type": "text",
          "wide": false
        },
        {
          "id": "preco-em-luzentis",
          "label": "Preço em Luzentis",
          "type": "text",
          "wide": false
        },
        {
          "id": "preco-em-favor",
          "label": "Preço em favor",
          "type": "text",
          "wide": false
        },
        {
          "id": "condicao-de-negociacao",
          "label": "Condição de negociação",
          "type": "text",
          "wide": false
        },
        {
          "id": "consequencia-se-der-errado",
          "label": "Consequência se der errado",
          "type": "textarea",
          "wide": true
        },
        {
          "id": "consequencia-se-o-grupo-denunciar",
          "label": "Consequência se o grupo denunciar",
          "type": "textarea",
          "wide": true
        },
        {
          "id": "observacoes",
          "label": "Observações",
          "type": "textarea",
          "wide": true
        }
      ]
    }
  ],
  "catalog": {
    "weapons": [
      {
        "id": "livro5-arma-faca-comum",
        "category": "weapon",
        "name": "Faca comum",
        "tier": "F",
        "type": "Corpo a corpo",
        "damage": "1d4 cortante",
        "range": "-",
        "properties": "Leve, Arremesso 6 m",
        "mods": 0,
        "price": 5000,
        "tags": [
          "F",
          "Corpo a corpo",
          "Leve, Arremesso 6 m"
        ],
        "summary": "Alcance - | Leve, Arremesso 6 m",
        "source": "Livro 5, Tabela 42",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-adaga-de-sucata",
        "category": "weapon",
        "name": "Adaga de sucata",
        "tier": "F",
        "type": "Corpo a corpo",
        "damage": "1d4 perfurante",
        "range": "-",
        "properties": "Leve, Silenciosa",
        "mods": 0,
        "price": 5500,
        "tags": [
          "F",
          "Corpo a corpo",
          "Leve, Silenciosa"
        ],
        "summary": "Alcance - | Leve, Silenciosa",
        "source": "Livro 5, Tabela 42",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-bastao-reforcado",
        "category": "weapon",
        "name": "Bastão reforçado",
        "tier": "F",
        "type": "Corpo a corpo",
        "damage": "1d6 concussão",
        "range": "-",
        "properties": "Simples, Duas mãos opcional",
        "mods": 0,
        "price": 5000,
        "tags": [
          "F",
          "Corpo a corpo",
          "Simples, Duas mãos opcional"
        ],
        "summary": "Alcance - | Simples, Duas mãos opcional",
        "source": "Livro 5, Tabela 42",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-cano-pesado",
        "category": "weapon",
        "name": "Cano pesado",
        "tier": "F",
        "type": "Corpo a corpo",
        "damage": "1d6 concussão",
        "range": "-",
        "properties": "Improvisada, Pesada, Instável",
        "mods": 0,
        "price": 5000,
        "tags": [
          "F",
          "Corpo a corpo",
          "Improvisada, Pesada, Instável"
        ],
        "summary": "Alcance - | Improvisada, Pesada, Instável",
        "source": "Livro 5, Tabela 42",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-espada-curta-gasta",
        "category": "weapon",
        "name": "Espada curta gasta",
        "tier": "F",
        "type": "Corpo a corpo",
        "damage": "1d6 cortante",
        "range": "-",
        "properties": "Leve",
        "mods": 0,
        "price": 6500,
        "tags": [
          "F",
          "Corpo a corpo",
          "Leve"
        ],
        "summary": "Alcance - | Leve",
        "source": "Livro 5, Tabela 42",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-machado-simples",
        "category": "weapon",
        "name": "Machado simples",
        "tier": "F",
        "type": "Corpo a corpo",
        "damage": "1d6 cortante",
        "range": "-",
        "properties": "Pesada leve",
        "mods": 0,
        "price": 7000,
        "tags": [
          "F",
          "Corpo a corpo",
          "Pesada leve"
        ],
        "summary": "Alcance - | Pesada leve",
        "source": "Livro 5, Tabela 42",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-lanca-improvisada",
        "category": "weapon",
        "name": "Lança improvisada",
        "tier": "F",
        "type": "Corpo a corpo",
        "damage": "1d6 perfurante",
        "range": "2 m",
        "properties": "Alcance, Duas mãos",
        "mods": 0,
        "price": 6000,
        "tags": [
          "F",
          "Corpo a corpo",
          "Alcance, Duas mãos"
        ],
        "summary": "Alcance 2 m | Alcance, Duas mãos",
        "source": "Livro 5, Tabela 42",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-manopla-simples",
        "category": "weapon",
        "name": "Manopla simples",
        "tier": "F",
        "type": "Corpo a corpo",
        "damage": "1d4 concussão",
        "range": "-",
        "properties": "Leve, Desarmado melhorado",
        "mods": 0,
        "price": 6000,
        "tags": [
          "F",
          "Corpo a corpo",
          "Leve, Desarmado melhorado"
        ],
        "summary": "Alcance - | Leve, Desarmado melhorado",
        "source": "Livro 5, Tabela 42",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-pistola-de-sucata",
        "category": "weapon",
        "name": "Pistola de sucata",
        "tier": "F",
        "type": "Distância",
        "damage": "1d6 balístico",
        "range": "10 m",
        "properties": "Leve, Munição, Instável",
        "mods": 0,
        "price": 7000,
        "tags": [
          "F",
          "Distância",
          "Leve, Munição, Instável"
        ],
        "summary": "Alcance 10 m | Leve, Munição, Instável",
        "source": "Livro 5, Tabela 42",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-revolver-antigo",
        "category": "weapon",
        "name": "Revólver antigo",
        "tier": "F",
        "type": "Distância",
        "damage": "1d6 balístico",
        "range": "10 m",
        "properties": "Leve, Munição, Barulhenta",
        "mods": 0,
        "price": 7500,
        "tags": [
          "F",
          "Distância",
          "Leve, Munição, Barulhenta"
        ],
        "summary": "Alcance 10 m | Leve, Munição, Barulhenta",
        "source": "Livro 5, Tabela 42",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-arco-tecnologico-fraco",
        "category": "weapon",
        "name": "Arco tecnológico fraco",
        "tier": "F",
        "type": "Distância",
        "damage": "1d6 perfurante",
        "range": "15 m",
        "properties": "Silenciosa, Munição",
        "mods": 0,
        "price": 6500,
        "tags": [
          "F",
          "Distância",
          "Silenciosa, Munição"
        ],
        "summary": "Alcance 15 m | Silenciosa, Munição",
        "source": "Livro 5, Tabela 42",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-escopeta-curta-velha",
        "category": "weapon",
        "name": "Escopeta curta velha",
        "tier": "F",
        "type": "Distância",
        "damage": "1d8 balístico",
        "range": "6 m",
        "properties": "Munição, Curto alcance, Barulhenta",
        "mods": 0,
        "price": 8000,
        "tags": [
          "F",
          "Distância",
          "Munição, Curto alcance, Barulhenta"
        ],
        "summary": "Alcance 6 m | Munição, Curto alcance, Barulhenta",
        "source": "Livro 5, Tabela 42",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-espada-curta-militar",
        "category": "weapon",
        "name": "Espada curta militar",
        "tier": "E",
        "type": "Corpo a corpo",
        "damage": "1d6 cortante",
        "range": "-",
        "properties": "Leve, Confiável",
        "mods": 1,
        "price": 15000,
        "tags": [
          "E",
          "Corpo a corpo",
          "Leve, Confiável"
        ],
        "summary": "Alcance - | Leve, Confiável",
        "source": "Livro 5, Tabela 43",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-sabre-comum",
        "category": "weapon",
        "name": "Sabre comum",
        "tier": "E",
        "type": "Corpo a corpo",
        "damage": "1d6 cortante",
        "range": "-",
        "properties": "Leve, Precisão leve",
        "mods": 1,
        "price": 16000,
        "tags": [
          "E",
          "Corpo a corpo",
          "Leve, Precisão leve"
        ],
        "summary": "Alcance - | Leve, Precisão leve",
        "source": "Livro 5, Tabela 43",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-martelo-leve",
        "category": "weapon",
        "name": "Martelo leve",
        "tier": "E",
        "type": "Corpo a corpo",
        "damage": "1d6 concussão",
        "range": "-",
        "properties": "Confiável",
        "mods": 1,
        "price": 14000,
        "tags": [
          "E",
          "Corpo a corpo",
          "Confiável"
        ],
        "summary": "Alcance - | Confiável",
        "source": "Livro 5, Tabela 43",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-machado-de-combate-simples",
        "category": "weapon",
        "name": "Machado de combate simples",
        "tier": "E",
        "type": "Corpo a corpo",
        "damage": "1d8 cortante",
        "range": "-",
        "properties": "Pesada",
        "mods": 1,
        "price": 18000,
        "tags": [
          "E",
          "Corpo a corpo",
          "Pesada"
        ],
        "summary": "Alcance - | Pesada",
        "source": "Livro 5, Tabela 43",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-lanca-de-patrulha",
        "category": "weapon",
        "name": "Lança de patrulha",
        "tier": "E",
        "type": "Corpo a corpo",
        "damage": "1d6 perfurante",
        "range": "2 m",
        "properties": "Alcance, Duas mãos",
        "mods": 1,
        "price": 15000,
        "tags": [
          "E",
          "Corpo a corpo",
          "Alcance, Duas mãos"
        ],
        "summary": "Alcance 2 m | Alcance, Duas mãos",
        "source": "Livro 5, Tabela 43",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-manopla-reforcada",
        "category": "weapon",
        "name": "Manopla reforçada",
        "tier": "E",
        "type": "Corpo a corpo",
        "damage": "1d6 concussão",
        "range": "-",
        "properties": "Desarmado melhorado",
        "mods": 1,
        "price": 16000,
        "tags": [
          "E",
          "Corpo a corpo",
          "Desarmado melhorado"
        ],
        "summary": "Alcance - | Desarmado melhorado",
        "source": "Livro 5, Tabela 43",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-pistola-de-sobrevivencia",
        "category": "weapon",
        "name": "Pistola de sobrevivência",
        "tier": "E",
        "type": "Distância",
        "damage": "1d6 balístico",
        "range": "12 m",
        "properties": "Leve, Munição, Confiável",
        "mods": 1,
        "price": 18000,
        "tags": [
          "E",
          "Distância",
          "Leve, Munição, Confiável"
        ],
        "summary": "Alcance 12 m | Leve, Munição, Confiável",
        "source": "Livro 5, Tabela 43",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-revolver-confiavel",
        "category": "weapon",
        "name": "Revólver confiável",
        "tier": "E",
        "type": "Distância",
        "damage": "1d8 balístico",
        "range": "10 m",
        "properties": "Leve, Munição, Barulhenta",
        "mods": 1,
        "price": 1000,
        "tags": [
          "E",
          "Distância",
          "Leve, Munição, Barulhenta"
        ],
        "summary": "Alcance 10 m | Leve, Munição, Barulhenta",
        "source": "Livro 5, Tabela 43",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-fuzil-antigo",
        "category": "weapon",
        "name": "Fuzil antigo",
        "tier": "E",
        "type": "Distância",
        "damage": "1d8 balístico",
        "range": "24 m",
        "properties": "Duas mãos, Munição",
        "mods": 1,
        "price": 24000,
        "tags": [
          "E",
          "Distância",
          "Duas mãos, Munição"
        ],
        "summary": "Alcance 24 m | Duas mãos, Munição",
        "source": "Livro 5, Tabela 43",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-escopeta-comum",
        "category": "weapon",
        "name": "Escopeta comum",
        "tier": "E",
        "type": "Distância",
        "damage": "1d8 balístico",
        "range": "8 m",
        "properties": "Duas mãos, Munição, Barulhenta",
        "mods": 1,
        "price": 3000,
        "tags": [
          "E",
          "Distância",
          "Duas mãos, Munição, Barulhenta"
        ],
        "summary": "Alcance 8 m | Duas mãos, Munição, Barulhenta",
        "source": "Livro 5, Tabela 43",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-submetralhadora-simples",
        "category": "weapon",
        "name": "Submetralhadora simples",
        "tier": "E",
        "type": "Distância",
        "damage": "1d6 balístico",
        "range": "12 m",
        "properties": "Rajada, Munição, Barulhenta",
        "mods": 1,
        "price": 25000,
        "tags": [
          "E",
          "Distância",
          "Rajada, Munição, Barulhenta"
        ],
        "summary": "Alcance 12 m | Rajada, Munição, Barulhenta",
        "source": "Livro 5, Tabela 43",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-zarabatana-tecnica",
        "category": "weapon",
        "name": "Zarabatana técnica",
        "tier": "E",
        "type": "Distância",
        "damage": "1d4 perfurante",
        "range": "10 m",
        "properties": "Silenciosa, Tóxica se usar veneno",
        "mods": 1,
        "price": 12000,
        "tags": [
          "E",
          "Distância",
          "Silenciosa, Tóxica se usar veneno"
        ],
        "summary": "Alcance 10 m | Silenciosa, Tóxica se usar veneno",
        "source": "Livro 5, Tabela 43",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-espada-tatica",
        "category": "weapon",
        "name": "Espada tática",
        "tier": "D",
        "type": "Corpo a corpo",
        "damage": "1d8 cortante",
        "range": "-",
        "properties": "Confiável, Equilibrada",
        "mods": 2,
        "price": 50000,
        "tags": [
          "D",
          "Corpo a corpo",
          "Confiável, Equilibrada"
        ],
        "summary": "Alcance - | Confiável, Equilibrada",
        "source": "Livro 5, Tabela 44",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-katana-industrial",
        "category": "weapon",
        "name": "Katana industrial",
        "tier": "D",
        "type": "Corpo a corpo",
        "damage": "1d8 cortante",
        "range": "-",
        "properties": "Precisão, Leve",
        "mods": 2,
        "price": 55000,
        "tags": [
          "D",
          "Corpo a corpo",
          "Precisão, Leve"
        ],
        "summary": "Alcance - | Precisão, Leve",
        "source": "Livro 5, Tabela 44",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-martelo-de-impacto",
        "category": "weapon",
        "name": "Martelo de impacto",
        "tier": "D",
        "type": "Corpo a corpo",
        "damage": "1d8 concussão",
        "range": "-",
        "properties": "Pesada, Impacto",
        "mods": 2,
        "price": 52000,
        "tags": [
          "D",
          "Corpo a corpo",
          "Pesada, Impacto"
        ],
        "summary": "Alcance - | Pesada, Impacto",
        "source": "Livro 5, Tabela 44",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-machado-militar",
        "category": "weapon",
        "name": "Machado militar",
        "tier": "D",
        "type": "Corpo a corpo",
        "damage": "1d8 cortante",
        "range": "-",
        "properties": "Pesada, Quebra cobertura leve",
        "mods": 2,
        "price": 55000,
        "tags": [
          "D",
          "Corpo a corpo",
          "Pesada, Quebra cobertura leve"
        ],
        "summary": "Alcance - | Pesada, Quebra cobertura leve",
        "source": "Livro 5, Tabela 44",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-lanca-retratil",
        "category": "weapon",
        "name": "Lança retrátil",
        "tier": "D",
        "type": "Corpo a corpo",
        "damage": "1d8 perfurante",
        "range": "2 m",
        "properties": "Alcance, Dobrável",
        "mods": 2,
        "price": 50000,
        "tags": [
          "D",
          "Corpo a corpo",
          "Alcance, Dobrável"
        ],
        "summary": "Alcance 2 m | Alcance, Dobrável",
        "source": "Livro 5, Tabela 44",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-manopla-de-combate",
        "category": "weapon",
        "name": "Manopla de combate",
        "tier": "D",
        "type": "Corpo a corpo",
        "damage": "1d6 concussão",
        "range": "-",
        "properties": "Desarmado, Confiável",
        "mods": 2,
        "price": 48000,
        "tags": [
          "D",
          "Corpo a corpo",
          "Desarmado, Confiável"
        ],
        "summary": "Alcance - | Desarmado, Confiável",
        "source": "Livro 5, Tabela 44",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-pistola-tatica",
        "category": "weapon",
        "name": "Pistola tática",
        "tier": "D",
        "type": "Distância",
        "damage": "1d6 balístico",
        "range": "15 m",
        "properties": "Leve, Munição, Confiável",
        "mods": 2,
        "price": 50000,
        "tags": [
          "D",
          "Distância",
          "Leve, Munição, Confiável"
        ],
        "summary": "Alcance 15 m | Leve, Munição, Confiável",
        "source": "Livro 5, Tabela 44",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-fuzil-de-patrulha",
        "category": "weapon",
        "name": "Fuzil de patrulha",
        "tier": "D",
        "type": "Distância",
        "damage": "1d8 balístico",
        "range": "30 m",
        "properties": "Duas mãos, Munição",
        "mods": 2,
        "price": 65000,
        "tags": [
          "D",
          "Distância",
          "Duas mãos, Munição"
        ],
        "summary": "Alcance 30 m | Duas mãos, Munição",
        "source": "Livro 5, Tabela 44",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-rifle-de-precisao-leve",
        "category": "weapon",
        "name": "Rifle de precisão leve",
        "tier": "D",
        "type": "Distância",
        "damage": "1d10 balístico",
        "range": "60 m",
        "properties": "Duas mãos, Precisão, Distância mínima",
        "mods": 2,
        "price": 80000,
        "tags": [
          "D",
          "Distância",
          "Duas mãos, Precisão, Distância mínima"
        ],
        "summary": "Alcance 60 m | Duas mãos, Precisão, Distância mínima",
        "source": "Livro 5, Tabela 44",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-escopeta-tatica",
        "category": "weapon",
        "name": "Escopeta tática",
        "tier": "D",
        "type": "Distância",
        "damage": "1d10 balístico",
        "range": "10 m",
        "properties": "Duas mãos, Barulhenta",
        "mods": 2,
        "price": 70000,
        "tags": [
          "D",
          "Distância",
          "Duas mãos, Barulhenta"
        ],
        "summary": "Alcance 10 m | Duas mãos, Barulhenta",
        "source": "Livro 5, Tabela 44",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-submetralhadora-tatica",
        "category": "weapon",
        "name": "Submetralhadora tática",
        "tier": "D",
        "type": "Distância",
        "damage": "1d6 balístico",
        "range": "15 m",
        "properties": "Rajada, Munição, Barulhenta",
        "mods": 2,
        "price": 65000,
        "tags": [
          "D",
          "Distância",
          "Rajada, Munição, Barulhenta"
        ],
        "summary": "Alcance 15 m | Rajada, Munição, Barulhenta",
        "source": "Livro 5, Tabela 44",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-lancador-leve",
        "category": "weapon",
        "name": "Lançador leve",
        "tier": "D",
        "type": "Distância",
        "damage": "2d6 explosivo",
        "range": "20 m",
        "properties": "Área, Munição especial, Pesada",
        "mods": 2,
        "price": 90000,
        "tags": [
          "D",
          "Distância",
          "Área, Munição especial, Pesada"
        ],
        "summary": "Alcance 20 m | Área, Munição especial, Pesada",
        "source": "Livro 5, Tabela 44",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-vibroespada-inicial",
        "category": "weapon",
        "name": "Vibroespada inicial",
        "tier": "C",
        "type": "Corpo a corpo",
        "damage": "1d8 cortante",
        "range": "-",
        "properties": "Instável, +1 dano em sucesso completo",
        "mods": 3,
        "price": 150000,
        "tags": [
          "C",
          "Corpo a corpo",
          "Instável, +1 dano em sucesso completo"
        ],
        "summary": "Alcance - | Instável, +1 dano em sucesso completo",
        "source": "Livro 5, Tabela 45",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-martelo-sismico-leve",
        "category": "weapon",
        "name": "Martelo sísmico leve",
        "tier": "C",
        "type": "Corpo a corpo",
        "damage": "1d10 concussão",
        "range": "-",
        "properties": "Pesada, Impacto",
        "mods": 3,
        "price": 160000,
        "tags": [
          "C",
          "Corpo a corpo",
          "Pesada, Impacto"
        ],
        "summary": "Alcance - | Pesada, Impacto",
        "source": "Livro 5, Tabela 45",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-lanca-eletrocondutora",
        "category": "weapon",
        "name": "Lança eletrocondutora",
        "tier": "C",
        "type": "Corpo a corpo",
        "damage": "1d8 perfurante",
        "range": "2 m",
        "properties": "Alcance, Elétrica em carga",
        "mods": 3,
        "price": 170000,
        "tags": [
          "C",
          "Corpo a corpo",
          "Alcance, Elétrica em carga"
        ],
        "summary": "Alcance 2 m | Alcance, Elétrica em carga",
        "source": "Livro 5, Tabela 45",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-manopla-hidraulica",
        "category": "weapon",
        "name": "Manopla hidráulica",
        "tier": "C",
        "type": "Corpo a corpo",
        "damage": "1d8 concussão",
        "range": "-",
        "properties": "Pesada leve, Empurrão em sucesso completo",
        "mods": 3,
        "price": 160000,
        "tags": [
          "C",
          "Corpo a corpo",
          "Pesada leve, Empurrão em sucesso completo"
        ],
        "summary": "Alcance - | Pesada leve, Empurrão em sucesso completo",
        "source": "Livro 5, Tabela 45",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-pistola-avancada",
        "category": "weapon",
        "name": "Pistola avançada",
        "tier": "C",
        "type": "Distância",
        "damage": "1d8 balístico",
        "range": "18 m",
        "properties": "Leve, Confiável, Munição",
        "mods": 3,
        "price": 150000,
        "tags": [
          "C",
          "Distância",
          "Leve, Confiável, Munição"
        ],
        "summary": "Alcance 18 m | Leve, Confiável, Munição",
        "source": "Livro 5, Tabela 45",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-fuzil-modular",
        "category": "weapon",
        "name": "Fuzil modular",
        "tier": "C",
        "type": "Distância",
        "damage": "1d8 balístico",
        "range": "36 m",
        "properties": "Duas mãos, Munição, Modular",
        "mods": 3,
        "price": 180000,
        "tags": [
          "C",
          "Distância",
          "Duas mãos, Munição, Modular"
        ],
        "summary": "Alcance 36 m | Duas mãos, Munição, Modular",
        "source": "Livro 5, Tabela 45",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-rifle-de-precisao-militar",
        "category": "weapon",
        "name": "Rifle de precisão militar",
        "tier": "C",
        "type": "Distância",
        "damage": "1d10 balístico",
        "range": "80 m",
        "properties": "Precisão, Duas mãos, Distância mínima",
        "mods": 3,
        "price": 220000,
        "tags": [
          "C",
          "Distância",
          "Precisão, Duas mãos, Distância mínima"
        ],
        "summary": "Alcance 80 m | Precisão, Duas mãos, Distância mínima",
        "source": "Livro 5, Tabela 45",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-submetralhadora-superior",
        "category": "weapon",
        "name": "Submetralhadora superior",
        "tier": "C",
        "type": "Distância",
        "damage": "1d6 balístico",
        "range": "18 m",
        "properties": "Rajada, Confiável, Barulhenta",
        "mods": 3,
        "price": 170000,
        "tags": [
          "C",
          "Distância",
          "Rajada, Confiável, Barulhenta"
        ],
        "summary": "Alcance 18 m | Rajada, Confiável, Barulhenta",
        "source": "Livro 5, Tabela 45",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-escopeta-de-brecha",
        "category": "weapon",
        "name": "Escopeta de brecha",
        "tier": "C",
        "type": "Distância",
        "damage": "1d10 balístico",
        "range": "12 m",
        "properties": "Quebra cobertura leve, Barulhenta",
        "mods": 3,
        "price": 180000,
        "tags": [
          "C",
          "Distância",
          "Quebra cobertura leve, Barulhenta"
        ],
        "summary": "Alcance 12 m | Quebra cobertura leve, Barulhenta",
        "source": "Livro 5, Tabela 45",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-foco-de-disparo-bruto",
        "category": "weapon",
        "name": "Foco de disparo bruto",
        "tier": "C",
        "type": "Cósmica",
        "damage": "1d8 cósmico",
        "range": "18 m",
        "properties": "Cósmica, Instável, usa MEN",
        "mods": 3,
        "price": 250000,
        "tags": [
          "C",
          "Cósmica",
          "Cósmica, Instável, usa MEN"
        ],
        "summary": "Alcance 18 m | Cósmica, Instável, usa MEN",
        "source": "Livro 5, Tabela 45",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-lamina-de-ressonancia",
        "category": "weapon",
        "name": "Lâmina de ressonância",
        "tier": "B",
        "type": "Corpo a corpo",
        "damage": "1d10 cortante",
        "range": "-",
        "properties": "Cósmica compatível, Precisão",
        "mods": 4,
        "price": 500000,
        "tags": [
          "B",
          "Corpo a corpo",
          "Cósmica compatível, Precisão"
        ],
        "summary": "Alcance - | Cósmica compatível, Precisão",
        "source": "Livro 5, Tabela 46",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-martelo-gravitacional",
        "category": "weapon",
        "name": "Martelo gravitacional",
        "tier": "B",
        "type": "Corpo a corpo",
        "damage": "1d10 concussão",
        "range": "-",
        "properties": "Pesada, Empurra em sucesso completo",
        "mods": 4,
        "price": 550000,
        "tags": [
          "B",
          "Corpo a corpo",
          "Pesada, Empurra em sucesso completo"
        ],
        "summary": "Alcance - | Pesada, Empurra em sucesso completo",
        "source": "Livro 5, Tabela 46",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-machado-de-cerco",
        "category": "weapon",
        "name": "Machado de cerco",
        "tier": "B",
        "type": "Corpo a corpo",
        "damage": "1d12 cortante",
        "range": "-",
        "properties": "Pesada, Quebra cobertura",
        "mods": 4,
        "price": 530000,
        "tags": [
          "B",
          "Corpo a corpo",
          "Pesada, Quebra cobertura"
        ],
        "summary": "Alcance - | Pesada, Quebra cobertura",
        "source": "Livro 5, Tabela 46",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-manopla-de-exoforca",
        "category": "weapon",
        "name": "Manopla de exoforça",
        "tier": "B",
        "type": "Corpo a corpo",
        "damage": "1d10 concussão",
        "range": "-",
        "properties": "Desarmado, Pesada, Requer energia",
        "mods": 4,
        "price": 550000,
        "tags": [
          "B",
          "Corpo a corpo",
          "Desarmado, Pesada, Requer energia"
        ],
        "summary": "Alcance - | Desarmado, Pesada, Requer energia",
        "source": "Livro 5, Tabela 46",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-pistola-de-elite",
        "category": "weapon",
        "name": "Pistola de elite",
        "tier": "B",
        "type": "Distância",
        "damage": "1d8 balístico",
        "range": "20 m",
        "properties": "Leve, Confiável, Precisão",
        "mods": 4,
        "price": 500000,
        "tags": [
          "B",
          "Distância",
          "Leve, Confiável, Precisão"
        ],
        "summary": "Alcance 20 m | Leve, Confiável, Precisão",
        "source": "Livro 5, Tabela 46",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-fuzil-militar-pesado",
        "category": "weapon",
        "name": "Fuzil militar pesado",
        "tier": "B",
        "type": "Distância",
        "damage": "1d10 balístico",
        "range": "40 m",
        "properties": "Duas mãos, Munição, Recuo",
        "mods": 4,
        "price": 600000,
        "tags": [
          "B",
          "Distância",
          "Duas mãos, Munição, Recuo"
        ],
        "summary": "Alcance 40 m | Duas mãos, Munição, Recuo",
        "source": "Livro 5, Tabela 46",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-rifle-de-precisao-de-elite",
        "category": "weapon",
        "name": "Rifle de precisão de elite",
        "tier": "B",
        "type": "Distância",
        "damage": "1d12 balístico",
        "range": "100 m",
        "properties": "Precisão, Duas mãos, Distância mínima",
        "mods": 4,
        "price": 700000,
        "tags": [
          "B",
          "Distância",
          "Precisão, Duas mãos, Distância mínima"
        ],
        "summary": "Alcance 100 m | Precisão, Duas mãos, Distância mínima",
        "source": "Livro 5, Tabela 46",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-metralhadora-leve",
        "category": "weapon",
        "name": "Metralhadora leve",
        "tier": "B",
        "type": "Distância",
        "damage": "1d8 balístico",
        "range": "30 m",
        "properties": "Rajada, Supressão, Pesada",
        "mods": 4,
        "price": 650000,
        "tags": [
          "B",
          "Distância",
          "Rajada, Supressão, Pesada"
        ],
        "summary": "Alcance 30 m | Rajada, Supressão, Pesada",
        "source": "Livro 5, Tabela 46",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-lancador-de-carga",
        "category": "weapon",
        "name": "Lançador de carga",
        "tier": "B",
        "type": "Distância",
        "damage": "3d6 explosivo",
        "range": "30 m",
        "properties": "Área, Pesada, Munição especial",
        "mods": 4,
        "price": 800000,
        "tags": [
          "B",
          "Distância",
          "Área, Pesada, Munição especial"
        ],
        "summary": "Alcance 30 m | Área, Pesada, Munição especial",
        "source": "Livro 5, Tabela 46",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-foco-de-combate",
        "category": "weapon",
        "name": "Foco de combate",
        "tier": "B",
        "type": "Cósmica",
        "damage": "1d10 cósmico",
        "range": "24 m",
        "properties": "Cósmica, usa MEN, requer Cosmos",
        "mods": 4,
        "price": 850000,
        "tags": [
          "B",
          "Cósmica",
          "Cósmica, usa MEN, requer Cosmos"
        ],
        "summary": "Alcance 24 m | Cósmica, usa MEN, requer Cosmos",
        "source": "Livro 5, Tabela 46",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-lamina-de-plasma-controlado",
        "category": "weapon",
        "name": "Lâmina de plasma controlado",
        "tier": "A",
        "type": "Corpo a corpo",
        "damage": "2d6 fogo/cortante",
        "range": "-",
        "properties": "Instável, Cósmica compatível",
        "mods": 5,
        "price": 2000000,
        "tags": [
          "A",
          "Corpo a corpo",
          "Instável, Cósmica compatível"
        ],
        "summary": "Alcance - | Instável, Cósmica compatível",
        "source": "Livro 5, Tabela 47",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-martelo-de-ruptura",
        "category": "weapon",
        "name": "Martelo de ruptura",
        "tier": "A",
        "type": "Corpo a corpo",
        "damage": "2d6 concussão",
        "range": "-",
        "properties": "Pesada, Quebra cobertura, Recuo físico",
        "mods": 5,
        "price": 2200000,
        "tags": [
          "A",
          "Corpo a corpo",
          "Pesada, Quebra cobertura, Recuo físico"
        ],
        "summary": "Alcance - | Pesada, Quebra cobertura, Recuo físico",
        "source": "Livro 5, Tabela 47",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-lanca-de-fase-curta",
        "category": "weapon",
        "name": "Lança de fase curta",
        "tier": "A",
        "type": "Corpo a corpo",
        "damage": "1d12 perfurante",
        "range": "2 m",
        "properties": "Alcance, Ignora 1 redução",
        "mods": 5,
        "price": 2300000,
        "tags": [
          "A",
          "Corpo a corpo",
          "Alcance, Ignora 1 redução"
        ],
        "summary": "Alcance 2 m | Alcance, Ignora 1 redução",
        "source": "Livro 5, Tabela 47",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-pistola-de-aceleracao",
        "category": "weapon",
        "name": "Pistola de aceleração",
        "tier": "A",
        "type": "Distância",
        "damage": "1d10 balístico",
        "range": "25 m",
        "properties": "Leve, Precisão, Recuo",
        "mods": 5,
        "price": 2000000,
        "tags": [
          "A",
          "Distância",
          "Leve, Precisão, Recuo"
        ],
        "summary": "Alcance 25 m | Leve, Precisão, Recuo",
        "source": "Livro 5, Tabela 47",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-fuzil-de-elite-avancado",
        "category": "weapon",
        "name": "Fuzil de elite avançado",
        "tier": "A",
        "type": "Distância",
        "damage": "1d12 balístico",
        "range": "50 m",
        "properties": "Duas mãos, Confiável, Modular",
        "mods": 5,
        "price": 2500000,
        "tags": [
          "A",
          "Distância",
          "Duas mãos, Confiável, Modular"
        ],
        "summary": "Alcance 50 m | Duas mãos, Confiável, Modular",
        "source": "Livro 5, Tabela 47",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-rifle-antimateria-leve",
        "category": "weapon",
        "name": "Rifle antimatéria leve",
        "tier": "A",
        "type": "Distância",
        "damage": "2d6 balístico",
        "range": "120 m",
        "properties": "Pesada, Precisão, Distância mínima",
        "mods": 5,
        "price": 3200000,
        "tags": [
          "A",
          "Distância",
          "Pesada, Precisão, Distância mínima"
        ],
        "summary": "Alcance 120 m | Pesada, Precisão, Distância mínima",
        "source": "Livro 5, Tabela 47",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-metralhadora-de-supressao",
        "category": "weapon",
        "name": "Metralhadora de supressão",
        "tier": "A",
        "type": "Distância",
        "damage": "1d10 balístico",
        "range": "40 m",
        "properties": "Rajada, Supressão, Pesada",
        "mods": 5,
        "price": 2800000,
        "tags": [
          "A",
          "Distância",
          "Rajada, Supressão, Pesada"
        ],
        "summary": "Alcance 40 m | Rajada, Supressão, Pesada",
        "source": "Livro 5, Tabela 47",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-lancador-de-microcargas",
        "category": "weapon",
        "name": "Lançador de microcargas",
        "tier": "A",
        "type": "Distância",
        "damage": "4d6 explosivo",
        "range": "40 m",
        "properties": "Área, Pesada, Munição rara",
        "mods": 5,
        "price": 3500000,
        "tags": [
          "A",
          "Distância",
          "Área, Pesada, Munição rara"
        ],
        "summary": "Alcance 40 m | Área, Pesada, Munição rara",
        "source": "Livro 5, Tabela 47",
        "schemaVersion": 1
      },
      {
        "id": "livro5-arma-foco-de-anomalia",
        "category": "weapon",
        "name": "Foco de anomalia",
        "tier": "A",
        "type": "Cósmica",
        "damage": "2d6 cósmico",
        "range": "30 m",
        "properties": "Cósmica, Instável, requer Cosmos",
        "mods": 5,
        "price": 3800000,
        "tags": [
          "A",
          "Cósmica",
          "Cósmica, Instável, requer Cosmos"
        ],
        "summary": "Alcance 30 m | Cósmica, Instável, requer Cosmos",
        "source": "Livro 5, Tabela 47",
        "schemaVersion": 1
      }
    ],
    "armors": [
      {
        "id": "livro5-armadura-roupa-reforcada",
        "category": "armor",
        "name": "Roupa reforçada",
        "tier": "F",
        "kind": "Leve",
        "ca": 1,
        "hooks": "1",
        "mods": 0,
        "price": 6000,
        "tags": [
          "F",
          "Leve",
          "Discreta"
        ],
        "summary": "Ganchos 1 | Discreta",
        "source": "Livro 5, Tabela 49",
        "schemaVersion": 1
      },
      {
        "id": "livro5-armadura-colete-simples",
        "category": "armor",
        "name": "Colete simples",
        "tier": "F",
        "kind": "Leve",
        "ca": 2,
        "hooks": "1",
        "mods": 0,
        "price": 8000,
        "tags": [
          "F",
          "Leve",
          "Básica"
        ],
        "summary": "Ganchos 1 | Básica",
        "source": "Livro 5, Tabela 49",
        "schemaVersion": 1
      },
      {
        "id": "livro5-armadura-armadura-de-sucata",
        "category": "armor",
        "name": "Armadura de sucata",
        "tier": "F",
        "kind": "Média",
        "ca": 2,
        "hooks": "2",
        "mods": 0,
        "price": 7000,
        "tags": [
          "F",
          "Média",
          "Barulhenta, Improvisada"
        ],
        "summary": "Ganchos 2 | Barulhenta, Improvisada",
        "source": "Livro 5, Tabela 49",
        "schemaVersion": 1
      },
      {
        "id": "livro5-armadura-casaco-rebitado",
        "category": "armor",
        "name": "Casaco rebitado",
        "tier": "F",
        "kind": "Média",
        "ca": 2,
        "hooks": "2",
        "mods": 0,
        "price": 9000,
        "tags": [
          "F",
          "Média",
          "Resistente, -1 Furtividade"
        ],
        "summary": "Ganchos 2 | Resistente, -1 Furtividade",
        "source": "Livro 5, Tabela 49",
        "schemaVersion": 1
      },
      {
        "id": "livro5-armadura-traje-utilitario-gasto",
        "category": "armor",
        "name": "Traje utilitário gasto",
        "tier": "F",
        "kind": "Utilitária",
        "ca": 1,
        "hooks": "3",
        "mods": 1,
        "price": 10000,
        "tags": [
          "F",
          "Utilitária",
          "Suporte de ferramentas simples"
        ],
        "summary": "Ganchos 3 | Suporte de ferramentas simples",
        "source": "Livro 5, Tabela 49",
        "schemaVersion": 1
      },
      {
        "id": "livro5-armadura-placas-pesadas-improvisadas",
        "category": "armor",
        "name": "Placas pesadas improvisadas",
        "tier": "F",
        "kind": "Pesada",
        "ca": 3,
        "hooks": "2",
        "mods": 0,
        "price": 12000,
        "tags": [
          "F",
          "Pesada",
          "Pesada, -1 movimento"
        ],
        "summary": "Ganchos 2 | Pesada, -1 movimento",
        "source": "Livro 5, Tabela 49",
        "schemaVersion": 1
      },
      {
        "id": "livro5-armadura-jaqueta-balistica-leve",
        "category": "armor",
        "name": "Jaqueta balística leve",
        "tier": "E",
        "kind": "Leve",
        "ca": 2,
        "hooks": "1",
        "mods": 1,
        "price": 1000,
        "tags": [
          "E",
          "Leve",
          "Discreta"
        ],
        "summary": "Ganchos 1 | Discreta",
        "source": "Livro 5, Tabela 50",
        "schemaVersion": 1
      },
      {
        "id": "livro5-armadura-colete-reforcado",
        "category": "armor",
        "name": "Colete reforçado",
        "tier": "E",
        "kind": "Leve/Média",
        "ca": 2,
        "hooks": "2",
        "mods": 1,
        "price": 3000,
        "tags": [
          "E",
          "Leve/Média",
          "Confiável"
        ],
        "summary": "Ganchos 2 | Confiável",
        "source": "Livro 5, Tabela 50",
        "schemaVersion": 1
      },
      {
        "id": "livro5-armadura-armadura-de-patrulha-simples",
        "category": "armor",
        "name": "Armadura de patrulha simples",
        "tier": "E",
        "kind": "Média",
        "ca": 3,
        "hooks": "2",
        "mods": 1,
        "price": 28000,
        "tags": [
          "E",
          "Média",
          "-1 Furtividade"
        ],
        "summary": "Ganchos 2 | -1 Furtividade",
        "source": "Livro 5, Tabela 50",
        "schemaVersion": 1
      },
      {
        "id": "livro5-armadura-traje-de-explorador-comum",
        "category": "armor",
        "name": "Traje de explorador comum",
        "tier": "E",
        "kind": "Utilitária",
        "ca": 2,
        "hooks": "3",
        "mods": 1,
        "price": 30000,
        "tags": [
          "E",
          "Utilitária",
          "Suporte de kit"
        ],
        "summary": "Ganchos 3 | Suporte de kit",
        "source": "Livro 5, Tabela 50",
        "schemaVersion": 1
      },
      {
        "id": "livro5-armadura-armadura-de-placas-simples",
        "category": "armor",
        "name": "Armadura de placas simples",
        "tier": "E",
        "kind": "Pesada",
        "ca": 4,
        "hooks": "2",
        "mods": 1,
        "price": 7000,
        "tags": [
          "E",
          "Pesada",
          "Pesada, -1 movimento"
        ],
        "summary": "Ganchos 2 | Pesada, -1 movimento",
        "source": "Livro 5, Tabela 50",
        "schemaVersion": 1
      },
      {
        "id": "livro5-armadura-traje-com-filtro-leve",
        "category": "armor",
        "name": "Traje com filtro leve",
        "tier": "E",
        "kind": "Selada leve",
        "ca": 2,
        "hooks": "2",
        "mods": 1,
        "price": 35000,
        "tags": [
          "E",
          "Selada leve",
          "+1 contra poeira/esporos leves"
        ],
        "summary": "Ganchos 2 | +1 contra poeira/esporos leves",
        "source": "Livro 5, Tabela 50",
        "schemaVersion": 1
      },
      {
        "id": "livro5-armadura-armadura-tatica-leve",
        "category": "armor",
        "name": "Armadura tática leve",
        "tier": "D",
        "kind": "Leve",
        "ca": 2,
        "hooks": "2",
        "mods": 2,
        "price": 65000,
        "tags": [
          "D",
          "Leve",
          "Boa mobilidade"
        ],
        "summary": "Ganchos 2 | Boa mobilidade",
        "source": "Livro 5, Tabela 51",
        "schemaVersion": 1
      },
      {
        "id": "livro5-armadura-traje-de-exploracao",
        "category": "armor",
        "name": "Traje de exploração",
        "tier": "D",
        "kind": "Média/Utilitária",
        "ca": 2,
        "hooks": "2",
        "mods": 2,
        "price": 75000,
        "tags": [
          "D",
          "Média/Utilitária",
          "Ambiental leve"
        ],
        "summary": "Ganchos 2 | Ambiental leve",
        "source": "Livro 5, Tabela 51",
        "schemaVersion": 1
      },
      {
        "id": "livro5-armadura-armadura-de-patrulha",
        "category": "armor",
        "name": "Armadura de patrulha",
        "tier": "D",
        "kind": "Média",
        "ca": 3,
        "hooks": "2",
        "mods": 2,
        "price": 85000,
        "tags": [
          "D",
          "Média",
          "Confiável, -1 Furtividade"
        ],
        "summary": "Ganchos 2 | Confiável, -1 Furtividade",
        "source": "Livro 5, Tabela 51",
        "schemaVersion": 1
      },
      {
        "id": "livro5-armadura-armadura-utilitaria-tecnica",
        "category": "armor",
        "name": "Armadura utilitária técnica",
        "tier": "D",
        "kind": "Utilitária",
        "ca": 2,
        "hooks": "4",
        "mods": 2,
        "price": 90000,
        "tags": [
          "D",
          "Utilitária",
          "Suporte de ferramentas"
        ],
        "summary": "Ganchos 4 | Suporte de ferramentas",
        "source": "Livro 5, Tabela 51",
        "schemaVersion": 1
      },
      {
        "id": "livro5-armadura-armadura-pesada-de-guarda",
        "category": "armor",
        "name": "Armadura pesada de guarda",
        "tier": "D",
        "kind": "Pesada",
        "ca": 4,
        "hooks": "3",
        "mods": 2,
        "price": 110000,
        "tags": [
          "D",
          "Pesada",
          "Pesada, Redução 1 física situacional"
        ],
        "summary": "Ganchos 3 | Pesada, Redução 1 física situacional",
        "source": "Livro 5, Tabela 51",
        "schemaVersion": 1
      },
      {
        "id": "livro5-armadura-traje-selado-basico",
        "category": "armor",
        "name": "Traje selado básico",
        "tier": "D",
        "kind": "Selada",
        "ca": 3,
        "hooks": "2",
        "mods": 2,
        "price": 120000,
        "tags": [
          "D",
          "Selada",
          "Proteção contra gás leve"
        ],
        "summary": "Ganchos 2 | Proteção contra gás leve",
        "source": "Livro 5, Tabela 51",
        "schemaVersion": 1
      },
      {
        "id": "livro5-armadura-armadura-furtiva-avancada",
        "category": "armor",
        "name": "Armadura furtiva avançada",
        "tier": "C",
        "kind": "Leve",
        "ca": 3,
        "hooks": "2",
        "mods": 3,
        "price": 220000,
        "tags": [
          "C",
          "Leve",
          "Reduz penalidade de Furtividade"
        ],
        "summary": "Ganchos 2 | Reduz penalidade de Furtividade",
        "source": "Livro 5, Tabela 52",
        "schemaVersion": 1
      },
      {
        "id": "livro5-armadura-armadura-de-combate-modular",
        "category": "armor",
        "name": "Armadura de combate modular",
        "tier": "C",
        "kind": "Média",
        "ca": 4,
        "hooks": "3",
        "mods": 3,
        "price": 240000,
        "tags": [
          "C",
          "Média",
          "Modular, Confiável"
        ],
        "summary": "Ganchos 3 | Modular, Confiável",
        "source": "Livro 5, Tabela 52",
        "schemaVersion": 1
      },
      {
        "id": "livro5-armadura-traje-selado-de-exploracao",
        "category": "armor",
        "name": "Traje selado de exploração",
        "tier": "C",
        "kind": "Selada/Utilitária",
        "ca": 3,
        "hooks": "3",
        "mods": 3,
        "price": 280000,
        "tags": [
          "C",
          "Selada/Utilitária",
          "Proteção ambiental moderada"
        ],
        "summary": "Ganchos 3 | Proteção ambiental moderada",
        "source": "Livro 5, Tabela 52",
        "schemaVersion": 1
      },
      {
        "id": "livro5-armadura-armadura-pesada-militar-leve",
        "category": "armor",
        "name": "Armadura pesada militar leve",
        "tier": "C",
        "kind": "Pesada",
        "ca": 5,
        "hooks": "3",
        "mods": 3,
        "price": 320000,
        "tags": [
          "C",
          "Pesada",
          "Pesada, Redução 1"
        ],
        "summary": "Ganchos 3 | Pesada, Redução 1",
        "source": "Livro 5, Tabela 52",
        "schemaVersion": 1
      },
      {
        "id": "livro5-armadura-exotraje-utilitario-leve",
        "category": "armor",
        "name": "Exotraje utilitário leve",
        "tier": "C",
        "kind": "Utilitária",
        "ca": 3,
        "hooks": "4",
        "mods": 3,
        "price": 350000,
        "tags": [
          "C",
          "Utilitária",
          "Ajuda em carga e ferramentas"
        ],
        "summary": "Ganchos 4 | Ajuda em carga e ferramentas",
        "source": "Livro 5, Tabela 52",
        "schemaVersion": 1
      },
      {
        "id": "livro5-armadura-armadura-canalizada-simples",
        "category": "armor",
        "name": "Armadura canalizada simples",
        "tier": "C",
        "kind": "Cósmica",
        "ca": 3,
        "hooks": "2",
        "mods": 3,
        "price": 400000,
        "tags": [
          "C",
          "Cósmica",
          "+1 em JPC específica"
        ],
        "summary": "Ganchos 2 | +1 em JPC específica",
        "source": "Livro 5, Tabela 52",
        "schemaVersion": 1
      },
      {
        "id": "livro5-armadura-armadura-de-elite-leve",
        "category": "armor",
        "name": "Armadura de elite leve",
        "tier": "B",
        "kind": "Leve",
        "ca": 3,
        "hooks": "3",
        "mods": 4,
        "price": 700000,
        "tags": [
          "B",
          "Leve",
          "Mobilidade superior"
        ],
        "summary": "Ganchos 3 | Mobilidade superior",
        "source": "Livro 5, Tabela 53",
        "schemaVersion": 1
      },
      {
        "id": "livro5-armadura-armadura-militar-modular",
        "category": "armor",
        "name": "Armadura militar modular",
        "tier": "B",
        "kind": "Média",
        "ca": 5,
        "hooks": "3",
        "mods": 4,
        "price": 800000,
        "tags": [
          "B",
          "Média",
          "Modular, Confiável"
        ],
        "summary": "Ganchos 3 | Modular, Confiável",
        "source": "Livro 5, Tabela 53",
        "schemaVersion": 1
      },
      {
        "id": "livro5-armadura-armadura-pesada-de-cerco",
        "category": "armor",
        "name": "Armadura pesada de cerco",
        "tier": "B",
        "kind": "Pesada",
        "ca": 6,
        "hooks": "4",
        "mods": 4,
        "price": 1000000,
        "tags": [
          "B",
          "Pesada",
          "Redução 2 física situacional, Pesada"
        ],
        "summary": "Ganchos 4 | Redução 2 física situacional, Pesada",
        "source": "Livro 5, Tabela 53",
        "schemaVersion": 1
      },
      {
        "id": "livro5-armadura-traje-selado-de-zona-hostil",
        "category": "armor",
        "name": "Traje selado de zona hostil",
        "tier": "B",
        "kind": "Selada",
        "ca": 4,
        "hooks": "3",
        "mods": 4,
        "price": 950000,
        "tags": [
          "B",
          "Selada",
          "Proteção ambiental forte"
        ],
        "summary": "Ganchos 3 | Proteção ambiental forte",
        "source": "Livro 5, Tabela 53",
        "schemaVersion": 1
      },
      {
        "id": "livro5-armadura-exotraje-de-trabalho-pesado",
        "category": "armor",
        "name": "Exotraje de trabalho pesado",
        "tier": "B",
        "kind": "Utilitária/Pesada",
        "ca": 5,
        "hooks": "5",
        "mods": 4,
        "price": 1100000,
        "tags": [
          "B",
          "Utilitária/Pesada",
          "Aumenta carga, Pesada"
        ],
        "summary": "Ganchos 5 | Aumenta carga, Pesada",
        "source": "Livro 5, Tabela 53",
        "schemaVersion": 1
      },
      {
        "id": "livro5-armadura-armadura-cosmica-estabilizada",
        "category": "armor",
        "name": "Armadura cósmica estabilizada",
        "tier": "B",
        "kind": "Cósmica",
        "ca": 4,
        "hooks": "3",
        "mods": 4,
        "price": 1300000,
        "tags": [
          "B",
          "Cósmica",
          "+1 JPC, reduz risco de marca"
        ],
        "summary": "Ganchos 3 | +1 JPC, reduz risco de marca",
        "source": "Livro 5, Tabela 53",
        "schemaVersion": 1
      },
      {
        "id": "livro5-armadura-armadura-de-infiltracao-ativa",
        "category": "armor",
        "name": "Armadura de infiltração ativa",
        "tier": "A",
        "kind": "Leve",
        "ca": 4,
        "hooks": "3",
        "mods": 5,
        "price": 3000000,
        "tags": [
          "A",
          "Leve",
          "Camuflagem limitada, Silenciosa"
        ],
        "summary": "Ganchos 3 | Camuflagem limitada, Silenciosa",
        "source": "Livro 5, Tabela 54",
        "schemaVersion": 1
      },
      {
        "id": "livro5-armadura-armadura-de-comandante",
        "category": "armor",
        "name": "Armadura de comandante",
        "tier": "A",
        "kind": "Média",
        "ca": 6,
        "hooks": "4",
        "mods": 5,
        "price": 3500000,
        "tags": [
          "A",
          "Média",
          "Modular, suporte tático"
        ],
        "summary": "Ganchos 4 | Modular, suporte tático",
        "source": "Livro 5, Tabela 54",
        "schemaVersion": 1
      },
      {
        "id": "livro5-armadura-armadura-pesada-de-assalto",
        "category": "armor",
        "name": "Armadura pesada de assalto",
        "tier": "A",
        "kind": "Pesada",
        "ca": 7,
        "hooks": "4",
        "mods": 5,
        "price": 4000000,
        "tags": [
          "A",
          "Pesada",
          "Redução 2, Pesada"
        ],
        "summary": "Ganchos 4 | Redução 2, Pesada",
        "source": "Livro 5, Tabela 54",
        "schemaVersion": 1
      },
      {
        "id": "livro5-armadura-traje-selado-extremo",
        "category": "armor",
        "name": "Traje selado extremo",
        "tier": "A",
        "kind": "Selada",
        "ca": 5,
        "hooks": "4",
        "mods": 5,
        "price": 4200000,
        "tags": [
          "A",
          "Selada",
          "Ambiente extremo, suporte vital curto"
        ],
        "summary": "Ganchos 4 | Ambiente extremo, suporte vital curto",
        "source": "Livro 5, Tabela 54",
        "schemaVersion": 1
      },
      {
        "id": "livro5-armadura-exotraje-industrial-avancado",
        "category": "armor",
        "name": "Exotraje industrial avançado",
        "tier": "A",
        "kind": "Utilitária/Pesada",
        "ca": 6,
        "hooks": "5",
        "mods": 5,
        "price": 4500000,
        "tags": [
          "A",
          "Utilitária/Pesada",
          "Grande carga, servoassistida"
        ],
        "summary": "Ganchos 5 | Grande carga, servoassistida",
        "source": "Livro 5, Tabela 54",
        "schemaVersion": 1
      },
      {
        "id": "livro5-armadura-armadura-de-ressonancia",
        "category": "armor",
        "name": "Armadura de ressonância",
        "tier": "A",
        "kind": "Cósmica",
        "ca": 5,
        "hooks": "4",
        "mods": 5,
        "price": 5000000,
        "tags": [
          "A",
          "Cósmica",
          "Bônus cósmico, risco de interferência"
        ],
        "summary": "Ganchos 4 | Bônus cósmico, risco de interferência",
        "source": "Livro 5, Tabela 54",
        "schemaVersion": 1
      }
    ],
    "items": [
      {
        "id": "livro5-item-balas-leves",
        "category": "item",
        "name": "Balas leves",
        "tier": "",
        "price": 50010,
        "weight": "",
        "tags": [
          "Municao"
        ],
        "summary": "Pistolas e submetralhadoras leves",
        "source": "Livro 5, Tabela 56",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-balas-medias",
        "category": "item",
        "name": "Balas médias",
        "tier": "",
        "price": 80010,
        "weight": "",
        "tags": [
          "Municao"
        ],
        "summary": "Fuzis e rifles comuns",
        "source": "Livro 5, Tabela 56",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-balas-pesadas",
        "category": "item",
        "name": "Balas pesadas",
        "tier": "",
        "price": 150010,
        "weight": "",
        "tags": [
          "Municao"
        ],
        "summary": "Rifles pesados e armas militares",
        "source": "Livro 5, Tabela 56",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-cartuchos",
        "category": "item",
        "name": "Cartuchos",
        "tier": "",
        "price": 100010,
        "weight": "",
        "tags": [
          "Municao"
        ],
        "summary": "Escopetas",
        "source": "Livro 5, Tabela 56",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-flechas-tecnologicas-simples",
        "category": "item",
        "name": "Flechas tecnológicas simples",
        "tier": "",
        "price": 50010,
        "weight": "",
        "tags": [
          "Municao"
        ],
        "summary": "Arcos tecnológicos",
        "source": "Livro 5, Tabela 56",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-dardos",
        "category": "item",
        "name": "Dardos",
        "tier": "",
        "price": 40010,
        "weight": "",
        "tags": [
          "Municao"
        ],
        "summary": "Zarabatanas e lançadores pequenos",
        "source": "Livro 5, Tabela 56",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-celula-energetica-simples",
        "category": "item",
        "name": "Célula energética simples",
        "tier": "",
        "price": 2000,
        "weight": "",
        "tags": [
          "Municao"
        ],
        "summary": "Armas de energia leves",
        "source": "Livro 5, Tabela 56",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-carga-de-lancador-leve",
        "category": "item",
        "name": "Carga de lançador leve",
        "tier": "",
        "price": 4000,
        "weight": "",
        "tags": [
          "Municao"
        ],
        "summary": "Lançadores Tier D/C",
        "source": "Livro 5, Tabela 56",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-carga-explosiva-pesada",
        "category": "item",
        "name": "Carga explosiva pesada",
        "tier": "",
        "price": 10000,
        "weight": "",
        "tags": [
          "Municao"
        ],
        "summary": "Lançadores Tier B/A",
        "source": "Livro 5, Tabela 56",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-perfurante-leve",
        "category": "item",
        "name": "Perfurante leve",
        "tier": "",
        "price": 250010,
        "weight": "",
        "tags": [
          "Municao especial"
        ],
        "summary": "Ignora 1 redução física, se aplicável",
        "source": "Livro 5, Tabela 57",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-incendiaria",
        "category": "item",
        "name": "Incendiária",
        "tier": "",
        "price": 350010,
        "weight": "",
        "tags": [
          "Municao especial"
        ],
        "summary": "Pode causar Queimando em sucesso completo",
        "source": "Livro 5, Tabela 57",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-eletrica",
        "category": "item",
        "name": "Elétrica",
        "tier": "",
        "price": 400010,
        "weight": "",
        "tags": [
          "Municao especial"
        ],
        "summary": "Pode causar Tonto em alvo metálico ou molhado",
        "source": "Livro 5, Tabela 57",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-tranquilizante",
        "category": "item",
        "name": "Tranquilizante",
        "tier": "",
        "price": 30005,
        "weight": "",
        "tags": [
          "Municao especial"
        ],
        "summary": "Pode causar Tonto/Envenenado com JPF CON",
        "source": "Livro 5, Tabela 57",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-marcadora",
        "category": "item",
        "name": "Marcadora",
        "tier": "",
        "price": 200010,
        "weight": "",
        "tags": [
          "Municao especial"
        ],
        "summary": "Facilita rastreio ou sensor contra alvo atingido",
        "source": "Livro 5, Tabela 57",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-anticosmica-fraca",
        "category": "item",
        "name": "Anticósmica fraca",
        "tier": "",
        "price": 80005,
        "weight": "",
        "tags": [
          "Municao especial"
        ],
        "summary": "+1 contra alvo Marcado pelo Cosmos",
        "source": "Livro 5, Tabela 57",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-explosiva-leve",
        "category": "item",
        "name": "Explosiva leve",
        "tier": "",
        "price": 60005,
        "weight": "",
        "tags": [
          "Municao especial"
        ],
        "summary": "Pequena área ou +1d4 contra estruturas",
        "source": "Livro 5, Tabela 57",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-corrosiva",
        "category": "item",
        "name": "Corrosiva",
        "tier": "",
        "price": 80005,
        "weight": "",
        "tags": [
          "Municao especial"
        ],
        "summary": "Pode causar 1 rachadura em armadura em crítico",
        "source": "Livro 5, Tabela 57",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-granada-improvisada",
        "category": "item",
        "name": "Granada improvisada",
        "tier": "F",
        "price": 5000,
        "weight": "",
        "tags": [
          "Explosivo",
          "F"
        ],
        "summary": "2d4 explosivo | F | 2 m | 10",
        "source": "Livro 5, Tabela 58",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-granada-simples",
        "category": "item",
        "name": "Granada simples",
        "tier": "E",
        "price": 12000,
        "weight": "",
        "tags": [
          "Explosivo",
          "E"
        ],
        "summary": "2d6 explosivo | E | 3 m | 12",
        "source": "Livro 5, Tabela 58",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-granada-de-fragmentacao",
        "category": "item",
        "name": "Granada de fragmentação",
        "tier": "D",
        "price": 25000,
        "weight": "",
        "tags": [
          "Explosivo",
          "D"
        ],
        "summary": "3d6 explosivo/perfurante | D | 3 m | 13",
        "source": "Livro 5, Tabela 58",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-granada-incendiaria",
        "category": "item",
        "name": "Granada incendiária",
        "tier": "D",
        "price": 30000,
        "weight": "",
        "tags": [
          "Explosivo",
          "D"
        ],
        "summary": "2d6 fogo e pode Queimar | D | 3 m | 13",
        "source": "Livro 5, Tabela 58",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-granada-de-fumaca",
        "category": "item",
        "name": "Granada de fumaça",
        "tier": "E",
        "price": 8000,
        "weight": "",
        "tags": [
          "Explosivo",
          "E"
        ],
        "summary": "Cria área de fumaça | E | 5 m | -",
        "source": "Livro 5, Tabela 58",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-granada-de-luz",
        "category": "item",
        "name": "Granada de luz",
        "tier": "D",
        "price": 1000,
        "weight": "",
        "tags": [
          "Explosivo",
          "D"
        ],
        "summary": "Pode causar Cego/Tonto | D | 4 m | 13",
        "source": "Livro 5, Tabela 58",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-carga-de-demolicao-leve",
        "category": "item",
        "name": "Carga de demolição leve",
        "tier": "D",
        "price": 7000,
        "weight": "",
        "tags": [
          "Explosivo",
          "D"
        ],
        "summary": "4d6 contra estrutura | D | 1 m | -",
        "source": "Livro 5, Tabela 58",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-carga-de-demolicao-pesada",
        "category": "item",
        "name": "Carga de demolição pesada",
        "tier": "C",
        "price": 100000,
        "weight": "",
        "tags": [
          "Explosivo",
          "C"
        ],
        "summary": "6d6 contra estrutura | C | 2 m | -",
        "source": "Livro 5, Tabela 58",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-mina-simples",
        "category": "item",
        "name": "Mina simples",
        "tier": "D",
        "price": 30000,
        "weight": "",
        "tags": [
          "Explosivo",
          "D"
        ],
        "summary": "3d6 explosivo | D | 2 m | 13",
        "source": "Livro 5, Tabela 58",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-mina-militar",
        "category": "item",
        "name": "Mina militar",
        "tier": "B",
        "price": 150000,
        "weight": "",
        "tags": [
          "Explosivo",
          "B"
        ],
        "summary": "5d6 explosivo | B | 3 m | 15",
        "source": "Livro 5, Tabela 58",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-kit-medico-simples",
        "category": "item",
        "name": "Kit médico simples",
        "tier": "F/E",
        "price": 2000,
        "weight": "",
        "tags": [
          "Kit",
          "F/E"
        ],
        "summary": "Primeiros socorros e estabilização | F/E",
        "source": "Livro 5, Tabela 59",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-kit-medico-profissional",
        "category": "item",
        "name": "Kit médico profissional",
        "tier": "D",
        "price": 1000,
        "weight": "",
        "tags": [
          "Kit",
          "D"
        ],
        "summary": "Tratamento e estabilização melhorada | D",
        "source": "Livro 5, Tabela 59",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-kit-de-reparo-simples",
        "category": "item",
        "name": "Kit de reparo simples",
        "tier": "F/E",
        "price": 2500,
        "weight": "",
        "tags": [
          "Kit",
          "F/E"
        ],
        "summary": "Reparos leves em campo | F/E",
        "source": "Livro 5, Tabela 59",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-kit-de-engenharia",
        "category": "item",
        "name": "Kit de engenharia",
        "tier": "D",
        "price": 1000,
        "weight": "",
        "tags": [
          "Kit",
          "D"
        ],
        "summary": "Armas, armaduras e mecanismos | D",
        "source": "Livro 5, Tabela 59",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-kit-de-tecnologia",
        "category": "item",
        "name": "Kit de tecnologia",
        "tier": "D",
        "price": 1000,
        "weight": "",
        "tags": [
          "Kit",
          "D"
        ],
        "summary": "Sensores, sistemas e dispositivos | D",
        "source": "Livro 5, Tabela 59",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-kit-de-sobrevivencia",
        "category": "item",
        "name": "Kit de sobrevivência",
        "tier": "F/E",
        "price": 3000,
        "weight": "",
        "tags": [
          "Kit",
          "F/E"
        ],
        "summary": "Abrigo, fogo, ferramentas básicas | F/E",
        "source": "Livro 5, Tabela 59",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-kit-de-exploracao",
        "category": "item",
        "name": "Kit de exploração",
        "tier": "F/E",
        "price": 3500,
        "weight": "",
        "tags": [
          "Kit",
          "F/E"
        ],
        "summary": "Corda, ganchos, luz, marcação | F/E",
        "source": "Livro 5, Tabela 59",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-kit-quimico",
        "category": "item",
        "name": "Kit químico",
        "tier": "D",
        "price": 18000,
        "weight": "",
        "tags": [
          "Kit",
          "D"
        ],
        "summary": "Ácidos, neutralizantes, testes simples | D",
        "source": "Livro 5, Tabela 59",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-kit-biologico",
        "category": "item",
        "name": "Kit biológico",
        "tier": "D",
        "price": 18000,
        "weight": "",
        "tags": [
          "Kit",
          "D"
        ],
        "summary": "Amostras, análise, contenção | D",
        "source": "Livro 5, Tabela 59",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-kit-de-infiltracao",
        "category": "item",
        "name": "Kit de infiltração",
        "tier": "D",
        "price": 25000,
        "weight": "",
        "tags": [
          "Kit",
          "D"
        ],
        "summary": "Fechaduras, sensores simples, disfarces técnicos | D",
        "source": "Livro 5, Tabela 59",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-cubo-de-medicina",
        "category": "item",
        "name": "Cubo de Medicina",
        "tier": "D",
        "price": 7000,
        "weight": "",
        "tags": [
          "Kit avancado",
          "D"
        ],
        "summary": "Armazena suprimentos médicos e ferramentas | D",
        "source": "Livro 5, Tabela 60",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-cubo-de-engenharia",
        "category": "item",
        "name": "Cubo de Engenharia",
        "tier": "D",
        "price": 7000,
        "weight": "",
        "tags": [
          "Kit avancado",
          "D"
        ],
        "summary": "Peças, ferramentas e bancada compacta | D",
        "source": "Livro 5, Tabela 60",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-cubo-de-tecnologia",
        "category": "item",
        "name": "Cubo de Tecnologia",
        "tier": "D",
        "price": 7000,
        "weight": "",
        "tags": [
          "Kit avancado",
          "D"
        ],
        "summary": "Cabos, interfaces e módulos digitais | D",
        "source": "Livro 5, Tabela 60",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-cubo-de-coleta",
        "category": "item",
        "name": "Cubo de Coleta",
        "tier": "D",
        "price": 30000,
        "weight": "",
        "tags": [
          "Kit avancado",
          "D"
        ],
        "summary": "Armazena amostras e materiais | D",
        "source": "Livro 5, Tabela 60",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-cubo-de-municao",
        "category": "item",
        "name": "Cubo de Munição",
        "tier": "D",
        "price": 30000,
        "weight": "",
        "tags": [
          "Kit avancado",
          "D"
        ],
        "summary": "Armazena munições com segurança | D",
        "source": "Livro 5, Tabela 60",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-bancada-portatil",
        "category": "item",
        "name": "Bancada portátil",
        "tier": "C",
        "price": 150000,
        "weight": "",
        "tags": [
          "Kit avancado",
          "C"
        ],
        "summary": "Permite reparos melhores fora de combate | C",
        "source": "Livro 5, Tabela 60",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-estacao-medica-dobravel",
        "category": "item",
        "name": "Estação médica dobrável",
        "tier": "C",
        "price": 180000,
        "weight": "",
        "tags": [
          "Kit avancado",
          "C"
        ],
        "summary": "Tratamento em campo com menos penalidade | C",
        "source": "Livro 5, Tabela 60",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-analisador-cosmico",
        "category": "item",
        "name": "Analisador cósmico",
        "tier": "C",
        "price": 200000,
        "weight": "",
        "tags": [
          "Kit avancado",
          "C"
        ],
        "summary": "Ajuda em Percepção/Busca Cósmica técnica | C",
        "source": "Livro 5, Tabela 60",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-selador-ambiental-portatil",
        "category": "item",
        "name": "Selador ambiental portátil",
        "tier": "C",
        "price": 150000,
        "weight": "",
        "tags": [
          "Kit avancado",
          "C"
        ],
        "summary": "Repara vedação de armadura fora de combate | C",
        "source": "Livro 5, Tabela 60",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-corda-reforcada-20-m",
        "category": "item",
        "name": "Corda reforçada 20 m",
        "tier": "",
        "price": 700,
        "weight": "",
        "tags": [
          "Exploracao"
        ],
        "summary": "Ajuda em escalada, resgaté e travessia",
        "source": "Livro 5, Tabela 61",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-gancho-de-escalada",
        "category": "item",
        "name": "Gancho de escalada",
        "tier": "",
        "price": 1000,
        "weight": "",
        "tags": [
          "Exploracao"
        ],
        "summary": "+1 em escalada com preparo",
        "source": "Livro 5, Tabela 61",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-lanterna-comum",
        "category": "item",
        "name": "Lanterna comum",
        "tier": "",
        "price": 500,
        "weight": "",
        "tags": [
          "Exploracao"
        ],
        "summary": "Ilumina área curta",
        "source": "Livro 5, Tabela 61",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-lanterna-de-alta-potencia",
        "category": "item",
        "name": "Lanterna de alta potência",
        "tier": "",
        "price": 2000,
        "weight": "",
        "tags": [
          "Exploracao"
        ],
        "summary": "Ilumina área maior, consome bateria",
        "source": "Livro 5, Tabela 61",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-bateria-simples",
        "category": "item",
        "name": "Bateria simples",
        "tier": "",
        "price": 800,
        "weight": "",
        "tags": [
          "Exploracao"
        ],
        "summary": "Recarrega item pequeno",
        "source": "Livro 5, Tabela 61",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-bateria-media",
        "category": "item",
        "name": "Bateria média",
        "tier": "",
        "price": 2500,
        "weight": "",
        "tags": [
          "Exploracao"
        ],
        "summary": "Recarrega item médio",
        "source": "Livro 5, Tabela 61",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-sinalizador",
        "category": "item",
        "name": "Sinalizador",
        "tier": "",
        "price": 1000,
        "weight": "",
        "tags": [
          "Exploracao"
        ],
        "summary": "Marca posição ou pede resgate",
        "source": "Livro 5, Tabela 61",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-mascara-simples",
        "category": "item",
        "name": "Máscara simples",
        "tier": "",
        "price": 1500,
        "weight": "",
        "tags": [
          "Exploracao"
        ],
        "summary": "+1 contra poeira e fumaça leve",
        "source": "Livro 5, Tabela 61",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-filtro-respiratorio-avulso",
        "category": "item",
        "name": "Filtro respiratório avulso",
        "tier": "",
        "price": 2500,
        "weight": "",
        "tags": [
          "Exploracao"
        ],
        "summary": "Proteção curta contra gás leve",
        "source": "Livro 5, Tabela 61",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-cantil-reforcado",
        "category": "item",
        "name": "Cantil reforçado",
        "tier": "",
        "price": 400,
        "weight": "",
        "tags": [
          "Exploracao"
        ],
        "summary": "Água protegida contra contaminação leve",
        "source": "Livro 5, Tabela 61",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-racao-de-viagem",
        "category": "item",
        "name": "Ração de viagem",
        "tier": "",
        "price": 100,
        "weight": "",
        "tags": [
          "Exploracao"
        ],
        "summary": "1 dia de alimento simples",
        "source": "Livro 5, Tabela 61",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-cobertor-termico",
        "category": "item",
        "name": "Cobertor térmico",
        "tier": "",
        "price": 700,
        "weight": "",
        "tags": [
          "Exploracao"
        ],
        "summary": "Ajuda contra frio leve",
        "source": "Livro 5, Tabela 61",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-kit-de-acampamento",
        "category": "item",
        "name": "Kit de acampamento",
        "tier": "",
        "price": 2500,
        "weight": "",
        "tags": [
          "Exploracao"
        ],
        "summary": "Barraca, lona e utensílios simples",
        "source": "Livro 5, Tabela 61",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-detector-quimico-simples",
        "category": "item",
        "name": "Detector químico simples",
        "tier": "",
        "price": 5000,
        "weight": "",
        "tags": [
          "Exploracao"
        ],
        "summary": "Identifica toxina comum com teste",
        "source": "Livro 5, Tabela 61",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-sensor-de-movimento-curto",
        "category": "item",
        "name": "Sensor de movimento curto",
        "tier": "",
        "price": 12000,
        "weight": "",
        "tags": [
          "Exploracao"
        ],
        "summary": "Ajuda a vigiar área pequena",
        "source": "Livro 5, Tabela 61",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-comunicador-simples",
        "category": "item",
        "name": "Comunicador simples",
        "tier": "F/E",
        "price": 1500,
        "weight": "",
        "tags": [
          "Tecnologico",
          "F/E"
        ],
        "summary": "Comunicação curta distância | F/E",
        "source": "Livro 5, Tabela 62",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-comunicador-criptografado",
        "category": "item",
        "name": "Comunicador criptografado",
        "tier": "D",
        "price": 15000,
        "weight": "",
        "tags": [
          "Tecnologico",
          "D"
        ],
        "summary": "Comunicação mais segura | D",
        "source": "Livro 5, Tabela 62",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-mini-notebook-simples",
        "category": "item",
        "name": "Mini-notebook simples",
        "tier": "D",
        "price": 25000,
        "weight": "",
        "tags": [
          "Tecnologico",
          "D"
        ],
        "summary": "2 RAM, usado para hacking básico | D",
        "source": "Livro 5, Tabela 62",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-terminal-portatil",
        "category": "item",
        "name": "Terminal portátil",
        "tier": "C",
        "price": 150000,
        "weight": "",
        "tags": [
          "Tecnologico",
          "C"
        ],
        "summary": "Interface avançada, 3 RAM | C",
        "source": "Livro 5, Tabela 62",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-scanner-termico",
        "category": "item",
        "name": "Scanner térmico",
        "tier": "D",
        "price": 25000,
        "weight": "",
        "tags": [
          "Tecnologico",
          "D"
        ],
        "summary": "Ajuda a detectar calor | D",
        "source": "Livro 5, Tabela 62",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-scanner-de-movimento",
        "category": "item",
        "name": "Scanner de movimento",
        "tier": "D",
        "price": 30000,
        "weight": "",
        "tags": [
          "Tecnologico",
          "D"
        ],
        "summary": "Ajuda contra emboscadas | D",
        "source": "Livro 5, Tabela 62",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-sensor-de-radiacao",
        "category": "item",
        "name": "Sensor de radiação",
        "tier": "D",
        "price": 1000,
        "weight": "",
        "tags": [
          "Tecnologico",
          "D"
        ],
        "summary": "Detecta zona irradiada | D",
        "source": "Livro 5, Tabela 62",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-microdrone-de-reconhecimento",
        "category": "item",
        "name": "Microdrone de reconhecimento",
        "tier": "C",
        "price": 180000,
        "weight": "",
        "tags": [
          "Tecnologico",
          "C"
        ],
        "summary": "Exploração curta | C",
        "source": "Livro 5, Tabela 62",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-drone-utilitario-pequeno",
        "category": "item",
        "name": "Drone utilitário pequeno",
        "tier": "C",
        "price": 200000,
        "weight": "",
        "tags": [
          "Tecnologico",
          "C"
        ],
        "summary": "Carrega item leve ou ilumina área | C",
        "source": "Livro 5, Tabela 62",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-bloqueador-de-sinal-simples",
        "category": "item",
        "name": "Bloqueador de sinal simples",
        "tier": "C",
        "price": 150000,
        "weight": "",
        "tags": [
          "Tecnologico",
          "C"
        ],
        "summary": "Dificulta rastreio local | C",
        "source": "Livro 5, Tabela 62",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-interface-universal",
        "category": "item",
        "name": "Interface universal",
        "tier": "C",
        "price": 120000,
        "weight": "",
        "tags": [
          "Tecnologico",
          "C"
        ],
        "summary": "Conecta sistemas incompatíveis | C",
        "source": "Livro 5, Tabela 62",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-curativo-simples",
        "category": "item",
        "name": "Curativo simples",
        "tier": "",
        "price": 250,
        "weight": "",
        "tags": [
          "Medico"
        ],
        "summary": "Ajuda em primeiros socorros",
        "source": "Livro 5, Tabela 63",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-coagulante",
        "category": "item",
        "name": "Coagulante",
        "tier": "",
        "price": 1500,
        "weight": "",
        "tags": [
          "Medico"
        ],
        "summary": "Ajuda a remover Sangrando",
        "source": "Livro 5, Tabela 63",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-analgesico-leve",
        "category": "item",
        "name": "Analgésico leve",
        "tier": "",
        "price": 1000,
        "weight": "",
        "tags": [
          "Medico"
        ],
        "summary": "Ajuda contra dor e Tonto leve",
        "source": "Livro 5, Tabela 63",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-antidoto-comum",
        "category": "item",
        "name": "Antídoto comum",
        "tier": "",
        "price": 4000,
        "weight": "",
        "tags": [
          "Medico"
        ],
        "summary": "+1 ou vantagem contra veneno comum",
        "source": "Livro 5, Tabela 63",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-antidoto-forte",
        "category": "item",
        "name": "Antídoto forte",
        "tier": "",
        "price": 15000,
        "weight": "",
        "tags": [
          "Medico"
        ],
        "summary": "Ajuda contra venenos perigosos",
        "source": "Livro 5, Tabela 63",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-injetor-de-emergencia",
        "category": "item",
        "name": "Injetor de emergência",
        "tier": "",
        "price": 2500,
        "weight": "",
        "tags": [
          "Medico"
        ],
        "summary": "Aplica medicação rapidamente",
        "source": "Livro 5, Tabela 63",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-estimulante-medico",
        "category": "item",
        "name": "Estimulante médico",
        "tier": "",
        "price": 5000,
        "weight": "",
        "tags": [
          "Medico"
        ],
        "summary": "Pode remover Tonto temporariamente",
        "source": "Livro 5, Tabela 63",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-soro-de-hidratacao",
        "category": "item",
        "name": "Soro de hidratação",
        "tier": "",
        "price": 1500,
        "weight": "",
        "tags": [
          "Medico"
        ],
        "summary": "Trata Desidratado leve",
        "source": "Livro 5, Tabela 63",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-spray-regenerativo-simples",
        "category": "item",
        "name": "Spray regenerativo simples",
        "tier": "",
        "price": 7500,
        "weight": "",
        "tags": [
          "Medico"
        ],
        "summary": "Recupera 1d4 PV fora de combate",
        "source": "Livro 5, Tabela 63",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-capsula-estabilizadora",
        "category": "item",
        "name": "Cápsula estabilizadora",
        "tier": "",
        "price": 10000,
        "weight": "",
        "tags": [
          "Medico"
        ],
        "summary": "Ajuda a estabilizar 0 PV",
        "source": "Livro 5, Tabela 63",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-cristal-bruto",
        "category": "item",
        "name": "Cristal bruto",
        "tier": "D",
        "price": 50000,
        "weight": "",
        "tags": [
          "Cosmico",
          "D"
        ],
        "summary": "Componente ou foco instável | D",
        "source": "Livro 5, Tabela 64",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-cristal-lapidado",
        "category": "item",
        "name": "Cristal lapidado",
        "tier": "C",
        "price": 200000,
        "weight": "",
        "tags": [
          "Cosmico",
          "C"
        ],
        "summary": "Componente confiável para foco | C",
        "source": "Livro 5, Tabela 64",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-talisma-condutor",
        "category": "item",
        "name": "Talismã condutor",
        "tier": "C",
        "price": 220000,
        "weight": "",
        "tags": [
          "Cosmico",
          "C"
        ],
        "summary": "Permite canalização simples | C",
        "source": "Livro 5, Tabela 64",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-foco-estabilizado",
        "category": "item",
        "name": "Foco estabilizado",
        "tier": "B",
        "price": 800000,
        "weight": "",
        "tags": [
          "Cosmico",
          "B"
        ],
        "summary": "Reduz risco de falha cósmica leve | B",
        "source": "Livro 5, Tabela 64",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-medidor-de-ressonancia",
        "category": "item",
        "name": "Medidor de ressonância",
        "tier": "C",
        "price": 250000,
        "weight": "",
        "tags": [
          "Cosmico",
          "C"
        ],
        "summary": "Detecta variações cósmicas | C",
        "source": "Livro 5, Tabela 64",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-selo-de-contencao",
        "category": "item",
        "name": "Selo de contenção",
        "tier": "B",
        "price": 900000,
        "weight": "",
        "tags": [
          "Cosmico",
          "B"
        ],
        "summary": "Ajuda a conter anomalia pequena | B",
        "source": "Livro 5, Tabela 64",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-nucleo-cosmico-artificial-fraco",
        "category": "item",
        "name": "Núcleo cósmico artificial fraco",
        "tier": "A",
        "price": 3000000,
        "weight": "",
        "tags": [
          "Cosmico",
          "A"
        ],
        "summary": "Componente experimental | A",
        "source": "Livro 5, Tabela 64",
        "schemaVersion": 1
      },
      {
        "id": "livro5-item-fragmento-de-falaris",
        "category": "item",
        "name": "Fragmento de Falaris",
        "tier": "S",
        "price": 0,
        "weight": "",
        "tags": [
          "Cosmico",
          "S"
        ],
        "summary": "Relíquia perigosa | S",
        "source": "Livro 5, Tabela 64",
        "schemaVersion": 1
      }
    ],
    "mods": [
      {
        "id": "livro5-mod-mira-simples",
        "category": "mod",
        "name": "Mira simples",
        "type": "precisão",
        "slots": 1,
        "effect": "+1 no primeiro ataque se mirar antes",
        "summary": "+1 no primeiro ataque se mirar antes",
        "tags": [
          "mod",
          "precisão"
        ],
        "source": "Livro 5, Tabela 28",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-mira-avancada",
        "category": "mod",
        "name": "Mira avançada",
        "type": "precisão",
        "slots": 2,
        "effect": "+1 em ataques dentro do alcance normal",
        "summary": "+1 em ataques dentro do alcance normal",
        "tags": [
          "mod",
          "precisão"
        ],
        "source": "Livro 5, Tabela 28",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-mira-termica",
        "category": "mod",
        "name": "Mira térmica",
        "type": "precisão",
        "slots": 2,
        "effect": "Reduz penalidade por escuridão contra alvos quentes",
        "summary": "Reduz penalidade por escuridão contra alvos quentes",
        "tags": [
          "mod",
          "precisão"
        ],
        "source": "Livro 5, Tabela 28",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-estabilizador-de-cano",
        "category": "mod",
        "name": "Estabilizador de cano",
        "type": "precisão",
        "slots": 1,
        "effect": "Reduz penalidade de movimento ou recuo",
        "summary": "Reduz penalidade de movimento ou recuo",
        "tags": [
          "mod",
          "precisão"
        ],
        "source": "Livro 5, Tabela 28",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-sensor-de-marcacao",
        "category": "mod",
        "name": "Sensor de marcação",
        "type": "precisão",
        "slots": 2,
        "effect": "+1 contra alvo previamente analisado",
        "summary": "+1 contra alvo previamente analisado",
        "tags": [
          "mod",
          "precisão"
        ],
        "source": "Livro 5, Tabela 28",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-calculador-balistico",
        "category": "mod",
        "name": "Calculador balístico",
        "type": "precisão",
        "slots": 2,
        "effect": "Reduz penalidade de alcance longo",
        "summary": "Reduz penalidade de alcance longo",
        "tags": [
          "mod",
          "precisão"
        ],
        "source": "Livro 5, Tabela 28",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-lamina-reforcada",
        "category": "mod",
        "name": "Lâmina reforçada",
        "type": "dano",
        "slots": 1,
        "effect": "+1 dano corpo a corpo",
        "summary": "+1 dano corpo a corpo",
        "tags": [
          "mod",
          "dano"
        ],
        "source": "Livro 5, Tabela 29",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-nucleo-de-impacto",
        "category": "mod",
        "name": "Núcleo de impacto",
        "type": "dano",
        "slots": 2,
        "effect": "+1d4 dano em acerto, 1 vez por cena",
        "summary": "+1d4 dano em acerto, 1 vez por cena",
        "tags": [
          "mod",
          "dano"
        ],
        "source": "Livro 5, Tabela 29",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-municao-adaptada",
        "category": "mod",
        "name": "Munição adaptada",
        "type": "dano",
        "slots": 1,
        "effect": "Altera tipo de dano quando usada com munição compatível",
        "summary": "Altera tipo de dano quando usada com munição compatível",
        "tags": [
          "mod",
          "dano"
        ],
        "source": "Livro 5, Tabela 29",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-nucleo-de-calor",
        "category": "mod",
        "name": "Núcleo de calor",
        "type": "dano",
        "slots": 2,
        "effect": "Pode adicionar fogo em sucesso completo",
        "summary": "Pode adicionar fogo em sucesso completo",
        "tags": [
          "mod",
          "dano"
        ],
        "source": "Livro 5, Tabela 29",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-condutor-eletrico",
        "category": "mod",
        "name": "Condutor elétrico",
        "type": "dano",
        "slots": 2,
        "effect": "Pode causar dano elétrico contra alvo metálico",
        "summary": "Pode causar dano elétrico contra alvo metálico",
        "tags": [
          "mod",
          "dano"
        ],
        "source": "Livro 5, Tabela 29",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-ponta-perfurante",
        "category": "mod",
        "name": "Ponta perfurante",
        "type": "dano",
        "slots": 1,
        "effect": "Ignora 1 ponto de redução física",
        "summary": "Ignora 1 ponto de redução física",
        "tags": [
          "mod",
          "dano"
        ],
        "source": "Livro 5, Tabela 29",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-vibrolamina",
        "category": "mod",
        "name": "Vibrolâmina",
        "type": "dano",
        "slots": 3,
        "effect": "+1d4 cortante, mas deixa a arma Instável",
        "summary": "+1d4 cortante, mas deixa a arma Instável",
        "tags": [
          "mod",
          "dano"
        ],
        "source": "Livro 5, Tabela 29",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-gancho-de-tracao",
        "category": "mod",
        "name": "Gancho de tração",
        "type": "controle",
        "slots": 1,
        "effect": "Permite puxar objeto leve ou criar manobra",
        "summary": "Permite puxar objeto leve ou criar manobra",
        "tags": [
          "mod",
          "controle"
        ],
        "source": "Livro 5, Tabela 30",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-cabo-de-choque",
        "category": "mod",
        "name": "Cabo de choque",
        "type": "controle",
        "slots": 2,
        "effect": "Pode deixar alvo Tonto em falha de JPF",
        "summary": "Pode deixar alvo Tonto em falha de JPF",
        "tags": [
          "mod",
          "controle"
        ],
        "source": "Livro 5, Tabela 30",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-recuo-amplificado",
        "category": "mod",
        "name": "Recuo amplificado",
        "type": "controle",
        "slots": 2,
        "effect": "Empurra alvo 1 m em sucesso completo",
        "summary": "Empurra alvo 1 m em sucesso completo",
        "tags": [
          "mod",
          "controle"
        ],
        "source": "Livro 5, Tabela 30",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-mod-de-supressao",
        "category": "mod",
        "name": "Mod de supressão",
        "type": "controle",
        "slots": 2,
        "effect": "Melhora ação de Supressão",
        "summary": "Melhora ação de Supressão",
        "tags": [
          "mod",
          "controle"
        ],
        "source": "Livro 5, Tabela 30",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-rede-acoplada",
        "category": "mod",
        "name": "Rede acoplada",
        "type": "controle",
        "slots": 2,
        "effect": "Permite ataque para Imobilizar, com carga",
        "summary": "Permite ataque para Imobilizar, com carga",
        "tags": [
          "mod",
          "controle"
        ],
        "source": "Livro 5, Tabela 30",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-lamina-de-desarme",
        "category": "mod",
        "name": "Lâmina de desarme",
        "type": "controle",
        "slots": 1,
        "effect": "+1 em manobras de Desarmar",
        "summary": "+1 em manobras de Desarmar",
        "tags": [
          "mod",
          "controle"
        ],
        "source": "Livro 5, Tabela 30",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-carregador-ampliado",
        "category": "mod",
        "name": "Carregador ampliado",
        "type": "munição",
        "slots": 1,
        "effect": "Aumenta munição carregada",
        "summary": "Aumenta munição carregada",
        "tags": [
          "mod",
          "munição"
        ],
        "source": "Livro 5, Tabela 31",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-camara-reforcada",
        "category": "mod",
        "name": "Câmara reforçada",
        "type": "munição",
        "slots": 1,
        "effect": "Reduz risco de Jammed",
        "summary": "Reduz risco de Jammed",
        "tags": [
          "mod",
          "munição"
        ],
        "source": "Livro 5, Tabela 31",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-alimentador-duplo",
        "category": "mod",
        "name": "Alimentador duplo",
        "type": "munição",
        "slots": 2,
        "effect": "Permite trocar tipo de munição com ação simples",
        "summary": "Permite trocar tipo de munição com ação simples",
        "tags": [
          "mod",
          "munição"
        ],
        "source": "Livro 5, Tabela 31",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-sistema-de-recarga-rapida",
        "category": "mod",
        "name": "Sistema de recarga rápida",
        "type": "munição",
        "slots": 2,
        "effect": "1 vez por cena, reduz custo de recarga conforme a arma",
        "summary": "1 vez por cena, reduz custo de recarga conforme a arma",
        "tags": [
          "mod",
          "munição"
        ],
        "source": "Livro 5, Tabela 31",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-conversor-de-celula",
        "category": "mod",
        "name": "Conversor de célula",
        "type": "munição",
        "slots": 2,
        "effect": "Usa bateria ou célula em vez de munição comum",
        "summary": "Usa bateria ou célula em vez de munição comum",
        "tags": [
          "mod",
          "munição"
        ],
        "source": "Livro 5, Tabela 31",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-mod-de-rajada",
        "category": "mod",
        "name": "Mod de Rajada",
        "type": "munição",
        "slots": 2,
        "effect": "Concede propriedade Rajada, se compatível",
        "summary": "Concede propriedade Rajada, se compatível",
        "tags": [
          "mod",
          "munição"
        ],
        "source": "Livro 5, Tabela 31",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-placa-balistica",
        "category": "mod",
        "name": "Placa balística",
        "type": "proteção",
        "slots": 1,
        "effect": "Redução 1 contra balístico",
        "summary": "Redução 1 contra balístico",
        "tags": [
          "mod",
          "proteção"
        ],
        "source": "Livro 5, Tabela 32",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-reforco-de-torso",
        "category": "mod",
        "name": "Reforço de torso",
        "type": "proteção",
        "slots": 2,
        "effect": "+1 CA contra ataques frontais",
        "summary": "+1 CA contra ataques frontais",
        "tags": [
          "mod",
          "proteção"
        ],
        "source": "Livro 5, Tabela 32",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-malha-anti-corte",
        "category": "mod",
        "name": "Malha anti-corte",
        "type": "proteção",
        "slots": 2,
        "effect": "Resistência situacional contra cortante leve",
        "summary": "Resistência situacional contra cortante leve",
        "tags": [
          "mod",
          "proteção"
        ],
        "source": "Livro 5, Tabela 32",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-camada-antiacida",
        "category": "mod",
        "name": "Camada antiácida",
        "type": "proteção",
        "slots": 1,
        "effect": "Reduz chance de Corroído",
        "summary": "Reduz chance de Corroído",
        "tags": [
          "mod",
          "proteção"
        ],
        "source": "Livro 5, Tabela 32",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-revestimento-termico",
        "category": "mod",
        "name": "Revestimento térmico",
        "type": "proteção",
        "slots": 1,
        "effect": "+1 contra frio ou calor ambiental",
        "summary": "+1 contra frio ou calor ambiental",
        "tags": [
          "mod",
          "proteção"
        ],
        "source": "Livro 5, Tabela 32",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-isolamento-eletrico",
        "category": "mod",
        "name": "Isolamento elétrico",
        "type": "proteção",
        "slots": 1,
        "effect": "+1 em JPF contra dano elétrico",
        "summary": "+1 em JPF contra dano elétrico",
        "tags": [
          "mod",
          "proteção"
        ],
        "source": "Livro 5, Tabela 32",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-nucleo-de-escudo",
        "category": "mod",
        "name": "Núcleo de escudo",
        "type": "proteção",
        "slots": 2,
        "effect": "PV temporários limitados por carga",
        "summary": "PV temporários limitados por carga",
        "tags": [
          "mod",
          "proteção"
        ],
        "source": "Livro 5, Tabela 32",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-botas-magneticas",
        "category": "mod",
        "name": "Botas magnéticas",
        "type": "mobilidade",
        "slots": 1,
        "effect": "Ajuda em metal, cascos e baixa gravidade",
        "summary": "Ajuda em metal, cascos e baixa gravidade",
        "tags": [
          "mod",
          "mobilidade"
        ],
        "source": "Livro 5, Tabela 33",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-servo-leve",
        "category": "mod",
        "name": "Servo leve",
        "type": "mobilidade",
        "slots": 2,
        "effect": "Reduz penalidade de armadura média",
        "summary": "Reduz penalidade de armadura média",
        "tags": [
          "mod",
          "mobilidade"
        ],
        "source": "Livro 5, Tabela 33",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-servo-pesado",
        "category": "mod",
        "name": "Servo pesado",
        "type": "mobilidade",
        "slots": 3,
        "effect": "Reduz penalidade de armadura pesada",
        "summary": "Reduz penalidade de armadura pesada",
        "tags": [
          "mod",
          "mobilidade"
        ],
        "source": "Livro 5, Tabela 33",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-estabilizador-de-queda",
        "category": "mod",
        "name": "Estabilizador de queda",
        "type": "mobilidade",
        "slots": 1,
        "effect": "Reduz dano de queda",
        "summary": "Reduz dano de queda",
        "tags": [
          "mod",
          "mobilidade"
        ],
        "source": "Livro 5, Tabela 33",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-garras-de-escalada",
        "category": "mod",
        "name": "Garras de escalada",
        "type": "mobilidade",
        "slots": 1,
        "effect": "+1 em escalada em superfície adequada",
        "summary": "+1 em escalada em superfície adequada",
        "tags": [
          "mod",
          "mobilidade"
        ],
        "source": "Livro 5, Tabela 33",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-articulacoes-silenciosas",
        "category": "mod",
        "name": "Articulações silenciosas",
        "type": "mobilidade",
        "slots": 2,
        "effect": "Reduz penalidade de Furtividade",
        "summary": "Reduz penalidade de Furtividade",
        "tags": [
          "mod",
          "mobilidade"
        ],
        "source": "Livro 5, Tabela 33",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-gancho-extra",
        "category": "mod",
        "name": "Gancho extra",
        "type": "suporte",
        "slots": 1,
        "effect": "+1 gancho",
        "summary": "+1 gancho",
        "tags": [
          "mod",
          "suporte"
        ],
        "source": "Livro 5, Tabela 34",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-suporte-de-kit",
        "category": "mod",
        "name": "Suporte de kit",
        "type": "suporte",
        "slots": 1,
        "effect": "Acesso rápido a um kit pequeno",
        "summary": "Acesso rápido a um kit pequeno",
        "tags": [
          "mod",
          "suporte"
        ],
        "source": "Livro 5, Tabela 34",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-compartimento-selado",
        "category": "mod",
        "name": "Compartimento selado",
        "type": "suporte",
        "slots": 1,
        "effect": "Protege item pequeno contra ambiente",
        "summary": "Protege item pequeno contra ambiente",
        "tags": [
          "mod",
          "suporte"
        ],
        "source": "Livro 5, Tabela 34",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-braco-auxiliar-simples",
        "category": "mod",
        "name": "Braço auxiliar simples",
        "type": "suporte",
        "slots": 2,
        "effect": "Ajuda em tarefa técnica fora de combate",
        "summary": "Ajuda em tarefa técnica fora de combate",
        "tags": [
          "mod",
          "suporte"
        ],
        "source": "Livro 5, Tabela 34",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-suporte-de-municao",
        "category": "mod",
        "name": "Suporte de munição",
        "type": "suporte",
        "slots": 1,
        "effect": "Acesso rápido a recarga",
        "summary": "Acesso rápido a recarga",
        "tags": [
          "mod",
          "suporte"
        ],
        "source": "Livro 5, Tabela 34",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-interface-de-drone",
        "category": "mod",
        "name": "Interface de drone",
        "type": "suporte",
        "slots": 2,
        "effect": "Permite controle básico de drone acoplado",
        "summary": "Permite controle básico de drone acoplado",
        "tags": [
          "mod",
          "suporte"
        ],
        "source": "Livro 5, Tabela 34",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-bolsa-de-amostras",
        "category": "mod",
        "name": "Bolsa de amostras",
        "type": "suporte",
        "slots": 1,
        "effect": "+1 em coleta biológica/química",
        "summary": "+1 em coleta biológica/química",
        "tags": [
          "mod",
          "suporte"
        ],
        "source": "Livro 5, Tabela 34",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-filtro-respiratorio",
        "category": "mod",
        "name": "Filtro respiratório",
        "type": "ambiental",
        "slots": 1,
        "effect": "Ajuda contra gás, poeira e esporos",
        "summary": "Ajuda contra gás, poeira e esporos",
        "tags": [
          "mod",
          "ambiental"
        ],
        "source": "Livro 5, Tabela 35",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-vedacao-simples",
        "category": "mod",
        "name": "Vedação simples",
        "type": "ambiental",
        "slots": 1,
        "effect": "Proteção contra ambiente leve",
        "summary": "Proteção contra ambiente leve",
        "tags": [
          "mod",
          "ambiental"
        ],
        "source": "Livro 5, Tabela 35",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-vedacao-avancada",
        "category": "mod",
        "name": "Vedação avançada",
        "type": "ambiental",
        "slots": 2,
        "effect": "Proteção contra ambiente hostil moderado",
        "summary": "Proteção contra ambiente hostil moderado",
        "tags": [
          "mod",
          "ambiental"
        ],
        "source": "Livro 5, Tabela 35",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-tanque-de-oxigenio-curto",
        "category": "mod",
        "name": "Tanque de oxigênio curto",
        "type": "ambiental",
        "slots": 2,
        "effect": "Permite respirar por tempo limitado",
        "summary": "Permite respirar por tempo limitado",
        "tags": [
          "mod",
          "ambiental"
        ],
        "source": "Livro 5, Tabela 35",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-camada-antirradiacao",
        "category": "mod",
        "name": "Camada antirradiação",
        "type": "ambiental",
        "slots": 2,
        "effect": "+1 contra radiação leve",
        "summary": "+1 contra radiação leve",
        "tags": [
          "mod",
          "ambiental"
        ],
        "source": "Livro 5, Tabela 35",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-regulador-termico",
        "category": "mod",
        "name": "Regulador térmico",
        "type": "ambiental",
        "slots": 2,
        "effect": "Ajuda contra frio e calor",
        "summary": "Ajuda contra frio e calor",
        "tags": [
          "mod",
          "ambiental"
        ],
        "source": "Livro 5, Tabela 35",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-selagem-de-emergencia",
        "category": "mod",
        "name": "Selagem de emergência",
        "type": "ambiental",
        "slots": 2,
        "effect": "1 vez por cena, ignora uma falha de vedação leve",
        "summary": "1 vez por cena, ignora uma falha de vedação leve",
        "tags": [
          "mod",
          "ambiental"
        ],
        "source": "Livro 5, Tabela 35",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-regulador-de-dor",
        "category": "mod",
        "name": "Regulador de dor",
        "type": "corporal",
        "slots": 1,
        "effect": "+1 contra Tonto ou Atordoado por dor física",
        "summary": "+1 contra Tonto ou Atordoado por dor física",
        "tags": [
          "mod",
          "corporal"
        ],
        "source": "Livro 5, Tabela 36",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-filtro-metabolico",
        "category": "mod",
        "name": "Filtro metabólico",
        "type": "corporal",
        "slots": 1,
        "effect": "+1 contra venenos leves",
        "summary": "+1 contra venenos leves",
        "tags": [
          "mod",
          "corporal"
        ],
        "source": "Livro 5, Tabela 36",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-estabilizador-de-reflexos",
        "category": "mod",
        "name": "Estabilizador de reflexos",
        "type": "corporal",
        "slots": 1,
        "effect": "+1 em iniciativa 1 vez por cena",
        "summary": "+1 em iniciativa 1 vez por cena",
        "tags": [
          "mod",
          "corporal"
        ],
        "source": "Livro 5, Tabela 36",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-sincronizador-de-armadura",
        "category": "mod",
        "name": "Sincronizador de armadura",
        "type": "corporal",
        "slots": 1,
        "effect": "Melhora conexão com armadura compatível",
        "summary": "Melhora conexão com armadura compatível",
        "tags": [
          "mod",
          "corporal"
        ],
        "source": "Livro 5, Tabela 36",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-reforco-muscular-leve",
        "category": "mod",
        "name": "Reforço muscular leve",
        "type": "corporal",
        "slots": 1,
        "effect": "+1 em teste de FOR 1 vez por cena",
        "summary": "+1 em teste de FOR 1 vez por cena",
        "tags": [
          "mod",
          "corporal"
        ],
        "source": "Livro 5, Tabela 36",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-controle-respiratorio",
        "category": "mod",
        "name": "Controle respiratório",
        "type": "corporal",
        "slots": 1,
        "effect": "+1 contra Sufocando ou gás leve",
        "summary": "+1 contra Sufocando ou gás leve",
        "tags": [
          "mod",
          "corporal"
        ],
        "source": "Livro 5, Tabela 36",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-interface-neural-expandida",
        "category": "mod",
        "name": "Interface neural expandida",
        "type": "corporal",
        "slots": 12,
        "effect": "+1 Slot Corporal, se permitida pelo mestre",
        "summary": "+1 Slot Corporal, se permitida pelo mestre",
        "tags": [
          "mod",
          "corporal"
        ],
        "source": "Livro 5, Tabela 36",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-bloqueador-de-sobrecarga",
        "category": "mod",
        "name": "Bloqueador de sobrecarga",
        "type": "corporal",
        "slots": 1,
        "effect": "Reduz Estresse causado por mod 1 vez por sessão",
        "summary": "Reduz Estresse causado por mod 1 vez por sessão",
        "tags": [
          "mod",
          "corporal"
        ],
        "source": "Livro 5, Tabela 36",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-canal-biocosmico",
        "category": "mod",
        "name": "Canal biocósmico",
        "type": "corporal",
        "slots": 2,
        "effect": "Ajuda em interação interna com Cosmos",
        "summary": "Ajuda em interação interna com Cosmos",
        "tags": [
          "mod",
          "corporal"
        ],
        "source": "Livro 5, Tabela 36",
        "schemaVersion": 1
      },
      {
        "id": "livro5-mod-nucleo-de-resposta-fisica",
        "category": "mod",
        "name": "Núcleo de resposta física",
        "type": "corporal",
        "slots": 2,
        "effect": "+1 em JPF 1 vez por cena",
        "summary": "+1 em JPF 1 vez por cena",
        "tags": [
          "mod",
          "corporal"
        ],
        "source": "Livro 5, Tabela 36",
        "schemaVersion": 1
      }
    ]
  },
  "bestiary": [
    {
      "id": "livro3-2-1-rasktorian-jovem",
      "category": "monster",
      "name": "Rasktorian Jovem",
      "tier": "E",
      "type": "predador biológico",
      "role": "predador rápido",
      "size": "médio",
      "pv": 14,
      "ca": 11,
      "movement": "9 m",
      "habitat": "ruínas rasas, campos rochosos, bordas de pântano e estradas abandonadas",
      "behavior": "",
      "attributes": "FOR 12/MOD +1",
      "attacks": "◆ Garra: 1d6 cortante.\n◆ Mordida: 1d4 perfurante.",
      "abilities": "◆ Uma vez por cena, o Rasktorian Jovem pode saltar até um alvo próximo, ignorando terreno difícil leve. Se acertar o ataque após o salto, causa +1 dano.\n◆ Se sofrer dano alto ou perder metade dos PV, deve testar moral. Em falha, recua ou tenta fugir.",
      "resistances": "◆ Nenhuma especial.",
      "weaknesses": "◆ Som alto, luz súbita ou fogo podem fazê-lo hesitar por 1 rodada, a critério do Mestre.",
      "senses": "◆ Olfato aguçado.\n◆ Boa audição.",
      "moral": "◆ Foge se estiver sozinho e cair abaixo da metade dos PV.",
      "resources": "◆ Garras pequenas.\n◆ Dentes.\n◆ Couro.\n◆ Tendões.",
      "campaign": "◆ Rasktorians Jovens são bons para missões iniciais. Eles ensinam que criaturas podem atacar, recuar e voltar depois com vantagem.\nFONTE OFICIAL // Livro 3, 2.4",
      "summary": "◆ Rasktorians Jovens são bons para missões iniciais. Eles ensinam que criaturas podem atacar, recuar e voltar depois com vantagem.\nFONTE OFICIAL // Livro 3, 2.4",
      "tags": [
        "E",
        "predador biológico",
        "predador rápido",
        "médio"
      ],
      "details": [
        {
          "label": "Resumo",
          "items": [
            "REGISTRO VISUAL // E // predador biológico",
            "Tier: E",
            "Tipo: predador biológico",
            "Papel: predador rápido",
            "Tamanho: médio",
            "Habitat: ruínas rasas, campos rochosos, bordas de pântano e estradas abandonadas",
            "PV: 14",
            "CA: 11",
            "Movimento: 9 m",
            "Atributos importantes: FOR 12/MOD +1",
            "◆ FOR 12/MOD +1.",
            "◆ REF 14/MOD +2.",
            "◆ CON 12/MOD +1.",
            "◆ MEN 10/MOD +0."
          ]
        },
        {
          "label": "Ataques",
          "items": [
            "◆ Garra: 1d6 cortante.",
            "◆ Mordida: 1d4 perfurante."
          ]
        },
        {
          "label": "Habilidade — Salto Curto",
          "items": [
            "◆ Uma vez por cena, o Rasktorian Jovem pode saltar até um alvo próximo, ignorando terreno difícil leve. Se acertar o ataque após o salto, causa +1 dano."
          ]
        },
        {
          "label": "Habilidade — Caçador Inexperiente",
          "items": [
            "◆ Se sofrer dano alto ou perder metade dos PV, deve testar moral. Em falha, recua ou tenta fugir."
          ]
        },
        {
          "label": "Resistências",
          "items": [
            "◆ Nenhuma especial."
          ]
        },
        {
          "label": "Fraquezas",
          "items": [
            "◆ Som alto, luz súbita ou fogo podem fazê-lo hesitar por 1 rodada, a critério do Mestre."
          ]
        },
        {
          "label": "Sentidos",
          "items": [
            "◆ Olfato aguçado.",
            "◆ Boa audição."
          ]
        },
        {
          "label": "Moral",
          "items": [
            "◆ Foge se estiver sozinho e cair abaixo da metade dos PV."
          ]
        },
        {
          "label": "Recursos coletáveis",
          "items": [
            "◆ Garras pequenas.",
            "◆ Dentes.",
            "◆ Couro.",
            "◆ Tendões."
          ]
        },
        {
          "label": "Uso em campanha",
          "items": [
            "◆ Rasktorians Jovens são bons para missões iniciais. Eles ensinam que criaturas podem atacar, recuar e voltar depois com vantagem.",
            "FONTE OFICIAL // Livro 3, 2.4"
          ]
        }
      ],
      "sheetType": "full",
      "needsCoreStats": false,
      "assets": [
        {
          "type": "image",
          "label": "Registro visual de Rasktorian Jovem",
          "url": "./assets/bestiary/rasktorian-jovem.jpg"
        }
      ],
      "source": "Livro 3, 2.1",
      "schemaVersion": 1,
      "image": "./assets/bestiary/rasktorian-jovem.jpg"
    },
    {
      "id": "livro3-2-2-rasktorian-adulto",
      "category": "monster",
      "name": "Rasktorian Adulto",
      "tier": "D",
      "type": "predador biológico",
      "role": "predador rápido/brutamontes leve",
      "size": "médio",
      "pv": 24,
      "ca": 13,
      "movement": "10 m",
      "habitat": "ruínas, rotas abandonadas, áreas rochosas, florestas secas e campos de caça",
      "behavior": "",
      "attributes": "FOR 14/MOD +2",
      "attacks": "◆ Garra: 1d8 cortante.\n◆ Mordida: 1d6 perfurante.",
      "abilities": "◆ Se o Rasktorian Adulto se mover pelo menos 6 m antes de atacar e acertar, o alvo faz JPR com REF. Em falha, fica Derrubado.\n◆ Recebe +1 em testes para rastrear ou atacar alvo Sangrando.\n◆ Se acertar um alvo Derrubado com Mordida, pode tentar arrastá-lo 2 m como parte do ataque, se vencer disputa de FOR.",
      "resistances": "",
      "weaknesses": "◆ Pode ser distraído por carne fresca, sangue ou isca bem posicionada.",
      "senses": "◆ Olfato aguçado.\n◆ Visão noturna limitada.",
      "moral": "◆ Recua se estiver gravemente ferido, mas pode voltar com emboscada.",
      "resources": "◆ Carapaça leve.\n◆ Garras.\n◆ Dentes.\n◆ Couro resistente.\n◆ Sangue adrenal.",
      "campaign": "◆ Rasktorian Adulto é uma ameaça padrão de rota perigosa. Um único adulto pode ser encontro médio para grupo iniciante; dois ou três podem ser extremamente perigosos.\nFONTE OFICIAL // Livro 3, 2.5",
      "summary": "◆ Rasktorian Adulto é uma ameaça padrão de rota perigosa. Um único adulto pode ser encontro médio para grupo iniciante; dois ou três podem ser extremamente perigosos.\nFONTE OFICIAL // Livro 3, 2.5",
      "tags": [
        "D",
        "predador biológico",
        "predador rápido/brutamontes leve",
        "médio"
      ],
      "details": [
        {
          "label": "Resumo",
          "items": [
            "REGISTRO VISUAL // D // predador biológico",
            "Tier: D",
            "Tipo: predador biológico",
            "Papel: predador rápido/brutamontes leve",
            "Tamanho: médio",
            "Habitat: ruínas, rotas abandonadas, áreas rochosas, florestas secas e campos de caça",
            "PV: 24",
            "CA: 13",
            "Movimento: 10 m",
            "Atributos importantes: FOR 14/MOD +2",
            "◆ FOR 14/MOD +2.",
            "◆ REF 14/MOD +2.",
            "◆ CON 14/MOD +2.",
            "◆ MEN 12/MOD +1."
          ]
        },
        {
          "label": "Ataques",
          "items": [
            "◆ Garra: 1d8 cortante.",
            "◆ Mordida: 1d6 perfurante."
          ]
        },
        {
          "label": "Habilidade — Investida Rasgante",
          "items": [
            "◆ Se o Rasktorian Adulto se mover pelo menos 6 m antes de atacar e acertar, o alvo faz JPR com REF. Em falha, fica Derrubado."
          ]
        },
        {
          "label": "Habilidade — Cheiro de Sangue",
          "items": [
            "◆ Recebe +1 em testes para rastrear ou atacar alvo Sangrando."
          ]
        },
        {
          "label": "Habilidade — Arrastar Presa",
          "items": [
            "◆ Se acertar um alvo Derrubado com Mordida, pode tentar arrastá-lo 2 m como parte do ataque, se vencer disputa de FOR."
          ]
        },
        {
          "label": "Fraquezas",
          "items": [
            "◆ Pode ser distraído por carne fresca, sangue ou isca bem posicionada."
          ]
        },
        {
          "label": "Sentidos",
          "items": [
            "◆ Olfato aguçado.",
            "◆ Visão noturna limitada."
          ]
        },
        {
          "label": "Moral",
          "items": [
            "◆ Recua se estiver gravemente ferido, mas pode voltar com emboscada."
          ]
        },
        {
          "label": "Recursos coletáveis",
          "items": [
            "◆ Carapaça leve.",
            "◆ Garras.",
            "◆ Dentes.",
            "◆ Couro resistente.",
            "◆ Sangue adrenal."
          ]
        },
        {
          "label": "Uso em campanha",
          "items": [
            "◆ Rasktorian Adulto é uma ameaça padrão de rota perigosa. Um único adulto pode ser encontro médio para grupo iniciante; dois ou três podem ser extremamente perigosos.",
            "FONTE OFICIAL // Livro 3, 2.5"
          ]
        }
      ],
      "sheetType": "full",
      "needsCoreStats": false,
      "assets": [
        {
          "type": "image",
          "label": "Registro visual de Rasktorian Adulto",
          "url": "./assets/bestiary/rasktorian-adulto.jpg"
        }
      ],
      "source": "Livro 3, 2.2",
      "schemaVersion": 1,
      "image": "./assets/bestiary/rasktorian-adulto.jpg"
    },
    {
      "id": "livro3-2-3-rasktorian-alfa",
      "category": "monster",
      "name": "Rasktorian Alfa",
      "tier": "B",
      "type": "predador Alfa",
      "role": "chefe/predador rápido",
      "size": "grande",
      "pv": 65,
      "ca": 16,
      "movement": "12 m",
      "habitat": "território dominado por bando Rasktorian",
      "behavior": "",
      "attributes": "FOR 18/MOD +4",
      "attacks": "◆ Garra Pesada: 1d10 cortante.\n◆ Mordida: 1d8 perfurante.\n◆ Cauda ou Impacto: 1d8 concussão.",
      "abilities": "◆ Uma vez por cena, todas as criaturas inimigas próximas fazem teste de MEN ou PRE. Em falha, recebem -1 no próximo ataque contra o Alfa ou +1 Estresse, conforme o tom da campanha.\n◆ No início de cada rodada, um Rasktorian aliado próximo pode se mover até metade do deslocamento ou fazer um ataque simples.\n◆ Quando cair abaixo da metade dos PV, o Alfa causa +1 dano em ataques corpo a corpo, mas se torna mais agressivo e fácil de atrair para armadilhas.\n◆ O Alfa não sofre penalidade em terreno difícil leve de seu próprio habitat.",
      "resistances": "",
      "weaknesses": "◆ Orgulho territorial. Pode ser atraído por desafio, invasão de território ou ameaça ao bando.",
      "senses": "◆ Olfato excelente.\n◆ Audição aguçada.\n◆ Percepção de vibração próxima.",
      "moral": "◆ Não foge por medo comum. Recua apenas para preservar o bando, proteger filhotes ou preparar nova emboscada.",
      "resources": "◆ Carapaça superior.\n◆ Presa Alfa.\n◆ Couro raro.\n◆ Sangue adrenal potente.\n◆ Glândula de feromônio.",
      "campaign": "◆ Rasktorian Alfa é chefe de arco local. Sua presença pode explicar desaparecimentos, rotas bloqueadas e migração de outros predadores.\nFONTE OFICIAL // Livro 3, 2.6",
      "summary": "◆ Rasktorian Alfa é chefe de arco local. Sua presença pode explicar desaparecimentos, rotas bloqueadas e migração de outros predadores.\nFONTE OFICIAL // Livro 3, 2.6",
      "tags": [
        "B",
        "predador Alfa",
        "chefe/predador rápido",
        "grande"
      ],
      "details": [
        {
          "label": "Resumo",
          "items": [
            "REGISTRO VISUAL // B // predador Alfa",
            "Tier: B",
            "Tipo: predador Alfa",
            "Papel: chefe/predador rápido",
            "Tamanho: grande",
            "Habitat: território dominado por bando Rasktorian",
            "PV: 65",
            "CA: 16",
            "Movimento: 12 m",
            "Atributos importantes: FOR 18/MOD +4",
            "◆ FOR 18/MOD +4.",
            "◆ REF 16/MOD +3.",
            "◆ CON 18/MOD +4.",
            "◆ MEN 14/MOD +2.",
            "◆ PRE 14/MOD +2."
          ]
        },
        {
          "label": "Ataques",
          "items": [
            "◆ Garra Pesada: 1d10 cortante.",
            "◆ Mordida: 1d8 perfurante.",
            "◆ Cauda ou Impacto: 1d8 concussão."
          ]
        },
        {
          "label": "Habilidade — Rugido de Domínio",
          "items": [
            "◆ Uma vez por cena, todas as criaturas inimigas próximas fazem teste de MEN ou PRE. Em falha, recebem -1 no próximo ataque contra o Alfa ou +1 Estresse, conforme o tom da campanha."
          ]
        },
        {
          "label": "Habilidade — Comando de Bando",
          "items": [
            "◆ No início de cada rodada, um Rasktorian aliado próximo pode se mover até metade do deslocamento ou fazer um ataque simples."
          ]
        },
        {
          "label": "Habilidade — Fúria Ferida",
          "items": [
            "◆ Quando cair abaixo da metade dos PV, o Alfa causa +1 dano em ataques corpo a corpo, mas se torna mais agressivo e fácil de atrair para armadilhas."
          ]
        },
        {
          "label": "Habilidade — Predador Experiente",
          "items": [
            "◆ O Alfa não sofre penalidade em terreno difícil leve de seu próprio habitat."
          ]
        },
        {
          "label": "Fraquezas",
          "items": [
            "◆ Orgulho territorial. Pode ser atraído por desafio, invasão de território ou ameaça ao bando."
          ]
        },
        {
          "label": "Sentidos",
          "items": [
            "◆ Olfato excelente.",
            "◆ Audição aguçada.",
            "◆ Percepção de vibração próxima."
          ]
        },
        {
          "label": "Moral",
          "items": [
            "◆ Não foge por medo comum. Recua apenas para preservar o bando, proteger filhotes ou preparar nova emboscada."
          ]
        },
        {
          "label": "Recursos coletáveis",
          "items": [
            "◆ Carapaça superior.",
            "◆ Presa Alfa.",
            "◆ Couro raro.",
            "◆ Sangue adrenal potente.",
            "◆ Glândula de feromônio."
          ]
        },
        {
          "label": "Uso em campanha",
          "items": [
            "◆ Rasktorian Alfa é chefe de arco local. Sua presença pode explicar desaparecimentos, rotas bloqueadas e migração de outros predadores.",
            "FONTE OFICIAL // Livro 3, 2.6"
          ]
        }
      ],
      "sheetType": "full",
      "needsCoreStats": false,
      "assets": [
        {
          "type": "image",
          "label": "Registro visual de Rasktorian Alfa",
          "url": "./assets/bestiary/rasktorian-alfa.jpg"
        }
      ],
      "source": "Livro 3, 2.3",
      "schemaVersion": 1,
      "image": "./assets/bestiary/rasktorian-alfa.jpg"
    },
    {
      "id": "livro3-2-4-rasktorian-marcado",
      "category": "monster",
      "name": "Rasktorian Marcado",
      "tier": "C ou B",
      "type": "predador cósmico/alterado",
      "role": "predador rápido/ameaça cósmica",
      "size": "médio ou grande",
      "pv": 42,
      "ca": 15,
      "movement": "11 m",
      "habitat": "regiões com rachaduras azuis, cristais instáveis, ruínas antigas ou fragmentos de Falaris",
      "behavior": "",
      "attributes": "FOR 16/MOD +3",
      "attacks": "◆ Garra Cósmica: 1d8 cortante + 1d4 cósmico.\n◆ Mordida: 1d8 perfurante.",
      "abilities": "◆ Recebe +1 para rastrear personagens com Marca pelo Cosmos, Estresse 4 ou mais, ou item cósmico instável.\n◆ Uma vez por cena, emite um grito que distorce sensores e causa desconforto. Todos próximos fazem JPC com MEN. Em falha, recebem +1 Estresse.\n◆ Quando sofre crítico, seu sangue azul espirra. Quem estiver adjacente faz JPF com CON ou sofre Tonto até o fim do próximo turno.",
      "resistances": "",
      "weaknesses": "◆ Sons harmônicos, símbolos de contenção ou luz branca intensa podem reduzir sua agressividade por 1 rodada.",
      "senses": "◆ Olfato.\n◆ Percepção Cósmica instintiva.\n◆ Visão no escuro.",
      "moral": "◆ Instável. Pode lutar até a morte ou fugir subitamente se a ressonância mudar.",
      "resources": "◆ Sangue luminoso.\n◆ Garra marcada.\n◆ Fragmento ósseo ressonante.\n◆ Glândula cósmica instável.",
      "campaign": "◆ O Rasktorian Marcado mostra que o Cosmos começou a afetar a fauna local. Deve ser usado como sinal de que uma área está mudando.\nFONTE OFICIAL // Livro 3, 2.7",
      "summary": "◆ O Rasktorian Marcado mostra que o Cosmos começou a afetar a fauna local. Deve ser usado como sinal de que uma área está mudando.\nFONTE OFICIAL // Livro 3, 2.7",
      "tags": [
        "C ou B",
        "predador cósmico/alterado",
        "predador rápido/ameaça cósmica",
        "médio ou grande"
      ],
      "details": [
        {
          "label": "Resumo",
          "items": [
            "REGISTRO VISUAL // C ou B // predador cósmico/alterado",
            "Tier: C ou B",
            "Tipo: predador cósmico/alterado",
            "Papel: predador rápido/ameaça cósmica",
            "Tamanho: médio ou grande",
            "Habitat: regiões com rachaduras azuis, cristais instáveis, ruínas antigas ou fragmentos de Falaris",
            "PV: 42",
            "CA: 15",
            "Movimento: 11 m",
            "Atributos importantes: FOR 16/MOD +3",
            "◆ FOR 16/MOD +3.",
            "◆ REF 16/MOD +3.",
            "◆ CON 16/MOD +3.",
            "◆ MEN 14/MOD +2."
          ]
        },
        {
          "label": "Ataques",
          "items": [
            "◆ Garra Cósmica: 1d8 cortante + 1d4 cósmico.",
            "◆ Mordida: 1d8 perfurante."
          ]
        },
        {
          "label": "Habilidade — Farejar Ressonância",
          "items": [
            "◆ Recebe +1 para rastrear personagens com Marca pelo Cosmos, Estresse 4 ou mais, ou item cósmico instável."
          ]
        },
        {
          "label": "Habilidade — Grito Partido",
          "items": [
            "◆ Uma vez por cena, emite um grito que distorce sensores e causa desconforto. Todos próximos fazem JPC com MEN. Em falha, recebem +1 Estresse."
          ]
        },
        {
          "label": "Habilidade — Sangue Luminoso",
          "items": [
            "◆ Quando sofre crítico, seu sangue azul espirra. Quem estiver adjacente faz JPF com CON ou sofre Tonto até o fim do próximo turno."
          ]
        },
        {
          "label": "Fraquezas",
          "items": [
            "◆ Sons harmônicos, símbolos de contenção ou luz branca intensa podem reduzir sua agressividade por 1 rodada."
          ]
        },
        {
          "label": "Sentidos",
          "items": [
            "◆ Olfato.",
            "◆ Percepção Cósmica instintiva.",
            "◆ Visão no escuro."
          ]
        },
        {
          "label": "Moral",
          "items": [
            "◆ Instável. Pode lutar até a morte ou fugir subitamente se a ressonância mudar."
          ]
        },
        {
          "label": "Recursos coletáveis",
          "items": [
            "◆ Sangue luminoso.",
            "◆ Garra marcada.",
            "◆ Fragmento ósseo ressonante.",
            "◆ Glândula cósmica instável."
          ]
        },
        {
          "label": "Uso em campanha",
          "items": [
            "◆ O Rasktorian Marcado mostra que o Cosmos começou a afetar a fauna local. Deve ser usado como sinal de que uma área está mudando.",
            "FONTE OFICIAL // Livro 3, 2.7"
          ]
        }
      ],
      "sheetType": "full",
      "needsCoreStats": false,
      "assets": [
        {
          "type": "image",
          "label": "Registro visual de Rasktorian Marcado",
          "url": "./assets/bestiary/rasktorian-marcado.jpg"
        }
      ],
      "source": "Livro 3, 2.4",
      "schemaVersion": 1,
      "image": "./assets/bestiary/rasktorian-marcado.jpg"
    },
    {
      "id": "livro3-2-5-viscerme-comum",
      "category": "monster",
      "name": "Viscerme Comum",
      "tier": "E",
      "type": "verme carnívoro",
      "role": "controlador leve",
      "size": "pequeno ou médio",
      "pv": 12,
      "ca": 10,
      "movement": "6 m, escavação curta em lama",
      "habitat": "lama, pântanos, aquedutos, esgotos e cavernas úmidas",
      "behavior": "",
      "attributes": "FOR 12/MOD +1",
      "attacks": "◆ Mordida Circular: 1d6 perfurante.",
      "abilities": "◆ Em sucesso completo, o alvo faz JPF com FOR ou fica Imobilizado até gastar uma ação para tentar se soltar.\n◆ Recebe +1 em Furtividade enquanto estiver em lama, água turva ou terreno pantanoso.",
      "resistances": "",
      "weaknesses": "◆ Terreno seco reduz seu movimento pela metade.\n◆ Fogo o faz recuar.",
      "senses": "◆ Vibração.\n◆ Olfato fraco.",
      "moral": "◆ Foge se for retirado da lama ou sofrer fogo.",
      "resources": "◆ Mandíbulas.\n◆ Secreção pegajosa.\n◆ Glândula digestiva.",
      "campaign": "◆ Bom para travessias, pântanos e cenas onde personagens sobrecarregados podem ser punidos.\nFONTE OFICIAL // Livro 3, 2.9",
      "summary": "◆ Bom para travessias, pântanos e cenas onde personagens sobrecarregados podem ser punidos.\nFONTE OFICIAL // Livro 3, 2.9",
      "tags": [
        "E",
        "verme carnívoro",
        "controlador leve",
        "pequeno ou médio"
      ],
      "details": [
        {
          "label": "Resumo",
          "items": [
            "REGISTRO VISUAL // E // verme carnívoro",
            "Tier: E",
            "Tipo: verme carnívoro",
            "Papel: controlador leve",
            "Tamanho: pequeno ou médio",
            "Habitat: lama, pântanos, aquedutos, esgotos e cavernas úmidas",
            "PV: 12",
            "CA: 10",
            "Movimento: 6 m, escavação curta em lama",
            "Atributos importantes: FOR 12/MOD +1",
            "◆ FOR 12/MOD +1.",
            "◆ REF 12/MOD +1.",
            "◆ CON 12/MOD +1.",
            "◆ MEN 8/MOD -1."
          ]
        },
        {
          "label": "Ataque",
          "items": [
            "◆ Mordida Circular: 1d6 perfurante."
          ]
        },
        {
          "label": "Habilidade — Agarrar na Lama",
          "items": [
            "◆ Em sucesso completo, o alvo faz JPF com FOR ou fica Imobilizado até gastar uma ação para tentar se soltar."
          ]
        },
        {
          "label": "Habilidade — Oculto na Lama",
          "items": [
            "◆ Recebe +1 em Furtividade enquanto estiver em lama, água turva ou terreno pantanoso."
          ]
        },
        {
          "label": "Fraquezas",
          "items": [
            "◆ Terreno seco reduz seu movimento pela metade.",
            "◆ Fogo o faz recuar."
          ]
        },
        {
          "label": "Sentidos",
          "items": [
            "◆ Vibração.",
            "◆ Olfato fraco."
          ]
        },
        {
          "label": "Moral",
          "items": [
            "◆ Foge se for retirado da lama ou sofrer fogo."
          ]
        },
        {
          "label": "Recursos coletáveis",
          "items": [
            "◆ Mandíbulas.",
            "◆ Secreção pegajosa.",
            "◆ Glândula digestiva."
          ]
        },
        {
          "label": "Uso em campanha",
          "items": [
            "◆ Bom para travessias, pântanos e cenas onde personagens sobrecarregados podem ser punidos.",
            "FONTE OFICIAL // Livro 3, 2.9"
          ]
        }
      ],
      "sheetType": "full",
      "needsCoreStats": false,
      "assets": [
        {
          "type": "image",
          "label": "Registro visual de Viscerme Comum",
          "url": "./assets/bestiary/viscerme-comum.jpg"
        }
      ],
      "source": "Livro 3, 2.5",
      "schemaVersion": 1,
      "image": "./assets/bestiary/viscerme-comum.jpg"
    },
    {
      "id": "livro3-2-6-viscerme-inchado",
      "category": "monster",
      "name": "Viscerme Inchado",
      "tier": "D",
      "type": "verme tóxico",
      "role": "controlador/ameaça ambiental",
      "size": "médio",
      "pv": 22,
      "ca": 11,
      "movement": "6 m, escavação curta em lama",
      "habitat": "pântanos contaminados, poços apodrecidos, zonas de esporos",
      "behavior": "",
      "attributes": "FOR 14/MOD +2",
      "attacks": "◆ Mordida Ácida: 1d6 perfurante + 1 corrosivo.",
      "abilities": "◆ Quando sofre dano cortante, libera fluido em área próxima. Quem estiver adjacente faz JPR com REF ou sofre -1 em movimento até gastar uma ação limpando.\n◆ Em crítico, o alvo faz JPF com CON ou fica Envenenado.",
      "resistances": "",
      "weaknesses": "◆ Fogo causa +1 dano.\n◆ Frio intenso reduz suas ações por 1 rodada.",
      "senses": "◆ Vibração.",
      "moral": "◆ Luta até perder metade dos PV, depois tenta afundar.",
      "resources": "◆ Bolsa tóxica.\n◆ Secreção corrosiva.\n◆ Tecido viscoso.",
      "campaign": "◆ Viscerme Inchado é bom para pântanos contaminados e missões médicas. Pode fornecer material para antídotos ou ácidos.\nFONTE OFICIAL // Livro 3, 2.10",
      "summary": "◆ Viscerme Inchado é bom para pântanos contaminados e missões médicas. Pode fornecer material para antídotos ou ácidos.\nFONTE OFICIAL // Livro 3, 2.10",
      "tags": [
        "D",
        "verme tóxico",
        "controlador/ameaça ambiental",
        "médio"
      ],
      "details": [
        {
          "label": "Resumo",
          "items": [
            "REGISTRO VISUAL // D // verme tóxico",
            "Tier: D",
            "Tipo: verme tóxico",
            "Papel: controlador/ameaça ambiental",
            "Tamanho: médio",
            "Habitat: pântanos contaminados, poços apodrecidos, zonas de esporos",
            "PV: 22",
            "CA: 11",
            "Movimento: 6 m, escavação curta em lama",
            "Atributos importantes: FOR 14/MOD +2",
            "◆ FOR 14/MOD +2.",
            "◆ CON 16/MOD +3.",
            "◆ REF 10/MOD +0."
          ]
        },
        {
          "label": "Ataques",
          "items": [
            "◆ Mordida Ácida: 1d6 perfurante + 1 corrosivo."
          ]
        },
        {
          "label": "Habilidade — Fluido Viscoso",
          "items": [
            "◆ Quando sofre dano cortante, libera fluido em área próxima. Quem estiver adjacente faz JPR com REF ou sofre -1 em movimento até gastar uma ação limpando."
          ]
        },
        {
          "label": "Habilidade — Mordida Contaminante",
          "items": [
            "◆ Em crítico, o alvo faz JPF com CON ou fica Envenenado."
          ]
        },
        {
          "label": "Fraquezas",
          "items": [
            "◆ Fogo causa +1 dano.",
            "◆ Frio intenso reduz suas ações por 1 rodada."
          ]
        },
        {
          "label": "Sentidos",
          "items": [
            "◆ Vibração."
          ]
        },
        {
          "label": "Moral",
          "items": [
            "◆ Luta até perder metade dos PV, depois tenta afundar."
          ]
        },
        {
          "label": "Recursos coletáveis",
          "items": [
            "◆ Bolsa tóxica.",
            "◆ Secreção corrosiva.",
            "◆ Tecido viscoso."
          ]
        },
        {
          "label": "Uso em campanha",
          "items": [
            "◆ Viscerme Inchado é bom para pântanos contaminados e missões médicas. Pode fornecer material para antídotos ou ácidos.",
            "FONTE OFICIAL // Livro 3, 2.10"
          ]
        }
      ],
      "sheetType": "full",
      "needsCoreStats": false,
      "assets": [
        {
          "type": "image",
          "label": "Registro visual de Viscerme Inchado",
          "url": "./assets/bestiary/viscerme-inchado.jpg"
        }
      ],
      "source": "Livro 3, 2.6",
      "schemaVersion": 1,
      "image": "./assets/bestiary/viscerme-inchado.jpg"
    },
    {
      "id": "livro3-2-7-voracnido-pequeno",
      "category": "monster",
      "name": "Voracnido Pequeno",
      "tier": "F",
      "type": "predador insetoide",
      "role": "enxame/predador fraco",
      "size": "pequeno",
      "pv": 6,
      "ca": 10,
      "movement": "8 m, escalada 4 m",
      "habitat": "cavernas, pântanos, ruínas orgânicas, túneis",
      "behavior": "",
      "attributes": "REF 14/MOD +2",
      "attacks": "◆ Mandíbula: 1d4 perfurante.",
      "abilities": "◆ Se houver outro Voracnido adjacente ao alvo, recebe +1 no ataque.",
      "resistances": "◆ Nenhuma.",
      "weaknesses": "◆ Fogo, fumaça e som agudo.",
      "senses": "◆ Vibração.\n◆ Olfato de sangue.",
      "moral": "◆ Foge se o enxame for dispersado.",
      "resources": "◆ Mandíbulas pequenas.\n◆ Quitina leve.",
      "campaign": "◆ Bom para pressão inicial, especialmente se o grupo estiver ferido ou carregando carne.\nFONTE OFICIAL // Livro 3, 2.12",
      "summary": "◆ Bom para pressão inicial, especialmente se o grupo estiver ferido ou carregando carne.\nFONTE OFICIAL // Livro 3, 2.12",
      "tags": [
        "F",
        "predador insetoide",
        "enxame/predador fraco",
        "pequeno"
      ],
      "details": [
        {
          "label": "Resumo",
          "items": [
            "REGISTRO VISUAL // F // predador insetoide",
            "Tier: F",
            "Tipo: predador insetoide",
            "Papel: enxame/predador fraco",
            "Tamanho: pequeno",
            "Habitat: cavernas, pântanos, ruínas orgânicas, túneis",
            "PV: 6",
            "CA: 10",
            "Movimento: 8 m, escalada 4 m",
            "Atributos importantes: REF 14/MOD +2",
            "◆ REF 14/MOD +2.",
            "◆ CON 10/MOD +0.",
            "◆ MEN 6/MOD -2."
          ]
        },
        {
          "label": "Ataque",
          "items": [
            "◆ Mandíbula: 1d4 perfurante."
          ]
        },
        {
          "label": "Habilidade — Enxame Faminto",
          "items": [
            "◆ Se houver outro Voracnido adjacente ao alvo, recebe +1 no ataque."
          ]
        },
        {
          "label": "Resistências",
          "items": [
            "◆ Nenhuma."
          ]
        },
        {
          "label": "Fraquezas",
          "items": [
            "◆ Fogo, fumaça e som agudo."
          ]
        },
        {
          "label": "Sentidos",
          "items": [
            "◆ Vibração.",
            "◆ Olfato de sangue."
          ]
        },
        {
          "label": "Moral",
          "items": [
            "◆ Foge se o enxame for dispersado."
          ]
        },
        {
          "label": "Recursos coletáveis",
          "items": [
            "◆ Mandíbulas pequenas.",
            "◆ Quitina leve."
          ]
        },
        {
          "label": "Uso em campanha",
          "items": [
            "◆ Bom para pressão inicial, especialmente se o grupo estiver ferido ou carregando carne.",
            "FONTE OFICIAL // Livro 3, 2.12"
          ]
        }
      ],
      "sheetType": "full",
      "needsCoreStats": false,
      "assets": [
        {
          "type": "image",
          "label": "Registro visual de Voracnido Pequeno",
          "url": "./assets/bestiary/voracnido-pequeno.jpg"
        }
      ],
      "source": "Livro 3, 2.7",
      "schemaVersion": 1,
      "image": "./assets/bestiary/voracnido-pequeno.jpg"
    },
    {
      "id": "livro3-2-8-voracnido-devorador",
      "category": "monster",
      "name": "Voracnido Devorador",
      "tier": "D",
      "type": "predador insetoide",
      "role": "brutamontes leve/enxame líder",
      "size": "médio",
      "pv": 26,
      "ca": 12,
      "movement": "9 m, escalada 6 m",
      "habitat": "ninhos de Voracnidos, cavernas quentes, ruínas com matéria orgânica",
      "behavior": "",
      "attributes": "FOR 14/MOD +2",
      "attacks": "◆ Mandíbula Serrada: 1d8 perfurante.\n◆ Patas Cortantes: 1d6 cortante.",
      "abilities": "◆ Contra alvo Derrubado, causa +1d4 dano.\n◆ Quando uma criatura próxima fica Sangrando, o Voracnido pode se mover 2 m em direção a ela.",
      "resistances": "",
      "weaknesses": "◆ Fogo causa medo instintivo.",
      "senses": "◆ Vibração.\n◆ Olfato aguçado para sangue.",
      "moral": "◆ Não foge enquanto houver presa Sangrando próxima. Foge de fogo intenso.",
      "resources": "◆ Quitina.\n◆ Mandíbula serrada.\n◆ Glândula digestiva.",
      "campaign": "◆ Ameaça boa para cavernas e ninhos. Funciona bem com Voracnidos Pequenos.\nFONTE OFICIAL // Livro 3, 2.13",
      "summary": "◆ Ameaça boa para cavernas e ninhos. Funciona bem com Voracnidos Pequenos.\nFONTE OFICIAL // Livro 3, 2.13",
      "tags": [
        "D",
        "predador insetoide",
        "brutamontes leve/enxame líder",
        "médio"
      ],
      "details": [
        {
          "label": "Resumo",
          "items": [
            "REGISTRO VISUAL // D // predador insetoide",
            "Tier: D",
            "Tipo: predador insetoide",
            "Papel: brutamontes leve/enxame líder",
            "Tamanho: médio",
            "Habitat: ninhos de Voracnidos, cavernas quentes, ruínas com matéria orgânica",
            "PV: 26",
            "CA: 12",
            "Movimento: 9 m, escalada 6 m",
            "Atributos importantes: FOR 14/MOD +2",
            "◆ FOR 14/MOD +2.",
            "◆ REF 14/MOD +2.",
            "◆ CON 14/MOD +2.",
            "◆ MEN 8/MOD -1."
          ]
        },
        {
          "label": "Ataques",
          "items": [
            "◆ Mandíbula Serrada: 1d8 perfurante.",
            "◆ Patas Cortantes: 1d6 cortante."
          ]
        },
        {
          "label": "Habilidade — Devorar Caído",
          "items": [
            "◆ Contra alvo Derrubado, causa +1d4 dano."
          ]
        },
        {
          "label": "Habilidade — Frenesi de Sangue",
          "items": [
            "◆ Quando uma criatura próxima fica Sangrando, o Voracnido pode se mover 2 m em direção a ela."
          ]
        },
        {
          "label": "Fraquezas",
          "items": [
            "◆ Fogo causa medo instintivo."
          ]
        },
        {
          "label": "Sentidos",
          "items": [
            "◆ Vibração.",
            "◆ Olfato aguçado para sangue."
          ]
        },
        {
          "label": "Moral",
          "items": [
            "◆ Não foge enquanto houver presa Sangrando próxima. Foge de fogo intenso."
          ]
        },
        {
          "label": "Recursos coletáveis",
          "items": [
            "◆ Quitina.",
            "◆ Mandíbula serrada.",
            "◆ Glândula digestiva."
          ]
        },
        {
          "label": "Uso em campanha",
          "items": [
            "◆ Ameaça boa para cavernas e ninhos. Funciona bem com Voracnidos Pequenos.",
            "FONTE OFICIAL // Livro 3, 2.13"
          ]
        }
      ],
      "sheetType": "full",
      "needsCoreStats": false,
      "assets": [
        {
          "type": "image",
          "label": "Registro visual de Voracnido Devorador",
          "url": "./assets/bestiary/voracnido-devorador.jpg"
        }
      ],
      "source": "Livro 3, 2.8",
      "schemaVersion": 1,
      "image": "./assets/bestiary/voracnido-devorador.jpg"
    },
    {
      "id": "livro3-2-9-tyrakth-jovem",
      "category": "monster",
      "name": "Tyrakth Jovem",
      "tier": "C",
      "type": "megafauna agressiva",
      "role": "brutamontes/tanque",
      "size": "grande",
      "pv": 45,
      "ca": 14,
      "movement": "8 m",
      "habitat": "montanhas, planícies rochosas, ruínas abertas",
      "behavior": "",
      "attributes": "FOR 18/MOD +4",
      "attacks": "◆ Chifre ou Cabeçada: 1d10 concussão.\n◆ Pisotear: 1d8 concussão.",
      "abilities": "◆ Se mover pelo menos 6 m em linha reta e acertar, o alvo faz JPF com FOR ou JPR com REF. Em falha, fica Derrubado.\n◆ Reduz em 1 dano físico comum.\n◆ Causa +1d6 dano contra portas, barricadas e estruturas leves.",
      "resistances": "◆ Redução 1 contra físico comum.",
      "weaknesses": "◆ Baixa manobrabilidade. Sofre em terreno estreito, lama profunda ou armadilhas.",
      "senses": "◆ Olfato.\n◆ Audição média.",
      "moral": "◆ Recua se for ferido gravemente e tiver rota de fuga. Luta até a morte se encurralado.",
      "resources": "◆ Placa óssea.\n◆ Chifre.\n◆ Couro grosso.\n◆ Tendões fortes.",
      "campaign": "◆ Tyrakth Jovem é uma ameaça de ambiente aberto. Pode ser evitado com rota inteligente.\nFONTE OFICIAL // Livro 3, 2.18",
      "summary": "◆ Tyrakth Jovem é uma ameaça de ambiente aberto. Pode ser evitado com rota inteligente.\nFONTE OFICIAL // Livro 3, 2.18",
      "tags": [
        "C",
        "megafauna agressiva",
        "brutamontes/tanque",
        "grande"
      ],
      "details": [
        {
          "label": "Resumo",
          "items": [
            "REGISTRO VISUAL // C // megafauna agressiva",
            "Tier: C",
            "Tipo: megafauna agressiva",
            "Papel: brutamontes/tanque",
            "Tamanho: grande",
            "Habitat: montanhas, planícies rochosas, ruínas abertas",
            "PV: 45",
            "CA: 14",
            "Movimento: 8 m",
            "Atributos importantes: FOR 18/MOD +4",
            "◆ FOR 18/MOD +4.",
            "◆ CON 18/MOD +4.",
            "◆ REF 8/MOD -1.",
            "◆ MEN 10/MOD +0."
          ]
        },
        {
          "label": "Ataques",
          "items": [
            "◆ Chifre ou Cabeçada: 1d10 concussão.",
            "◆ Pisotear: 1d8 concussão."
          ]
        },
        {
          "label": "Habilidade — Carga Pesada",
          "items": [
            "◆ Se mover pelo menos 6 m em linha reta e acertar, o alvo faz JPF com FOR ou JPR com REF. Em falha, fica Derrubado."
          ]
        },
        {
          "label": "Habilidade — Couro Grosso",
          "items": [
            "◆ Reduz em 1 dano físico comum."
          ]
        },
        {
          "label": "Habilidade — Quebrar Obstáculo",
          "items": [
            "◆ Causa +1d6 dano contra portas, barricadas e estruturas leves."
          ]
        },
        {
          "label": "Resistências",
          "items": [
            "◆ Redução 1 contra físico comum."
          ]
        },
        {
          "label": "Fraquezas",
          "items": [
            "◆ Baixa manobrabilidade. Sofre em terreno estreito, lama profunda ou armadilhas."
          ]
        },
        {
          "label": "Sentidos",
          "items": [
            "◆ Olfato.",
            "◆ Audição média."
          ]
        },
        {
          "label": "Moral",
          "items": [
            "◆ Recua se for ferido gravemente e tiver rota de fuga. Luta até a morte se encurralado."
          ]
        },
        {
          "label": "Recursos coletáveis",
          "items": [
            "◆ Placa óssea.",
            "◆ Chifre.",
            "◆ Couro grosso.",
            "◆ Tendões fortes."
          ]
        },
        {
          "label": "Uso em campanha",
          "items": [
            "◆ Tyrakth Jovem é uma ameaça de ambiente aberto. Pode ser evitado com rota inteligente.",
            "FONTE OFICIAL // Livro 3, 2.18"
          ]
        }
      ],
      "sheetType": "full",
      "needsCoreStats": false,
      "assets": [
        {
          "type": "image",
          "label": "Registro visual de Tyrakth Jovem",
          "url": "./assets/bestiary/tyrakth-jovem.jpg"
        }
      ],
      "source": "Livro 3, 2.9",
      "schemaVersion": 1,
      "image": "./assets/bestiary/tyrakth-jovem.jpg"
    },
    {
      "id": "livro3-2-10-tyrakth-anciao",
      "category": "monster",
      "name": "Tyrakth Ancião",
      "tier": "A",
      "type": "megafauna colossal",
      "role": "chefe/tanque/brutamontes",
      "size": "enorme",
      "pv": 120,
      "ca": 18,
      "movement": "8 m",
      "habitat": "território antigo, montanhas, vales isolados, ruínas abertas",
      "behavior": "",
      "attributes": "FOR 22/MOD +6",
      "attacks": "◆ Investida Ancestral: 2d6 concussão.\n◆ Chifre Monumental: 2d6 perfurante.\n◆ Pisoteio: 2d6 concussão em área próxima.",
      "abilities": "◆ Uma vez por cena, bate no chão. Todos próximos fazem JPR com REF ou ficam Derrubados.\n◆ Reduz 2 de dano físico comum.\n◆ Não pode ser empurrado por criaturas menores que grande, salvo efeito especial.\n◆ Quando sofre dano alto, pode destruir cobertura ou estrutura próxima como reação.",
      "resistances": "◆ Redução 2 contra físico comum.",
      "weaknesses": "◆ Pontos sensíveis nas juntas, olhos e parte inferior da mandíbula. Descobrir exige Biologia, Busca, Biologia ou experiência.",
      "senses": "◆ Olfato poderoso.\n◆ Percepção de vibração.",
      "moral": "◆ Não foge de ameaça pequena. Pode abandonar combate se o invasor sair de seu território.",
      "resources": "◆ Chifre raro.\n◆ Placas ancestrais.\n◆ Couro pesado.\n◆ Núcleo ósseo mineral.",
      "campaign": "◆ Tyrakth Ancião não deve ser encontro aleatório. Ele é evento, obstáculo ou guardião natural de região.\nFONTE OFICIAL // Livro 3, 2.19",
      "summary": "◆ Tyrakth Ancião não deve ser encontro aleatório. Ele é evento, obstáculo ou guardião natural de região.\nFONTE OFICIAL // Livro 3, 2.19",
      "tags": [
        "A",
        "megafauna colossal",
        "chefe/tanque/brutamontes",
        "enorme"
      ],
      "details": [
        {
          "label": "Resumo",
          "items": [
            "REGISTRO VISUAL // A // megafauna colossal",
            "Tier: A",
            "Tipo: megafauna colossal",
            "Papel: chefe/tanque/brutamontes",
            "Tamanho: enorme",
            "Habitat: território antigo, montanhas, vales isolados, ruínas abertas",
            "PV: 120",
            "CA: 18",
            "Movimento: 8 m",
            "Atributos importantes: FOR 22/MOD +6",
            "◆ FOR 22/MOD +6.",
            "◆ CON 22/MOD +6.",
            "◆ REF 8/MOD -1.",
            "◆ MEN 12/MOD +1.",
            "◆ PRE 16/MOD +3."
          ]
        },
        {
          "label": "Ataques",
          "items": [
            "◆ Investida Ancestral: 2d6 concussão.",
            "◆ Chifre Monumental: 2d6 perfurante.",
            "◆ Pisoteio: 2d6 concussão em área próxima."
          ]
        },
        {
          "label": "Habilidade — Terremoto Curto",
          "items": [
            "◆ Uma vez por cena, bate no chão. Todos próximos fazem JPR com REF ou ficam Derrubados."
          ]
        },
        {
          "label": "Habilidade — Couraça Ancestral",
          "items": [
            "◆ Reduz 2 de dano físico comum."
          ]
        },
        {
          "label": "Habilidade — Imparável",
          "items": [
            "◆ Não pode ser empurrado por criaturas menores que grande, salvo efeito especial."
          ]
        },
        {
          "label": "Habilidade — Fúria Territorial",
          "items": [
            "◆ Quando sofre dano alto, pode destruir cobertura ou estrutura próxima como reação."
          ]
        },
        {
          "label": "Resistências",
          "items": [
            "◆ Redução 2 contra físico comum."
          ]
        },
        {
          "label": "Fraquezas",
          "items": [
            "◆ Pontos sensíveis nas juntas, olhos e parte inferior da mandíbula. Descobrir exige Biologia, Busca, Biologia ou experiência."
          ]
        },
        {
          "label": "Sentidos",
          "items": [
            "◆ Olfato poderoso.",
            "◆ Percepção de vibração."
          ]
        },
        {
          "label": "Moral",
          "items": [
            "◆ Não foge de ameaça pequena. Pode abandonar combate se o invasor sair de seu território."
          ]
        },
        {
          "label": "Recursos coletáveis",
          "items": [
            "◆ Chifre raro.",
            "◆ Placas ancestrais.",
            "◆ Couro pesado.",
            "◆ Núcleo ósseo mineral."
          ]
        },
        {
          "label": "Uso em campanha",
          "items": [
            "◆ Tyrakth Ancião não deve ser encontro aleatório. Ele é evento, obstáculo ou guardião natural de região.",
            "FONTE OFICIAL // Livro 3, 2.19"
          ]
        }
      ],
      "sheetType": "full",
      "needsCoreStats": false,
      "assets": [
        {
          "type": "image",
          "label": "Registro visual de Tyrakth Ancião",
          "url": "./assets/bestiary/tyrakth-anciao.jpg"
        }
      ],
      "source": "Livro 3, 2.10",
      "schemaVersion": 1,
      "image": "./assets/bestiary/tyrakth-anciao.jpg"
    },
    {
      "id": "livro3-2-11-laceris-comum",
      "category": "monster",
      "name": "Laceris Comum",
      "tier": "D",
      "type": "predador de ruína",
      "role": "emboscador/predador rápido",
      "size": "médio",
      "pv": 20,
      "ca": 14,
      "movement": "10 m",
      "habitat": "túneis, corredores estreitos, cavernas secas, ruínas",
      "behavior": "",
      "attributes": "REF 16/MOD +3",
      "attacks": "◆ Lâminas Ósseas: 1d8 cortante.\n◆ Mordida Curta: 1d4 perfurante.",
      "abilities": "◆ Em crítico ou sucesso completo especial, o alvo faz JPF com CON. Em falha, fica Sangrando.\n◆ Pode passar por aberturas pequenas e recebe +1 em Furtividade em corredores estreitos.\n◆ Se errar ataque corpo a corpo contra ele, o atacante sofre 1 dano cortante se estiver adjacente, uma vez por rodada.",
      "resistances": "◆ Nenhuma especial.",
      "weaknesses": "◆ Espaços abertos reduzem sua vantagem. Luz forte dificulta emboscadas.",
      "senses": "◆ Audição aguçada.\n◆ Visão no escuro.",
      "moral": "◆ Recua quando perde metade dos PV, mas pode seguir o grupo à distância.",
      "resources": "◆ Lâmina óssea.\n◆ Couro fino.\n◆ Sangue coagulante.",
      "campaign": "◆ Laceris é ótimo para horror de ruína e para ensinar que corredores estreitos favorecem certas criaturas.\nFONTE OFICIAL // Livro 3, 2.21",
      "summary": "◆ Laceris é ótimo para horror de ruína e para ensinar que corredores estreitos favorecem certas criaturas.\nFONTE OFICIAL // Livro 3, 2.21",
      "tags": [
        "D",
        "predador de ruína",
        "emboscador/predador rápido",
        "médio"
      ],
      "details": [
        {
          "label": "Resumo",
          "items": [
            "REGISTRO VISUAL // D // predador de ruína",
            "Tier: D",
            "Tipo: predador de ruína",
            "Papel: emboscador/predador rápido",
            "Tamanho: médio",
            "Habitat: túneis, corredores estreitos, cavernas secas, ruínas",
            "PV: 20",
            "CA: 14",
            "Movimento: 10 m",
            "Atributos importantes: REF 16/MOD +3",
            "◆ REF 16/MOD +3.",
            "◆ FOR 12/MOD +1.",
            "◆ MEN 12/MOD +1."
          ]
        },
        {
          "label": "Ataques",
          "items": [
            "◆ Lâminas Ósseas: 1d8 cortante.",
            "◆ Mordida Curta: 1d4 perfurante."
          ]
        },
        {
          "label": "Habilidade — Corte Profundo",
          "items": [
            "◆ Em crítico ou sucesso completo especial, o alvo faz JPF com CON. Em falha, fica Sangrando."
          ]
        },
        {
          "label": "Habilidade — Corpo Estreito",
          "items": [
            "◆ Pode passar por aberturas pequenas e recebe +1 em Furtividade em corredores estreitos."
          ]
        },
        {
          "label": "Habilidade — Recuo Cortante",
          "items": [
            "◆ Se errar ataque corpo a corpo contra ele, o atacante sofre 1 dano cortante se estiver adjacente, uma vez por rodada."
          ]
        },
        {
          "label": "Resistências",
          "items": [
            "◆ Nenhuma especial."
          ]
        },
        {
          "label": "Fraquezas",
          "items": [
            "◆ Espaços abertos reduzem sua vantagem. Luz forte dificulta emboscadas."
          ]
        },
        {
          "label": "Sentidos",
          "items": [
            "◆ Audição aguçada.",
            "◆ Visão no escuro."
          ]
        },
        {
          "label": "Moral",
          "items": [
            "◆ Recua quando perde metade dos PV, mas pode seguir o grupo à distância."
          ]
        },
        {
          "label": "Recursos coletáveis",
          "items": [
            "◆ Lâmina óssea.",
            "◆ Couro fino.",
            "◆ Sangue coagulante."
          ]
        },
        {
          "label": "Uso em campanha",
          "items": [
            "◆ Laceris é ótimo para horror de ruína e para ensinar que corredores estreitos favorecem certas criaturas.",
            "FONTE OFICIAL // Livro 3, 2.21"
          ]
        }
      ],
      "sheetType": "full",
      "needsCoreStats": false,
      "assets": [
        {
          "type": "image",
          "label": "Registro visual de Laceris Comum",
          "url": "./assets/bestiary/laceris-comum.jpg"
        }
      ],
      "source": "Livro 3, 2.11",
      "schemaVersion": 1,
      "image": "./assets/bestiary/laceris-comum.jpg"
    },
    {
      "id": "livro3-2-12-laceris-serrilhado",
      "category": "monster",
      "name": "Laceris Serrilhado",
      "tier": "C",
      "type": "predador especializado",
      "role": "emboscador/controlador",
      "size": "médio",
      "pv": 36,
      "ca": 15,
      "movement": "11 m",
      "habitat": "ruínas profundas, túneis de caça, zonas secas",
      "behavior": "",
      "attributes": "REF 18/MOD +4",
      "attacks": "◆ Garras Serrilhadas: 1d10 cortante.\n◆ Pode atacar através de abertura estreita ou cobertura parcial sem se expor totalmente, se houver ambiente adequado.",
      "abilities": "◆ Se causar Sangrando em um alvo, esse Sangramento é mais difícil de estancar. Testes de Medicina contra essa ferida sofrem -1 sem kit adequado.\n◆ Recebe +1 para rastrear alvos feridos dentro de ruínas ou túneis.\n◆ Pode atacar através de abertura estreita ou cobertura parcial sem se expor totalmente, se houver ambiente adequado.",
      "resistances": "",
      "weaknesses": "◆ Som grave ou vibração forte pode desorientá-lo por 1 rodada.",
      "senses": "◆ Audição excelente.\n◆ Vibração.",
      "moral": "◆ Não luta até a morte se puder continuar caçando depois.",
      "resources": "◆ Garras serrilhadas.\n◆ Medula coagulante.\n◆ Pele flexível.",
      "campaign": "◆ Laceris Serrilhado funciona como ameaça recorrente que persegue o grupo dentro de uma ruína.\nFONTE OFICIAL // Livro 3, 2.22",
      "summary": "◆ Laceris Serrilhado funciona como ameaça recorrente que persegue o grupo dentro de uma ruína.\nFONTE OFICIAL // Livro 3, 2.22",
      "tags": [
        "C",
        "predador especializado",
        "emboscador/controlador",
        "médio"
      ],
      "details": [
        {
          "label": "Resumo",
          "items": [
            "REGISTRO VISUAL // C // predador especializado",
            "Tier: C",
            "Tipo: predador especializado",
            "Papel: emboscador/controlador",
            "Tamanho: médio",
            "Habitat: ruínas profundas, túneis de caça, zonas secas",
            "PV: 36",
            "CA: 15",
            "Movimento: 11 m",
            "Atributos importantes: REF 18/MOD +4",
            "◆ REF 18/MOD +4.",
            "◆ FOR 14/MOD +2.",
            "◆ MEN 12/MOD +1."
          ]
        },
        {
          "label": "Ataques",
          "items": [
            "◆ Garras Serrilhadas: 1d10 cortante."
          ]
        },
        {
          "label": "Habilidade — Ferida Aberta",
          "items": [
            "◆ Se causar Sangrando em um alvo, esse Sangramento é mais difícil de estancar. Testes de Medicina contra essa ferida sofrem -1 sem kit adequado."
          ]
        },
        {
          "label": "Habilidade — Caçador de Ecos",
          "items": [
            "◆ Recebe +1 para rastrear alvos feridos dentro de ruínas ou túneis."
          ]
        },
        {
          "label": "Habilidade — Ataque de Fresta",
          "items": [
            "◆ Pode atacar através de abertura estreita ou cobertura parcial sem se expor totalmente, se houver ambiente adequado."
          ]
        },
        {
          "label": "Fraquezas",
          "items": [
            "◆ Som grave ou vibração forte pode desorientá-lo por 1 rodada."
          ]
        },
        {
          "label": "Sentidos",
          "items": [
            "◆ Audição excelente.",
            "◆ Vibração."
          ]
        },
        {
          "label": "Moral",
          "items": [
            "◆ Não luta até a morte se puder continuar caçando depois."
          ]
        },
        {
          "label": "Recursos coletáveis",
          "items": [
            "◆ Garras serrilhadas.",
            "◆ Medula coagulante.",
            "◆ Pele flexível."
          ]
        },
        {
          "label": "Uso em campanha",
          "items": [
            "◆ Laceris Serrilhado funciona como ameaça recorrente que persegue o grupo dentro de uma ruína.",
            "FONTE OFICIAL // Livro 3, 2.22"
          ]
        }
      ],
      "sheetType": "full",
      "needsCoreStats": false,
      "assets": [
        {
          "type": "image",
          "label": "Registro visual de Laceris Serrilhado",
          "url": "./assets/bestiary/laceris-serrilhado.jpg"
        }
      ],
      "source": "Livro 3, 2.12",
      "schemaVersion": 1,
      "image": "./assets/bestiary/laceris-serrilhado.jpg"
    },
    {
      "id": "livro3-2-13-morvak-carnical",
      "category": "monster",
      "name": "Morvak Carniçal",
      "tier": "D",
      "type": "carniceiro resistente",
      "role": "tanque/brutamontes leve",
      "size": "médio",
      "pv": 28,
      "ca": 12,
      "movement": "7 m",
      "habitat": "ruínas com cadáveres, pântanos, zonas de descarte, campos de batalha",
      "behavior": "",
      "attributes": "FOR 14/MOD +2",
      "attacks": "◆ Pancada: 1d8 concussão.\n◆ Mordida Suja: 1d6 perfurante.",
      "abilities": "◆ Em sucesso completo, o alvo faz JPF com CON. Em falha, fica Envenenado leve ou Doente, conforme o ambiente.\n◆ Reduz 1 dano de concussão ou cortante comum, uma vez por rodada.\n◆ Se gastar uma ação devorando cadáver ou carne próxima, recupera 1d4 PV. Só pode fazer isso se houver material orgânico disponível.",
      "resistances": "",
      "weaknesses": "◆ Fogo e cheiros químicos fortes.",
      "senses": "◆ Olfato excelente para cadáveres.",
      "moral": "◆ Defende alimento, mas foge de fogo intenso ou ameaça claramente superior.",
      "resources": "◆ Couro grosso.\n◆ Bile contaminante.\n◆ Dentes.",
      "campaign": "◆ Morvaks mostram que uma área teve morte demais. Podem indicar massacre, batalha antiga ou contaminação.\nFONTE OFICIAL // Livro 3, 2.24",
      "summary": "◆ Morvaks mostram que uma área teve morte demais. Podem indicar massacre, batalha antiga ou contaminação.\nFONTE OFICIAL // Livro 3, 2.24",
      "tags": [
        "D",
        "carniceiro resistente",
        "tanque/brutamontes leve",
        "médio"
      ],
      "details": [
        {
          "label": "Resumo",
          "items": [
            "REGISTRO VISUAL // D // carniceiro resistente",
            "Tier: D",
            "Tipo: carniceiro resistente",
            "Papel: tanque/brutamontes leve",
            "Tamanho: médio",
            "Habitat: ruínas com cadáveres, pântanos, zonas de descarte, campos de batalha",
            "PV: 28",
            "CA: 12",
            "Movimento: 7 m",
            "Atributos importantes: FOR 14/MOD +2",
            "◆ FOR 14/MOD +2.",
            "◆ CON 16/MOD +3.",
            "◆ REF 10/MOD +0.",
            "◆ MEN 10/MOD +0."
          ]
        },
        {
          "label": "Ataques",
          "items": [
            "◆ Pancada: 1d8 concussão.",
            "◆ Mordida Suja: 1d6 perfurante."
          ]
        },
        {
          "label": "Habilidade — Mordida Contaminada",
          "items": [
            "◆ Em sucesso completo, o alvo faz JPF com CON. Em falha, fica Envenenado leve ou Doente, conforme o ambiente."
          ]
        },
        {
          "label": "Habilidade — Pele Grossa",
          "items": [
            "◆ Reduz 1 dano de concussão ou cortante comum, uma vez por rodada."
          ]
        },
        {
          "label": "Habilidade — Banquete Sombrio",
          "items": [
            "◆ Se gastar uma ação devorando cadáver ou carne próxima, recupera 1d4 PV. Só pode fazer isso se houver material orgânico disponível."
          ]
        },
        {
          "label": "Fraquezas",
          "items": [
            "◆ Fogo e cheiros químicos fortes."
          ]
        },
        {
          "label": "Sentidos",
          "items": [
            "◆ Olfato excelente para cadáveres."
          ]
        },
        {
          "label": "Moral",
          "items": [
            "◆ Defende alimento, mas foge de fogo intenso ou ameaça claramente superior."
          ]
        },
        {
          "label": "Recursos coletáveis",
          "items": [
            "◆ Couro grosso.",
            "◆ Bile contaminante.",
            "◆ Dentes."
          ]
        },
        {
          "label": "Uso em campanha",
          "items": [
            "◆ Morvaks mostram que uma área teve morte demais. Podem indicar massacre, batalha antiga ou contaminação.",
            "FONTE OFICIAL // Livro 3, 2.24"
          ]
        }
      ],
      "sheetType": "full",
      "needsCoreStats": false,
      "assets": [
        {
          "type": "image",
          "label": "Registro visual de Morvak Carniçal",
          "url": "./assets/bestiary/morvak-carnical.jpg"
        }
      ],
      "source": "Livro 3, 2.13",
      "schemaVersion": 1,
      "image": "./assets/bestiary/morvak-carnical.jpg"
    },
    {
      "id": "livro3-2-14-morvak-putrefato",
      "category": "monster",
      "name": "Morvak Putrefato",
      "tier": "C",
      "type": "carniceiro contaminado",
      "role": "tanque/ameaça ambiental",
      "size": "grande",
      "pv": 48,
      "ca": 13,
      "movement": "6 m",
      "habitat": "fossas tóxicas, ruínas contaminadas, pântanos mortos",
      "behavior": "",
      "attributes": "FOR 16/MOD +3",
      "attacks": "◆ Pancada Pesada: 1d10 concussão.\n◆ Mordida Podre: 1d8 perfurante.\n◆ Ataques corpo a corpo contra o Morvak Putrefato podem respingar fluido. Em erro crítico, o atacante faz JPF com CON ou fica Envenenado.",
      "abilities": "◆ Criaturas adjacentes fazem JPF com CON ao início do turno se permanecerem próximas por muito tempo. Em falha, ficam Tontas ou Envenenadas leves.\n◆ Ataques corpo a corpo contra o Morvak Putrefato podem respingar fluido. Em erro crítico, o atacante faz JPF com CON ou fica Envenenado.\n◆ Na primeira vez que chegaria a 0 PV, permanece com 1 PV e ganha uma última ação, salvo se for destruído por fogo, ácido forte ou dano massivo.",
      "resistances": "",
      "weaknesses": "◆ Fogo.\n◆ Ácido purificador.\n◆ Ambiente seco.",
      "senses": "◆ Olfato.\n◆ Percepção por calor fraca.",
      "moral": "◆ Quase nunca foge. É mais instinto de decomposição do que medo.",
      "resources": "◆ Bile putrefata.\n◆ Couro contaminado.\n◆ Órgão resistente.",
      "campaign": "◆ Morvak Putrefato é bom como guardião de local contaminado ou obstáculo que força o grupo a pensar em purificação.\nFONTE OFICIAL // Livro 3, 2.25",
      "summary": "◆ Morvak Putrefato é bom como guardião de local contaminado ou obstáculo que força o grupo a pensar em purificação.\nFONTE OFICIAL // Livro 3, 2.25",
      "tags": [
        "C",
        "carniceiro contaminado",
        "tanque/ameaça ambiental",
        "grande"
      ],
      "details": [
        {
          "label": "Resumo",
          "items": [
            "REGISTRO VISUAL // C // carniceiro contaminado",
            "Tier: C",
            "Tipo: carniceiro contaminado",
            "Papel: tanque/ameaça ambiental",
            "Tamanho: grande",
            "Habitat: fossas tóxicas, ruínas contaminadas, pântanos mortos",
            "PV: 48",
            "CA: 13",
            "Movimento: 6 m",
            "Atributos importantes: FOR 16/MOD +3",
            "◆ FOR 16/MOD +3.",
            "◆ CON 20/MOD +5.",
            "◆ REF 8/MOD -1."
          ]
        },
        {
          "label": "Ataques",
          "items": [
            "◆ Pancada Pesada: 1d10 concussão.",
            "◆ Mordida Podre: 1d8 perfurante."
          ]
        },
        {
          "label": "Habilidade — Aura de Podridão",
          "items": [
            "◆ Criaturas adjacentes fazem JPF com CON ao início do turno se permanecerem próximas por muito tempo. Em falha, ficam Tontas ou Envenenadas leves."
          ]
        },
        {
          "label": "Habilidade — Corpo Imundo",
          "items": [
            "◆ Ataques corpo a corpo contra o Morvak Putrefato podem respingar fluido. Em erro crítico, o atacante faz JPF com CON ou fica Envenenado."
          ]
        },
        {
          "label": "Habilidade — Não Cai Fácil",
          "items": [
            "◆ Na primeira vez que chegaria a 0 PV, permanece com 1 PV e ganha uma última ação, salvo se for destruído por fogo, ácido forte ou dano massivo."
          ]
        },
        {
          "label": "Fraquezas",
          "items": [
            "◆ Fogo.",
            "◆ Ácido purificador.",
            "◆ Ambiente seco."
          ]
        },
        {
          "label": "Sentidos",
          "items": [
            "◆ Olfato.",
            "◆ Percepção por calor fraca."
          ]
        },
        {
          "label": "Moral",
          "items": [
            "◆ Quase nunca foge. É mais instinto de decomposição do que medo."
          ]
        },
        {
          "label": "Recursos coletáveis",
          "items": [
            "◆ Bile putrefata.",
            "◆ Couro contaminado.",
            "◆ Órgão resistente."
          ]
        },
        {
          "label": "Uso em campanha",
          "items": [
            "◆ Morvak Putrefato é bom como guardião de local contaminado ou obstáculo que força o grupo a pensar em purificação.",
            "FONTE OFICIAL // Livro 3, 2.25"
          ]
        }
      ],
      "sheetType": "full",
      "needsCoreStats": false,
      "assets": [
        {
          "type": "image",
          "label": "Registro visual de Morvak Putrefato",
          "url": "./assets/bestiary/morvak-putrefato.jpg"
        }
      ],
      "source": "Livro 3, 2.14",
      "schemaVersion": 1,
      "image": "./assets/bestiary/morvak-putrefato.jpg"
    },
    {
      "id": "livro3-2-15-nyxaracne-menor",
      "category": "monster",
      "name": "Nyxaracne Menor",
      "tier": "D",
      "type": "aracnídeo de sombra",
      "role": "emboscador/controlador",
      "size": "médio",
      "pv": 20,
      "ca": 13,
      "movement": "8 m, escalada 8 m",
      "habitat": "cavernas, ruínas, túneis, tetos altos",
      "behavior": "",
      "attributes": "REF 16/MOD +3",
      "attacks": "◆ Presas: 1d6 perfurante.",
      "abilities": "◆ Alvo atingido por ataque especial faz JPR com REF. Em falha, fica Imobilizado. Pode gastar ação para tentar se soltar.\n◆ Ignora terreno difícil no chão enquanto houver teto ou parede adequada.\n◆ Em área com muitas teias, testes de Percepção baseados em som sofrem -1.",
      "resistances": "",
      "weaknesses": "◆ Fogo e luz intensa.",
      "senses": "◆ Visão no escuro.\n◆ Vibração em teias.",
      "moral": "◆ Foge se a teia principal for queimada ou se sofrer fogo.",
      "resources": "◆ Teia resistente.\n◆ Veneno fraco.\n◆ Olhos sensíveis.",
      "campaign": "◆ Boa ameaça para resgates em caverna e exploração vertical.\nFONTE OFICIAL // Livro 3, 2.27",
      "summary": "◆ Boa ameaça para resgates em caverna e exploração vertical.\nFONTE OFICIAL // Livro 3, 2.27",
      "tags": [
        "D",
        "aracnídeo de sombra",
        "emboscador/controlador",
        "médio"
      ],
      "details": [
        {
          "label": "Resumo",
          "items": [
            "REGISTRO VISUAL // D // aracnídeo de sombra",
            "Tier: D",
            "Tipo: aracnídeo de sombra",
            "Papel: emboscador/controlador",
            "Tamanho: médio",
            "Habitat: cavernas, ruínas, túneis, tetos altos",
            "PV: 20",
            "CA: 13",
            "Movimento: 8 m, escalada 8 m",
            "Atributos importantes: REF 16/MOD +3",
            "◆ REF 16/MOD +3.",
            "◆ FOR 12/MOD +1.",
            "◆ MEN 12/MOD +1."
          ]
        },
        {
          "label": "Ataques",
          "items": [
            "◆ Presas: 1d6 perfurante."
          ]
        },
        {
          "label": "Habilidade — Teia Escura",
          "items": [
            "◆ Alvo atingido por ataque especial faz JPR com REF. Em falha, fica Imobilizado. Pode gastar ação para tentar se soltar."
          ]
        },
        {
          "label": "Habilidade — Andar no Teto",
          "items": [
            "◆ Ignora terreno difícil no chão enquanto houver teto ou parede adequada."
          ]
        },
        {
          "label": "Habilidade — Silêncio de Teia",
          "items": [
            "◆ Em área com muitas teias, testes de Percepção baseados em som sofrem -1."
          ]
        },
        {
          "label": "Fraquezas",
          "items": [
            "◆ Fogo e luz intensa."
          ]
        },
        {
          "label": "Sentidos",
          "items": [
            "◆ Visão no escuro.",
            "◆ Vibração em teias."
          ]
        },
        {
          "label": "Moral",
          "items": [
            "◆ Foge se a teia principal for queimada ou se sofrer fogo."
          ]
        },
        {
          "label": "Recursos coletáveis",
          "items": [
            "◆ Teia resistente.",
            "◆ Veneno fraco.",
            "◆ Olhos sensíveis."
          ]
        },
        {
          "label": "Uso em campanha",
          "items": [
            "◆ Boa ameaça para resgates em caverna e exploração vertical.",
            "FONTE OFICIAL // Livro 3, 2.27"
          ]
        }
      ],
      "sheetType": "full",
      "needsCoreStats": false,
      "assets": [
        {
          "type": "image",
          "label": "Registro visual de Nyxaracne Menor",
          "url": "./assets/bestiary/nyxaracne-menor.jpg"
        }
      ],
      "source": "Livro 3, 2.15",
      "schemaVersion": 1,
      "image": "./assets/bestiary/nyxaracne-menor.jpg"
    },
    {
      "id": "livro3-2-16-nyxaracne-tecela",
      "category": "monster",
      "name": "Nyxaracne Tecelã",
      "tier": "C",
      "type": "aracnídeo de sombra",
      "role": "controlador/suporte",
      "size": "grande",
      "pv": 38,
      "ca": 14,
      "movement": "8 m, escalada 8 m",
      "habitat": "ninhos, ruínas profundas, cavernas com muita teia",
      "behavior": "",
      "attributes": "REF 16/MOD +3",
      "attacks": "◆ Presas: 1d8 perfurante.",
      "abilities": "◆ Cria área de teia que conta como terreno difícil. Quem correr dentro dela faz JPR com REF ou fica Imobilizado.\n◆ Uma vez por cena, cobre uma fonte de luz pequena ou média com teia escura, reduzindo visibilidade.\n◆ Se estiver em ninho, pode chamar 1d4 Nyxaracnes pequenas, Larvas Vorazes ou criaturas menores, a critério do Mestre.\n◆ Equipamentos tecnológicos presos na teia podem sofrer interferência leve.",
      "resistances": "",
      "weaknesses": "◆ Fogo destrói teias rapidamente.\n◆ Luz forte impede Apagar Luz por 1 rodada.",
      "senses": "◆ Vibração em teias.\n◆ Visão no escuro.\n◆ Percepção de calor fraca.",
      "moral": "◆ Defende ninho. Se ovos forem destruídos, pode entrar em fúria ou fugir para reconstruir ninho.",
      "resources": "◆ Teia de alta qualidade.\n◆ Veneno.\n◆ Casulo.\n◆ Órgão sensorial.",
      "campaign": "◆ Excelente chefe de missão de resgate, exploração ou ninho.\nFONTE OFICIAL // Livro 3, 2.28",
      "summary": "◆ Excelente chefe de missão de resgate, exploração ou ninho.\nFONTE OFICIAL // Livro 3, 2.28",
      "tags": [
        "C",
        "aracnídeo de sombra",
        "controlador/suporte",
        "grande"
      ],
      "details": [
        {
          "label": "Resumo",
          "items": [
            "REGISTRO VISUAL // C // aracnídeo de sombra",
            "Tier: C",
            "Tipo: aracnídeo de sombra",
            "Papel: controlador/suporte",
            "Tamanho: grande",
            "Habitat: ninhos, ruínas profundas, cavernas com muita teia",
            "PV: 38",
            "CA: 14",
            "Movimento: 8 m, escalada 8 m",
            "Atributos importantes: REF 16/MOD +3",
            "◆ REF 16/MOD +3.",
            "◆ MEN 14/MOD +2.",
            "◆ CON 14/MOD +2."
          ]
        },
        {
          "label": "Ataques",
          "items": [
            "◆ Presas: 1d8 perfurante."
          ]
        },
        {
          "label": "Habilidade — Campo de Teias",
          "items": [
            "◆ Cria área de teia que conta como terreno difícil. Quem correr dentro dela faz JPR com REF ou fica Imobilizado."
          ]
        },
        {
          "label": "Habilidade — Apagar Luz",
          "items": [
            "◆ Uma vez por cena, cobre uma fonte de luz pequena ou média com teia escura, reduzindo visibilidade."
          ]
        },
        {
          "label": "Habilidade — Chamar Filhotes",
          "items": [
            "◆ Se estiver em ninho, pode chamar 1d4 Nyxaracnes pequenas, Larvas Vorazes ou criaturas menores, a critério do Mestre."
          ]
        },
        {
          "label": "Habilidade — Teia Condutora",
          "items": [
            "◆ Equipamentos tecnológicos presos na teia podem sofrer interferência leve."
          ]
        },
        {
          "label": "Fraquezas",
          "items": [
            "◆ Fogo destrói teias rapidamente.",
            "◆ Luz forte impede Apagar Luz por 1 rodada."
          ]
        },
        {
          "label": "Sentidos",
          "items": [
            "◆ Vibração em teias.",
            "◆ Visão no escuro.",
            "◆ Percepção de calor fraca."
          ]
        },
        {
          "label": "Moral",
          "items": [
            "◆ Defende ninho. Se ovos forem destruídos, pode entrar em fúria ou fugir para reconstruir ninho."
          ]
        },
        {
          "label": "Recursos coletáveis",
          "items": [
            "◆ Teia de alta qualidade.",
            "◆ Veneno.",
            "◆ Casulo.",
            "◆ Órgão sensorial."
          ]
        },
        {
          "label": "Uso em campanha",
          "items": [
            "◆ Excelente chefe de missão de resgate, exploração ou ninho.",
            "FONTE OFICIAL // Livro 3, 2.28"
          ]
        }
      ],
      "sheetType": "full",
      "needsCoreStats": false,
      "assets": [
        {
          "type": "image",
          "label": "Registro visual de Nyxaracne Tecelã",
          "url": "./assets/bestiary/nyxaracne-tecela.jpg"
        }
      ],
      "source": "Livro 3, 2.16",
      "schemaVersion": 1,
      "image": "./assets/bestiary/nyxaracne-tecela.jpg"
    },
    {
      "id": "livro3-2-17-nyxaracne-matriarca",
      "category": "monster",
      "name": "Nyxaracne Matriarca",
      "tier": "B",
      "type": "aracnídeo superior de sombra",
      "role": "chefe, controlador e senhora de ninho",
      "size": "enorme",
      "pv": 78,
      "ca": 16,
      "movement": "8 m; escalada 8 m",
      "habitat": "ninho profundo, ruína tomada por teias, cavernas antigas e túneis verticais",
      "behavior": "",
      "attributes": "FOR 16/MOD +3; REF 16/MOD +3; CON 18/MOD +4; INT 6/MOD -2; MEN 16/MOD +3; PRE 14/MOD +2",
      "attacks": "◆ Ataques: Presas da Matriarca, 1d10 perfurante; Pata Cortante, 1d8 cortante.",
      "abilities": "◆ Habilidade — Domínio do Ninho: enquanto estiver no próprio ninho, recebe +1 CA e ignora penalidade de teias.\n◆ Habilidade — Teia Abissal Menor: uma vez por rodada, escolhe área com teia. Alvos fazem JPR com REF ou ficam Imobilizados.\n◆ Habilidade — Ninhada: no fim de cada rodada, se houver ovos ou casulos intactos, uma criatura menor pode surgir, mover-se ou atrapalhar o grupo.\n◆ Habilidade — Sombra Viva: uma vez por cena, apaga fontes pequenas de luz por 1 rodada, salvo fogo intenso ou luz cósmica forte.",
      "resistances": "◆ Resistências: resistência leve contra perfurante e contra terreno de teia.",
      "weaknesses": "◆ Fraquezas: fogo, luz intensa e destruição dos pontos principais do ninho.",
      "senses": "◆ Sentidos: vibração perfeita em teias, visão no escuro e percepção de calor fraca.",
      "moral": "◆ Moral: protege ovos e rota de fuga. Pode abandonar o ninho se a espécie estiver ameaçada.",
      "resources": "◆ Recursos coletáveis: teia superior, veneno concentrado, olhos da Matriarca, quitina escura e ovos.",
      "campaign": "◆ Uso em campanha: chefe de arco subterrâneo. A Matriarca Abissal do Capítulo 3 é a versão lendária Tier A.\nFONTE OFICIAL // Livro 3, ficha consolidada de 2.29 e 4.16",
      "summary": "◆ Uso em campanha: chefe de arco subterrâneo. A Matriarca Abissal do Capítulo 3 é a versão lendária Tier A.\nFONTE OFICIAL // Livro 3, ficha consolidada de 2.29 e 4.16",
      "tags": [
        "B",
        "aracnídeo superior de sombra",
        "chefe, controlador e senhora de ninho",
        "enorme"
      ],
      "details": [
        {
          "label": "Resumo",
          "items": [
            "REGISTRO VISUAL // B // aracnídeo superior de sombra",
            "Tier: B",
            "Tipo: aracnídeo superior de sombra",
            "Papel: chefe, controlador e senhora de ninho",
            "Tamanho: enorme",
            "Habitat: ninho profundo, ruína tomada por teias, cavernas antigas e túneis verticais",
            "PV: 78",
            "CA: 16",
            "Movimento: 8 m; escalada 8 m",
            "Atributos importantes: FOR 16/MOD +3; REF 16/MOD +3; CON 18/MOD +4; INT 6/MOD -2; MEN 16/MOD +3; PRE 14/MOD +2",
            "◆ Ataques: Presas da Matriarca, 1d10 perfurante; Pata Cortante, 1d8 cortante.",
            "◆ Habilidade — Domínio do Ninho: enquanto estiver no próprio ninho, recebe +1 CA e ignora penalidade de teias.",
            "◆ Habilidade — Teia Abissal Menor: uma vez por rodada, escolhe área com teia. Alvos fazem JPR com REF ou ficam Imobilizados.",
            "◆ Habilidade — Ninhada: no fim de cada rodada, se houver ovos ou casulos intactos, uma criatura menor pode surgir, mover-se ou atrapalhar o grupo.",
            "◆ Habilidade — Sombra Viva: uma vez por cena, apaga fontes pequenas de luz por 1 rodada, salvo fogo intenso ou luz cósmica forte.",
            "◆ Resistências: resistência leve contra perfurante e contra terreno de teia.",
            "◆ Fraquezas: fogo, luz intensa e destruição dos pontos principais do ninho.",
            "◆ Sentidos: vibração perfeita em teias, visão no escuro e percepção de calor fraca.",
            "◆ Moral: protege ovos e rota de fuga. Pode abandonar o ninho se a espécie estiver ameaçada.",
            "◆ Recursos coletáveis: teia superior, veneno concentrado, olhos da Matriarca, quitina escura e ovos.",
            "◆ Uso em campanha: chefe de arco subterrâneo. A Matriarca Abissal do Capítulo 3 é a versão lendária Tier A.",
            "FONTE OFICIAL // Livro 3, ficha consolidada de 2.29 e 4.16"
          ]
        }
      ],
      "sheetType": "full",
      "needsCoreStats": false,
      "assets": [
        {
          "type": "image",
          "label": "Registro visual de Nyxaracne Matriarca",
          "url": "./assets/bestiary/nyxaracne-matriarca.jpg"
        }
      ],
      "source": "Livro 3, 2.17",
      "schemaVersion": 1,
      "image": "./assets/bestiary/nyxaracne-matriarca.jpg"
    },
    {
      "id": "livro3-2-18-filhote-rasktorian",
      "category": "monster",
      "name": "Filhote Rasktorian",
      "tier": "F",
      "type": "predador biológico imaturo",
      "role": "ameaça inicial, enxame menor e presságio de ninho",
      "size": "pequeno",
      "pv": 8,
      "ca": 9,
      "movement": "7 m",
      "habitat": "ninhos, túneis baixos, ruínas rasas e bordas de território Rasktorian",
      "behavior": "",
      "attributes": "FOR 8/MOD -1; REF 12/MOD +1; CON 10/MOD +0; INT 2/MOD -4; MEN 8/MOD -1; PRE 4/MOD -3",
      "attacks": "Ataques: Mordida Curta, 1d4 perfurante; Garra Fraca, 1d3 cortante.",
      "abilities": "◆ Habilidade — Fome de Ninhada: se houver outro Filhote Rasktorian adjacente ao mesmo alvo, recebe +1 no ataque.\n◆ Habilidade — Pânico de Isolamento: se estiver sozinho e sofrer dano, faz teste de moral. Em falha, foge, chia ou chama adultos próximos.\n◆ Habilidade — Cheiro de Sangue Fraco: recebe +1 em Busca para localizar alvo Sangrando em curta distância.",
      "resistances": "Resistências: nenhuma especial.",
      "weaknesses": "◆ Fraquezas: fogo, som alto e luz súbita podem fazê-lo fugir por 1 rodada.",
      "senses": "Sentidos: olfato sensível e audição aguçada.",
      "moral": "◆ Moral: foge se metade da ninhada cair ou se um adulto não estiver por perto.",
      "resources": "◆ Recursos coletáveis: dentes pequenos, couro imaturo e glândula odorífera fraca.",
      "campaign": "◆ Uso em campanha: ideal para indicar que há ninho próximo. Não deve substituir o Rasktorian Jovem oficial.\nFONTE OFICIAL // Livro 3, 4.4",
      "summary": "◆ Uso em campanha: ideal para indicar que há ninho próximo. Não deve substituir o Rasktorian Jovem oficial.\nFONTE OFICIAL // Livro 3, 4.4",
      "tags": [
        "F",
        "predador biológico imaturo",
        "ameaça inicial, enxame menor e presságio de ninho",
        "pequeno"
      ],
      "details": [
        {
          "label": "Resumo",
          "items": [
            "REGISTRO VISUAL // F // predador biológico imaturo",
            "Tier: F",
            "Tipo: predador biológico imaturo",
            "Papel: ameaça inicial, enxame menor e presságio de ninho",
            "Tamanho: pequeno",
            "Habitat: ninhos, túneis baixos, ruínas rasas e bordas de território Rasktorian",
            "PV: 8",
            "CA: 9",
            "Movimento: 7 m",
            "Atributos importantes: FOR 8/MOD -1; REF 12/MOD +1; CON 10/MOD +0; INT 2/MOD -4; MEN 8/MOD -1; PRE 4/MOD -3",
            "Ataques: Mordida Curta, 1d4 perfurante; Garra Fraca, 1d3 cortante.",
            "◆ Habilidade — Fome de Ninhada: se houver outro Filhote Rasktorian adjacente ao mesmo alvo, recebe +1 no ataque.",
            "◆ Habilidade — Pânico de Isolamento: se estiver sozinho e sofrer dano, faz teste de moral. Em falha, foge, chia ou chama adultos próximos.",
            "◆ Habilidade — Cheiro de Sangue Fraco: recebe +1 em Busca para localizar alvo Sangrando em curta distância.",
            "Resistências: nenhuma especial.",
            "◆ Fraquezas: fogo, som alto e luz súbita podem fazê-lo fugir por 1 rodada.",
            "Sentidos: olfato sensível e audição aguçada.",
            "◆ Moral: foge se metade da ninhada cair ou se um adulto não estiver por perto.",
            "◆ Recursos coletáveis: dentes pequenos, couro imaturo e glândula odorífera fraca.",
            "◆ Uso em campanha: ideal para indicar que há ninho próximo. Não deve substituir o Rasktorian Jovem oficial.",
            "FONTE OFICIAL // Livro 3, 4.4"
          ]
        }
      ],
      "sheetType": "full",
      "needsCoreStats": false,
      "assets": [
        {
          "type": "image",
          "label": "Registro visual de Filhote Rasktorian",
          "url": "./assets/bestiary/filhote-rasktorian.jpg"
        }
      ],
      "source": "Livro 3, 2.18",
      "schemaVersion": 1,
      "image": "./assets/bestiary/filhote-rasktorian.jpg"
    },
    {
      "id": "livro3-2-19-rasktorian-beta-dominante",
      "category": "monster",
      "name": "Rasktorian Beta Dominante",
      "tier": "C",
      "type": "predador dominante de bando",
      "role": "elite, líder intermediário e chefe menor",
      "size": "médio grande",
      "pv": 46,
      "ca": 15,
      "movement": "11 m",
      "habitat": "território de caça, ruínas abertas, cavernas largas e rotas bloqueadas por bando",
      "behavior": "",
      "attributes": "FOR 16/MOD +3; REF 16/MOD +3; CON 16/MOD +3; INT 6/MOD -2; MEN 12/MOD +1; PRE 12/MOD +1",
      "attacks": "◆ Ataques: Garra Dominante, 1d8 cortante; Mordida de Pressão, 1d8 perfurante; Pancada de Ombro, 1d6 concussão.",
      "abilities": "◆ Habilidade — Desafio de Bando: uma vez por cena, escolhe um alvo que tenha causado dano nele. Até o fim da próxima rodada, o Beta recebe +1 em ataques contra esse alvo, mas sofre -1 contra os demais.\n◆ Habilidade — Ordem Instintiva: no início de uma rodada, um Rasktorian Filhote, Jovem ou Adulto próximo pode se mover 3 m ou reposicionar sem atacar.\n◆ Habilidade — Derrubar Presa: se mover pelo menos 6 m e acertar com Garra Dominante, o alvo faz JPR com REF ou fica Derrubado.",
      "resistances": "Resistências: resistência leve contra cortante comum.",
      "weaknesses": "◆ Fraquezas: disputa de domínio. Pode ser atraído por desafio, cheiro de sangue Alfa ou invasão de território.",
      "senses": "◆ Sentidos: olfato excelente, audição aguçada e percepção de vibração curta.",
      "moral": "◆ Moral: não foge facilmente, mas recua se perceber presença de Alfa ou se o bando for destruído.",
      "resources": "◆ Recursos coletáveis: garra dominante, couro reforçado, glândula de feromônio e sangue adrenal.",
      "campaign": "◆ Uso em campanha: serve como chefe de missão inicial avançada ou como guardião do território antes do verdadeiro Alfa.\nFONTE OFICIAL // Livro 3, 4.5",
      "summary": "◆ Uso em campanha: serve como chefe de missão inicial avançada ou como guardião do território antes do verdadeiro Alfa.\nFONTE OFICIAL // Livro 3, 4.5",
      "tags": [
        "C",
        "predador dominante de bando",
        "elite, líder intermediário e chefe menor",
        "médio grande"
      ],
      "details": [
        {
          "label": "Resumo",
          "items": [
            "REGISTRO VISUAL // C // predador dominante de bando",
            "Tier: C",
            "Tipo: predador dominante de bando",
            "Papel: elite, líder intermediário e chefe menor",
            "Tamanho: médio grande",
            "Habitat: território de caça, ruínas abertas, cavernas largas e rotas bloqueadas por bando",
            "PV: 46",
            "CA: 15",
            "Movimento: 11 m",
            "Atributos importantes: FOR 16/MOD +3; REF 16/MOD +3; CON 16/MOD +3; INT 6/MOD -2; MEN 12/MOD +1; PRE 12/MOD +1",
            "◆ Ataques: Garra Dominante, 1d8 cortante; Mordida de Pressão, 1d8 perfurante; Pancada de Ombro, 1d6 concussão.",
            "◆ Habilidade — Desafio de Bando: uma vez por cena, escolhe um alvo que tenha causado dano nele. Até o fim da próxima rodada, o Beta recebe +1 em ataques contra esse alvo, mas sofre -1 contra os demais.",
            "◆ Habilidade — Ordem Instintiva: no início de uma rodada, um Rasktorian Filhote, Jovem ou Adulto próximo pode se mover 3 m ou reposicionar sem atacar.",
            "◆ Habilidade — Derrubar Presa: se mover pelo menos 6 m e acertar com Garra Dominante, o alvo faz JPR com REF ou fica Derrubado.",
            "Resistências: resistência leve contra cortante comum.",
            "◆ Fraquezas: disputa de domínio. Pode ser atraído por desafio, cheiro de sangue Alfa ou invasão de território.",
            "◆ Sentidos: olfato excelente, audição aguçada e percepção de vibração curta.",
            "◆ Moral: não foge facilmente, mas recua se perceber presença de Alfa ou se o bando for destruído.",
            "◆ Recursos coletáveis: garra dominante, couro reforçado, glândula de feromônio e sangue adrenal.",
            "◆ Uso em campanha: serve como chefe de missão inicial avançada ou como guardião do território antes do verdadeiro Alfa.",
            "FONTE OFICIAL // Livro 3, 4.5"
          ]
        }
      ],
      "sheetType": "full",
      "needsCoreStats": false,
      "assets": [
        {
          "type": "image",
          "label": "Registro visual de Rasktorian Beta Dominante",
          "url": "./assets/bestiary/rasktorian-beta-dominante.jpg"
        }
      ],
      "source": "Livro 3, 2.19",
      "schemaVersion": 1,
      "image": "./assets/bestiary/rasktorian-beta-dominante.jpg"
    },
    {
      "id": "livro3-2-20-viscerme-de-lodo-menor",
      "category": "monster",
      "name": "Viscerme de Lodo Menor",
      "tier": "F",
      "type": "lodo biológico reativo",
      "role": "controle de terreno e armadilha viva",
      "size": "pequeno ou massa baixa",
      "pv": 7,
      "ca": 8,
      "movement": "4 m em terra; 6 m em lama ou água rasa",
      "habitat": "pântanos, ruínas alagadas, poços contaminados e lama com resíduo cósmico",
      "behavior": "",
      "attributes": "FOR 8/MOD -1; REF 8/MOD -1; CON 12/MOD +1; INT 2/MOD -4; MEN 6/MOD -2; PRE 2/MOD -4",
      "attacks": "Ataque: Tentáculo de Lodo, 1d4 concussão.",
      "abilities": "◆ Habilidade — Puxar para a Lama: em sucesso completo, o alvo faz JPF com FOR ou fica Imobilizado até gastar ação para se soltar.\n◆ Habilidade — Corpo Amorfo: passa por frestas, grades largas e rachaduras lamacentas.",
      "resistances": "Resistências: resistência leve contra concussão comum.",
      "weaknesses": "Fraquezas: fogo e ambiente seco reduzem seu movimento pela metade.",
      "senses": "Sentidos: vibração em água e lama.",
      "moral": "◆ Moral: não possui moral complexa; recua para lama profunda se sofrer fogo.",
      "resources": "◆ Recursos coletáveis: núcleo viscoso, lodo concentrado e resíduo ácido fraco.",
      "campaign": "◆ Uso em campanha: funciona como perigo de travessia, não como substituto do Viscerme Comum.\nFONTE OFICIAL // Livro 3, 4.7",
      "summary": "◆ Uso em campanha: funciona como perigo de travessia, não como substituto do Viscerme Comum.\nFONTE OFICIAL // Livro 3, 4.7",
      "tags": [
        "F",
        "lodo biológico reativo",
        "controle de terreno e armadilha viva",
        "pequeno ou massa baixa"
      ],
      "details": [
        {
          "label": "Resumo",
          "items": [
            "REGISTRO VISUAL // F // lodo biológico reativo",
            "Tier: F",
            "Tipo: lodo biológico reativo",
            "Papel: controle de terreno e armadilha viva",
            "Tamanho: pequeno ou massa baixa",
            "Habitat: pântanos, ruínas alagadas, poços contaminados e lama com resíduo cósmico",
            "PV: 7",
            "CA: 8",
            "Movimento: 4 m em terra; 6 m em lama ou água rasa",
            "Atributos importantes: FOR 8/MOD -1; REF 8/MOD -1; CON 12/MOD +1; INT 2/MOD -4; MEN 6/MOD -2; PRE 2/MOD -4",
            "Ataque: Tentáculo de Lodo, 1d4 concussão.",
            "◆ Habilidade — Puxar para a Lama: em sucesso completo, o alvo faz JPF com FOR ou fica Imobilizado até gastar ação para se soltar.",
            "◆ Habilidade — Corpo Amorfo: passa por frestas, grades largas e rachaduras lamacentas.",
            "Resistências: resistência leve contra concussão comum.",
            "Fraquezas: fogo e ambiente seco reduzem seu movimento pela metade.",
            "Sentidos: vibração em água e lama.",
            "◆ Moral: não possui moral complexa; recua para lama profunda se sofrer fogo.",
            "◆ Recursos coletáveis: núcleo viscoso, lodo concentrado e resíduo ácido fraco.",
            "◆ Uso em campanha: funciona como perigo de travessia, não como substituto do Viscerme Comum.",
            "FONTE OFICIAL // Livro 3, 4.7"
          ]
        }
      ],
      "sheetType": "full",
      "needsCoreStats": false,
      "assets": [
        {
          "type": "image",
          "label": "Registro visual de Viscerme de Lodo Menor",
          "url": "./assets/bestiary/viscerme-de-lodo-menor.jpg"
        }
      ],
      "source": "Livro 3, 2.20",
      "schemaVersion": 1,
      "image": "./assets/bestiary/viscerme-de-lodo-menor.jpg"
    },
    {
      "id": "livro3-2-21-viscerme-de-lodo-instavel",
      "category": "monster",
      "name": "Viscerme de Lodo Instável",
      "tier": "E",
      "type": "lodo biológico-cósmico instável",
      "role": "controlador e ameaça ambiental",
      "size": "médio",
      "pv": 16,
      "ca": 9,
      "movement": "5 m; 7 m em lama ou água rasa",
      "habitat": "zonas pantanosas contaminadas por Falaris, poços antigos e ruínas alagadas",
      "behavior": "",
      "attributes": "FOR 12/MOD +1; REF 8/MOD -1; CON 14/MOD +2; INT 2/MOD -4; MEN 8/MOD -1; PRE 4/MOD -3",
      "attacks": "◆ Ataques: Tentáculo Ácido, 1d6 concussão/ácido; Abraço Viscoso, 1d4 ácido por rodada contra alvo Imobilizado.",
      "abilities": "◆ Habilidade — Instabilidade Cósmica: se for destruído por dano cósmico, role 1d6. Em 1, explode em ácido; em 2-3, divide-se em dois Viscermes de Lodo Menores; em 4-6, dissolve normalmente.\n◆ Habilidade — Contaminar Cubo: se um Cubo de Suprimentos aberto estiver adjacente, uma falha ou erro crítico na cena pode contaminá-lo.",
      "resistances": "Resistências: tóxico comum e concussão leve.",
      "weaknesses": "Fraquezas: fogo causa +1 dano; frio intenso reduz seu movimento.",
      "senses": "Sentidos: vibração e percepção rudimentar de calor.",
      "moral": "Moral: tenta se fundir ao terreno quando cai abaixo da metade dos PV.",
      "resources": "◆ Recursos coletáveis: núcleo instável, resíduo ácido, lodo cósmico fraco e amostra contaminada.",
      "campaign": "◆ Uso em campanha: bom para cenas de pântano onde a maior ameaça é perder movimento, recurso ou cubo.\nFONTE OFICIAL // Livro 3, 4.8",
      "summary": "◆ Uso em campanha: bom para cenas de pântano onde a maior ameaça é perder movimento, recurso ou cubo.\nFONTE OFICIAL // Livro 3, 4.8",
      "tags": [
        "E",
        "lodo biológico-cósmico instável",
        "controlador e ameaça ambiental",
        "médio"
      ],
      "details": [
        {
          "label": "Resumo",
          "items": [
            "REGISTRO VISUAL // E // lodo biológico-cósmico instável",
            "Tier: E",
            "Tipo: lodo biológico-cósmico instável",
            "Papel: controlador e ameaça ambiental",
            "Tamanho: médio",
            "Habitat: zonas pantanosas contaminadas por Falaris, poços antigos e ruínas alagadas",
            "PV: 16",
            "CA: 9",
            "Movimento: 5 m; 7 m em lama ou água rasa",
            "Atributos importantes: FOR 12/MOD +1; REF 8/MOD -1; CON 14/MOD +2; INT 2/MOD -4; MEN 8/MOD -1; PRE 4/MOD -3",
            "◆ Ataques: Tentáculo Ácido, 1d6 concussão/ácido; Abraço Viscoso, 1d4 ácido por rodada contra alvo Imobilizado.",
            "◆ Habilidade — Instabilidade Cósmica: se for destruído por dano cósmico, role 1d6. Em 1, explode em ácido; em 2-3, divide-se em dois Viscermes de Lodo Menores; em 4-6, dissolve normalmente.",
            "◆ Habilidade — Contaminar Cubo: se um Cubo de Suprimentos aberto estiver adjacente, uma falha ou erro crítico na cena pode contaminá-lo.",
            "Resistências: tóxico comum e concussão leve.",
            "Fraquezas: fogo causa +1 dano; frio intenso reduz seu movimento.",
            "Sentidos: vibração e percepção rudimentar de calor.",
            "Moral: tenta se fundir ao terreno quando cai abaixo da metade dos PV.",
            "◆ Recursos coletáveis: núcleo instável, resíduo ácido, lodo cósmico fraco e amostra contaminada.",
            "◆ Uso em campanha: bom para cenas de pântano onde a maior ameaça é perder movimento, recurso ou cubo.",
            "FONTE OFICIAL // Livro 3, 4.8"
          ]
        }
      ],
      "sheetType": "full",
      "needsCoreStats": false,
      "assets": [
        {
          "type": "image",
          "label": "Registro visual de Viscerme de Lodo Instável",
          "url": "./assets/bestiary/viscerme-de-lodo-instavel.jpg"
        }
      ],
      "source": "Livro 3, 2.21",
      "schemaVersion": 1,
      "image": "./assets/bestiary/viscerme-de-lodo-instavel.jpg"
    },
    {
      "id": "livro3-2-22-voraxio-alado-comum",
      "category": "monster",
      "name": "Voráxio Alado Comum",
      "tier": "F",
      "type": "predador alado de bando",
      "role": "enxame leve, perseguidor e caçador de feridos",
      "size": "pequeno",
      "pv": 8,
      "ca": 10,
      "movement": "8 m terrestre; voo 12 m",
      "habitat": "céu baixo, pântanos, florestas enevoadas, torres abandonadas e rotas abertas",
      "behavior": "",
      "attributes": "FOR 10/MOD +0; REF 14/MOD +2; CON 8/MOD -1; INT 4/MOD -3; MEN 8/MOD -1; PRE 6/MOD -2",
      "attacks": "Ataque: Mordida Aérea, 1d4+1 perfurante.",
      "abilities": "◆ Habilidade — Investida de Voo: uma vez por cena, se mergulhar de pelo menos 6 m, o alvo faz JPR com REF ou fica Derrubado.\n◆ Habilidade — Caçadores de Sangue: recebe +1 em Busca para rastrear alvo Sangrando.\n◆ Habilidade — Mergulho em Bando: se dois ou mais Voráxios atacarem o mesmo alvo na rodada, o segundo recebe +1 no ataque.",
      "resistances": "Resistências: nenhuma especial.",
      "weaknesses": "Fraquezas: fumaça, som agudo e luz súbita.",
      "senses": "Sentidos: olfato de sangue e visão em baixa luz.",
      "moral": "Moral: foge se metade do bando cair.",
      "resources": "Recursos coletáveis: presa afiada, asa membranosa e sangue residual.",
      "campaign": "◆ Uso em campanha: ameaça inicial de céu baixo e perseguição de viajantes feridos.\nFONTE OFICIAL // Livro 3, 4.13",
      "summary": "◆ Uso em campanha: ameaça inicial de céu baixo e perseguição de viajantes feridos.\nFONTE OFICIAL // Livro 3, 4.13",
      "tags": [
        "F",
        "predador alado de bando",
        "enxame leve, perseguidor e caçador de feridos",
        "pequeno"
      ],
      "details": [
        {
          "label": "Resumo",
          "items": [
            "REGISTRO VISUAL // F // predador alado de bando",
            "Tier: F",
            "Tipo: predador alado de bando",
            "Papel: enxame leve, perseguidor e caçador de feridos",
            "Tamanho: pequeno",
            "Habitat: céu baixo, pântanos, florestas enevoadas, torres abandonadas e rotas abertas",
            "PV: 8",
            "CA: 10",
            "Movimento: 8 m terrestre; voo 12 m",
            "Atributos importantes: FOR 10/MOD +0; REF 14/MOD +2; CON 8/MOD -1; INT 4/MOD -3; MEN 8/MOD -1; PRE 6/MOD -2",
            "Ataque: Mordida Aérea, 1d4+1 perfurante.",
            "◆ Habilidade — Investida de Voo: uma vez por cena, se mergulhar de pelo menos 6 m, o alvo faz JPR com REF ou fica Derrubado.",
            "◆ Habilidade — Caçadores de Sangue: recebe +1 em Busca para rastrear alvo Sangrando.",
            "◆ Habilidade — Mergulho em Bando: se dois ou mais Voráxios atacarem o mesmo alvo na rodada, o segundo recebe +1 no ataque.",
            "Resistências: nenhuma especial.",
            "Fraquezas: fumaça, som agudo e luz súbita.",
            "Sentidos: olfato de sangue e visão em baixa luz.",
            "Moral: foge se metade do bando cair.",
            "Recursos coletáveis: presa afiada, asa membranosa e sangue residual.",
            "◆ Uso em campanha: ameaça inicial de céu baixo e perseguição de viajantes feridos.",
            "FONTE OFICIAL // Livro 3, 4.13"
          ]
        }
      ],
      "sheetType": "full",
      "needsCoreStats": false,
      "assets": [
        {
          "type": "image",
          "label": "Registro visual de Voráxio Alado Comum",
          "url": "./assets/bestiary/voraxio-alado-comum.jpg"
        }
      ],
      "source": "Livro 3, 2.22",
      "schemaVersion": 1,
      "image": "./assets/bestiary/voraxio-alado-comum.jpg"
    },
    {
      "id": "livro3-2-23-voraxio-matriarca",
      "category": "monster",
      "name": "Voráxio Matriarca",
      "tier": "D",
      "type": "predador alado dominante",
      "role": "chefe de ninho e comandante de bando",
      "size": "médio grande",
      "pv": 34,
      "ca": 13,
      "movement": "8 m terrestre; voo 15 m",
      "habitat": "ninhos em torres, penhascos, árvores altas e ruínas abertas",
      "behavior": "",
      "attributes": "FOR 14/MOD +2; REF 16/MOD +3; CON 14/MOD +2; INT 6/MOD -2; MEN 10/MOD +0; PRE 12/MOD +1",
      "attacks": "◆ Ataques: Mordida Dilacerante, 2d6 perfurante; Garras de Mergulho, 1d8 cortante.",
      "abilities": "◆ Habilidade — Grito de Bando: uma vez por cena, todos os Voráxios aliados podem se mover 3 m sem gastar ação.\n◆ Habilidade — Mergulho Esmagador: se mergulhar de altura, o alvo faz JPR com REF. Em falha, sofre dano e fica Derrubado.",
      "resistances": "Resistências: resistência leve contra frio ambiental.",
      "weaknesses": "Fraquezas: dano ao ninho, fumaça densa e espaço sem altura.",
      "senses": "Sentidos: visão noturna, olfato de sangue e audição aguçada.",
      "moral": "◆ Moral: defende ovos e filhotes, mas pode abandonar caça se o ninho estiver ameaçado.",
      "resources": "◆ Recursos coletáveis: presa maior, asa membranosa resistente, glândula de chamado e sangue residual.",
      "campaign": "◆ Uso em campanha: chefe de ataque noturno a colônia ou de ninho em área elevada.\nFONTE OFICIAL // Livro 3, 4.14",
      "summary": "◆ Uso em campanha: chefe de ataque noturno a colônia ou de ninho em área elevada.\nFONTE OFICIAL // Livro 3, 4.14",
      "tags": [
        "D",
        "predador alado dominante",
        "chefe de ninho e comandante de bando",
        "médio grande"
      ],
      "details": [
        {
          "label": "Resumo",
          "items": [
            "REGISTRO VISUAL // D // predador alado dominante",
            "Tier: D",
            "Tipo: predador alado dominante",
            "Papel: chefe de ninho e comandante de bando",
            "Tamanho: médio grande",
            "Habitat: ninhos em torres, penhascos, árvores altas e ruínas abertas",
            "PV: 34",
            "CA: 13",
            "Movimento: 8 m terrestre; voo 15 m",
            "Atributos importantes: FOR 14/MOD +2; REF 16/MOD +3; CON 14/MOD +2; INT 6/MOD -2; MEN 10/MOD +0; PRE 12/MOD +1",
            "◆ Ataques: Mordida Dilacerante, 2d6 perfurante; Garras de Mergulho, 1d8 cortante.",
            "◆ Habilidade — Grito de Bando: uma vez por cena, todos os Voráxios aliados podem se mover 3 m sem gastar ação.",
            "◆ Habilidade — Mergulho Esmagador: se mergulhar de altura, o alvo faz JPR com REF. Em falha, sofre dano e fica Derrubado.",
            "Resistências: resistência leve contra frio ambiental.",
            "Fraquezas: dano ao ninho, fumaça densa e espaço sem altura.",
            "Sentidos: visão noturna, olfato de sangue e audição aguçada.",
            "◆ Moral: defende ovos e filhotes, mas pode abandonar caça se o ninho estiver ameaçado.",
            "◆ Recursos coletáveis: presa maior, asa membranosa resistente, glândula de chamado e sangue residual.",
            "◆ Uso em campanha: chefe de ataque noturno a colônia ou de ninho em área elevada.",
            "FONTE OFICIAL // Livro 3, 4.14"
          ]
        }
      ],
      "sheetType": "full",
      "needsCoreStats": false,
      "assets": [
        {
          "type": "image",
          "label": "Registro visual de Voráxio Matriarca",
          "url": "./assets/bestiary/voraxio-matriarca.jpg"
        }
      ],
      "source": "Livro 3, 2.23",
      "schemaVersion": 1,
      "image": "./assets/bestiary/voraxio-matriarca.jpg"
    },
    {
      "id": "livro3-2-24-tyrakth-cristalino",
      "category": "monster",
      "name": "Tyrakth Cristalino",
      "tier": "B",
      "type": "megafauna cósmica/cristalina",
      "role": "chefe físico, tanque e evento de terreno",
      "size": "grande ou enorme",
      "pv": 80,
      "ca": 16,
      "movement": "7 m. Cosmos: 3",
      "habitat": "crateras, cavernas cristalinas, regiões de ressonância e antigas zonas de impacto",
      "behavior": "",
      "attributes": "FOR 20/MOD +5; REF 8/MOD -1; CON 20/MOD +5; INT 4/MOD -3; MEN 12/MOD +1; PRE 16/MOD +3",
      "attacks": "◆ Ataques: Pisada Sísmica, 2d6 concussão; Chifre Cristalino, 2d8 perfurante/cósmico.",
      "abilities": "◆ Habilidade — Rugido do Sol Morto: uma vez por cena, todos em alcance médio fazem JPC com PRE. Em falha, sofrem Medo por 1 rodada ou +1 Estresse.\nHabilidade — Carapaça Cristalina: reduz 2 de dano físico comum.\n◆ Habilidade — Ressonância Cósmica: perto de cristais ativos, recupera 1 Cosmos por rodada até o limite definido pelo Mestre.",
      "resistances": "",
      "weaknesses": "◆ Fraqueza — Juntas Cristalinas: após ataques pesados, expõe juntas. Descobrir exige Biologia, Busca ou Percepção Cósmica, conforme a abordagem.",
      "senses": "Sentidos: percepção de vibração, olfato e sensibilidade a cristais.",
      "moral": "◆ Moral: não caça sem motivo. Defende território e pode ignorar alvos pequenos até ser provocado.",
      "resources": "◆ Recursos coletáveis: escama cristalina, fragmento de carapaça, cristal de ressonância e material de Tier alto.",
      "campaign": "◆ Uso em campanha: não é encontro aleatório. É obstáculo, chefe de região ou ameaça que o grupo talvez precise desviar, não matar.\nFONTE OFICIAL // Livro 3, 4.18",
      "summary": "◆ Uso em campanha: não é encontro aleatório. É obstáculo, chefe de região ou ameaça que o grupo talvez precise desviar, não matar.\nFONTE OFICIAL // Livro 3, 4.18",
      "tags": [
        "B",
        "megafauna cósmica/cristalina",
        "chefe físico, tanque e evento de terreno",
        "grande ou enorme"
      ],
      "details": [
        {
          "label": "Resumo",
          "items": [
            "REGISTRO VISUAL // B // megafauna cósmica/cristalina",
            "Tier: B",
            "Tipo: megafauna cósmica/cristalina",
            "Papel: chefe físico, tanque e evento de terreno",
            "Tamanho: grande ou enorme",
            "Habitat: crateras, cavernas cristalinas, regiões de ressonância e antigas zonas de impacto",
            "PV: 80",
            "CA: 16",
            "Movimento: 7 m. Cosmos: 3",
            "Atributos importantes: FOR 20/MOD +5; REF 8/MOD -1; CON 20/MOD +5; INT 4/MOD -3; MEN 12/MOD +1; PRE 16/MOD +3",
            "◆ Ataques: Pisada Sísmica, 2d6 concussão; Chifre Cristalino, 2d8 perfurante/cósmico.",
            "◆ Habilidade — Rugido do Sol Morto: uma vez por cena, todos em alcance médio fazem JPC com PRE. Em falha, sofrem Medo por 1 rodada ou +1 Estresse.",
            "Habilidade — Carapaça Cristalina: reduz 2 de dano físico comum.",
            "◆ Habilidade — Ressonância Cósmica: perto de cristais ativos, recupera 1 Cosmos por rodada até o limite definido pelo Mestre.",
            "◆ Fraqueza — Juntas Cristalinas: após ataques pesados, expõe juntas. Descobrir exige Biologia, Busca ou Percepção Cósmica, conforme a abordagem.",
            "Sentidos: percepção de vibração, olfato e sensibilidade a cristais.",
            "◆ Moral: não caça sem motivo. Defende território e pode ignorar alvos pequenos até ser provocado.",
            "◆ Recursos coletáveis: escama cristalina, fragmento de carapaça, cristal de ressonância e material de Tier alto.",
            "◆ Uso em campanha: não é encontro aleatório. É obstáculo, chefe de região ou ameaça que o grupo talvez precise desviar, não matar.",
            "FONTE OFICIAL // Livro 3, 4.18"
          ]
        }
      ],
      "sheetType": "full",
      "needsCoreStats": false,
      "assets": [
        {
          "type": "image",
          "label": "Registro visual de Tyrakth Cristalino",
          "url": "./assets/bestiary/tyrakth-cristalino.jpg"
        }
      ],
      "source": "Livro 3, 2.24",
      "schemaVersion": 1,
      "image": "./assets/bestiary/tyrakth-cristalino.jpg"
    },
    {
      "id": "livro3-2-25-tyrakth-desperto",
      "category": "monster",
      "name": "Tyrakth Desperto",
      "tier": "A",
      "type": "megafauna ancestral tocada pelo Cosmos",
      "role": "ameaça lendária, chefe de região e força da natureza",
      "size": "enorme",
      "pv": 125,
      "ca": 18,
      "movement": "8 m. Cosmos: 5",
      "habitat": "vales cristalinos, montanhas antigas, ruínas abertas e zonas onde Tarantus parece responder ao Cosmos",
      "behavior": "",
      "attributes": "FOR 22/MOD +6; REF 8/MOD -1; CON 22/MOD +6; INT 6/MOD -2; MEN 16/MOD +3; PRE 18/MOD +4",
      "attacks": "◆ Ataques: Investida Telúrica, 2d6 concussão em linha; Chifre Ancestral, 2d8 perfurante/cósmico; Pisoteio, 2d6 concussão em área próxima.",
      "abilities": "◆ Habilidade — Passos de Terremoto: sempre que se move mais de 6 m, criaturas próximas fazem JPR com REF ou ficam Derrubadas.\n◆ Habilidade — Couraça Viva: reduz 2 de dano físico comum e possui resistência leve contra dano cósmico fraco.\n◆ Habilidade — Chamado Mineral: cristais próximos vibram; sensores e focos podem sofrer interferência se o Mestre quiser aumentar a tensão.\n◆ Habilidade — Evento, não Encontro: o Mestre deve oferecer sinais, rotas de fuga, objetivos alternativos e consequências ambientais.",
      "resistances": "",
      "weaknesses": "◆ Fraquezas: juntas cristalinas, olhos, parte inferior da mandíbula e símbolos de contenção antigos.",
      "senses": "Sentidos: vibração profunda, olfato e percepção de energia mineral.",
      "moral": "◆ Moral: não foge de ameaça pequena. Pode abandonar combate se a invasão terminar ou se o território for respeitado.",
      "resources": "◆ Recursos coletáveis: placa ancestral, cristal vivo, chifre desperto e fragmento de couraça cósmica.",
      "campaign": "◆ Uso em campanha: ameaça de arco avançado. Sobreviver ou redirecionar o Tyrakth pode ser vitória suficiente.\nFONTE OFICIAL // Livro 3, 4.19",
      "summary": "◆ Uso em campanha: ameaça de arco avançado. Sobreviver ou redirecionar o Tyrakth pode ser vitória suficiente.\nFONTE OFICIAL // Livro 3, 4.19",
      "tags": [
        "A",
        "megafauna ancestral tocada pelo Cosmos",
        "ameaça lendária, chefe de região e força da natureza",
        "enorme"
      ],
      "details": [
        {
          "label": "Resumo",
          "items": [
            "REGISTRO VISUAL // A // megafauna ancestral tocada pelo Cosmos",
            "Tier: A",
            "Tipo: megafauna ancestral tocada pelo Cosmos",
            "Papel: ameaça lendária, chefe de região e força da natureza",
            "Tamanho: enorme",
            "Habitat: vales cristalinos, montanhas antigas, ruínas abertas e zonas onde Tarantus parece responder ao Cosmos",
            "PV: 125",
            "CA: 18",
            "Movimento: 8 m. Cosmos: 5",
            "Atributos importantes: FOR 22/MOD +6; REF 8/MOD -1; CON 22/MOD +6; INT 6/MOD -2; MEN 16/MOD +3; PRE 18/MOD +4",
            "◆ Ataques: Investida Telúrica, 2d6 concussão em linha; Chifre Ancestral, 2d8 perfurante/cósmico; Pisoteio, 2d6 concussão em área próxima.",
            "◆ Habilidade — Passos de Terremoto: sempre que se move mais de 6 m, criaturas próximas fazem JPR com REF ou ficam Derrubadas.",
            "◆ Habilidade — Couraça Viva: reduz 2 de dano físico comum e possui resistência leve contra dano cósmico fraco.",
            "◆ Habilidade — Chamado Mineral: cristais próximos vibram; sensores e focos podem sofrer interferência se o Mestre quiser aumentar a tensão.",
            "◆ Habilidade — Evento, não Encontro: o Mestre deve oferecer sinais, rotas de fuga, objetivos alternativos e consequências ambientais.",
            "◆ Fraquezas: juntas cristalinas, olhos, parte inferior da mandíbula e símbolos de contenção antigos.",
            "Sentidos: vibração profunda, olfato e percepção de energia mineral.",
            "◆ Moral: não foge de ameaça pequena. Pode abandonar combate se a invasão terminar ou se o território for respeitado.",
            "◆ Recursos coletáveis: placa ancestral, cristal vivo, chifre desperto e fragmento de couraça cósmica.",
            "◆ Uso em campanha: ameaça de arco avançado. Sobreviver ou redirecionar o Tyrakth pode ser vitória suficiente.",
            "FONTE OFICIAL // Livro 3, 4.19"
          ]
        }
      ],
      "sheetType": "full",
      "needsCoreStats": false,
      "assets": [
        {
          "type": "image",
          "label": "Registro visual de Tyrakth Desperto",
          "url": "./assets/bestiary/tyrakth-desperto.jpg"
        }
      ],
      "source": "Livro 3, 2.25",
      "schemaVersion": 1,
      "image": "./assets/bestiary/tyrakth-desperto.jpg"
    },
    {
      "id": "livro3-2-26-silvari-das-folhas",
      "category": "monster",
      "name": "Silvari das Folhas",
      "tier": "D",
      "type": "predador natural",
      "role": "emboscador/predador rápido",
      "size": "médio",
      "pv": 22,
      "ca": 14,
      "movement": "10 m, escalada 6 m",
      "habitat": "florestas, pântanos densos, jardins antigos, ruínas tomadas por vegetação",
      "behavior": "",
      "attributes": "REF 16/MOD +3",
      "attacks": "◆ Garras Finas: 1d6 cortante.\n◆ Mordida: 1d6 perfurante.\n◆ Se atacar alvo que ainda não o percebeu, causa +1d4 dano.",
      "abilities": "◆ Recebe +1 em Furtividade em vegetação, sombra natural ou ruínas cobertas por plantas.\n◆ Se atacar alvo que ainda não o percebeu, causa +1d4 dano.\n◆ Após atacar, pode se mover 2 m sem provocar reação, se houver cobertura natural próxima.",
      "resistances": "",
      "weaknesses": "◆ Fogo e destruição de vegetação o deixam agressivo ou assustado.",
      "senses": "◆ Visão em baixa luz.\n◆ Olfato.\n◆ Audição fina.",
      "moral": "◆ Recua se o território deixar de ser ameaçado. Luta ferozmente por filhotes.",
      "resources": "◆ Garras finas.\n◆ Couro flexível.\n◆ Folículos camuflados.",
      "campaign": "◆ Silvari das Folhas funciona bem em aventuras onde a natureza de Tarantus entra em conflito com exploração, coleta ou expansão.\nFONTE OFICIAL // Livro 3, 2.15",
      "summary": "◆ Silvari das Folhas funciona bem em aventuras onde a natureza de Tarantus entra em conflito com exploração, coleta ou expansão.\nFONTE OFICIAL // Livro 3, 2.15",
      "tags": [
        "D",
        "predador natural",
        "emboscador/predador rápido",
        "médio"
      ],
      "details": [
        {
          "label": "Resumo",
          "items": [
            "REGISTRO VISUAL // D // predador natural",
            "Tier: D",
            "Tipo: predador natural",
            "Papel: emboscador/predador rápido",
            "Tamanho: médio",
            "Habitat: florestas, pântanos densos, jardins antigos, ruínas tomadas por vegetação",
            "PV: 22",
            "CA: 14",
            "Movimento: 10 m, escalada 6 m",
            "Atributos importantes: REF 16/MOD +3",
            "◆ REF 16/MOD +3.",
            "◆ MEN 12/MOD +1.",
            "◆ FOR 12/MOD +1."
          ]
        },
        {
          "label": "Ataques",
          "items": [
            "◆ Garras Finas: 1d6 cortante.",
            "◆ Mordida: 1d6 perfurante."
          ]
        },
        {
          "label": "Habilidade — Camuflagem Natural",
          "items": [
            "◆ Recebe +1 em Furtividade em vegetação, sombra natural ou ruínas cobertas por plantas."
          ]
        },
        {
          "label": "Habilidade — Ataque Silencioso",
          "items": [
            "◆ Se atacar alvo que ainda não o percebeu, causa +1d4 dano."
          ]
        },
        {
          "label": "Habilidade — Recuo Ágil",
          "items": [
            "◆ Após atacar, pode se mover 2 m sem provocar reação, se houver cobertura natural próxima."
          ]
        },
        {
          "label": "Fraquezas",
          "items": [
            "◆ Fogo e destruição de vegetação o deixam agressivo ou assustado."
          ]
        },
        {
          "label": "Sentidos",
          "items": [
            "◆ Visão em baixa luz.",
            "◆ Olfato.",
            "◆ Audição fina."
          ]
        },
        {
          "label": "Moral",
          "items": [
            "◆ Recua se o território deixar de ser ameaçado. Luta ferozmente por filhotes."
          ]
        },
        {
          "label": "Recursos coletáveis",
          "items": [
            "◆ Garras finas.",
            "◆ Couro flexível.",
            "◆ Folículos camuflados."
          ]
        },
        {
          "label": "Uso em campanha",
          "items": [
            "◆ Silvari das Folhas funciona bem em aventuras onde a natureza de Tarantus entra em conflito com exploração, coleta ou expansão.",
            "FONTE OFICIAL // Livro 3, 2.15"
          ]
        }
      ],
      "sheetType": "full",
      "needsCoreStats": false,
      "assets": [
        {
          "type": "image",
          "label": "Registro visual de Silvari das Folhas",
          "url": "./assets/bestiary/silvari-das-folhas.jpg"
        }
      ],
      "source": "Livro 3, 2.26",
      "schemaVersion": 1,
      "image": "./assets/bestiary/silvari-das-folhas.jpg"
    },
    {
      "id": "livro3-2-27-silvari-luminar",
      "category": "monster",
      "name": "Silvari Luminar",
      "tier": "C",
      "type": "criatura natural/cósmica leve",
      "role": "emboscador/controlador",
      "size": "médio",
      "pv": 34,
      "ca": 15,
      "movement": "10 m, escalada 8 m",
      "habitat": "bosques de cristais, ruínas verdes, áreas de ressonância Kairi",
      "behavior": "",
      "attributes": "REF 16/MOD +3",
      "attacks": "◆ Garra Luminar: 1d8 cortante.\n◆ Pulso de Luz: 1d6 cósmico ou luminoso em curto alcance.",
      "abilities": "◆ Uma vez por cena, emite luz pulsante. Alvos próximos fazem JPC com MEN. Em falha, ficam Tontos até o fim do próximo turno.\n◆ Enquanto estiver em vegetação densa ou luz fragmentada, pode se reposicionar 4 m como reação ao ser atacado, uma vez por rodada.\n◆ Recebe +1 em testes enquanto defender um local de ressonância.",
      "resistances": "",
      "weaknesses": "◆ Metal queimado, fogo industrial e ruído tecnológico intenso podem perturbá-lo.",
      "senses": "◆ Percepção Cósmica instintiva.\n◆ Visão em baixa luz.",
      "moral": "◆ Evita matar sem necessidade. Pode deixar invasores vivos se recuarem.",
      "resources": "◆ Pelo luminar.\n◆ Cristal orgânico pequeno.\n◆ Garra translúcida.",
      "campaign": "◆ Silvari Luminar é ideal para conflitos morais: matar a criatura pode ser possível, mas talvez profane um lugar importante.\nFONTE OFICIAL // Livro 3, 2.16",
      "summary": "◆ Silvari Luminar é ideal para conflitos morais: matar a criatura pode ser possível, mas talvez profane um lugar importante.\nFONTE OFICIAL // Livro 3, 2.16",
      "tags": [
        "C",
        "criatura natural/cósmica leve",
        "emboscador/controlador",
        "médio"
      ],
      "details": [
        {
          "label": "Resumo",
          "items": [
            "REGISTRO VISUAL // C // criatura natural/cósmica leve",
            "Tier: C",
            "Tipo: criatura natural/cósmica leve",
            "Papel: emboscador/controlador",
            "Tamanho: médio",
            "Habitat: bosques de cristais, ruínas verdes, áreas de ressonância Kairi",
            "PV: 34",
            "CA: 15",
            "Movimento: 10 m, escalada 8 m",
            "Atributos importantes: REF 16/MOD +3",
            "◆ REF 16/MOD +3.",
            "◆ MEN 14/MOD +2.",
            "◆ PRE 12/MOD +1."
          ]
        },
        {
          "label": "Ataques",
          "items": [
            "◆ Garra Luminar: 1d8 cortante.",
            "◆ Pulso de Luz: 1d6 cósmico ou luminoso em curto alcance."
          ]
        },
        {
          "label": "Habilidade — Brilho Hipnótico",
          "items": [
            "◆ Uma vez por cena, emite luz pulsante. Alvos próximos fazem JPC com MEN. Em falha, ficam Tontos até o fim do próximo turno."
          ]
        },
        {
          "label": "Habilidade — Passo Entre Folhas",
          "items": [
            "◆ Enquanto estiver em vegetação densa ou luz fragmentada, pode se reposicionar 4 m como reação ao ser atacado, uma vez por rodada."
          ]
        },
        {
          "label": "Habilidade — Guardião Natural",
          "items": [
            "◆ Recebe +1 em testes enquanto defender um local de ressonância."
          ]
        },
        {
          "label": "Fraquezas",
          "items": [
            "◆ Metal queimado, fogo industrial e ruído tecnológico intenso podem perturbá-lo."
          ]
        },
        {
          "label": "Sentidos",
          "items": [
            "◆ Percepção Cósmica instintiva.",
            "◆ Visão em baixa luz."
          ]
        },
        {
          "label": "Moral",
          "items": [
            "◆ Evita matar sem necessidade. Pode deixar invasores vivos se recuarem."
          ]
        },
        {
          "label": "Recursos coletáveis",
          "items": [
            "◆ Pelo luminar.",
            "◆ Cristal orgânico pequeno.",
            "◆ Garra translúcida."
          ]
        },
        {
          "label": "Uso em campanha",
          "items": [
            "◆ Silvari Luminar é ideal para conflitos morais: matar a criatura pode ser possível, mas talvez profane um lugar importante.",
            "FONTE OFICIAL // Livro 3, 2.16"
          ]
        }
      ],
      "sheetType": "full",
      "needsCoreStats": false,
      "assets": [
        {
          "type": "image",
          "label": "Registro visual de Silvari Luminar",
          "url": "./assets/bestiary/silvari-luminar.jpg"
        }
      ],
      "source": "Livro 3, 2.27",
      "schemaVersion": 1,
      "image": "./assets/bestiary/silvari-luminar.jpg"
    },
    {
      "id": "livro3-2-28-massa-de-teia-sombra",
      "category": "monster",
      "name": "Massa de Teia-Sombra",
      "tier": "D",
      "type": "ameaça ambiental/cósmica leve",
      "role": "controlador/terreno perigoso",
      "size": "área",
      "pv": 18,
      "ca": 8,
      "movement": "nenhum, mas pode se contrair em área próxima",
      "habitat": "ruínas escuras, ninhos antigos, zonas de baixa luz e ressonância",
      "behavior": "",
      "attributes": "CON 14/MOD +2",
      "attacks": "◆ Laço de Teia: alvo na área faz JPR com REF ou fica Imobilizado.",
      "abilities": "◆ Fontes de luz pequenas dentro da área têm alcance reduzido.\n◆ Quando uma criatura falha ao se mover dentro da área, pode ser puxada 2 m.\n◆ Depois que uma criatura se debate, a Teia-Sombra recebe +1 para prendê-la novamente até o fim da cena.",
      "resistances": "",
      "weaknesses": "◆ Fogo.\n◆ Luz intensa.\n◆ Corte preciso no núcleo.",
      "senses": "◆ Vibração.\n◆ Percepção de calor fraca.",
      "moral": "◆ Não possui moral. Reage a movimento e energia.",
      "resources": "◆ Fibra de sombra.\n◆ Resíduo pegajoso.\n◆ Amostra de teia alterada.",
      "campaign": "◆ Ideal como terreno perigoso em ninhos, cavernas e ruínas cósmicas.\nFONTE OFICIAL // Livro 3, 2.31",
      "summary": "◆ Ideal como terreno perigoso em ninhos, cavernas e ruínas cósmicas.\nFONTE OFICIAL // Livro 3, 2.31",
      "tags": [
        "D",
        "ameaça ambiental/cósmica leve",
        "controlador/terreno perigoso",
        "área"
      ],
      "details": [
        {
          "label": "Resumo",
          "items": [
            "REGISTRO VISUAL // D // ameaça ambiental/cósmica leve",
            "Tier: D",
            "Tipo: ameaça ambiental/cósmica leve",
            "Papel: controlador/terreno perigoso",
            "Tamanho: área",
            "Habitat: ruínas escuras, ninhos antigos, zonas de baixa luz e ressonância",
            "PV: 18",
            "CA: 8",
            "Movimento: nenhum, mas pode se contrair em área próxima",
            "Atributos importantes: CON 14/MOD +2",
            "◆ CON 14/MOD +2.",
            "◆ MEN 10/MOD +0 ou +1 se for cósmica."
          ]
        },
        {
          "label": "Ataque",
          "items": [
            "◆ Laço de Teia: alvo na área faz JPR com REF ou fica Imobilizado."
          ]
        },
        {
          "label": "Habilidade — Abafar Luz",
          "items": [
            "◆ Fontes de luz pequenas dentro da área têm alcance reduzido."
          ]
        },
        {
          "label": "Habilidade — Puxão Repentino",
          "items": [
            "◆ Quando uma criatura falha ao se mover dentro da área, pode ser puxada 2 m."
          ]
        },
        {
          "label": "Habilidade — Memória de Movimento",
          "items": [
            "◆ Depois que uma criatura se debate, a Teia-Sombra recebe +1 para prendê-la novamente até o fim da cena."
          ]
        },
        {
          "label": "Fraquezas",
          "items": [
            "◆ Fogo.",
            "◆ Luz intensa.",
            "◆ Corte preciso no núcleo."
          ]
        },
        {
          "label": "Sentidos",
          "items": [
            "◆ Vibração.",
            "◆ Percepção de calor fraca."
          ]
        },
        {
          "label": "Moral",
          "items": [
            "◆ Não possui moral. Reage a movimento e energia."
          ]
        },
        {
          "label": "Recursos coletáveis",
          "items": [
            "◆ Fibra de sombra.",
            "◆ Resíduo pegajoso.",
            "◆ Amostra de teia alterada."
          ]
        },
        {
          "label": "Uso em campanha",
          "items": [
            "◆ Ideal como terreno perigoso em ninhos, cavernas e ruínas cósmicas.",
            "FONTE OFICIAL // Livro 3, 2.31"
          ]
        }
      ],
      "sheetType": "full",
      "needsCoreStats": false,
      "assets": [
        {
          "type": "image",
          "label": "Registro visual de Massa de Teia-Sombra",
          "url": "./assets/bestiary/massa-de-teia-sombra.jpg"
        }
      ],
      "source": "Livro 3, 2.28",
      "schemaVersion": 1,
      "image": "./assets/bestiary/massa-de-teia-sombra.jpg"
    },
    {
      "id": "livro3-2-29-fungo-irritante",
      "category": "monster",
      "name": "Fungo Irritante",
      "tier": "D",
      "type": "ameaça biológica ambiental",
      "role": "controlador/ambiente",
      "size": "área",
      "pv": 18,
      "ca": 9,
      "movement": "nenhum",
      "habitat": "cavernas, pântanos, ruínas úmidas, corpos antigos",
      "behavior": "",
      "attributes": "",
      "attacks": "◆ Nuvem de Esporos: sem dano ou 1d4 tóxico em exposição severa.",
      "abilities": "◆ Quem entra na área sem proteção faz JPF com CON. Em falha, fica Envenenado ou Tonto.\n◆ Quando o núcleo sofre dano cortante ou concussivo, libera uma nuvem maior.\n◆ Se houver Cubo de Suprimentos aberto na área, ele pode ser contaminado em falha ou sucesso parcial.",
      "resistances": "",
      "weaknesses": "◆ Fogo controlado.\n◆ Frio intenso.\n◆ Ventilação.\n◆ Selagem.",
      "senses": "◆ Nenhum.",
      "moral": "◆ Nenhuma.",
      "resources": "◆ Amostra fúngica.\n◆ Toxina.\n◆ Base para antídoto.",
      "campaign": "◆ Ameaça perfeita para missões de medicina, ruínas úmidas e pântanos.\nFONTE OFICIAL // Livro 3, 2.33",
      "summary": "◆ Ameaça perfeita para missões de medicina, ruínas úmidas e pântanos.\nFONTE OFICIAL // Livro 3, 2.33",
      "tags": [
        "D",
        "ameaça biológica ambiental",
        "controlador/ambiente",
        "área"
      ],
      "details": [
        {
          "label": "Resumo",
          "items": [
            "REGISTRO VISUAL // D // ameaça biológica ambiental",
            "Tier: D",
            "Tipo: ameaça biológica ambiental",
            "Papel: controlador/ambiente",
            "Tamanho: área",
            "Habitat: cavernas, pântanos, ruínas úmidas, corpos antigos",
            "PV: 18",
            "CA: 9",
            "Movimento: nenhum"
          ]
        },
        {
          "label": "Ataque",
          "items": [
            "◆ Nuvem de Esporos: sem dano ou 1d4 tóxico em exposição severa."
          ]
        },
        {
          "label": "Habilidade — Esporos Irritantes",
          "items": [
            "◆ Quem entra na área sem proteção faz JPF com CON. Em falha, fica Envenenado ou Tonto."
          ]
        },
        {
          "label": "Habilidade — Explosão de Esporos",
          "items": [
            "◆ Quando o núcleo sofre dano cortante ou concussivo, libera uma nuvem maior."
          ]
        },
        {
          "label": "Habilidade — Contaminar Cubo",
          "items": [
            "◆ Se houver Cubo de Suprimentos aberto na área, ele pode ser contaminado em falha ou sucesso parcial."
          ]
        },
        {
          "label": "Fraquezas",
          "items": [
            "◆ Fogo controlado.",
            "◆ Frio intenso.",
            "◆ Ventilação.",
            "◆ Selagem."
          ]
        },
        {
          "label": "Sentidos",
          "items": [
            "◆ Nenhum."
          ]
        },
        {
          "label": "Moral",
          "items": [
            "◆ Nenhuma."
          ]
        },
        {
          "label": "Recursos coletáveis",
          "items": [
            "◆ Amostra fúngica.",
            "◆ Toxina.",
            "◆ Base para antídoto."
          ]
        },
        {
          "label": "Uso em campanha",
          "items": [
            "◆ Ameaça perfeita para missões de medicina, ruínas úmidas e pântanos.",
            "FONTE OFICIAL // Livro 3, 2.33"
          ]
        }
      ],
      "sheetType": "full",
      "needsCoreStats": false,
      "assets": [
        {
          "type": "image",
          "label": "Registro visual de Fungo Irritante",
          "url": "./assets/bestiary/fungo-irritante.jpg"
        }
      ],
      "source": "Livro 3, 2.29",
      "schemaVersion": 1,
      "image": "./assets/bestiary/fungo-irritante.jpg"
    },
    {
      "id": "livro3-2-30-fungo-de-falaris",
      "category": "monster",
      "name": "Fungo de Falaris",
      "tier": "C",
      "type": "ameaça biológica/cósmica",
      "role": "controlador/ameaça ambiental",
      "size": "área",
      "pv": 32,
      "ca": 10,
      "movement": "crescimento lento fora de combate",
      "habitat": "zonas contaminadas por fragmentos cósmicos, ruínas antigas, cavernas azuis",
      "behavior": "",
      "attributes": "CON 18/MOD +4",
      "attacks": "◆ Esporos Luminares: JPF com CON ou JPC com MEN, conforme exposição.",
      "abilities": "◆ Quem falha no teste contra os esporos recebe visão fragmentada de um céu com três sóis e +1 Estresse.\n◆ Em sucesso parcial ou falha crítica dentro da área, uma armadura, cubo ou arma pode ganhar resíduo fúngico. Se não for limpo, pode causar interferência depois.\n◆ Personagens com chip de profissão ativo ou instável sofrem -1 no primeiro teste contra o fungo.",
      "resistances": "",
      "weaknesses": "◆ Fogo branco.\n◆ Selagem química.\n◆ Purificação cósmica controlada.",
      "senses": "◆ Percepção de energia fraca.",
      "moral": "◆ Nenhuma.",
      "resources": "◆ Esporo luminar.\n◆ Amostra cósmica-biológica.\n◆ Filamento azul.",
      "campaign": "◆ O Fungo de Falaris deve indicar contaminação maior. Ele não aparece sem motivo.\nFONTE OFICIAL // Livro 3, 2.34",
      "summary": "◆ O Fungo de Falaris deve indicar contaminação maior. Ele não aparece sem motivo.\nFONTE OFICIAL // Livro 3, 2.34",
      "tags": [
        "C",
        "ameaça biológica/cósmica",
        "controlador/ameaça ambiental",
        "área"
      ],
      "details": [
        {
          "label": "Resumo",
          "items": [
            "REGISTRO VISUAL // C // ameaça biológica/cósmica",
            "Tier: C",
            "Tipo: ameaça biológica/cósmica",
            "Papel: controlador/ameaça ambiental",
            "Tamanho: área",
            "Habitat: zonas contaminadas por fragmentos cósmicos, ruínas antigas, cavernas azuis",
            "PV: 32",
            "CA: 10",
            "Movimento: crescimento lento fora de combate",
            "Atributos importantes: CON 18/MOD +4",
            "◆ CON 18/MOD +4.",
            "◆ MEN 14/MOD +2."
          ]
        },
        {
          "label": "Ataque",
          "items": [
            "◆ Esporos Luminares: JPF com CON ou JPC com MEN, conforme exposição."
          ]
        },
        {
          "label": "Habilidade — Esporos de Memória",
          "items": [
            "◆ Quem falha no teste contra os esporos recebe visão fragmentada de um céu com três sóis e +1 Estresse."
          ]
        },
        {
          "label": "Habilidade — Crescimento em Equipamento",
          "items": [
            "◆ Em sucesso parcial ou falha crítica dentro da área, uma armadura, cubo ou arma pode ganhar resíduo fúngico. Se não for limpo, pode causar interferência depois."
          ]
        },
        {
          "label": "Habilidade — Reação ao Chip",
          "items": [
            "◆ Personagens com chip de profissão ativo ou instável sofrem -1 no primeiro teste contra o fungo."
          ]
        },
        {
          "label": "Fraquezas",
          "items": [
            "◆ Fogo branco.",
            "◆ Selagem química.",
            "◆ Purificação cósmica controlada."
          ]
        },
        {
          "label": "Sentidos",
          "items": [
            "◆ Percepção de energia fraca."
          ]
        },
        {
          "label": "Moral",
          "items": [
            "◆ Nenhuma."
          ]
        },
        {
          "label": "Recursos coletáveis",
          "items": [
            "◆ Esporo luminar.",
            "◆ Amostra cósmica-biológica.",
            "◆ Filamento azul."
          ]
        },
        {
          "label": "Uso em campanha",
          "items": [
            "◆ O Fungo de Falaris deve indicar contaminação maior. Ele não aparece sem motivo.",
            "FONTE OFICIAL // Livro 3, 2.34"
          ]
        }
      ],
      "sheetType": "full",
      "needsCoreStats": false,
      "assets": [
        {
          "type": "image",
          "label": "Registro visual de Fungo de Falaris",
          "url": "./assets/bestiary/fungo-de-falaris.jpg"
        }
      ],
      "source": "Livro 3, 2.30",
      "schemaVersion": 1,
      "image": "./assets/bestiary/fungo-de-falaris.jpg"
    },
    {
      "id": "livro3-2-31-drone-defeituoso",
      "category": "monster",
      "name": "Drone Defeituoso",
      "tier": "E",
      "type": "máquina",
      "role": "atirador/guardião simples",
      "size": "pequeno ou médio",
      "pv": 12,
      "ca": 12,
      "movement": "6 m ou voo curto 6 m",
      "habitat": "oficinas, torres, ruínas, instalações antigas",
      "behavior": "",
      "attributes": "REF 12/MOD +1",
      "attacks": "◆ Disparo Elétrico: 1d6 elétrico.",
      "abilities": "◆ Em crítico ou sucesso completo especial, um equipamento tecnológico simples do alvo sofre Jammed temporário ou falha até o fim da próxima rodada.\n◆ Pode ser confundido por credencial, senha, uniforme ou transmissão correta.",
      "resistances": "◆ Imune a veneno e doença.",
      "weaknesses": "◆ Pulso eletromagnético.\n◆ Hack.\n◆ Painel exposto.",
      "senses": "◆ Sensor de movimento.\n◆ Visão simples.",
      "moral": "◆ Não possui moral. Para se for desligado, hackeado ou se a ordem for satisfeita.",
      "resources": "◆ Microcircuitos.\n◆ Bateria simples.\n◆ Lente.\n◆ Núcleo danificado.",
      "campaign": "◆ Ameaça tecnológica inicial.\nFONTE OFICIAL // Livro 3, 2.36",
      "summary": "◆ Ameaça tecnológica inicial.\nFONTE OFICIAL // Livro 3, 2.36",
      "tags": [
        "E",
        "máquina",
        "atirador/guardião simples",
        "pequeno ou médio"
      ],
      "details": [
        {
          "label": "Resumo",
          "items": [
            "REGISTRO VISUAL // E // máquina",
            "Tier: E",
            "Tipo: máquina",
            "Papel: atirador/guardião simples",
            "Tamanho: pequeno ou médio",
            "Habitat: oficinas, torres, ruínas, instalações antigas",
            "PV: 12",
            "CA: 12",
            "Movimento: 6 m ou voo curto 6 m",
            "Atributos importantes: REF 12/MOD +1",
            "◆ REF 12/MOD +1.",
            "◆ CON 12/MOD +1.",
            "◆ INT 10/MOD +0."
          ]
        },
        {
          "label": "Ataque",
          "items": [
            "◆ Disparo Elétrico: 1d6 elétrico."
          ]
        },
        {
          "label": "Habilidade — Pulso de Interferência",
          "items": [
            "◆ Em crítico ou sucesso completo especial, um equipamento tecnológico simples do alvo sofre Jammed temporário ou falha até o fim da próxima rodada."
          ]
        },
        {
          "label": "Habilidade — Ordem Corrompida",
          "items": [
            "◆ Pode ser confundido por credencial, senha, uniforme ou transmissão correta."
          ]
        },
        {
          "label": "Resistências",
          "items": [
            "◆ Imune a veneno e doença."
          ]
        },
        {
          "label": "Fraquezas",
          "items": [
            "◆ Pulso eletromagnético.",
            "◆ Hack.",
            "◆ Painel exposto."
          ]
        },
        {
          "label": "Sentidos",
          "items": [
            "◆ Sensor de movimento.",
            "◆ Visão simples."
          ]
        },
        {
          "label": "Moral",
          "items": [
            "◆ Não possui moral. Para se for desligado, hackeado ou se a ordem for satisfeita."
          ]
        },
        {
          "label": "Recursos coletáveis",
          "items": [
            "◆ Microcircuitos.",
            "◆ Bateria simples.",
            "◆ Lente.",
            "◆ Núcleo danificado."
          ]
        },
        {
          "label": "Uso em campanha",
          "items": [
            "◆ Ameaça tecnológica inicial.",
            "FONTE OFICIAL // Livro 3, 2.36"
          ]
        }
      ],
      "sheetType": "full",
      "needsCoreStats": false,
      "assets": [
        {
          "type": "image",
          "label": "Registro visual de Drone Defeituoso",
          "url": "./assets/bestiary/drone-defeituoso.jpg"
        }
      ],
      "source": "Livro 3, 2.31",
      "schemaVersion": 1,
      "image": "./assets/bestiary/drone-defeituoso.jpg"
    },
    {
      "id": "livro3-2-32-guardiao-antigo",
      "category": "monster",
      "name": "Guardião Antigo",
      "tier": "C",
      "type": "máquina antiga",
      "role": "guardião/tanque",
      "size": "médio",
      "pv": 42,
      "ca": 15,
      "movement": "6 m",
      "habitat": "portas antigas, ruínas, corredores selados, câmaras de contenção",
      "behavior": "",
      "attributes": "FOR 16/MOD +3",
      "attacks": "◆ Golpe Mecânico: 1d10 concussão.",
      "abilities": "◆ Enquanto estiver protegendo uma área designada, recebe +1 CA.\n◆ Pode parar por 1 rodada se apresentado a símbolo, frase, chip ou credencial compatível.\n◆ Após sofrer crítico, revela ponto fraco. O próximo ataque contra ele recebe +1.\n◆ Antes do combate, pode emitir mensagem em Nytharûl ou linguagem corrompida.",
      "resistances": "◆ Imune a veneno e doença.\n◆ Redução 1 contra dano físico comum.",
      "weaknesses": "◆ Senha antiga.\n◆ Hack.\n◆ Dano elétrico preciso.\n◆ Símbolo correto.",
      "senses": "◆ Sensor de movimento.\n◆ Detecção de chip.",
      "moral": "◆ Não recua. Pode ser desligado por protocolo.",
      "resources": "◆ Placa antiga.\n◆ Núcleo energético.\n◆ Servomotor.\n◆ Inscrição.",
      "campaign": "◆ Guardião Antigo é ótimo para mostrar que ruínas possuem regras próprias.\nFONTE OFICIAL // Livro 3, 2.37",
      "summary": "◆ Guardião Antigo é ótimo para mostrar que ruínas possuem regras próprias.\nFONTE OFICIAL // Livro 3, 2.37",
      "tags": [
        "C",
        "máquina antiga",
        "guardião/tanque",
        "médio"
      ],
      "details": [
        {
          "label": "Resumo",
          "items": [
            "REGISTRO VISUAL // C // máquina antiga",
            "Tier: C",
            "Tipo: máquina antiga",
            "Papel: guardião/tanque",
            "Tamanho: médio",
            "Habitat: portas antigas, ruínas, corredores selados, câmaras de contenção",
            "PV: 42",
            "CA: 15",
            "Movimento: 6 m",
            "Atributos importantes: FOR 16/MOD +3",
            "◆ FOR 16/MOD +3.",
            "◆ CON 18/MOD +4.",
            "◆ INT 12/MOD +1.",
            "◆ MEN 10/MOD +0."
          ]
        },
        {
          "label": "Ataque",
          "items": [
            "◆ Golpe Mecânico: 1d10 concussão."
          ]
        },
        {
          "label": "Habilidade — Protocolo de Defesa",
          "items": [
            "◆ Enquanto estiver protegendo uma área designada, recebe +1 CA."
          ]
        },
        {
          "label": "Habilidade — Reconhecer Sinal",
          "items": [
            "◆ Pode parar por 1 rodada se apresentado a símbolo, frase, chip ou credencial compatível."
          ]
        },
        {
          "label": "Habilidade — Núcleo Exposto",
          "items": [
            "◆ Após sofrer crítico, revela ponto fraco. O próximo ataque contra ele recebe +1."
          ]
        },
        {
          "label": "Habilidade — Voz Antiga",
          "items": [
            "◆ Antes do combate, pode emitir mensagem em Nytharûl ou linguagem corrompida."
          ]
        },
        {
          "label": "Resistências",
          "items": [
            "◆ Imune a veneno e doença."
          ]
        },
        {
          "label": "Resistência contra medo",
          "items": [
            "◆ Redução 1 contra dano físico comum."
          ]
        },
        {
          "label": "Fraquezas",
          "items": [
            "◆ Senha antiga.",
            "◆ Hack.",
            "◆ Dano elétrico preciso.",
            "◆ Símbolo correto."
          ]
        },
        {
          "label": "Sentidos",
          "items": [
            "◆ Sensor de movimento.",
            "◆ Detecção de chip."
          ]
        },
        {
          "label": "Moral",
          "items": [
            "◆ Não recua. Pode ser desligado por protocolo."
          ]
        },
        {
          "label": "Recursos coletáveis",
          "items": [
            "◆ Placa antiga.",
            "◆ Núcleo energético.",
            "◆ Servomotor.",
            "◆ Inscrição."
          ]
        },
        {
          "label": "Uso em campanha",
          "items": [
            "◆ Guardião Antigo é ótimo para mostrar que ruínas possuem regras próprias.",
            "FONTE OFICIAL // Livro 3, 2.37"
          ]
        }
      ],
      "sheetType": "full",
      "needsCoreStats": false,
      "assets": [
        {
          "type": "image",
          "label": "Registro visual de Guardião Antigo",
          "url": "./assets/bestiary/guardiao-antigo.jpg"
        }
      ],
      "source": "Livro 3, 2.32",
      "schemaVersion": 1,
      "image": "./assets/bestiary/guardiao-antigo.jpg"
    },
    {
      "id": "livro3-2-33-sentinela-de-ruina",
      "category": "monster",
      "name": "Sentinela de Ruína",
      "tier": "B",
      "type": "máquina antiga de defesa",
      "role": "chefe/guardião",
      "size": "grande",
      "pv": 72,
      "ca": 17,
      "movement": "7 m",
      "habitat": "ruínas profundas, câmaras de portal, entradas seladas",
      "behavior": "",
      "attributes": "FOR 18/MOD +4",
      "attacks": "◆ Lâmina Mecânica: 1d10 cortante.\n◆ Canhão de Pulso: 1d10 energético.",
      "abilities": "◆ Uma vez por cena, cria campo que dificulta passagem. Área próxima vira terreno difícil até o fim da próxima rodada.\n◆ Se alguém falar frase correta em Nytharûl, apresentar símbolo válido ou resolver um teste de Tecnologia/Memória Cósmica, a Sentinela perde uma ação ou muda de modo.\n◆ Uma vez por rodada, quando sofre dano, pode girar placas e receber redução 2 contra esse ataque.\n◆ Ao cair abaixo da metade dos PV, aumenta dano em +1, mas expõe núcleo. Ataques contra o núcleo recebem +1 se os personagens identificarem a abertura.",
      "resistances": "◆ Imune a veneno, doença e medo comum.\n◆ Redução 2 contra físico comum.",
      "weaknesses": "◆ Núcleo exposto em Modo de Execução.\n◆ Comandos antigos.\n◆ Sobrecarga elétrica.",
      "senses": "◆ Detecção de movimento.\n◆ Detecção de chip.\n◆ Leitura térmica.",
      "moral": "◆ Não foge. Pode mudar prioridade se o objetivo protegido for removido.",
      "resources": "◆ Núcleo antigo.\n◆ Placas de Sentinela.\n◆ Lente de leitura.\n◆ Componente de portal.",
      "campaign": "◆ Chefe de ruína. Pode ser derrotada por combate, hack, tradução ou solução de ambiente.\nFONTE OFICIAL // Livro 3, 2.38",
      "summary": "◆ Chefe de ruína. Pode ser derrotada por combate, hack, tradução ou solução de ambiente.\nFONTE OFICIAL // Livro 3, 2.38",
      "tags": [
        "B",
        "máquina antiga de defesa",
        "chefe/guardião",
        "grande"
      ],
      "details": [
        {
          "label": "Resumo",
          "items": [
            "REGISTRO VISUAL // B // máquina antiga de defesa",
            "Tier: B",
            "Tipo: máquina antiga de defesa",
            "Papel: chefe/guardião",
            "Tamanho: grande",
            "Habitat: ruínas profundas, câmaras de portal, entradas seladas",
            "PV: 72",
            "CA: 17",
            "Movimento: 7 m",
            "Atributos importantes: FOR 18/MOD +4",
            "◆ FOR 18/MOD +4.",
            "◆ CON 20/MOD +5.",
            "◆ INT 14/MOD +2.",
            "◆ MEN 12/MOD +1."
          ]
        },
        {
          "label": "Ataques",
          "items": [
            "◆ Lâmina Mecânica: 1d10 cortante.",
            "◆ Canhão de Pulso: 1d10 energético."
          ]
        },
        {
          "label": "Habilidade — Campo de Bloqueio",
          "items": [
            "◆ Uma vez por cena, cria campo que dificulta passagem. Área próxima vira terreno difícil até o fim da próxima rodada."
          ]
        },
        {
          "label": "Habilidade — Protocolo Antigo",
          "items": [
            "◆ Se alguém falar frase correta em Nytharûl, apresentar símbolo válido ou resolver um teste de Tecnologia/Memória Cósmica, a Sentinela perde uma ação ou muda de modo."
          ]
        },
        {
          "label": "Habilidade — Reação Defensiva",
          "items": [
            "◆ Uma vez por rodada, quando sofre dano, pode girar placas e receber redução 2 contra esse ataque."
          ]
        },
        {
          "label": "Habilidade — Modo de Execução",
          "items": [
            "◆ Ao cair abaixo da metade dos PV, aumenta dano em +1, mas expõe núcleo. Ataques contra o núcleo recebem +1 se os personagens identificarem a abertura."
          ]
        },
        {
          "label": "Resistências",
          "items": [
            "◆ Imune a veneno, doença e medo comum.",
            "◆ Redução 2 contra físico comum."
          ]
        },
        {
          "label": "Fraquezas",
          "items": [
            "◆ Núcleo exposto em Modo de Execução.",
            "◆ Comandos antigos.",
            "◆ Sobrecarga elétrica."
          ]
        },
        {
          "label": "Sentidos",
          "items": [
            "◆ Detecção de movimento.",
            "◆ Detecção de chip.",
            "◆ Leitura térmica."
          ]
        },
        {
          "label": "Moral",
          "items": [
            "◆ Não foge. Pode mudar prioridade se o objetivo protegido for removido."
          ]
        },
        {
          "label": "Recursos coletáveis",
          "items": [
            "◆ Núcleo antigo.",
            "◆ Placas de Sentinela.",
            "◆ Lente de leitura.",
            "◆ Componente de portal."
          ]
        },
        {
          "label": "Uso em campanha",
          "items": [
            "◆ Chefe de ruína. Pode ser derrotada por combate, hack, tradução ou solução de ambiente.",
            "FONTE OFICIAL // Livro 3, 2.38"
          ]
        }
      ],
      "sheetType": "full",
      "needsCoreStats": false,
      "assets": [
        {
          "type": "image",
          "label": "Registro visual de Sentinela de Ruína",
          "url": "./assets/bestiary/sentinela-de-ruina.jpg"
        }
      ],
      "source": "Livro 3, 2.33",
      "schemaVersion": 1,
      "image": "./assets/bestiary/sentinela-de-ruina.jpg"
    },
    {
      "id": "livro3-2-34-juggernautt-sentinela-suprema",
      "category": "monster",
      "name": "Juggernautt — Sentinela Suprema",
      "tier": "A",
      "type": "máquina antiga de guerra/guardião de forja",
      "role": "chefe tecnológico, tanque e sentinela de resistência extrema",
      "size": "grande, com massa estimada acima de 200 kg",
      "pv": 140,
      "ca": 18,
      "movement": "6 m",
      "habitat": "forjas antigas, hangares, portões militares, câmaras de contenção e ruínas de defesa",
      "behavior": "",
      "attributes": "FOR 22/MOD +6; REF 10/MOD +0; CON 22/MOD +6; INT 12/MOD +1; MEN 10/MOD +0; PRE 14/MOD +2",
      "attacks": "◆ Ataques: Fuzil de Tûngnásio, 1d10 perfurante, até 2 disparos por rodada se o módulo estiver ativo; Golpe Brutal, 2d6 concussão; Pisão Hidráulico, 1d10 concussão e JPF com FOR ou JPR com REF para evitar Derrubado.",
      "abilities": "Habilidade — Blindagem Suprema: redução 2 contra dano físico comum.\n◆ Habilidade — Imunidade a Cosmos Comum: dano cósmico fraco não afeta o corpo principal, mas poderes de contenção, selamento ou sobrecarga ainda podem interagir com o núcleo.\n◆ Habilidade — Protocolo de Guarda: não abandona o local protegido, salvo comando antigo válido ou corrupção do objetivo.\n◆ Habilidade — Superaquecimento: após usar o Fuzil de Tûngnásio por 2 rodadas seguidas, expõe o núcleo até o início da próxima rodada. Ataques contra o núcleo recebem +1 se os personagens identificarem a abertura com Engenharia, Tecnologia ou Busca.\n◆ Habilidade — Modo Sentinela Suprema: abaixo de metade dos PV, ignora terreno difícil leve, causa +1 dano corpo a corpo e passa a mirar cubos, portas, cobertura e rotas de fuga.",
      "resistances": "◆ Resistências: veneno, doença, medo comum, dano físico comum e fogo leve.",
      "weaknesses": "◆ Fraquezas: explosivos pesados, hack difícil, núcleo exposto após superaquecimento, comandos antigos e sabotagem interna.",
      "senses": "◆ Sentidos: sensor térmico, sensor de movimento, leitura de chip e detecção de metal.",
      "moral": "◆ Moral: não possui moral. Para apenas se o protocolo for encerrado, se o núcleo for destruído ou se a ordem antiga for alterada.",
      "resources": "◆ Recursos coletáveis: fragmentos de Tûngnásio, núcleo da Sentinela Suprema, módulo de arma Tier A, placas de blindagem e processador antigo.",
      "campaign": "◆ Uso em campanha: chefe de ruína ou forja. A luta deve envolver cobertura, módulos, superaquecimento, hack, terreno e objetivo além de apenas zerar PV.\nFONTE OFICIAL // Livro 3, 4.20",
      "summary": "◆ Uso em campanha: chefe de ruína ou forja. A luta deve envolver cobertura, módulos, superaquecimento, hack, terreno e objetivo além de apenas zerar PV.\nFONTE OFICIAL // Livro 3, 4.20",
      "tags": [
        "A",
        "máquina antiga de guerra/guardião de forja",
        "chefe tecnológico, tanque e sentinela de resistência extrema",
        "grande, com massa estimada acima de 200 kg"
      ],
      "details": [
        {
          "label": "Resumo",
          "items": [
            "REGISTRO VISUAL // A // máquina antiga de guerra/guardião de forja",
            "Tier: A",
            "Tipo: máquina antiga de guerra/guardião de forja",
            "Papel: chefe tecnológico, tanque e sentinela de resistência extrema",
            "Tamanho: grande, com massa estimada acima de 200 kg",
            "Habitat: forjas antigas, hangares, portões militares, câmaras de contenção e ruínas de defesa",
            "PV: 140",
            "CA: 18",
            "Movimento: 6 m",
            "Atributos importantes: FOR 22/MOD +6; REF 10/MOD +0; CON 22/MOD +6; INT 12/MOD +1; MEN 10/MOD +0; PRE 14/MOD +2",
            "◆ O Juggernautt não é Tier A. A versão oficial é Tier A. Ele deve ser usado como chefe tecnológico de alto impacto, guardião de forja antiga ou obstáculo de ruína militar.",
            "◆ Ataques: Fuzil de Tûngnásio, 1d10 perfurante, até 2 disparos por rodada se o módulo estiver ativo; Golpe Brutal, 2d6 concussão; Pisão Hidráulico, 1d10 concussão e JPF com FOR ou JPR com REF para evitar Derrubado.",
            "Habilidade — Blindagem Suprema: redução 2 contra dano físico comum.",
            "◆ Habilidade — Imunidade a Cosmos Comum: dano cósmico fraco não afeta o corpo principal, mas poderes de contenção, selamento ou sobrecarga ainda podem interagir com o núcleo.",
            "◆ Habilidade — Protocolo de Guarda: não abandona o local protegido, salvo comando antigo válido ou corrupção do objetivo.",
            "◆ Habilidade — Superaquecimento: após usar o Fuzil de Tûngnásio por 2 rodadas seguidas, expõe o núcleo até o início da próxima rodada. Ataques contra o núcleo recebem +1 se os personagens identificarem a abertura com Engenharia, Tecnologia ou Busca.",
            "◆ Habilidade — Modo Sentinela Suprema: abaixo de metade dos PV, ignora terreno difícil leve, causa +1 dano corpo a corpo e passa a mirar cubos, portas, cobertura e rotas de fuga.",
            "◆ Resistências: veneno, doença, medo comum, dano físico comum e fogo leve.",
            "◆ Fraquezas: explosivos pesados, hack difícil, núcleo exposto após superaquecimento, comandos antigos e sabotagem interna.",
            "◆ Sentidos: sensor térmico, sensor de movimento, leitura de chip e detecção de metal.",
            "◆ Moral: não possui moral. Para apenas se o protocolo for encerrado, se o núcleo for destruído ou se a ordem antiga for alterada.",
            "◆ Recursos coletáveis: fragmentos de Tûngnásio, núcleo da Sentinela Suprema, módulo de arma Tier A, placas de blindagem e processador antigo.",
            "◆ Uso em campanha: chefe de ruína ou forja. A luta deve envolver cobertura, módulos, superaquecimento, hack, terreno e objetivo além de apenas zerar PV.",
            "FONTE OFICIAL // Livro 3, 4.20"
          ]
        }
      ],
      "sheetType": "full",
      "needsCoreStats": false,
      "assets": [
        {
          "type": "image",
          "label": "Registro visual de Juggernautt — Sentinela Suprema",
          "url": "./assets/bestiary/juggernautt-sentinela-suprema.jpg"
        }
      ],
      "source": "Livro 3, 2.34",
      "schemaVersion": 1,
      "image": "./assets/bestiary/juggernautt-sentinela-suprema.jpg"
    },
    {
      "id": "livro3-2-35-saqueador-de-rota",
      "category": "monster",
      "name": "Saqueador de Rota",
      "tier": "E",
      "type": "humanoide hostil",
      "role": "combatente leve/atirador",
      "size": "médio",
      "pv": 10,
      "ca": 11,
      "movement": "8 m",
      "habitat": "estradas, ruínas ocupadas, acampamentos, rotas comerciais",
      "behavior": "",
      "attributes": "REF 12/MOD +1",
      "attacks": "◆ Faca: 1d4 cortante.\n◆ Pistola Simples: 1d6 balístico.",
      "abilities": "◆ Recebe +1 em Furtividade ou Busca no próprio território.\n◆ Se metade do grupo de saqueadores cair, deve testar moral ou fugir.",
      "resistances": "◆ Nenhuma.",
      "weaknesses": "◆ Medo de patrulheiros, ganância e baixa disciplina.",
      "senses": "◆ Comuns.",
      "moral": "◆ Foge se parecer que vai morrer.",
      "resources": "◆ Munição.\n◆ Arma simples.\n◆ Sucata.\n◆ Informação.",
      "campaign": "◆ Bom inimigo inicial, especialmente para dilemas sociais.\nFONTE OFICIAL // Livro 3, 2.40",
      "summary": "◆ Bom inimigo inicial, especialmente para dilemas sociais.\nFONTE OFICIAL // Livro 3, 2.40",
      "tags": [
        "E",
        "humanoide hostil",
        "combatente leve/atirador",
        "médio"
      ],
      "details": [
        {
          "label": "Resumo",
          "items": [
            "REGISTRO VISUAL // E // humanoide hostil",
            "Tier: E",
            "Tipo: humanoide hostil",
            "Papel: combatente leve/atirador",
            "Tamanho: médio",
            "Habitat: estradas, ruínas ocupadas, acampamentos, rotas comerciais",
            "PV: 10",
            "CA: 11",
            "Movimento: 8 m",
            "Atributos importantes: REF 12/MOD +1",
            "◆ REF 12/MOD +1.",
            "◆ PRE 12/MOD +1.",
            "◆ MEN 10/MOD +0."
          ]
        },
        {
          "label": "Ataques",
          "items": [
            "◆ Faca: 1d4 cortante.",
            "◆ Pistola Simples: 1d6 balístico."
          ]
        },
        {
          "label": "Habilidade — Conhece a Rota",
          "items": [
            "◆ Recebe +1 em Furtividade ou Busca no próprio território."
          ]
        },
        {
          "label": "Habilidade — Covardia Prática",
          "items": [
            "◆ Se metade do grupo de saqueadores cair, deve testar moral ou fugir."
          ]
        },
        {
          "label": "Resistências",
          "items": [
            "◆ Nenhuma."
          ]
        },
        {
          "label": "Fraquezas",
          "items": [
            "◆ Medo de patrulheiros, ganância e baixa disciplina."
          ]
        },
        {
          "label": "Sentidos",
          "items": [
            "◆ Comuns."
          ]
        },
        {
          "label": "Moral",
          "items": [
            "◆ Foge se parecer que vai morrer."
          ]
        },
        {
          "label": "Recursos coletáveis",
          "items": [
            "◆ Munição.",
            "◆ Arma simples.",
            "◆ Sucata.",
            "◆ Informação."
          ]
        },
        {
          "label": "Uso em campanha",
          "items": [
            "◆ Bom inimigo inicial, especialmente para dilemas sociais.",
            "FONTE OFICIAL // Livro 3, 2.40"
          ]
        }
      ],
      "sheetType": "full",
      "needsCoreStats": false,
      "assets": [
        {
          "type": "image",
          "label": "Registro visual de Saqueador de Rota",
          "url": "./assets/bestiary/saqueador-de-rota.jpg"
        }
      ],
      "source": "Livro 3, 2.35",
      "schemaVersion": 1,
      "image": "./assets/bestiary/saqueador-de-rota.jpg"
    },
    {
      "id": "livro3-2-36-saqueador-veterano",
      "category": "monster",
      "name": "Saqueador Veterano",
      "tier": "D",
      "type": "humanoide hostil",
      "role": "atirador/comandante menor",
      "size": "médio",
      "pv": 20,
      "ca": 13,
      "movement": "8 m",
      "habitat": "acampamentos de saqueadores, rotas perigosas, ruínas ocupadas",
      "behavior": "",
      "attributes": "REF 14/MOD +2",
      "attacks": "◆ Pistola Tática ou Fuzil Antigo: 1d8 balístico.\n◆ Lâmina Curta: 1d6 cortante.",
      "abilities": "◆ Uma vez por rodada, pode dar ordem a um saqueador aliado próximo, concedendo +1 no próximo ataque ou movimento curto.\n◆ Recebe +1 CA enquanto estiver atrás de cobertura adequada.\n◆ Quando cai abaixo da metade dos PV, pode tentar fugir usando fumaça, refém ou terreno.",
      "resistances": "◆ Nenhuma especial.",
      "weaknesses": "◆ Pode ser negociado se a sobrevivência ou lucro for mais interessante.",
      "senses": "◆ Comuns.",
      "moral": "◆ Não morre por orgulho. Foge se perder vantagem.",
      "resources": "◆ Arma melhor.\n◆ Munição.\n◆ Mapa de rota.\n◆ Credencial roubada.",
      "campaign": "◆ Bom líder de encontro inicial ou rival recorrente.\nFONTE OFICIAL // Livro 3, 2.41",
      "summary": "◆ Bom líder de encontro inicial ou rival recorrente.\nFONTE OFICIAL // Livro 3, 2.41",
      "tags": [
        "D",
        "humanoide hostil",
        "atirador/comandante menor",
        "médio"
      ],
      "details": [
        {
          "label": "Resumo",
          "items": [
            "REGISTRO VISUAL // D // humanoide hostil",
            "Tier: D",
            "Tipo: humanoide hostil",
            "Papel: atirador/comandante menor",
            "Tamanho: médio",
            "Habitat: acampamentos de saqueadores, rotas perigosas, ruínas ocupadas",
            "PV: 20",
            "CA: 13",
            "Movimento: 8 m",
            "Atributos importantes: REF 14/MOD +2",
            "◆ REF 14/MOD +2.",
            "◆ MEN 12/MOD +1.",
            "◆ PRE 12/MOD +1."
          ]
        },
        {
          "label": "Ataques",
          "items": [
            "◆ Pistola Tática ou Fuzil Antigo: 1d8 balístico.",
            "◆ Lâmina Curta: 1d6 cortante."
          ]
        },
        {
          "label": "Habilidade — Ordem Rápida",
          "items": [
            "◆ Uma vez por rodada, pode dar ordem a um saqueador aliado próximo, concedendo +1 no próximo ataque ou movimento curto."
          ]
        },
        {
          "label": "Habilidade — Usar Cobertura",
          "items": [
            "◆ Recebe +1 CA enquanto estiver atrás de cobertura adequada."
          ]
        },
        {
          "label": "Habilidade — Recuo Planejado",
          "items": [
            "◆ Quando cai abaixo da metade dos PV, pode tentar fugir usando fumaça, refém ou terreno."
          ]
        },
        {
          "label": "Resistências",
          "items": [
            "◆ Nenhuma especial."
          ]
        },
        {
          "label": "Fraquezas",
          "items": [
            "◆ Pode ser negociado se a sobrevivência ou lucro for mais interessante."
          ]
        },
        {
          "label": "Sentidos",
          "items": [
            "◆ Comuns."
          ]
        },
        {
          "label": "Moral",
          "items": [
            "◆ Não morre por orgulho. Foge se perder vantagem."
          ]
        },
        {
          "label": "Recursos coletáveis",
          "items": [
            "◆ Arma melhor.",
            "◆ Munição.",
            "◆ Mapa de rota.",
            "◆ Credencial roubada."
          ]
        },
        {
          "label": "Uso em campanha",
          "items": [
            "◆ Bom líder de encontro inicial ou rival recorrente.",
            "FONTE OFICIAL // Livro 3, 2.41"
          ]
        }
      ],
      "sheetType": "full",
      "needsCoreStats": false,
      "assets": [
        {
          "type": "image",
          "label": "Registro visual de Saqueador Veterano",
          "url": "./assets/bestiary/saqueador-veterano.jpg"
        }
      ],
      "source": "Livro 3, 2.36",
      "schemaVersion": 1,
      "image": "./assets/bestiary/saqueador-veterano.jpg"
    },
    {
      "id": "livro3-2-37-cultista-do-sinal",
      "category": "monster",
      "name": "Cultista do Sinal",
      "tier": "D",
      "type": "humanoide/cósmico",
      "role": "suporte/controlador",
      "size": "médio",
      "pv": 18,
      "ca": 12,
      "movement": "8 m",
      "habitat": "ruínas, rituais secretos, grupos cósmicos, cultos",
      "behavior": "",
      "attributes": "MEN 14/MOD +2",
      "attacks": "◆ Lâmina Ritual: 1d6 cortante.\n◆ Pulso Cósmico Fraco: 1d6 cósmico.",
      "abilities": "◆ Uma vez por cena, alvo que possa ouvir faz JPC com MEN. Em falha, recebe +1 Estresse ou -1 no próximo teste de MEN.\n◆ Enquanto estiver perto de símbolo preparado, recebe +1 CA ou +1 em JPC.\n◆ Pode ignorar Medo comum uma vez por cena, mas recebe +1 Estresse ao fazer isso.",
      "resistances": "",
      "weaknesses": "◆ Longe de foco, símbolo ou grupo ritual, perde Proteção Ritual.",
      "senses": "◆ Comuns.\n◆ Alguns possuem Percepção Cósmica fraca.",
      "moral": "◆ Pode lutar até a morte se acreditar que o ritual exige isso. Outros fogem para espalhar a mensagem.",
      "resources": "◆ Talismã.\n◆ Inscrição.\n◆ Mapa ritual.\n◆ Fragmento de cristal.",
      "campaign": "◆ Ameaça social, cósmica e investigativa.\nFONTE OFICIAL // Livro 3, 2.42",
      "summary": "◆ Ameaça social, cósmica e investigativa.\nFONTE OFICIAL // Livro 3, 2.42",
      "tags": [
        "D",
        "humanoide/cósmico",
        "suporte/controlador",
        "médio"
      ],
      "details": [
        {
          "label": "Resumo",
          "items": [
            "REGISTRO VISUAL // D // humanoide/cósmico",
            "Tier: D",
            "Tipo: humanoide/cósmico",
            "Papel: suporte/controlador",
            "Tamanho: médio",
            "Habitat: ruínas, rituais secretos, grupos cósmicos, cultos",
            "PV: 18",
            "CA: 12",
            "Movimento: 8 m",
            "Atributos importantes: MEN 14/MOD +2",
            "◆ MEN 14/MOD +2.",
            "◆ PRE 14/MOD +2.",
            "◆ REF 10/MOD +0."
          ]
        },
        {
          "label": "Ataques",
          "items": [
            "◆ Lâmina Ritual: 1d6 cortante.",
            "◆ Pulso Cósmico Fraco: 1d6 cósmico."
          ]
        },
        {
          "label": "Habilidade — Sussurro de Falaris",
          "items": [
            "◆ Uma vez por cena, alvo que possa ouvir faz JPC com MEN. Em falha, recebe +1 Estresse ou -1 no próximo teste de MEN."
          ]
        },
        {
          "label": "Habilidade — Proteção Ritual",
          "items": [
            "◆ Enquanto estiver perto de símbolo preparado, recebe +1 CA ou +1 em JPC."
          ]
        },
        {
          "label": "Habilidade — Fanatismo Instável",
          "items": [
            "◆ Pode ignorar Medo comum uma vez por cena, mas recebe +1 Estresse ao fazer isso."
          ]
        },
        {
          "label": "Fraquezas",
          "items": [
            "◆ Longe de foco, símbolo ou grupo ritual, perde Proteção Ritual."
          ]
        },
        {
          "label": "Sentidos",
          "items": [
            "◆ Comuns.",
            "◆ Alguns possuem Percepção Cósmica fraca."
          ]
        },
        {
          "label": "Moral",
          "items": [
            "◆ Pode lutar até a morte se acreditar que o ritual exige isso. Outros fogem para espalhar a mensagem."
          ]
        },
        {
          "label": "Recursos coletáveis",
          "items": [
            "◆ Talismã.",
            "◆ Inscrição.",
            "◆ Mapa ritual.",
            "◆ Fragmento de cristal."
          ]
        },
        {
          "label": "Uso em campanha",
          "items": [
            "◆ Ameaça social, cósmica e investigativa.",
            "FONTE OFICIAL // Livro 3, 2.42"
          ]
        }
      ],
      "sheetType": "full",
      "needsCoreStats": false,
      "assets": [
        {
          "type": "image",
          "label": "Registro visual de Cultista do Sinal",
          "url": "./assets/bestiary/cultista-do-sinal.jpg"
        }
      ],
      "source": "Livro 3, 2.37",
      "schemaVersion": 1,
      "image": "./assets/bestiary/cultista-do-sinal.jpg"
    },
    {
      "id": "livro3-2-38-espreitador-do-vazio-menor",
      "category": "monster",
      "name": "Espreitador do Vazio Menor",
      "tier": "C",
      "type": "criatura cósmica",
      "role": "emboscador/controlador",
      "size": "médio",
      "pv": 40,
      "ca": 15,
      "movement": "9 m",
      "habitat": "ruínas cósmicas, túneis antigos, zonas de sombra, locais de falha de realidade",
      "behavior": "",
      "attributes": "REF 16/MOD +3",
      "attacks": "◆ Toque do Vazio: 1d8 cósmico.\n◆ Garras Sombrias: 1d6 cortante.",
      "abilities": "◆ Quando visto pela primeira vez na cena, todos fazem JPC com MEN. Em falha, recebem +1 Estresse.\n◆ Enquanto estiver em sombra intensa ou escuridão, pode se mover 4 m como reação após ser atacado.\n◆ Uma vez por cena, cria uma área de silêncio breve. Comunicação falada dentro da área fica impossível até o fim da próxima rodada.\n◆ Em crítico com Toque do Vazio, o alvo esquece um detalhe recente por alguns minutos ou sofre -1 no próximo teste de MEN.",
      "resistances": "",
      "weaknesses": "◆ Luz intensa.\n◆ Símbolos de contenção.\n◆ Fogo branco.\n◆ teste de Cosmos estabilizador, foco estável ou contenção adequada.",
      "senses": "◆ Percepção Cósmica.\n◆ Percepção de Estresse.\n◆ Visão no escuro absoluto.",
      "moral": "◆ Recua se for exposto à luz intensa ou se não conseguir isolar presa.",
      "resources": "◆ Resíduo de sombra.\n◆ Fragmento de vazio.\n◆ Marca instável.",
      "campaign": "◆ O Espreitador do Vazio Menor é uma ameaça de ruína cósmica. Deve aparecer com sinais antes do combate: silêncio, luz falhando, sonhos e sensação de observação.\nFONTE OFICIAL // Livro 3, 2.44",
      "summary": "◆ O Espreitador do Vazio Menor é uma ameaça de ruína cósmica. Deve aparecer com sinais antes do combate: silêncio, luz falhando, sonhos e sensação de observação.\nFONTE OFICIAL // Livro 3, 2.44",
      "tags": [
        "C",
        "criatura cósmica",
        "emboscador/controlador",
        "médio"
      ],
      "details": [
        {
          "label": "Resumo",
          "items": [
            "REGISTRO VISUAL // C // criatura cósmica",
            "Tier: C",
            "Tipo: criatura cósmica",
            "Papel: emboscador/controlador",
            "Tamanho: médio",
            "Habitat: ruínas cósmicas, túneis antigos, zonas de sombra, locais de falha de realidade",
            "PV: 40",
            "CA: 15",
            "Movimento: 9 m",
            "Atributos importantes: REF 16/MOD +3",
            "◆ REF 16/MOD +3.",
            "◆ MEN 18/MOD +4.",
            "◆ CON 14/MOD +2.",
            "◆ PRE 16/MOD +3."
          ]
        },
        {
          "label": "Ataques",
          "items": [
            "◆ Toque do Vazio: 1d8 cósmico.",
            "◆ Garras Sombrias: 1d6 cortante."
          ]
        },
        {
          "label": "Habilidade — Presença Inquietante",
          "items": [
            "◆ Quando visto pela primeira vez na cena, todos fazem JPC com MEN. Em falha, recebem +1 Estresse."
          ]
        },
        {
          "label": "Habilidade — Passo no Escuro",
          "items": [
            "◆ Enquanto estiver em sombra intensa ou escuridão, pode se mover 4 m como reação após ser atacado."
          ]
        },
        {
          "label": "Habilidade — Roubar Som",
          "items": [
            "◆ Uma vez por cena, cria uma área de silêncio breve. Comunicação falada dentro da área fica impossível até o fim da próxima rodada."
          ]
        },
        {
          "label": "Habilidade — Ferida de Memória",
          "items": [
            "◆ Em crítico com Toque do Vazio, o alvo esquece um detalhe recente por alguns minutos ou sofre -1 no próximo teste de MEN."
          ]
        },
        {
          "label": "Fraquezas",
          "items": [
            "◆ Luz intensa.",
            "◆ Símbolos de contenção.",
            "◆ Fogo branco.",
            "◆ teste de Cosmos estabilizador, foco estável ou contenção adequada."
          ]
        },
        {
          "label": "Sentidos",
          "items": [
            "◆ Percepção Cósmica.",
            "◆ Percepção de Estresse.",
            "◆ Visão no escuro absoluto."
          ]
        },
        {
          "label": "Moral",
          "items": [
            "◆ Recua se for exposto à luz intensa ou se não conseguir isolar presa."
          ]
        },
        {
          "label": "Recursos coletáveis",
          "items": [
            "◆ Resíduo de sombra.",
            "◆ Fragmento de vazio.",
            "◆ Marca instável."
          ]
        },
        {
          "label": "Uso em campanha",
          "items": [
            "◆ O Espreitador do Vazio Menor é uma ameaça de ruína cósmica. Deve aparecer com sinais antes do combate: silêncio, luz falhando, sonhos e sensação de observação.",
            "FONTE OFICIAL // Livro 3, 2.44"
          ]
        }
      ],
      "sheetType": "full",
      "needsCoreStats": false,
      "assets": [
        {
          "type": "image",
          "label": "Registro visual de Espreitador do Vazio Menor",
          "url": "./assets/bestiary/espreitador-do-vazio-menor.jpg"
        }
      ],
      "source": "Livro 3, 2.38",
      "schemaVersion": 1,
      "image": "./assets/bestiary/espreitador-do-vazio-menor.jpg"
    },
    {
      "id": "livro3-2-39-espreitador-do-vazio-profundo",
      "category": "monster",
      "name": "Espreitador do Vazio Profundo",
      "tier": "A",
      "type": "entidade cósmica menor",
      "role": "chefe/ameaça psicológica",
      "size": "grande ou indefinido",
      "pv": 100,
      "ca": 18,
      "movement": "10 m, Passo no Escuro 6 m",
      "habitat": "portais Tharan corrompidos, câmaras antigas, zonas ligadas a Uryon",
      "behavior": "",
      "attributes": "MEN 22/MOD +6",
      "attacks": "◆ Toque de Ausência: 2d6 cósmico.\n◆ Garra Impossível: 1d10 cortante.",
      "abilities": "◆ Uma vez por cena, um alvo que veja o Espreitador faz JPC com MEN. Em falha, recebe +2 Estresse ou fica com Medo até o fim da próxima rodada.\n◆ Uma vez por rodada, se estiver em escuridão, pode se tornar parcialmente intangível. O próximo ataque físico contra ele sofre -1 ou causa metade do dano, a critério do Mestre.\n◆ Quando cai abaixo da metade dos PV, todos os personagens com Estresse 4 ou mais ou Marca pelo Cosmos fazem JPC com MEN. Em falha, ouvem uma ordem impossível e perdem a próxima interação simples.\n◆ Pode atravessar uma barreira fina, sombra profunda ou rachadura cósmica como movimento especial.\n◆ Ao chegar a 0 PV, não morre necessariamente. Pode se desfazer, deixando marca, fragmento ou promessa de retorno.",
      "resistances": "",
      "weaknesses": "◆ Luz de contenção antiga.\n◆ Ritual correto.\n◆ Foco estabilizado.\n◆ Destruição da âncora cósmica local.",
      "senses": "◆ Percepção Cósmica profunda.\n◆ Percepção de medo.\n◆ Percepção de marcas.",
      "moral": "◆ Não pensa como animal. Recua se sua âncora for ameaçada ou se o objetivo cósmico for cumprido.",
      "resources": "◆ Fragmento de vazio.\n◆ Marca concentrada.\n◆ Eco de memória.\n◆ Resíduo de Uryon.",
      "campaign": "◆ Não use cedo sem preparo. O Espreitador Profundo deve ser anunciado por sonhos, desaparecimentos, símbolos e falhas de luz.\nFONTE OFICIAL // Livro 3, 2.45",
      "summary": "◆ Não use cedo sem preparo. O Espreitador Profundo deve ser anunciado por sonhos, desaparecimentos, símbolos e falhas de luz.\nFONTE OFICIAL // Livro 3, 2.45",
      "tags": [
        "A",
        "entidade cósmica menor",
        "chefe/ameaça psicológica",
        "grande ou indefinido"
      ],
      "details": [
        {
          "label": "Resumo",
          "items": [
            "REGISTRO VISUAL // A // entidade cósmica menor",
            "Tier: A",
            "Tipo: entidade cósmica menor",
            "Papel: chefe/ameaça psicológica",
            "Tamanho: grande ou indefinido",
            "Habitat: portais Tharan corrompidos, câmaras antigas, zonas ligadas a Uryon",
            "PV: 100",
            "CA: 18",
            "Movimento: 10 m, Passo no Escuro 6 m",
            "Atributos importantes: MEN 22/MOD +6",
            "◆ MEN 22/MOD +6.",
            "◆ PRE 20/MOD +5.",
            "◆ REF 16/MOD +3.",
            "◆ CON 18/MOD +4."
          ]
        },
        {
          "label": "Ataques",
          "items": [
            "◆ Toque de Ausência: 2d6 cósmico.",
            "◆ Garra Impossível: 1d10 cortante."
          ]
        },
        {
          "label": "Habilidade — Olhar do Abismo",
          "items": [
            "◆ Uma vez por cena, um alvo que veja o Espreitador faz JPC com MEN. Em falha, recebe +2 Estresse ou fica com Medo até o fim da próxima rodada."
          ]
        },
        {
          "label": "Habilidade — Apagar Presença",
          "items": [
            "◆ Uma vez por rodada, se estiver em escuridão, pode se tornar parcialmente intangível. O próximo ataque físico contra ele sofre -1 ou causa metade do dano, a critério do Mestre."
          ]
        },
        {
          "label": "Habilidade — Chamado de Uryon",
          "items": [
            "◆ Quando cai abaixo da metade dos PV, todos os personagens com Estresse 4 ou mais ou Marca pelo Cosmos fazem JPC com MEN. Em falha, ouvem uma ordem impossível e perdem a próxima interação simples."
          ]
        },
        {
          "label": "Habilidade — Fenda Curta",
          "items": [
            "◆ Pode atravessar uma barreira fina, sombra profunda ou rachadura cósmica como movimento especial."
          ]
        },
        {
          "label": "Habilidade — Última Sombra",
          "items": [
            "◆ Ao chegar a 0 PV, não morre necessariamente. Pode se desfazer, deixando marca, fragmento ou promessa de retorno."
          ]
        },
        {
          "label": "Fraquezas",
          "items": [
            "◆ Luz de contenção antiga.",
            "◆ Ritual correto.",
            "◆ Foco estabilizado.",
            "◆ Destruição da âncora cósmica local."
          ]
        },
        {
          "label": "Sentidos",
          "items": [
            "◆ Percepção Cósmica profunda.",
            "◆ Percepção de medo.",
            "◆ Percepção de marcas."
          ]
        },
        {
          "label": "Moral",
          "items": [
            "◆ Não pensa como animal. Recua se sua âncora for ameaçada ou se o objetivo cósmico for cumprido."
          ]
        },
        {
          "label": "Recursos coletáveis",
          "items": [
            "◆ Fragmento de vazio.",
            "◆ Marca concentrada.",
            "◆ Eco de memória.",
            "◆ Resíduo de Uryon."
          ]
        },
        {
          "label": "Uso em campanha",
          "items": [
            "◆ Não use cedo sem preparo. O Espreitador Profundo deve ser anunciado por sonhos, desaparecimentos, símbolos e falhas de luz.",
            "FONTE OFICIAL // Livro 3, 2.45"
          ]
        }
      ],
      "sheetType": "full",
      "needsCoreStats": false,
      "assets": [
        {
          "type": "image",
          "label": "Registro visual de Espreitador do Vazio Profundo",
          "url": "./assets/bestiary/espreitador-do-vazio-profundo.jpg"
        }
      ],
      "source": "Livro 3, 2.39",
      "schemaVersion": 1,
      "image": "./assets/bestiary/espreitador-do-vazio-profundo.jpg"
    },
    {
      "id": "livro3-2-40-arauto-da-noite-comum",
      "category": "monster",
      "name": "Arauto da Noite Comum",
      "tier": "E",
      "type": "predador alado noturno",
      "role": "atirador orgânico, assediador e ameaça de bando",
      "size": "pequeno ou médio",
      "pv": 12,
      "ca": 12,
      "movement": "4 m terrestre; voo 15 m",
      "habitat": "cavernas altas, ruínas abertas, torres, penhascos e regiões de Noite Eterna em lendas Kairi",
      "behavior": "",
      "attributes": "FOR 8/MOD -1; REF 14/MOD +2; CON 10/MOD +0; INT 4/MOD -3; MEN 10/MOD +0; PRE 8/MOD -1",
      "attacks": "◆ Ataques: Mordida Drenante, 1d4 perfurante; Rasante, 1d6 cortante se vier de voo.",
      "abilities": "◆ Habilidade — Onda Sônica: duas vezes por cena, criaturas em cone curto fazem JPC com MEN. Em falha, ficam Tontas até o fim da próxima rodada.\n◆ Habilidade — Caçador Noturno: recebe +1 no primeiro ataque contra alvo que não o percebeu em penumbra ou escuridão.",
      "resistances": "Resistências: nenhuma especial.",
      "weaknesses": "Fraquezas: luz intensa, som harmônico e espaços fechados baixos.",
      "senses": "Sentidos: ecolocalização, audição excelente e visão em baixa luz.",
      "moral": "Moral: foge se metade do bando cair ou se ficar preso sem altura.",
      "resources": "◆ Recursos coletáveis: asa membranosa, glândula sônica e olhos luminescentes.",
      "campaign": "◆ Uso em campanha: ameaça aérea de viagem noturna, torre, caverna vertical ou presságio Kairi.\nFONTE OFICIAL // Livro 3, 4.10",
      "summary": "◆ Uso em campanha: ameaça aérea de viagem noturna, torre, caverna vertical ou presságio Kairi.\nFONTE OFICIAL // Livro 3, 4.10",
      "tags": [
        "E",
        "predador alado noturno",
        "atirador orgânico, assediador e ameaça de bando",
        "pequeno ou médio"
      ],
      "details": [
        {
          "label": "Resumo",
          "items": [
            "REGISTRO VISUAL // E // predador alado noturno",
            "Tier: E",
            "Tipo: predador alado noturno",
            "Papel: atirador orgânico, assediador e ameaça de bando",
            "Tamanho: pequeno ou médio",
            "Habitat: cavernas altas, ruínas abertas, torres, penhascos e regiões de Noite Eterna em lendas Kairi",
            "PV: 12",
            "CA: 12",
            "Movimento: 4 m terrestre; voo 15 m",
            "Atributos importantes: FOR 8/MOD -1; REF 14/MOD +2; CON 10/MOD +0; INT 4/MOD -3; MEN 10/MOD +0; PRE 8/MOD -1",
            "◆ Ataques: Mordida Drenante, 1d4 perfurante; Rasante, 1d6 cortante se vier de voo.",
            "◆ Habilidade — Onda Sônica: duas vezes por cena, criaturas em cone curto fazem JPC com MEN. Em falha, ficam Tontas até o fim da próxima rodada.",
            "◆ Habilidade — Caçador Noturno: recebe +1 no primeiro ataque contra alvo que não o percebeu em penumbra ou escuridão.",
            "Resistências: nenhuma especial.",
            "Fraquezas: luz intensa, som harmônico e espaços fechados baixos.",
            "Sentidos: ecolocalização, audição excelente e visão em baixa luz.",
            "Moral: foge se metade do bando cair ou se ficar preso sem altura.",
            "◆ Recursos coletáveis: asa membranosa, glândula sônica e olhos luminescentes.",
            "◆ Uso em campanha: ameaça aérea de viagem noturna, torre, caverna vertical ou presságio Kairi.",
            "FONTE OFICIAL // Livro 3, 4.10"
          ]
        }
      ],
      "sheetType": "full",
      "needsCoreStats": false,
      "assets": [
        {
          "type": "image",
          "label": "Registro visual de Arauto da Noite Comum",
          "url": "./assets/bestiary/arauto-da-noite-comum.jpg"
        }
      ],
      "source": "Livro 3, 2.40",
      "schemaVersion": 1,
      "image": "./assets/bestiary/arauto-da-noite-comum.jpg"
    },
    {
      "id": "livro3-2-41-arauto-da-noite-maior",
      "category": "monster",
      "name": "Arauto da Noite Maior",
      "tier": "D",
      "type": "predador alado sônico",
      "role": "chefe de bando, controlador e terror noturno",
      "size": "médio grande",
      "pv": 30,
      "ca": 14,
      "movement": "5 m terrestre; voo 16 m",
      "habitat": "ninhos altos, torres antigas, árvores gigantes e cavernas de teto amplo",
      "behavior": "",
      "attributes": "FOR 12/MOD +1; REF 16/MOD +3; CON 12/MOD +1; INT 6/MOD -2; MEN 12/MOD +1; PRE 12/MOD +1",
      "attacks": "◆ Ataques: Mordida Drenante Maior, 1d8 perfurante; Garras de Rasante, 1d8 cortante.",
      "abilities": "◆ Habilidade — Grito da Noite: uma vez por cena, todos em cone médio fazem JPC com MEN. Em falha, ficam Tontos e recebem +1 Estresse.\n◆ Habilidade — Eco de Bando: Arautos da Noite aliados próximos recebem +1 em Busca baseada em som.",
      "resistances": "Resistências: resistência leve contra Medo comum.",
      "weaknesses": "◆ Fraquezas: luz intensa e destruição do ninho reduzem sua agressividade.",
      "senses": "Sentidos: ecolocalização refinada e percepção de movimento no escuro.",
      "moral": "◆ Moral: protege o ninho; fora do ninho, recua se perder vantagem aérea.",
      "resources": "◆ Recursos coletáveis: glândula sônica maior, couro de asa, olhos luminescentes e osso oco ressonante.",
      "campaign": "◆ Uso em campanha: chefe menor de bando e presságio de área dominada por predadores noturnos.\nFONTE OFICIAL // Livro 3, 4.11",
      "summary": "◆ Uso em campanha: chefe menor de bando e presságio de área dominada por predadores noturnos.\nFONTE OFICIAL // Livro 3, 4.11",
      "tags": [
        "D",
        "predador alado sônico",
        "chefe de bando, controlador e terror noturno",
        "médio grande"
      ],
      "details": [
        {
          "label": "Resumo",
          "items": [
            "REGISTRO VISUAL // D // predador alado sônico",
            "Tier: D",
            "Tipo: predador alado sônico",
            "Papel: chefe de bando, controlador e terror noturno",
            "Tamanho: médio grande",
            "Habitat: ninhos altos, torres antigas, árvores gigantes e cavernas de teto amplo",
            "PV: 30",
            "CA: 14",
            "Movimento: 5 m terrestre; voo 16 m",
            "Atributos importantes: FOR 12/MOD +1; REF 16/MOD +3; CON 12/MOD +1; INT 6/MOD -2; MEN 12/MOD +1; PRE 12/MOD +1",
            "◆ Ataques: Mordida Drenante Maior, 1d8 perfurante; Garras de Rasante, 1d8 cortante.",
            "◆ Habilidade — Grito da Noite: uma vez por cena, todos em cone médio fazem JPC com MEN. Em falha, ficam Tontos e recebem +1 Estresse.",
            "◆ Habilidade — Eco de Bando: Arautos da Noite aliados próximos recebem +1 em Busca baseada em som.",
            "Resistências: resistência leve contra Medo comum.",
            "◆ Fraquezas: luz intensa e destruição do ninho reduzem sua agressividade.",
            "Sentidos: ecolocalização refinada e percepção de movimento no escuro.",
            "◆ Moral: protege o ninho; fora do ninho, recua se perder vantagem aérea.",
            "◆ Recursos coletáveis: glândula sônica maior, couro de asa, olhos luminescentes e osso oco ressonante.",
            "◆ Uso em campanha: chefe menor de bando e presságio de área dominada por predadores noturnos.",
            "FONTE OFICIAL // Livro 3, 4.11"
          ]
        }
      ],
      "sheetType": "full",
      "needsCoreStats": false,
      "assets": [
        {
          "type": "image",
          "label": "Registro visual de Arauto da Noite Maior",
          "url": "./assets/bestiary/arauto-da-noite-maior.jpg"
        }
      ],
      "source": "Livro 3, 2.41",
      "schemaVersion": 1,
      "image": "./assets/bestiary/arauto-da-noite-maior.jpg"
    },
    {
      "id": "livro3-2-42-humanis-corrompido-comum",
      "category": "monster",
      "name": "Humanis Corrompido Comum",
      "tier": "F",
      "type": "humanoide corrompido",
      "role": "ameaça trágica, corpo a corpo simples e horror de colônia perdida",
      "size": "médio",
      "pv": 10,
      "ca": 9,
      "movement": "8 m",
      "habitat": "colônias abandonadas, estações, ruínas habitadas e zonas contaminadas",
      "behavior": "",
      "attributes": "FOR 10/MOD +0; REF 8/MOD -1; CON 12/MOD +1; INT 4/MOD -3; MEN 8/MOD -1; PRE 4/MOD -3",
      "attacks": "Ataque: Garras Bioferríticas, 1d6 perfurante/concussão.",
      "abilities": "◆ Habilidade — Instinto de Caça Cósmica: se alguém usar Cosmos perto dele, recebe +1 no próximo ataque contra esse alvo.\n◆ Habilidade — Resquício de Memória: ao ser derrotado, pode carregar objeto pessoal, chip danificado, documento ou ferramenta antiga.",
      "resistances": "Resistências: dor comum e medo comum reduzidos, a critério do Mestre.",
      "weaknesses": "◆ Fraquezas: contenção cósmica, luz intensa e lembranças pessoais podem fazê-lo hesitar por 1 rodada.",
      "senses": "◆ Sentidos: visão comum deteriorada, audição instintiva e atração por ressonância.",
      "moral": "◆ Moral: não recua por medo comum, mas pode repetir ações da vida antiga.",
      "resources": "◆ Recursos coletáveis: chip danificado, circuitos, sucata técnica, fragmentos bioferríticos e objeto pessoal.",
      "campaign": "◆ Uso em campanha: ameaça de horror e culpa. Deve lembrar que havia uma pessoa ali.\nFONTE OFICIAL // Livro 3, 4.22",
      "summary": "◆ Uso em campanha: ameaça de horror e culpa. Deve lembrar que havia uma pessoa ali.\nFONTE OFICIAL // Livro 3, 4.22",
      "tags": [
        "F",
        "humanoide corrompido",
        "ameaça trágica, corpo a corpo simples e horror de colônia perdida",
        "médio"
      ],
      "details": [
        {
          "label": "Resumo",
          "items": [
            "REGISTRO VISUAL // F // humanoide corrompido",
            "Tier: F",
            "Tipo: humanoide corrompido",
            "Papel: ameaça trágica, corpo a corpo simples e horror de colônia perdida",
            "Tamanho: médio",
            "Habitat: colônias abandonadas, estações, ruínas habitadas e zonas contaminadas",
            "PV: 10",
            "CA: 9",
            "Movimento: 8 m",
            "Atributos importantes: FOR 10/MOD +0; REF 8/MOD -1; CON 12/MOD +1; INT 4/MOD -3; MEN 8/MOD -1; PRE 4/MOD -3",
            "Ataque: Garras Bioferríticas, 1d6 perfurante/concussão.",
            "◆ Habilidade — Instinto de Caça Cósmica: se alguém usar Cosmos perto dele, recebe +1 no próximo ataque contra esse alvo.",
            "◆ Habilidade — Resquício de Memória: ao ser derrotado, pode carregar objeto pessoal, chip danificado, documento ou ferramenta antiga.",
            "Resistências: dor comum e medo comum reduzidos, a critério do Mestre.",
            "◆ Fraquezas: contenção cósmica, luz intensa e lembranças pessoais podem fazê-lo hesitar por 1 rodada.",
            "◆ Sentidos: visão comum deteriorada, audição instintiva e atração por ressonância.",
            "◆ Moral: não recua por medo comum, mas pode repetir ações da vida antiga.",
            "◆ Recursos coletáveis: chip danificado, circuitos, sucata técnica, fragmentos bioferríticos e objeto pessoal.",
            "◆ Uso em campanha: ameaça de horror e culpa. Deve lembrar que havia uma pessoa ali.",
            "FONTE OFICIAL // Livro 3, 4.22"
          ]
        }
      ],
      "sheetType": "full",
      "needsCoreStats": false,
      "assets": [
        {
          "type": "image",
          "label": "Registro visual de Humanis Corrompido Comum",
          "url": "./assets/bestiary/humanis-corrompido-comum.jpg"
        }
      ],
      "source": "Livro 3, 2.42",
      "schemaVersion": 1,
      "image": "./assets/bestiary/humanis-corrompido-comum.jpg"
    },
    {
      "id": "livro3-2-43-humanis-corrompido-tecnico",
      "category": "monster",
      "name": "Humanis Corrompido Técnico",
      "tier": "E",
      "type": "humanoide corrompido por chip e tecnologia",
      "role": "ameaça tecnológica leve e interação com ambiente",
      "size": "médio",
      "pv": 16,
      "ca": 10,
      "movement": "8 m",
      "habitat": "oficinas, laboratórios, estações, torres e salas de manutenção",
      "behavior": "",
      "attributes": "FOR 10/MOD +0; REF 10/MOD +0; CON 12/MOD +1; INT 10/MOD +0; MEN 8/MOD -1; PRE 4/MOD -3",
      "attacks": "◆ Ataques: Ferramenta Quebrada, 1d6+1 concussão ou cortante; Descarga de Implante, 1d4 elétrico em alvo próximo.",
      "abilities": "◆ Habilidade — Memória Profissional: interage instintivamente com consoles, portas e máquinas simples, podendo ativar perigos sem entender.\n◆ Habilidade — Falha de Chip: ao cair a 0 PV, libera pulso elétrico fraco. Alvos adjacentes fazem JPR com REF ou sofrem 1d4 elétrico.",
      "resistances": "Resistências: doença comum e medo comum parcial.",
      "weaknesses": "◆ Fraquezas: pulso EMP, hack, comando de segurança antigo ou desligamento do implante.",
      "senses": "Sentidos: visão comum, ruído de chip e atração por energia.",
      "moral": "Moral: protege painel, porta ou equipamento ligado à memória antiga.",
      "resources": "◆ Recursos coletáveis: chip quebrado, implante queimado, ferramenta, microcircuitos e registro corrompido.",
      "campaign": "◆ Uso em campanha: ideal para oficinas abandonadas e cenas em que o ambiente tecnológico é parte do combate.\nFONTE OFICIAL // Livro 3, 4.23",
      "summary": "◆ Uso em campanha: ideal para oficinas abandonadas e cenas em que o ambiente tecnológico é parte do combate.\nFONTE OFICIAL // Livro 3, 4.23",
      "tags": [
        "E",
        "humanoide corrompido por chip e tecnologia",
        "ameaça tecnológica leve e interação com ambiente",
        "médio"
      ],
      "details": [
        {
          "label": "Resumo",
          "items": [
            "REGISTRO VISUAL // E // humanoide corrompido por chip e tecnologia",
            "Tier: E",
            "Tipo: humanoide corrompido por chip e tecnologia",
            "Papel: ameaça tecnológica leve e interação com ambiente",
            "Tamanho: médio",
            "Habitat: oficinas, laboratórios, estações, torres e salas de manutenção",
            "PV: 16",
            "CA: 10",
            "Movimento: 8 m",
            "Atributos importantes: FOR 10/MOD +0; REF 10/MOD +0; CON 12/MOD +1; INT 10/MOD +0; MEN 8/MOD -1; PRE 4/MOD -3",
            "◆ Ataques: Ferramenta Quebrada, 1d6+1 concussão ou cortante; Descarga de Implante, 1d4 elétrico em alvo próximo.",
            "◆ Habilidade — Memória Profissional: interage instintivamente com consoles, portas e máquinas simples, podendo ativar perigos sem entender.",
            "◆ Habilidade — Falha de Chip: ao cair a 0 PV, libera pulso elétrico fraco. Alvos adjacentes fazem JPR com REF ou sofrem 1d4 elétrico.",
            "Resistências: doença comum e medo comum parcial.",
            "◆ Fraquezas: pulso EMP, hack, comando de segurança antigo ou desligamento do implante.",
            "Sentidos: visão comum, ruído de chip e atração por energia.",
            "Moral: protege painel, porta ou equipamento ligado à memória antiga.",
            "◆ Recursos coletáveis: chip quebrado, implante queimado, ferramenta, microcircuitos e registro corrompido.",
            "◆ Uso em campanha: ideal para oficinas abandonadas e cenas em que o ambiente tecnológico é parte do combate.",
            "FONTE OFICIAL // Livro 3, 4.23"
          ]
        }
      ],
      "sheetType": "full",
      "needsCoreStats": false,
      "assets": [
        {
          "type": "image",
          "label": "Registro visual de Humanis Corrompido Técnico",
          "url": "./assets/bestiary/humanis-corrompido-tecnico.jpg"
        }
      ],
      "source": "Livro 3, 2.43",
      "schemaVersion": 1,
      "image": "./assets/bestiary/humanis-corrompido-tecnico.jpg"
    },
    {
      "id": "livro3-2-44-zerak-corrompido",
      "category": "monster",
      "name": "Zerak Corrompido",
      "tier": "D",
      "type": "humanoide corrompido/brutamontes",
      "role": "tanque, agressor físico e tragédia guerreira",
      "size": "médio grande",
      "pv": 30,
      "ca": 13,
      "movement": "7 m",
      "habitat": "campos de batalha, minas, fortalezas arruinadas e zonas de combate antigo",
      "behavior": "",
      "attributes": "FOR 16/MOD +3; REF 8/MOD -1; CON 16/MOD +3; INT 6/MOD -2; MEN 8/MOD -1; PRE 10/MOD +0",
      "attacks": "◆ Ataques: Punho Ferruginoso, 1d8 concussão; Lâmina Improvisada, 1d8 cortante.",
      "abilities": "◆ Habilidade — Corpo de Guerra: reduz 1 dano físico comum uma vez por rodada.\n◆ Habilidade — Fúria Residual: abaixo da metade dos PV, causa +1 dano corpo a corpo e perde capacidade de recuar.\n◆ Habilidade — Investida Bruta: se mover 4 m antes de atacar, alvo faz JPF com FOR ou JPR com REF. Em falha, fica Derrubado.",
      "resistances": "Resistências: concussão leve e medo comum.",
      "weaknesses": "◆ Fraquezas: ataques em juntas, contenção por terreno estreito e memórias de clã ou honra, se aplicável à campanha.",
      "senses": "Sentidos: comuns, com atração por vibração e barulho de combate.",
      "moral": "◆ Moral: luta até cair, a menos que algo da antiga identidade interrompa o instinto.",
      "resources": "◆ Recursos coletáveis: placas bioferríticas, osso denso, fragmento de chip e insígnia antiga.",
      "campaign": "◆ Uso em campanha: inimigo pesado para mostrar a corrupção de antigos defensores ou trabalhadores de força.\nFONTE OFICIAL // Livro 3, 4.24",
      "summary": "◆ Uso em campanha: inimigo pesado para mostrar a corrupção de antigos defensores ou trabalhadores de força.\nFONTE OFICIAL // Livro 3, 4.24",
      "tags": [
        "D",
        "humanoide corrompido/brutamontes",
        "tanque, agressor físico e tragédia guerreira",
        "médio grande"
      ],
      "details": [
        {
          "label": "Resumo",
          "items": [
            "REGISTRO VISUAL // D // humanoide corrompido/brutamontes",
            "Tier: D",
            "Tipo: humanoide corrompido/brutamontes",
            "Papel: tanque, agressor físico e tragédia guerreira",
            "Tamanho: médio grande",
            "Habitat: campos de batalha, minas, fortalezas arruinadas e zonas de combate antigo",
            "PV: 30",
            "CA: 13",
            "Movimento: 7 m",
            "Atributos importantes: FOR 16/MOD +3; REF 8/MOD -1; CON 16/MOD +3; INT 6/MOD -2; MEN 8/MOD -1; PRE 10/MOD +0",
            "◆ Ataques: Punho Ferruginoso, 1d8 concussão; Lâmina Improvisada, 1d8 cortante.",
            "◆ Habilidade — Corpo de Guerra: reduz 1 dano físico comum uma vez por rodada.",
            "◆ Habilidade — Fúria Residual: abaixo da metade dos PV, causa +1 dano corpo a corpo e perde capacidade de recuar.",
            "◆ Habilidade — Investida Bruta: se mover 4 m antes de atacar, alvo faz JPF com FOR ou JPR com REF. Em falha, fica Derrubado.",
            "Resistências: concussão leve e medo comum.",
            "◆ Fraquezas: ataques em juntas, contenção por terreno estreito e memórias de clã ou honra, se aplicável à campanha.",
            "Sentidos: comuns, com atração por vibração e barulho de combate.",
            "◆ Moral: luta até cair, a menos que algo da antiga identidade interrompa o instinto.",
            "◆ Recursos coletáveis: placas bioferríticas, osso denso, fragmento de chip e insígnia antiga.",
            "◆ Uso em campanha: inimigo pesado para mostrar a corrupção de antigos defensores ou trabalhadores de força.",
            "FONTE OFICIAL // Livro 3, 4.24"
          ]
        }
      ],
      "sheetType": "full",
      "needsCoreStats": false,
      "assets": [
        {
          "type": "image",
          "label": "Registro visual de Zerak Corrompido",
          "url": "./assets/bestiary/zerak-corrompido.jpg"
        }
      ],
      "source": "Livro 3, 2.44",
      "schemaVersion": 1,
      "image": "./assets/bestiary/zerak-corrompido.jpg"
    },
    {
      "id": "livro3-2-45-veyrkan-corrompido",
      "category": "monster",
      "name": "Veyrkan Corrompido",
      "tier": "D",
      "type": "humanoide corrompido/predador furtivo",
      "role": "emboscador, venenoso e perseguidor",
      "size": "médio",
      "pv": 24,
      "ca": 14,
      "movement": "10 m; escalada 6 m, se houver superfície adequada",
      "habitat": "corredores, dutos, instalações úmidas, naves caídas e ruínas com passagens estreitas",
      "behavior": "",
      "attributes": "FOR 10/MOD +0; REF 16/MOD +3; CON 12/MOD +1; INT 8/MOD -1; MEN 10/MOD +0; PRE 8/MOD -1",
      "attacks": "◆ Ataques: Garras Rápidas, 1d6 cortante; Mordida Tóxica, 1d6 perfurante.",
      "abilities": "◆ Habilidade — Toxina Instável: em sucesso completo com Mordida Tóxica, o alvo faz JPF com CON ou fica Envenenado leve.\n◆ Habilidade — Deslocamento Serpentino: recebe +1 em Furtividade ou Acrobacia em corredores, dutos e espaços estreitos.\n◆ Habilidade — Recuo Predatório: após atacar alvo isolado, pode se mover 2 m sem provocar reação se houver cobertura próxima.",
      "resistances": "Resistências: veneno comum leve.",
      "weaknesses": "Fraquezas: frio intenso, luz súbita e bloqueio de rota de fuga.",
      "senses": "Sentidos: visão em baixa luz, olfato e percepção de calor fraca.",
      "moral": "◆ Moral: recua se perder vantagem de emboscada, mas volta a perseguir se sentir cheiro de sangue.",
      "resources": "◆ Recursos coletáveis: glândula tóxica, escamas, dente fino e implante corrompido.",
      "campaign": "◆ Uso em campanha: excelente para horror de corredor e perseguição dentro de instalações.\nFONTE OFICIAL // Livro 3, 4.25",
      "summary": "◆ Uso em campanha: excelente para horror de corredor e perseguição dentro de instalações.\nFONTE OFICIAL // Livro 3, 4.25",
      "tags": [
        "D",
        "humanoide corrompido/predador furtivo",
        "emboscador, venenoso e perseguidor",
        "médio"
      ],
      "details": [
        {
          "label": "Resumo",
          "items": [
            "REGISTRO VISUAL // D // humanoide corrompido/predador furtivo",
            "Tier: D",
            "Tipo: humanoide corrompido/predador furtivo",
            "Papel: emboscador, venenoso e perseguidor",
            "Tamanho: médio",
            "Habitat: corredores, dutos, instalações úmidas, naves caídas e ruínas com passagens estreitas",
            "PV: 24",
            "CA: 14",
            "Movimento: 10 m; escalada 6 m, se houver superfície adequada",
            "Atributos importantes: FOR 10/MOD +0; REF 16/MOD +3; CON 12/MOD +1; INT 8/MOD -1; MEN 10/MOD +0; PRE 8/MOD -1",
            "◆ Ataques: Garras Rápidas, 1d6 cortante; Mordida Tóxica, 1d6 perfurante.",
            "◆ Habilidade — Toxina Instável: em sucesso completo com Mordida Tóxica, o alvo faz JPF com CON ou fica Envenenado leve.",
            "◆ Habilidade — Deslocamento Serpentino: recebe +1 em Furtividade ou Acrobacia em corredores, dutos e espaços estreitos.",
            "◆ Habilidade — Recuo Predatório: após atacar alvo isolado, pode se mover 2 m sem provocar reação se houver cobertura próxima.",
            "Resistências: veneno comum leve.",
            "Fraquezas: frio intenso, luz súbita e bloqueio de rota de fuga.",
            "Sentidos: visão em baixa luz, olfato e percepção de calor fraca.",
            "◆ Moral: recua se perder vantagem de emboscada, mas volta a perseguir se sentir cheiro de sangue.",
            "◆ Recursos coletáveis: glândula tóxica, escamas, dente fino e implante corrompido.",
            "◆ Uso em campanha: excelente para horror de corredor e perseguição dentro de instalações.",
            "FONTE OFICIAL // Livro 3, 4.25"
          ]
        }
      ],
      "sheetType": "full",
      "needsCoreStats": false,
      "assets": [
        {
          "type": "image",
          "label": "Registro visual de Veyrkan Corrompido",
          "url": "./assets/bestiary/veyrkan-corrompido.jpg"
        }
      ],
      "source": "Livro 3, 2.45",
      "schemaVersion": 1,
      "image": "./assets/bestiary/veyrkan-corrompido.jpg"
    },
    {
      "id": "livro3-2-46-kairi-corrompido",
      "category": "monster",
      "name": "Kairi Corrompido",
      "tier": "C",
      "type": "humanoide corrompido/cósmico",
      "role": "controlador, ameaça emocional e foco de anomalia",
      "size": "médio",
      "pv": 36,
      "ca": 14,
      "movement": "8 m. Cosmos: 4",
      "habitat": "ruínas de ressonância, lagos cósmicos, templos antigos, locais Kairi profanados e zonas de sonho",
      "behavior": "",
      "attributes": "FOR 8/MOD -1; REF 12/MOD +1; CON 12/MOD +1; INT 12/MOD +1; MEN 16/MOD +3; PRE 16/MOD +3",
      "attacks": "◆ Ataques: Toque Ressonante, 1d8 cósmico; Grito Afogado, sem dano físico, mas força JPC.",
      "abilities": "◆ Habilidade — Canto Quebrado: uma vez por cena, alvos próximos fazem JPC com PRE. Em falha, recebem +1 Estresse ou ficam Tontos até o fim da próxima rodada.\n◆ Habilidade — Memória Afogada: em crítico com Toque Ressonante, o alvo vê uma memória que não é sua e sofre -1 no próximo teste de MEN.\n◆ Habilidade — Ressonância Instável: se usar Cosmos perto dele, o personagem faz JPC com MEN para evitar eco, interferência ou +1 Estresse.",
      "resistances": "Resistências: dano cósmico fraco e medo comum.",
      "weaknesses": "◆ Fraquezas: música Kairi verdadeira, símbolo ritual correto, contenção cósmica e apelo emocional ligado à memória perdida.",
      "senses": "◆ Sentidos: Percepção Cósmica instintiva e sensibilidade a emoção forte.",
      "moral": "◆ Moral: não age por fome. Pode proteger local, repetir canto antigo ou tentar arrastar outros para a própria visão.",
      "resources": "◆ Recursos coletáveis: cristal lacrimal, fio de voz, marca cósmica e fragmento de foco quebrado.",
      "campaign": "◆ Uso em campanha: ameaça trágica e rara. Deve ser usada com peso narrativo, não como inimigo comum.\nFONTE OFICIAL // Livro 3, 4.26\nCHEFES E AMEAÇAS LENDÁRIAS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nEntidades, máquinas e predadores concebidos como encontros centrais de campanha.",
      "summary": "◆ Uso em campanha: ameaça trágica e rara. Deve ser usada com peso narrativo, não como inimigo comum.\nFONTE OFICIAL // Livro 3, 4.26\nCHEFES E AMEAÇAS LENDÁRIAS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nEntidades, máquinas e predadores concebidos como encontros centrais de campanha.",
      "tags": [
        "C",
        "humanoide corrompido/cósmico",
        "controlador, ameaça emocional e foco de anomalia",
        "médio"
      ],
      "details": [
        {
          "label": "Resumo",
          "items": [
            "REGISTRO VISUAL // C // humanoide corrompido/cósmico",
            "Tier: C",
            "Tipo: humanoide corrompido/cósmico",
            "Papel: controlador, ameaça emocional e foco de anomalia",
            "Tamanho: médio",
            "Habitat: ruínas de ressonância, lagos cósmicos, templos antigos, locais Kairi profanados e zonas de sonho",
            "PV: 36",
            "CA: 14",
            "Movimento: 8 m. Cosmos: 4",
            "Atributos importantes: FOR 8/MOD -1; REF 12/MOD +1; CON 12/MOD +1; INT 12/MOD +1; MEN 16/MOD +3; PRE 16/MOD +3",
            "◆ Ataques: Toque Ressonante, 1d8 cósmico; Grito Afogado, sem dano físico, mas força JPC.",
            "◆ Habilidade — Canto Quebrado: uma vez por cena, alvos próximos fazem JPC com PRE. Em falha, recebem +1 Estresse ou ficam Tontos até o fim da próxima rodada.",
            "◆ Habilidade — Memória Afogada: em crítico com Toque Ressonante, o alvo vê uma memória que não é sua e sofre -1 no próximo teste de MEN.",
            "◆ Habilidade — Ressonância Instável: se usar Cosmos perto dele, o personagem faz JPC com MEN para evitar eco, interferência ou +1 Estresse.",
            "Resistências: dano cósmico fraco e medo comum.",
            "◆ Fraquezas: música Kairi verdadeira, símbolo ritual correto, contenção cósmica e apelo emocional ligado à memória perdida.",
            "◆ Sentidos: Percepção Cósmica instintiva e sensibilidade a emoção forte.",
            "◆ Moral: não age por fome. Pode proteger local, repetir canto antigo ou tentar arrastar outros para a própria visão.",
            "◆ Recursos coletáveis: cristal lacrimal, fio de voz, marca cósmica e fragmento de foco quebrado.",
            "◆ Uso em campanha: ameaça trágica e rara. Deve ser usada com peso narrativo, não como inimigo comum.",
            "FONTE OFICIAL // Livro 3, 4.26",
            "CHEFES E AMEAÇAS LENDÁRIAS",
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
            "Entidades, máquinas e predadores concebidos como encontros centrais de campanha."
          ]
        }
      ],
      "sheetType": "full",
      "needsCoreStats": false,
      "assets": [
        {
          "type": "image",
          "label": "Registro visual de Kairi Corrompido",
          "url": "./assets/bestiary/kairi-corrompido.jpg"
        }
      ],
      "source": "Livro 3, 2.46",
      "schemaVersion": 1,
      "image": "./assets/bestiary/kairi-corrompido.jpg"
    },
    {
      "id": "livro3-3-1-rasktorian-ancestral",
      "category": "monster",
      "name": "Rasktorian Ancestral",
      "tier": "A",
      "type": "Predador Alfa lendario",
      "role": "Chefe, brutamontes e predador rapido",
      "size": "Enorme",
      "pv": 115,
      "ca": 18,
      "movement": "12 m",
      "habitat": "Campos rochosos, ruinas abertas e territorio antigo de caca",
      "behavior": "",
      "attributes": "FOR 22/MOD +6, REF 18/MOD +4, CON 22/MOD +6, MEN 16/MOD +3, PRE 18/MOD +4",
      "attacks": "◆ Garra Ancestral: 2d6 cortante.\n◆ Mordida de Ruptura: 2d6 perfurante.\n◆ Impacto de Cauda: 1d10 concussao em alvo adjacente.",
      "abilities": "◆ Rugido de Predador-Rei: uma vez por cena, inimigos proximos fazem JPC com MEN ou PRE. Em falha, recebem +1 Estresse e -1 no proximo ataque contra o Rasktorian Ancestral.\n◆ Salto Impossivel: pode saltar grandes distancias dentro da arena, ignorando terreno dificil. Ao cair perto de personagens, alvos adjacentes fazem JPF com REF ou ficam Derrubados.\n◆ Sangue de Alfa: abaixo de metade dos PV, o sangue cosmico-adrenal altera Rasktorians menores, fazendo-os entrar em furia ou fugir.\n◆ Destruir Cobertura: uma vez por rodada, ao errar ou acertar ataque contra alvo em cobertura, pode destruir cobertura leve ou danificar cobertura media.\n◆ Mover metade do deslocamento.\n◆ Atacar com Cauda.\n◆ Rugir para chamar Rasktorians menores.\n◆ Se for cercado por tres ou mais inimigos, pode empurrar todos adjacentes. Alvos fazem JPF com FOR ou REF.\nFase 1: caca e testa o grupo.\n◆ Fase 2: abaixo de metade dos PV, torna-se agressivo e causa +1 dano corpo a corpo.\n◆ Fase 3: abaixo de 20 PV, tenta matar quem mais o feriu ou recuar para territorio profundo.",
      "resistances": "◆ Resistencias: Reducao 2 contra dano fisico comum. Resistencia contra medo comum.\n◆ Fraquezas: Orgulho territorial, feromonios de desafio e ferida antiga em uma das laterais, descoberta com Percepcao ou Biologia.",
      "weaknesses": "◆ Resistencias: Reducao 2 contra dano fisico comum. Resistencia contra medo comum.\n◆ Fraquezas: Orgulho territorial, feromonios de desafio e ferida antiga em uma das laterais, descoberta com Percepcao ou Biologia.",
      "senses": "",
      "moral": "",
      "resources": "◆ Condicoes que aplica: Derrubado, Sangrando, Medo ou Estresse.\n◆ Recursos ameacados: Armaduras, coberturas, cubos carregados durante fuga e rotas de retirada.\n◆ Recursos coletaveis: Presa Ancestral, Carapaca de Alfa Antigo, sangue adrenal raro, couro superior e glandula de dominio.",
      "campaign": "◆ Como pode ser derrotado sem matar: Atrair para fora do territorio, vencer ritual de dominio, ferir gravemente e permitir retirada ou usar feromonio para redirecionar o bando.\n◆ Se vencer, o grupo pode ser cacado pelo bando e rotas proximas se tornam perigosas.\n◆ Se fugir, vira ameaca recorrente e pode atacar caravanas ligadas ao grupo.\n◆ Se for derrotado, o territorio fica instavel e Rasktorians menores se dispersam. A carapaca pode conter marcas azuis antigas.\nFONTE OFICIAL // Livro 3, 3.1",
      "summary": "◆ Como pode ser derrotado sem matar: Atrair para fora do territorio, vencer ritual de dominio, ferir gravemente e permitir retirada ou usar feromonio para redirecionar o bando.\n◆ Se vencer, o grupo pode ser cacado pelo bando e rotas proximas se tornam perigosas.\n◆ Se fugir, vira ameaca recorrente e pode atacar caravanas ligadas ao grupo.\n◆ Se for derrotado, o territorio fica instavel e Rasktorians menores se dispersam. A carapaca pode conter marcas azuis antigas.\nFONTE OFICIAL // Livro 3, 3.1",
      "tags": [
        "A",
        "Predador Alfa lendario",
        "Chefe, brutamontes e predador rapido",
        "Enorme",
        "Chefe"
      ],
      "details": [
        {
          "label": "Resumo",
          "items": [
            "REGISTRO VISUAL // A // Predador Alfa lendario",
            "Tier: A",
            "Tipo: Predador Alfa lendario",
            "Papel: Chefe, brutamontes e predador rapido",
            "Tamanho: Enorme",
            "Habitat: Campos rochosos, ruinas abertas e territorio antigo de caca",
            "PV: 115",
            "CA: 18",
            "Movimento: 12 m",
            "Atributos importantes: FOR 22/MOD +6, REF 18/MOD +4, CON 22/MOD +6, MEN 16/MOD +3, PRE 18/MOD +4"
          ]
        },
        {
          "label": "Sinais antes do encontro",
          "items": [
            "◆ Ossos quebrados ao meio.",
            "◆ Rastros maiores que um corpo humano.",
            "◆ Rugido ouvido a quilometros.",
            "◆ Rasktorians menores fugindo.",
            "◆ Pedras marcadas por garras."
          ]
        },
        {
          "label": "Ataques",
          "items": [
            "◆ Garra Ancestral: 2d6 cortante.",
            "◆ Mordida de Ruptura: 2d6 perfurante.",
            "◆ Impacto de Cauda: 1d10 concussao em alvo adjacente."
          ]
        },
        {
          "label": "Habilidades principais",
          "items": [
            "◆ Rugido de Predador-Rei: uma vez por cena, inimigos proximos fazem JPC com MEN ou PRE. Em falha, recebem +1 Estresse e -1 no proximo ataque contra o Rasktorian Ancestral.",
            "◆ Salto Impossivel: pode saltar grandes distancias dentro da arena, ignorando terreno dificil. Ao cair perto de personagens, alvos adjacentes fazem JPF com REF ou ficam Derrubados.",
            "◆ Sangue de Alfa: abaixo de metade dos PV, o sangue cosmico-adrenal altera Rasktorians menores, fazendo-os entrar em furia ou fugir.",
            "◆ Destruir Cobertura: uma vez por rodada, ao errar ou acertar ataque contra alvo em cobertura, pode destruir cobertura leve ou danificar cobertura media."
          ]
        },
        {
          "label": "Acoes de chefe",
          "items": [
            "◆ Mover metade do deslocamento.",
            "◆ Atacar com Cauda.",
            "◆ Rugir para chamar Rasktorians menores."
          ]
        },
        {
          "label": "Reacoes",
          "items": [
            "◆ Se for cercado por tres ou mais inimigos, pode empurrar todos adjacentes. Alvos fazem JPF com FOR ou REF."
          ]
        },
        {
          "label": "Fases",
          "items": [
            "Fase 1: caca e testa o grupo.",
            "◆ Fase 2: abaixo de metade dos PV, torna-se agressivo e causa +1 dano corpo a corpo.",
            "◆ Fase 3: abaixo de 20 PV, tenta matar quem mais o feriu ou recuar para territorio profundo."
          ]
        },
        {
          "label": "Resistencias e fraquezas",
          "items": [
            "◆ Resistencias: Reducao 2 contra dano fisico comum. Resistencia contra medo comum.",
            "◆ Fraquezas: Orgulho territorial, feromonios de desafio e ferida antiga em uma das laterais, descoberta com Percepcao ou Biologia."
          ]
        },
        {
          "label": "Condicoes, recursos e coleta",
          "items": [
            "◆ Condicoes que aplica: Derrubado, Sangrando, Medo ou Estresse.",
            "◆ Recursos ameacados: Armaduras, coberturas, cubos carregados durante fuga e rotas de retirada.",
            "◆ Recursos coletaveis: Presa Ancestral, Carapaca de Alfa Antigo, sangue adrenal raro, couro superior e glandula de dominio."
          ]
        },
        {
          "label": "Solucoes e consequencias",
          "items": [
            "◆ Como pode ser derrotado sem matar: Atrair para fora do territorio, vencer ritual de dominio, ferir gravemente e permitir retirada ou usar feromonio para redirecionar o bando.",
            "◆ Se vencer, o grupo pode ser cacado pelo bando e rotas proximas se tornam perigosas.",
            "◆ Se fugir, vira ameaca recorrente e pode atacar caravanas ligadas ao grupo.",
            "◆ Se for derrotado, o territorio fica instavel e Rasktorians menores se dispersam. A carapaca pode conter marcas azuis antigas.",
            "FONTE OFICIAL // Livro 3, 3.1"
          ]
        }
      ],
      "sheetType": "boss",
      "needsCoreStats": false,
      "assets": [
        {
          "type": "image",
          "label": "Registro visual de Rasktorian Ancestral",
          "url": "./assets/bestiary/rasktorian-ancestral.jpg"
        }
      ],
      "source": "Livro 3, 3.1",
      "schemaVersion": 1,
      "image": "./assets/bestiary/rasktorian-ancestral.jpg"
    },
    {
      "id": "livro3-3-2-matriarca-abissal",
      "category": "monster",
      "name": "Matriarca Abissal",
      "tier": "A",
      "type": "Nyxaracne superior/cosmica",
      "role": "Chefe, controlador e suporte",
      "size": "Enorme",
      "pv": 95,
      "ca": 17,
      "movement": "8 m, escalada 10 m",
      "habitat": "Ninho profundo, caverna vertical ou ruina tomada por teias negras",
      "behavior": "",
      "attributes": "FOR 18/MOD +4, REF 18/MOD +4, CON 20/MOD +5, MEN 18/MOD +4, PRE 16/MOD +3",
      "attacks": "◆ Presas Abissais: 2d6 perfurante.\n◆ Pata Serrada: 1d10 cortante.\n◆ Jato de Teia: forca JPF com REF para evitar Imobilizado.",
      "abilities": "◆ Dominio de Teia: na arena com teias, ignora penalidades e move-se por paredes e teto sem custo adicional.\n◆ Apagar Todas as Luzes: uma vez por cena, reduz ou apaga fontes pequenas e medias de luz. Luz cosmica forte ou fogo intenso resiste melhor.\n◆ Ninhada Infinita: no fim de cada rodada, se houver ovos intactos, 1 criatura menor surge ou se move.\n◆ Casulo Vivo: personagens presos em casulos fazem JPF com CON a cada rodada ou ficam Tontos.\n◆ Criar area de teia.\n◆ Mover filhotes.\n◆ Puxar alvo Imobilizado 2 m.\n◆ Apagar uma fonte de luz menor.\n◆ Quando sofre dano de fogo, pode recuar 4 m pelas teias, uma vez por rodada.\nFase 1: controla area e separa o grupo.\nFase 2: abaixo de metade dos PV, chama ninhada e ataca diretamente.\n◆ Fase 3: se ovos forem destruidos, entra em Furia Materna, ganhando +1 dano e perdendo cautela.",
      "resistances": "◆ Resistencias: Resistencia leve contra perfurante e resistencia contra escuridao.\n◆ Fraquezas: Fogo, luz intensa e destruicao dos pontos principais da teia.",
      "weaknesses": "◆ Resistencias: Resistencia leve contra perfurante e resistencia contra escuridao.\n◆ Fraquezas: Fogo, luz intensa e destruicao dos pontos principais da teia.",
      "senses": "",
      "moral": "",
      "resources": "◆ Condicoes que aplica: Imobilizado, Tonto e Medo.\n◆ Recursos ameacados: Luz, oxigenio em casulos, cubos presos em teia e armas corpo a corpo.\n◆ Recursos coletaveis: Teia abissal, veneno concentrado, olho da Matriarca, ovos e quitina negra.",
      "campaign": "◆ Como pode ser derrotado sem matar: Remover ou proteger ovos e abandonar territorio, oferecer presa maior, selar entrada do ninho ou usar luz e fogo para forcar retirada.\n◆ Se vencer, tuneis ficam inacessiveis e NPCs capturados viram casulos.\n◆ Se fugir, reconstrói o ninho em local mais perigoso.\n◆ Se derrotada, a ninhada se dispersa e uma passagem antiga sob o ninho pode ser revelada.\nFONTE OFICIAL // Livro 3, 3.2",
      "summary": "◆ Como pode ser derrotado sem matar: Remover ou proteger ovos e abandonar territorio, oferecer presa maior, selar entrada do ninho ou usar luz e fogo para forcar retirada.\n◆ Se vencer, tuneis ficam inacessiveis e NPCs capturados viram casulos.\n◆ Se fugir, reconstrói o ninho em local mais perigoso.\n◆ Se derrotada, a ninhada se dispersa e uma passagem antiga sob o ninho pode ser revelada.\nFONTE OFICIAL // Livro 3, 3.2",
      "tags": [
        "A",
        "Nyxaracne superior/cosmica",
        "Chefe, controlador e suporte",
        "Enorme",
        "Chefe"
      ],
      "details": [
        {
          "label": "Resumo",
          "items": [
            "REGISTRO VISUAL // A // Nyxaracne superior/cosmica",
            "Tier: A",
            "Tipo: Nyxaracne superior/cosmica",
            "Papel: Chefe, controlador e suporte",
            "Tamanho: Enorme",
            "Habitat: Ninho profundo, caverna vertical ou ruina tomada por teias negras",
            "PV: 95",
            "CA: 17",
            "Movimento: 8 m, escalada 10 m",
            "Atributos importantes: FOR 18/MOD +4, REF 18/MOD +4, CON 20/MOD +5, MEN 18/MOD +4, PRE 16/MOD +3"
          ]
        },
        {
          "label": "Sinais antes do encontro",
          "items": [
            "◆ Luzes apagadas por teias.",
            "◆ Casulos vazios.",
            "◆ Sussurros abafados.",
            "◆ Teias vibrando sem vento.",
            "◆ Corpos pendurados, ainda vivos."
          ]
        },
        {
          "label": "Ataques",
          "items": [
            "◆ Presas Abissais: 2d6 perfurante.",
            "◆ Pata Serrada: 1d10 cortante.",
            "◆ Jato de Teia: forca JPF com REF para evitar Imobilizado."
          ]
        },
        {
          "label": "Habilidades principais",
          "items": [
            "◆ Dominio de Teia: na arena com teias, ignora penalidades e move-se por paredes e teto sem custo adicional.",
            "◆ Apagar Todas as Luzes: uma vez por cena, reduz ou apaga fontes pequenas e medias de luz. Luz cosmica forte ou fogo intenso resiste melhor.",
            "◆ Ninhada Infinita: no fim de cada rodada, se houver ovos intactos, 1 criatura menor surge ou se move.",
            "◆ Casulo Vivo: personagens presos em casulos fazem JPF com CON a cada rodada ou ficam Tontos."
          ]
        },
        {
          "label": "Acoes de chefe",
          "items": [
            "◆ Criar area de teia.",
            "◆ Mover filhotes.",
            "◆ Puxar alvo Imobilizado 2 m.",
            "◆ Apagar uma fonte de luz menor."
          ]
        },
        {
          "label": "Reacoes",
          "items": [
            "◆ Quando sofre dano de fogo, pode recuar 4 m pelas teias, uma vez por rodada."
          ]
        },
        {
          "label": "Fases",
          "items": [
            "Fase 1: controla area e separa o grupo.",
            "Fase 2: abaixo de metade dos PV, chama ninhada e ataca diretamente.",
            "◆ Fase 3: se ovos forem destruidos, entra em Furia Materna, ganhando +1 dano e perdendo cautela."
          ]
        },
        {
          "label": "Resistencias e fraquezas",
          "items": [
            "◆ Resistencias: Resistencia leve contra perfurante e resistencia contra escuridao.",
            "◆ Fraquezas: Fogo, luz intensa e destruicao dos pontos principais da teia."
          ]
        },
        {
          "label": "Condicoes, recursos e coleta",
          "items": [
            "◆ Condicoes que aplica: Imobilizado, Tonto e Medo.",
            "◆ Recursos ameacados: Luz, oxigenio em casulos, cubos presos em teia e armas corpo a corpo.",
            "◆ Recursos coletaveis: Teia abissal, veneno concentrado, olho da Matriarca, ovos e quitina negra."
          ]
        },
        {
          "label": "Solucoes e consequencias",
          "items": [
            "◆ Como pode ser derrotado sem matar: Remover ou proteger ovos e abandonar territorio, oferecer presa maior, selar entrada do ninho ou usar luz e fogo para forcar retirada.",
            "◆ Se vencer, tuneis ficam inacessiveis e NPCs capturados viram casulos.",
            "◆ Se fugir, reconstrói o ninho em local mais perigoso.",
            "◆ Se derrotada, a ninhada se dispersa e uma passagem antiga sob o ninho pode ser revelada.",
            "FONTE OFICIAL // Livro 3, 3.2"
          ]
        }
      ],
      "sheetType": "boss",
      "needsCoreStats": false,
      "assets": [
        {
          "type": "image",
          "label": "Registro visual de Matriarca Abissal",
          "url": "./assets/bestiary/matriarca-abissal.jpg"
        }
      ],
      "source": "Livro 3, 3.2",
      "schemaVersion": 1,
      "image": "./assets/bestiary/matriarca-abissal.jpg"
    },
    {
      "id": "livro3-3-3-sentinela-tharan",
      "category": "monster",
      "name": "Sentinela Tharan",
      "tier": "A",
      "type": "Maquina antiga/guardiao de portal",
      "role": "Chefe, guardiao e tanque",
      "size": "Grande",
      "pv": 110,
      "ca": 19,
      "movement": "7 m",
      "habitat": "Camara de portal, ruina antiga ou entrada Tharan selada",
      "behavior": "",
      "attributes": "FOR 20/MOD +5, CON 22/MOD +6, INT 16/MOD +3, MEN 14/MOD +2, PRE 10/MOD +0",
      "attacks": "◆ Lamina de Contencao: 2d6 cortante.\n◆ Canhao de Pulso: 2d6 energetico.\n◆ Golpe de Escudo: 1d10 concussao e JPF com FOR ou Derrubado.",
      "abilities": "◆ Protocolo Tharan: nao inicia combate imediatamente se os personagens apresentarem simbolo, frase ou autorizacao antiga.\n◆ Campo de Contencao: cria zona onde movimento e reduzido pela metade ate o fim da proxima rodada.\n◆ Escudo Rotativo: uma vez por rodada, reduz em 3 o dano de um ataque.\n◆ Leitura de Chip: identifica chip de profissao ativo e escolhe alvo considerado risco de abertura.\n◆ Ativar campo de contencao.\n◆ Disparar pulso menor.\n◆ Fechar porta ou bloquear passagem.\n◆ Mover drone auxiliar.\n◆ Ao receber dano eletrico ou tecnologico, pode redirecionar parte da energia. O atacante faz teste de Tecnologia ou o equipamento usado sofre Jammed.\nFase 1: modo advertencia.\nFase 2: abaixo de 70 PV, modo defesa ativa.\n◆ Fase 3: abaixo de 30 PV, modo selamento total; o portal comeca a fechar ou sobrecarregar.",
      "resistances": "◆ Resistencias: Imune a veneno, doenca e medo comum. Reducao 2 contra fisico comum. Resistencia contra fogo e frio.\n◆ Fraquezas: Comando antigo correto, nucleo exposto apos Canhao de Pulso e sobrecarga coordenada em tres pilares da arena.",
      "weaknesses": "◆ Resistencias: Imune a veneno, doenca e medo comum. Reducao 2 contra fisico comum. Resistencia contra fogo e frio.\n◆ Fraquezas: Comando antigo correto, nucleo exposto apos Canhao de Pulso e sobrecarga coordenada em tres pilares da arena.",
      "senses": "",
      "moral": "",
      "resources": "◆ Condicoes que aplica: Derrubado, Jammed e Imobilizado por campo.\n◆ Recursos ameacados: Chips, armas tecnologicas, cubos proximos ao portal e energia da sala.\n◆ Recursos coletaveis: Placa Tharan, nucleo de contencao, lente de leitura antiga e fragmento de comando.",
      "campaign": "◆ Como pode ser derrotado sem matar: Desativar protocolo, apresentar autorizacao correta, desligar pilares ou convencer a Sentinela de que o portal foi corrompido.\n◆ Se vencer, o portal permanece selado e o grupo pode ser marcado como intruso por sistemas antigos.\n◆ Se fugir, a Sentinela registra a assinatura dos personagens.\n◆ Se derrotada, o portal pode ficar instavel e faccoes tentarao controlar a camara.\nFONTE OFICIAL // Livro 3, 3.3",
      "summary": "◆ Como pode ser derrotado sem matar: Desativar protocolo, apresentar autorizacao correta, desligar pilares ou convencer a Sentinela de que o portal foi corrompido.\n◆ Se vencer, o portal permanece selado e o grupo pode ser marcado como intruso por sistemas antigos.\n◆ Se fugir, a Sentinela registra a assinatura dos personagens.\n◆ Se derrotada, o portal pode ficar instavel e faccoes tentarao controlar a camara.\nFONTE OFICIAL // Livro 3, 3.3",
      "tags": [
        "A",
        "Maquina antiga/guardiao de portal",
        "Chefe, guardiao e tanque",
        "Grande",
        "Chefe"
      ],
      "details": [
        {
          "label": "Resumo",
          "items": [
            "REGISTRO VISUAL // A // Maquina antiga/guardiao de portal",
            "Tier: A",
            "Tipo: Maquina antiga/guardiao de portal",
            "Papel: Chefe, guardiao e tanque",
            "Tamanho: Grande",
            "Habitat: Camara de portal, ruina antiga ou entrada Tharan selada",
            "PV: 110",
            "CA: 19",
            "Movimento: 7 m",
            "Atributos importantes: FOR 20/MOD +5, CON 22/MOD +6, INT 16/MOD +3, MEN 14/MOD +2, PRE 10/MOD +0"
          ]
        },
        {
          "label": "Sinais antes do encontro",
          "items": [
            "◆ Simbolos antigos acendendo.",
            "◆ Voz metalica em lingua antiga.",
            "◆ Piso com circulos concentricos.",
            "◆ Drones menores destruidos.",
            "◆ Chips de profissao oscilando."
          ]
        },
        {
          "label": "Ataques",
          "items": [
            "◆ Lamina de Contencao: 2d6 cortante.",
            "◆ Canhao de Pulso: 2d6 energetico.",
            "◆ Golpe de Escudo: 1d10 concussao e JPF com FOR ou Derrubado."
          ]
        },
        {
          "label": "Habilidades principais",
          "items": [
            "◆ Protocolo Tharan: nao inicia combate imediatamente se os personagens apresentarem simbolo, frase ou autorizacao antiga.",
            "◆ Campo de Contencao: cria zona onde movimento e reduzido pela metade ate o fim da proxima rodada.",
            "◆ Escudo Rotativo: uma vez por rodada, reduz em 3 o dano de um ataque.",
            "◆ Leitura de Chip: identifica chip de profissao ativo e escolhe alvo considerado risco de abertura."
          ]
        },
        {
          "label": "Acoes de chefe",
          "items": [
            "◆ Ativar campo de contencao.",
            "◆ Disparar pulso menor.",
            "◆ Fechar porta ou bloquear passagem.",
            "◆ Mover drone auxiliar."
          ]
        },
        {
          "label": "Reacoes",
          "items": [
            "◆ Ao receber dano eletrico ou tecnologico, pode redirecionar parte da energia. O atacante faz teste de Tecnologia ou o equipamento usado sofre Jammed."
          ]
        },
        {
          "label": "Fases",
          "items": [
            "Fase 1: modo advertencia.",
            "Fase 2: abaixo de 70 PV, modo defesa ativa.",
            "◆ Fase 3: abaixo de 30 PV, modo selamento total; o portal comeca a fechar ou sobrecarregar."
          ]
        },
        {
          "label": "Resistencias e fraquezas",
          "items": [
            "◆ Resistencias: Imune a veneno, doenca e medo comum. Reducao 2 contra fisico comum. Resistencia contra fogo e frio.",
            "◆ Fraquezas: Comando antigo correto, nucleo exposto apos Canhao de Pulso e sobrecarga coordenada em tres pilares da arena."
          ]
        },
        {
          "label": "Condicoes, recursos e coleta",
          "items": [
            "◆ Condicoes que aplica: Derrubado, Jammed e Imobilizado por campo.",
            "◆ Recursos ameacados: Chips, armas tecnologicas, cubos proximos ao portal e energia da sala.",
            "◆ Recursos coletaveis: Placa Tharan, nucleo de contencao, lente de leitura antiga e fragmento de comando."
          ]
        },
        {
          "label": "Solucoes e consequencias",
          "items": [
            "◆ Como pode ser derrotado sem matar: Desativar protocolo, apresentar autorizacao correta, desligar pilares ou convencer a Sentinela de que o portal foi corrompido.",
            "◆ Se vencer, o portal permanece selado e o grupo pode ser marcado como intruso por sistemas antigos.",
            "◆ Se fugir, a Sentinela registra a assinatura dos personagens.",
            "◆ Se derrotada, o portal pode ficar instavel e faccoes tentarao controlar a camara.",
            "FONTE OFICIAL // Livro 3, 3.3"
          ]
        }
      ],
      "sheetType": "boss",
      "needsCoreStats": false,
      "assets": [
        {
          "type": "image",
          "label": "Registro visual de Sentinela Tharan",
          "url": "./assets/bestiary/sentinela-tharan.jpg"
        }
      ],
      "source": "Livro 3, 3.3",
      "schemaVersion": 1,
      "image": "./assets/bestiary/sentinela-tharan.jpg"
    },
    {
      "id": "livro3-3-4-eco-de-falaris",
      "category": "monster",
      "name": "Eco de Falaris",
      "tier": "S",
      "type": "Entidade cosmica/fragmento de Sol morto",
      "role": "Ameaca lendaria e entidade ambiental",
      "size": "Indefinido",
      "pv": 160,
      "ca": 18,
      "movement": "Manifesta-se por luz, rachaduras e avatares",
      "habitat": "Cristal colossal, camara de ruina, fragmento de Falaris ou zona cosmica",
      "behavior": "",
      "attributes": "MEN 24/MOD +7, PRE 22/MOD +6, CON 20/MOD +5, INT 18/MOD +4",
      "attacks": "◆ Pulso Solar Morto: 3d6 cosmico.\n◆ Lanca de Luz Quebrada: 2d6 fogo/cosmico.\n◆ Onda de Memoria: sem dano fisico, mas exige JPC com MEN.",
      "abilities": "◆ Memoria da Explosao: uma vez por cena, todos na area fazem JPC com MEN. Em falha, recebem +2 Estresse e visao de Falaris morto.\n◆ Calor de Estrela Morta: a cada rodada proxima da manifestacao, personagens sem protecao fazem JPF com CON ou sofrem Tonto, Exausto ou dano leve.\n◆ Fragmentar Realidade: o terreno muda, paredes parecem distantes, o chao vibra e portas aparecem onde nao existiam.\n◆ Chamar Fragmentos: cristais menores proximos pulsam; se nao forem estabilizados, aumentam o poder do Eco.\n◆ Ativar cristal menor.\n◆ Criar rachadura de luz.\n◆ Forcar visao em alvo marcado.\n◆ Desligar equipamento tecnologico por interferencia.\n◆ Quando sofre dano cosmico instavel, pode absorver parte da energia ou causar Falha Cosmica no usuario, a criterio do Mestre.\nFase 1: sussurro e pulsos.\nFase 2: manifestacao parcial.\nFase 3: memoria da explosao se repete e a camara comeca a colapsar.\nFase 4: contencao, fuga ou desastre.",
      "resistances": "◆ Resistencias: Resistencia contra dano fisico comum, fogo e dano cosmico fraco.\n◆ Fraquezas: Silencio Cosmico, ritual de contencao Nytharul, separacao dos fragmentos, estabilizacao por foco poderoso ou purificacao da ancora.",
      "weaknesses": "◆ Resistencias: Resistencia contra dano fisico comum, fogo e dano cosmico fraco.\n◆ Fraquezas: Silencio Cosmico, ritual de contencao Nytharul, separacao dos fragmentos, estabilizacao por foco poderoso ou purificacao da ancora.",
      "senses": "",
      "moral": "",
      "resources": "◆ Condicoes que aplica: Estresse, Tonto, Exausto, Marcado pelo Cosmos e Falha Cosmica.\n◆ Recursos ameacados: Chips, focos, cristais, armaduras canalizadas e estabilidade emocional do grupo.\n◆ Recursos coletaveis: Fragmento de Falaris, po solar morto, cristal de memoria e luz solidificada.",
      "campaign": "◆ Como pode ser derrotado sem matar: Conter a ancora, dividir fragmentos, completar ritual antigo, convencer a memoria de que a explosao terminou ou usar tecnologia de selamento.\n◆ Se vencer, a regiao pode ser consumida por anomalia e personagens podem sair marcados.\n◆ Se fugir, o Eco continua crescendo e sonhos se espalham.\n◆ Se contido, a area estabiliza parcialmente e o grupo ganha acesso a memoria antiga.\nFONTE OFICIAL // Livro 3, 3.4",
      "summary": "◆ Como pode ser derrotado sem matar: Conter a ancora, dividir fragmentos, completar ritual antigo, convencer a memoria de que a explosao terminou ou usar tecnologia de selamento.\n◆ Se vencer, a regiao pode ser consumida por anomalia e personagens podem sair marcados.\n◆ Se fugir, o Eco continua crescendo e sonhos se espalham.\n◆ Se contido, a area estabiliza parcialmente e o grupo ganha acesso a memoria antiga.\nFONTE OFICIAL // Livro 3, 3.4",
      "tags": [
        "S",
        "Entidade cosmica/fragmento de Sol morto",
        "Ameaca lendaria e entidade ambiental",
        "Indefinido",
        "Chefe"
      ],
      "details": [
        {
          "label": "Resumo",
          "items": [
            "REGISTRO VISUAL // S // Entidade cosmica/fragmento de Sol morto",
            "Tier: S",
            "Tipo: Entidade cosmica/fragmento de Sol morto",
            "Papel: Ameaca lendaria e entidade ambiental",
            "Tamanho: Indefinido",
            "Habitat: Cristal colossal, camara de ruina, fragmento de Falaris ou zona cosmica",
            "PV: 160",
            "CA: 18",
            "Movimento: Manifesta-se por luz, rachaduras e avatares",
            "Atributos importantes: MEN 24/MOD +7, PRE 22/MOD +6, CON 20/MOD +5, INT 18/MOD +4"
          ]
        },
        {
          "label": "Sinais antes do encontro",
          "items": [
            "◆ Calor sem fogo.",
            "◆ Luz azul-dourada pulsando.",
            "◆ Som de explosao muito distante.",
            "◆ Sombras apontando para o lugar errado.",
            "◆ Sonhos com um sol quebrando.",
            "◆ Maquinas antigas ligando em silencio."
          ]
        },
        {
          "label": "Ataques",
          "items": [
            "◆ Pulso Solar Morto: 3d6 cosmico.",
            "◆ Lanca de Luz Quebrada: 2d6 fogo/cosmico.",
            "◆ Onda de Memoria: sem dano fisico, mas exige JPC com MEN."
          ]
        },
        {
          "label": "Habilidades principais",
          "items": [
            "◆ Memoria da Explosao: uma vez por cena, todos na area fazem JPC com MEN. Em falha, recebem +2 Estresse e visao de Falaris morto.",
            "◆ Calor de Estrela Morta: a cada rodada proxima da manifestacao, personagens sem protecao fazem JPF com CON ou sofrem Tonto, Exausto ou dano leve.",
            "◆ Fragmentar Realidade: o terreno muda, paredes parecem distantes, o chao vibra e portas aparecem onde nao existiam.",
            "◆ Chamar Fragmentos: cristais menores proximos pulsam; se nao forem estabilizados, aumentam o poder do Eco."
          ]
        },
        {
          "label": "Acoes de chefe",
          "items": [
            "◆ Ativar cristal menor.",
            "◆ Criar rachadura de luz.",
            "◆ Forcar visao em alvo marcado.",
            "◆ Desligar equipamento tecnologico por interferencia."
          ]
        },
        {
          "label": "Reacoes",
          "items": [
            "◆ Quando sofre dano cosmico instavel, pode absorver parte da energia ou causar Falha Cosmica no usuario, a criterio do Mestre."
          ]
        },
        {
          "label": "Fases",
          "items": [
            "Fase 1: sussurro e pulsos.",
            "Fase 2: manifestacao parcial.",
            "Fase 3: memoria da explosao se repete e a camara comeca a colapsar.",
            "Fase 4: contencao, fuga ou desastre."
          ]
        },
        {
          "label": "Resistencias e fraquezas",
          "items": [
            "◆ Resistencias: Resistencia contra dano fisico comum, fogo e dano cosmico fraco.",
            "◆ Fraquezas: Silencio Cosmico, ritual de contencao Nytharul, separacao dos fragmentos, estabilizacao por foco poderoso ou purificacao da ancora."
          ]
        },
        {
          "label": "Condicoes, recursos e coleta",
          "items": [
            "◆ Condicoes que aplica: Estresse, Tonto, Exausto, Marcado pelo Cosmos e Falha Cosmica.",
            "◆ Recursos ameacados: Chips, focos, cristais, armaduras canalizadas e estabilidade emocional do grupo.",
            "◆ Recursos coletaveis: Fragmento de Falaris, po solar morto, cristal de memoria e luz solidificada."
          ]
        },
        {
          "label": "Solucoes e consequencias",
          "items": [
            "◆ Como pode ser derrotado sem matar: Conter a ancora, dividir fragmentos, completar ritual antigo, convencer a memoria de que a explosao terminou ou usar tecnologia de selamento.",
            "◆ Se vencer, a regiao pode ser consumida por anomalia e personagens podem sair marcados.",
            "◆ Se fugir, o Eco continua crescendo e sonhos se espalham.",
            "◆ Se contido, a area estabiliza parcialmente e o grupo ganha acesso a memoria antiga.",
            "FONTE OFICIAL // Livro 3, 3.4"
          ]
        }
      ],
      "sheetType": "boss",
      "needsCoreStats": false,
      "assets": [
        {
          "type": "image",
          "label": "Registro visual de Eco de Falaris",
          "url": "./assets/bestiary/eco-de-falaris.jpg"
        }
      ],
      "source": "Livro 3, 3.4",
      "schemaVersion": 1,
      "image": "./assets/bestiary/eco-de-falaris.jpg"
    },
    {
      "id": "livro3-3-5-arauto-de-uryon",
      "category": "monster",
      "name": "Arauto de Uryon",
      "tier": "S",
      "type": "Entidade cosmica/servo ou reflexo de Uryon",
      "role": "Ameaca final e controlador psicologico",
      "size": "Variavel",
      "pv": 180,
      "ca": 19,
      "movement": "10 m, Fenda Curta entre sombras",
      "habitat": "Zonas de vazio, portais corrompidos, sonhos compartilhados e ruinas ligadas a Uryon",
      "behavior": "",
      "attributes": "MEN 26/MOD +8, PRE 24/MOD +7, CON 20/MOD +5, INT 20/MOD +5, REF 16/MOD +3",
      "attacks": "◆ Toque da Ausencia: 3d6 cosmico.\n◆ Garra Impossivel: 2d6 cortante.\n◆ Comando do Vazio: JPC com MEN ou PRE, conforme o efeito.",
      "abilities": "◆ Nome Verdadeiro Distorcido: escolhe um alvo e fala algo que nao deveria saber. O alvo faz JPC. Em falha, recebe +2 Estresse ou fica com Medo.\n◆ Apagar Memoria Curta: uma vez por cena, apos uma falha de personagem, pode fazer o personagem esquecer a ultima informacao obtida, salvo registro de outro personagem.\n◆ Vazio Entre Passos: atravessa sombras, rachaduras ou reflexos escuros como movimento especial.\n◆ Chamado de Uryon: personagens com Marca Cosmica ou Estresse alto sofrem -1 no primeiro teste contra o Arauto.\n◆ Presenca Impossivel: enquanto a ancora estiver ativa, ataques fisicos comuns causam metade do dano.\n◆ Mover por sombra.\n◆ Forcar teste de medo em alvo isolado.\n◆ Apagar fonte de luz.\n◆ Ativar simbolo de Uryon.\n◆ Puxar personagem marcado 2 m.\n◆ Quando um personagem usa poder cosmico, o Arauto pode responder com sussurro. O personagem faz JPC ou sofre +1 Estresse.\nFase 1: presenca e manipulacao.\nFase 2: manifestacao fisica.\nFase 3: tentativa de marcar ou levar personagem.\nFase 4: se a ancora for destruida, colapsa em sombra e deixa aviso.",
      "resistances": "◆ Resistencias: Resistencia contra fisico comum, medo, cosmico fraco, veneno e doenca.\n◆ Fraquezas: Luz de contencao antiga, nome correto de selamento, destruicao da ancora, memorias verdadeiras usadas contra ele e uniao do grupo para resistir ao medo.",
      "weaknesses": "◆ Resistencias: Resistencia contra fisico comum, medo, cosmico fraco, veneno e doenca.\n◆ Fraquezas: Luz de contencao antiga, nome correto de selamento, destruicao da ancora, memorias verdadeiras usadas contra ele e uniao do grupo para resistir ao medo.",
      "senses": "",
      "moral": "",
      "resources": "◆ Condicoes que aplica: Medo, Estresse, Marcado pelo Cosmos, Silencio Cosmico e perda de memoria curta.\n◆ Recursos ameacados: Identidade, memorias, focos, chips e confianca entre personagens.\n◆ Recursos coletaveis: Fragmento de Vazio, Eco de Uryon, marca impossivel e residuo de sombra consciente.",
      "campaign": "◆ Como pode ser derrotado sem matar: Romper a ancora, fechar portal, recusar o chamado coletivamente, realizar ritual de nomeacao ou usar memoria verdadeira para estabilizar a realidade.\n◆ Se vencer, um personagem pode ser marcado e uma regiao pode se tornar zona de vazio.\n◆ Se fugir, passa a aparecer em sonhos e conhece o grupo.\n◆ Se contido, o portal enfraquece e uma verdade sobre Uryon e revelada.\nFONTE OFICIAL // Livro 3, 3.5",
      "summary": "◆ Como pode ser derrotado sem matar: Romper a ancora, fechar portal, recusar o chamado coletivamente, realizar ritual de nomeacao ou usar memoria verdadeira para estabilizar a realidade.\n◆ Se vencer, um personagem pode ser marcado e uma regiao pode se tornar zona de vazio.\n◆ Se fugir, passa a aparecer em sonhos e conhece o grupo.\n◆ Se contido, o portal enfraquece e uma verdade sobre Uryon e revelada.\nFONTE OFICIAL // Livro 3, 3.5",
      "tags": [
        "S",
        "Entidade cosmica/servo ou reflexo de Uryon",
        "Ameaca final e controlador psicologico",
        "Variavel",
        "Chefe"
      ],
      "details": [
        {
          "label": "Resumo",
          "items": [
            "REGISTRO VISUAL // S // Entidade cosmica/servo ou reflexo de Uryon",
            "Tier: S",
            "Tipo: Entidade cosmica/servo ou reflexo de Uryon",
            "Papel: Ameaca final e controlador psicologico",
            "Tamanho: Variavel",
            "Habitat: Zonas de vazio, portais corrompidos, sonhos compartilhados e ruinas ligadas a Uryon",
            "PV: 180",
            "CA: 19",
            "Movimento: 10 m, Fenda Curta entre sombras",
            "Atributos importantes: MEN 26/MOD +8, PRE 24/MOD +7, CON 20/MOD +5, INT 20/MOD +5, REF 16/MOD +3"
          ]
        },
        {
          "label": "Sinais antes do encontro",
          "items": [
            "◆ Ninguem lembra exatamente quando chegou ao local.",
            "◆ Sombras se movem sem corpo.",
            "◆ Simbolos mudam quando nao observados.",
            "◆ Personagens escutam nomes em vozes de mortos.",
            "◆ Agua fica negra e imovel.",
            "◆ Estrelas parecem desaparecer."
          ]
        },
        {
          "label": "Ataques",
          "items": [
            "◆ Toque da Ausencia: 3d6 cosmico.",
            "◆ Garra Impossivel: 2d6 cortante.",
            "◆ Comando do Vazio: JPC com MEN ou PRE, conforme o efeito."
          ]
        },
        {
          "label": "Habilidades principais",
          "items": [
            "◆ Nome Verdadeiro Distorcido: escolhe um alvo e fala algo que nao deveria saber. O alvo faz JPC. Em falha, recebe +2 Estresse ou fica com Medo.",
            "◆ Apagar Memoria Curta: uma vez por cena, apos uma falha de personagem, pode fazer o personagem esquecer a ultima informacao obtida, salvo registro de outro personagem.",
            "◆ Vazio Entre Passos: atravessa sombras, rachaduras ou reflexos escuros como movimento especial.",
            "◆ Chamado de Uryon: personagens com Marca Cosmica ou Estresse alto sofrem -1 no primeiro teste contra o Arauto.",
            "◆ Presenca Impossivel: enquanto a ancora estiver ativa, ataques fisicos comuns causam metade do dano."
          ]
        },
        {
          "label": "Acoes de chefe",
          "items": [
            "◆ Mover por sombra.",
            "◆ Forcar teste de medo em alvo isolado.",
            "◆ Apagar fonte de luz.",
            "◆ Ativar simbolo de Uryon.",
            "◆ Puxar personagem marcado 2 m."
          ]
        },
        {
          "label": "Reacoes",
          "items": [
            "◆ Quando um personagem usa poder cosmico, o Arauto pode responder com sussurro. O personagem faz JPC ou sofre +1 Estresse."
          ]
        },
        {
          "label": "Fases",
          "items": [
            "Fase 1: presenca e manipulacao.",
            "Fase 2: manifestacao fisica.",
            "Fase 3: tentativa de marcar ou levar personagem.",
            "Fase 4: se a ancora for destruida, colapsa em sombra e deixa aviso."
          ]
        },
        {
          "label": "Resistencias e fraquezas",
          "items": [
            "◆ Resistencias: Resistencia contra fisico comum, medo, cosmico fraco, veneno e doenca.",
            "◆ Fraquezas: Luz de contencao antiga, nome correto de selamento, destruicao da ancora, memorias verdadeiras usadas contra ele e uniao do grupo para resistir ao medo."
          ]
        },
        {
          "label": "Condicoes, recursos e coleta",
          "items": [
            "◆ Condicoes que aplica: Medo, Estresse, Marcado pelo Cosmos, Silencio Cosmico e perda de memoria curta.",
            "◆ Recursos ameacados: Identidade, memorias, focos, chips e confianca entre personagens.",
            "◆ Recursos coletaveis: Fragmento de Vazio, Eco de Uryon, marca impossivel e residuo de sombra consciente."
          ]
        },
        {
          "label": "Solucoes e consequencias",
          "items": [
            "◆ Como pode ser derrotado sem matar: Romper a ancora, fechar portal, recusar o chamado coletivamente, realizar ritual de nomeacao ou usar memoria verdadeira para estabilizar a realidade.",
            "◆ Se vencer, um personagem pode ser marcado e uma regiao pode se tornar zona de vazio.",
            "◆ Se fugir, passa a aparecer em sonhos e conhece o grupo.",
            "◆ Se contido, o portal enfraquece e uma verdade sobre Uryon e revelada.",
            "FONTE OFICIAL // Livro 3, 3.5"
          ]
        }
      ],
      "sheetType": "boss",
      "needsCoreStats": false,
      "assets": [
        {
          "type": "image",
          "label": "Registro visual de Arauto de Uryon",
          "url": "./assets/bestiary/arauto-de-uryon.jpg"
        }
      ],
      "source": "Livro 3, 3.5",
      "schemaVersion": 1,
      "image": "./assets/bestiary/arauto-de-uryon.jpg"
    },
    {
      "id": "livro3-3-6-comandante-saqueador-com-exotraje",
      "category": "monster",
      "name": "Comandante Saqueador com Exotraje",
      "tier": "B",
      "type": "Humanoide hostil/tecnologico",
      "role": "Chefe tatico e brutamontes",
      "size": "Medio em exotraje pesado",
      "pv": 70,
      "ca": 16,
      "movement": "8 m",
      "habitat": "Acampamento saqueador, oficina roubada ou rota fortificada",
      "behavior": "",
      "attributes": "FOR 18/MOD +4 com exotraje, REF 12/MOD +1, CON 16/MOD +3, INT 12/MOD +1, PRE 16/MOD +3",
      "attacks": "◆ Punho Hidraulico: 1d10 concussao.\n◆ Metralhadora Leve: 1d8 balistico.\n◆ Arremesso de Carga: 1d8 concussao.",
      "abilities": "◆ Escudo Improvisado: usa cobertura ou veiculo destruido para receber +1 CA.\n◆ Ordem Brutal: uma vez por rodada, comanda saqueador aliado a atacar ou se mover.\n◆ Exotraje Instavel: ao sofrer critico, o exotraje ganha 1 falha. Com 3 falhas, perde movimento ou uma arma.\n◆ Pisar e Quebrar: contra alvo Derrubado, causa +1d4 dano ou tenta danificar item em gancho.\n◆ Comandar aliado.\n◆ Disparar rajada curta.\n◆ Mover e empurrar alvo.\n◆ Quando sofre dano corpo a corpo, pode empurrar atacante 2 m com o exotraje.\nFase 1: usa saqueadores e cobertura.\nFase 2: quando aliados caem, entra no combate direto.\nFase 3: se o exotraje falhar, tenta fugir ou explodir munição.",
      "resistances": "Resistencias: Reducao 1 contra dano fisico comum por blindagem.\n◆ Fraquezas: Juntas do exotraje, pulso eletrico, hack e superaquecimento.",
      "weaknesses": "Resistencias: Reducao 1 contra dano fisico comum por blindagem.\n◆ Fraquezas: Juntas do exotraje, pulso eletrico, hack e superaquecimento.",
      "senses": "",
      "moral": "",
      "resources": "◆ Condicoes que aplica: Derrubado e Jammed em supressao.\nRecursos ameacados: Cubos, municao, cobertura e armadura.\n◆ Recursos coletaveis: Exotraje danificado, bateria militar, arma pesada e mapas de rotas saqueadas.",
      "campaign": "◆ Como pode ser derrotado sem matar: Sabotar exotraje, convencer saqueadores a abandona-lo, cortar bateria ou forcar rendicao publica.\n◆ Se vencer, rotas ficam sob dominio saqueador e comerciantes aumentam precos.\n◆ Se fugir, vira rival recorrente.\n◆ Se derrotado, saqueadores se dispersam ou elegem novo lider.\nFONTE OFICIAL // Livro 3, 3.6",
      "summary": "◆ Como pode ser derrotado sem matar: Sabotar exotraje, convencer saqueadores a abandona-lo, cortar bateria ou forcar rendicao publica.\n◆ Se vencer, rotas ficam sob dominio saqueador e comerciantes aumentam precos.\n◆ Se fugir, vira rival recorrente.\n◆ Se derrotado, saqueadores se dispersam ou elegem novo lider.\nFONTE OFICIAL // Livro 3, 3.6",
      "tags": [
        "B",
        "Humanoide hostil/tecnologico",
        "Chefe tatico e brutamontes",
        "Medio em exotraje pesado",
        "Chefe"
      ],
      "details": [
        {
          "label": "Resumo",
          "items": [
            "REGISTRO VISUAL // B // Humanoide hostil/tecnologico",
            "Tier: B",
            "Tipo: Humanoide hostil/tecnologico",
            "Papel: Chefe tatico e brutamontes",
            "Tamanho: Medio em exotraje pesado",
            "Habitat: Acampamento saqueador, oficina roubada ou rota fortificada",
            "PV: 70",
            "CA: 16",
            "Movimento: 8 m",
            "Atributos importantes: FOR 18/MOD +4 com exotraje, REF 12/MOD +1, CON 16/MOD +3, INT 12/MOD +1, PRE 16/MOD +3"
          ]
        },
        {
          "label": "Sinais antes do encontro",
          "items": [
            "◆ Caravanas destruidas.",
            "◆ Balas pesadas em corpos.",
            "◆ Marcas de exotraje no chao.",
            "◆ Saqueadores usando disciplina incomum."
          ]
        },
        {
          "label": "Ataques",
          "items": [
            "◆ Punho Hidraulico: 1d10 concussao.",
            "◆ Metralhadora Leve: 1d8 balistico.",
            "◆ Arremesso de Carga: 1d8 concussao."
          ]
        },
        {
          "label": "Habilidades principais",
          "items": [
            "◆ Escudo Improvisado: usa cobertura ou veiculo destruido para receber +1 CA.",
            "◆ Ordem Brutal: uma vez por rodada, comanda saqueador aliado a atacar ou se mover.",
            "◆ Exotraje Instavel: ao sofrer critico, o exotraje ganha 1 falha. Com 3 falhas, perde movimento ou uma arma.",
            "◆ Pisar e Quebrar: contra alvo Derrubado, causa +1d4 dano ou tenta danificar item em gancho."
          ]
        },
        {
          "label": "Acoes de chefe",
          "items": [
            "◆ Comandar aliado.",
            "◆ Disparar rajada curta.",
            "◆ Mover e empurrar alvo."
          ]
        },
        {
          "label": "Reacoes",
          "items": [
            "◆ Quando sofre dano corpo a corpo, pode empurrar atacante 2 m com o exotraje."
          ]
        },
        {
          "label": "Fases",
          "items": [
            "Fase 1: usa saqueadores e cobertura.",
            "Fase 2: quando aliados caem, entra no combate direto.",
            "Fase 3: se o exotraje falhar, tenta fugir ou explodir munição."
          ]
        },
        {
          "label": "Resistencias e fraquezas",
          "items": [
            "Resistencias: Reducao 1 contra dano fisico comum por blindagem.",
            "◆ Fraquezas: Juntas do exotraje, pulso eletrico, hack e superaquecimento."
          ]
        },
        {
          "label": "Condicoes, recursos e coleta",
          "items": [
            "◆ Condicoes que aplica: Derrubado e Jammed em supressao.",
            "Recursos ameacados: Cubos, municao, cobertura e armadura.",
            "◆ Recursos coletaveis: Exotraje danificado, bateria militar, arma pesada e mapas de rotas saqueadas."
          ]
        },
        {
          "label": "Solucoes e consequencias",
          "items": [
            "◆ Como pode ser derrotado sem matar: Sabotar exotraje, convencer saqueadores a abandona-lo, cortar bateria ou forcar rendicao publica.",
            "◆ Se vencer, rotas ficam sob dominio saqueador e comerciantes aumentam precos.",
            "◆ Se fugir, vira rival recorrente.",
            "◆ Se derrotado, saqueadores se dispersam ou elegem novo lider.",
            "FONTE OFICIAL // Livro 3, 3.6"
          ]
        }
      ],
      "sheetType": "boss",
      "needsCoreStats": false,
      "assets": [
        {
          "type": "image",
          "label": "Registro visual de Comandante Saqueador com Exotraje",
          "url": "./assets/bestiary/comandante-saqueador-com-exotraje.jpg"
        }
      ],
      "source": "Livro 3, 3.6",
      "schemaVersion": 1,
      "image": "./assets/bestiary/comandante-saqueador-com-exotraje.jpg"
    },
    {
      "id": "livro3-3-7-cultista-ascendido",
      "category": "monster",
      "name": "Cultista Ascendido",
      "tier": "B ou A",
      "type": "Humanoide cosmico",
      "role": "Chefe e controlador",
      "size": "Medio",
      "pv": 60,
      "ca": 15,
      "movement": "8 m",
      "habitat": "Templo improvisado, ruina antiga, circulo ritual ou camara com fragmento",
      "behavior": "",
      "attributes": "MEN 20/MOD +5, PRE 20/MOD +5, INT 16/MOD +3, CON 14/MOD +2",
      "attacks": "◆ Lamina Ritual: 1d8 cortante.\n◆ Pulso Cosmico: 2d6 cosmico.",
      "abilities": "◆ Circulo de Protecao: dentro do circulo ritual, recebe +1 CA e resistencia leve contra dano cosmico.\n◆ Palavra de Ruptura: alvo faz JPC. Em falha, recebe +1 Estresse e perde a proxima interacao simples.\n◆ Sacrificio de Foco: consome energia de cristal ou seguidor para recuperar 1d8 PV ou acelerar ritual.\n◆ Olhar de Falaris: uma vez por cena, mostra visao do Sol morto. Alvos que falham ficam Tontos.\n◆ Mover cristal.\n◆ Dar ordem a cultista.\n◆ Ativar simbolo.\n◆ Causar pulso menor.\n◆ Quando atacado dentro do circulo, pode transferir parte do dano para um cristal ritual.\nFase 1: fala e tenta convencer.\nFase 2: usa seguidores e simbolos.\nFase 3: se o ritual for interrompido, libera energia instavel.",
      "resistances": "◆ Resistencias: Resistencia contra medo comum e resistencia leve contra cosmico dentro do circulo.\n◆ Fraquezas: Fora do circulo perde protecao. Destruir simbolos reduz habilidades. Prova real contra sua fe pode causar hesitacao narrativa.",
      "weaknesses": "◆ Resistencias: Resistencia contra medo comum e resistencia leve contra cosmico dentro do circulo.\n◆ Fraquezas: Fora do circulo perde protecao. Destruir simbolos reduz habilidades. Prova real contra sua fe pode causar hesitacao narrativa.",
      "senses": "",
      "moral": "",
      "resources": "◆ Condicoes que aplica: Estresse, Tonto, Medo e Marcado pelo Cosmos.\n◆ Recursos ameacados: Focos, cristais, mente dos personagens e NPCs inocentes usados em ritual.\n◆ Recursos coletaveis: Talisma ascendido, fragmento ritual, livro de sinais e po de Falaris.",
      "campaign": "◆ Como pode ser derrotado sem matar: Quebrar ritual, convencer seguidores, remover fragmento, expor mentira central ou selar circulo.\n◆ Se vencer, ritual se completa e uma porta pode abrir.\n◆ Se fugir, forma novo culto e passa a conhecer o grupo.\n◆ Se derrotado, seguidores se dispersam e faccoes disputam o local.\nFONTE OFICIAL // Livro 3, 3.7",
      "summary": "◆ Como pode ser derrotado sem matar: Quebrar ritual, convencer seguidores, remover fragmento, expor mentira central ou selar circulo.\n◆ Se vencer, ritual se completa e uma porta pode abrir.\n◆ Se fugir, forma novo culto e passa a conhecer o grupo.\n◆ Se derrotado, seguidores se dispersam e faccoes disputam o local.\nFONTE OFICIAL // Livro 3, 3.7",
      "tags": [
        "B ou A",
        "Humanoide cosmico",
        "Chefe e controlador",
        "Medio",
        "Chefe"
      ],
      "details": [
        {
          "label": "Resumo",
          "items": [
            "REGISTRO VISUAL // B ou A // Humanoide cosmico",
            "Tier: B ou A",
            "Tipo: Humanoide cosmico",
            "Papel: Chefe e controlador",
            "Tamanho: Medio",
            "Habitat: Templo improvisado, ruina antiga, circulo ritual ou camara com fragmento",
            "PV: 60",
            "CA: 15",
            "Movimento: 8 m",
            "Atributos importantes: MEN 20/MOD +5, PRE 20/MOD +5, INT 16/MOD +3, CON 14/MOD +2"
          ]
        },
        {
          "label": "Sinais antes do encontro",
          "items": [
            "◆ Seguidores em transe.",
            "◆ Simbolos desenhados com po azul.",
            "◆ Vozes repetindo uma frase.",
            "◆ Cristais flutuando levemente.",
            "◆ Chips oscilando."
          ]
        },
        {
          "label": "Ataques",
          "items": [
            "◆ Lamina Ritual: 1d8 cortante.",
            "◆ Pulso Cosmico: 2d6 cosmico."
          ]
        },
        {
          "label": "Habilidades principais",
          "items": [
            "◆ Circulo de Protecao: dentro do circulo ritual, recebe +1 CA e resistencia leve contra dano cosmico.",
            "◆ Palavra de Ruptura: alvo faz JPC. Em falha, recebe +1 Estresse e perde a proxima interacao simples.",
            "◆ Sacrificio de Foco: consome energia de cristal ou seguidor para recuperar 1d8 PV ou acelerar ritual.",
            "◆ Olhar de Falaris: uma vez por cena, mostra visao do Sol morto. Alvos que falham ficam Tontos."
          ]
        },
        {
          "label": "Acoes de chefe",
          "items": [
            "◆ Mover cristal.",
            "◆ Dar ordem a cultista.",
            "◆ Ativar simbolo.",
            "◆ Causar pulso menor."
          ]
        },
        {
          "label": "Reacoes",
          "items": [
            "◆ Quando atacado dentro do circulo, pode transferir parte do dano para um cristal ritual."
          ]
        },
        {
          "label": "Fases",
          "items": [
            "Fase 1: fala e tenta convencer.",
            "Fase 2: usa seguidores e simbolos.",
            "Fase 3: se o ritual for interrompido, libera energia instavel."
          ]
        },
        {
          "label": "Resistencias e fraquezas",
          "items": [
            "◆ Resistencias: Resistencia contra medo comum e resistencia leve contra cosmico dentro do circulo.",
            "◆ Fraquezas: Fora do circulo perde protecao. Destruir simbolos reduz habilidades. Prova real contra sua fe pode causar hesitacao narrativa."
          ]
        },
        {
          "label": "Condicoes, recursos e coleta",
          "items": [
            "◆ Condicoes que aplica: Estresse, Tonto, Medo e Marcado pelo Cosmos.",
            "◆ Recursos ameacados: Focos, cristais, mente dos personagens e NPCs inocentes usados em ritual.",
            "◆ Recursos coletaveis: Talisma ascendido, fragmento ritual, livro de sinais e po de Falaris."
          ]
        },
        {
          "label": "Solucoes e consequencias",
          "items": [
            "◆ Como pode ser derrotado sem matar: Quebrar ritual, convencer seguidores, remover fragmento, expor mentira central ou selar circulo.",
            "◆ Se vencer, ritual se completa e uma porta pode abrir.",
            "◆ Se fugir, forma novo culto e passa a conhecer o grupo.",
            "◆ Se derrotado, seguidores se dispersam e faccoes disputam o local.",
            "FONTE OFICIAL // Livro 3, 3.7"
          ]
        }
      ],
      "sheetType": "boss",
      "needsCoreStats": false,
      "assets": [
        {
          "type": "image",
          "label": "Registro visual de Cultista Ascendido",
          "url": "./assets/bestiary/cultista-ascendido.jpg"
        }
      ],
      "source": "Livro 3, 3.7",
      "schemaVersion": 1,
      "image": "./assets/bestiary/cultista-ascendido.jpg"
    },
    {
      "id": "livro3-3-8-maquina-de-guerra-do-mundo-partido",
      "category": "monster",
      "name": "Maquina de Guerra do Mundo Partido",
      "tier": "S",
      "type": "Maquina antiga/militar",
      "role": "Ameaca lendaria de campanha",
      "size": "Colossal ou enorme",
      "pv": 200,
      "ca": 20,
      "movement": "Lento, mas avanca destruindo terreno",
      "habitat": "Campo de batalha antigo, hangar soterrado, ruina militar ou defesa de portal",
      "behavior": "",
      "attributes": "FOR 26/MOD +8, CON 26/MOD +8, INT 18/MOD +4, MEN 16/MOD +3, PRE 20/MOD +5",
      "attacks": "◆ Canhao de Ruptura: 4d6 energetico em area.\n◆ Pisoteio Mecanico: 3d6 concussao.\n◆ Rajada de Defesa: 2d6 balistico.",
      "abilities": "◆ Modulos Separados: armas, escudo, locomocao, nucleo e sensores podem ser atacados ou sabotados separadamente.\n◆ Protocolo de Guerra: a cada rodada escolhe prioridade: eliminar, proteger, avancar ou selar area.\n◆ Campo Blindado: enquanto modulo de escudo estiver ativo, reduz 3 de todo dano recebido.\n◆ Fabrica de Drones: libera drones menores enquanto modulo interno estiver ativo.\n◆ Ordem Antiga: pode parar ou mudar comportamento se receber comando correto em Nytharul ou codigo de guerra antigo.\n◆ Ativar arma secundaria.\n◆ Mover modulo.\n◆ Liberar drone.\n◆ Fechar compartimento.\n◆ Carregar canhao principal.\n◆ Quando um modulo e destruido, libera descarga. Personagens proximos fazem JPF com REF.\nFase 1: despertar parcial.\nFase 2: modo defesa.\nFase 3: modo guerra total.\nFase 4: sobrecarga, fuga ou selamento.",
      "resistances": "◆ Resistencias: Reducao alta contra fisico comum. Imune a veneno, doenca e medo. Resistencia contra fogo, frio e eletrico comum.\n◆ Fraquezas: Modulos expostos, codigos antigos, sabotagem interna, ataques coordenados e falta de energia estavel.",
      "weaknesses": "◆ Resistencias: Reducao alta contra fisico comum. Imune a veneno, doenca e medo. Resistencia contra fogo, frio e eletrico comum.\n◆ Fraquezas: Modulos expostos, codigos antigos, sabotagem interna, ataques coordenados e falta de energia estavel.",
      "senses": "",
      "moral": "",
      "resources": "◆ Condicoes que aplica: Derrubado, Jammed, Queimando, Tonto e rachaduras em equipamento.\n◆ Recursos ameacados: Tudo: cubos, veiculos, armaduras, rotas, muralhas e colonias.\n◆ Recursos coletaveis: Placa de guerra, nucleo militar, arma modular, codigo antigo e componente Tier A/S.",
      "campaign": "◆ Como pode ser derrotado sem matar: Desligar nucleo, mudar ordem, sabotar modulos, atrair para zona instavel, selar hangar ou convencer que a guerra terminou.\n◆ Se vencer, causa devastacao regional e faccoes entram em guerra por controle ou fuga.\n◆ Se fugir, continua ativa como ameaca de campanha.\n◆ Se derrotada, tecnologia e loot atraem todas as faccoes.\nFONTE OFICIAL // Livro 3, 3.8\nVARIANTES E TEMPLATES\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nCamadas de modificação para criar versões únicas sem perder a leitura da ficha original.",
      "summary": "◆ Como pode ser derrotado sem matar: Desligar nucleo, mudar ordem, sabotar modulos, atrair para zona instavel, selar hangar ou convencer que a guerra terminou.\n◆ Se vencer, causa devastacao regional e faccoes entram em guerra por controle ou fuga.\n◆ Se fugir, continua ativa como ameaca de campanha.\n◆ Se derrotada, tecnologia e loot atraem todas as faccoes.\nFONTE OFICIAL // Livro 3, 3.8\nVARIANTES E TEMPLATES\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nCamadas de modificação para criar versões únicas sem perder a leitura da ficha original.",
      "tags": [
        "S",
        "Maquina antiga/militar",
        "Ameaca lendaria de campanha",
        "Colossal ou enorme",
        "Chefe"
      ],
      "details": [
        {
          "label": "Resumo",
          "items": [
            "REGISTRO VISUAL // S // Maquina antiga/militar",
            "Tier: S",
            "Tipo: Maquina antiga/militar",
            "Papel: Ameaca lendaria de campanha",
            "Tamanho: Colossal ou enorme",
            "Habitat: Campo de batalha antigo, hangar soterrado, ruina militar ou defesa de portal",
            "PV: 200",
            "CA: 20",
            "Movimento: Lento, mas avanca destruindo terreno",
            "Atributos importantes: FOR 26/MOD +8, CON 26/MOD +8, INT 18/MOD +4, MEN 16/MOD +3, PRE 20/MOD +5"
          ]
        },
        {
          "label": "Sinais antes do encontro",
          "items": [
            "◆ Solo metalico vibrando.",
            "◆ Sirenes antigas.",
            "◆ Drones menores despertando.",
            "◆ Mapas mudando para modo militar.",
            "◆ Inscricao: Tar-Sher nao caira duas vezes."
          ]
        },
        {
          "label": "Ataques",
          "items": [
            "◆ Canhao de Ruptura: 4d6 energetico em area.",
            "◆ Pisoteio Mecanico: 3d6 concussao.",
            "◆ Rajada de Defesa: 2d6 balistico."
          ]
        },
        {
          "label": "Habilidades principais",
          "items": [
            "◆ Modulos Separados: armas, escudo, locomocao, nucleo e sensores podem ser atacados ou sabotados separadamente.",
            "◆ Protocolo de Guerra: a cada rodada escolhe prioridade: eliminar, proteger, avancar ou selar area.",
            "◆ Campo Blindado: enquanto modulo de escudo estiver ativo, reduz 3 de todo dano recebido.",
            "◆ Fabrica de Drones: libera drones menores enquanto modulo interno estiver ativo.",
            "◆ Ordem Antiga: pode parar ou mudar comportamento se receber comando correto em Nytharul ou codigo de guerra antigo."
          ]
        },
        {
          "label": "Acoes de chefe",
          "items": [
            "◆ Ativar arma secundaria.",
            "◆ Mover modulo.",
            "◆ Liberar drone.",
            "◆ Fechar compartimento.",
            "◆ Carregar canhao principal."
          ]
        },
        {
          "label": "Reacoes",
          "items": [
            "◆ Quando um modulo e destruido, libera descarga. Personagens proximos fazem JPF com REF."
          ]
        },
        {
          "label": "Fases",
          "items": [
            "Fase 1: despertar parcial.",
            "Fase 2: modo defesa.",
            "Fase 3: modo guerra total.",
            "Fase 4: sobrecarga, fuga ou selamento."
          ]
        },
        {
          "label": "Resistencias e fraquezas",
          "items": [
            "◆ Resistencias: Reducao alta contra fisico comum. Imune a veneno, doenca e medo. Resistencia contra fogo, frio e eletrico comum.",
            "◆ Fraquezas: Modulos expostos, codigos antigos, sabotagem interna, ataques coordenados e falta de energia estavel."
          ]
        },
        {
          "label": "Condicoes, recursos e coleta",
          "items": [
            "◆ Condicoes que aplica: Derrubado, Jammed, Queimando, Tonto e rachaduras em equipamento.",
            "◆ Recursos ameacados: Tudo: cubos, veiculos, armaduras, rotas, muralhas e colonias.",
            "◆ Recursos coletaveis: Placa de guerra, nucleo militar, arma modular, codigo antigo e componente Tier A/S."
          ]
        },
        {
          "label": "Solucoes e consequencias",
          "items": [
            "◆ Como pode ser derrotado sem matar: Desligar nucleo, mudar ordem, sabotar modulos, atrair para zona instavel, selar hangar ou convencer que a guerra terminou.",
            "◆ Se vencer, causa devastacao regional e faccoes entram em guerra por controle ou fuga.",
            "◆ Se fugir, continua ativa como ameaca de campanha.",
            "◆ Se derrotada, tecnologia e loot atraem todas as faccoes.",
            "FONTE OFICIAL // Livro 3, 3.8",
            "VARIANTES E TEMPLATES",
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
            "Camadas de modificação para criar versões únicas sem perder a leitura da ficha original."
          ]
        }
      ],
      "sheetType": "boss",
      "needsCoreStats": false,
      "assets": [
        {
          "type": "image",
          "label": "Registro visual de Maquina de Guerra do Mundo Partido",
          "url": "./assets/bestiary/maquina-de-guerra-do-mundo-partido.jpg"
        }
      ],
      "source": "Livro 3, 3.8",
      "schemaVersion": 1,
      "image": "./assets/bestiary/maquina-de-guerra-do-mundo-partido.jpg"
    }
  ],
  "rules": [
    {
      "id": "regra-final-rolagem",
      "name": "Resolucao central",
      "source": "Livro 1, 10; Livro 2, 18",
      "tags": [
        "Livro 1",
        "Livro 2",
        "3d6"
      ],
      "summary": "Testes gerais usam 3d6 mais modificadores. Ataques contra CA usam 1d20. Triplo 6 e triplo 1 sao os extremos dos testes; 20 e 1 naturais sao os extremos dos ataques."
    },
    {
      "id": "regra-final-atributos",
      "name": "Atributos iniciais",
      "source": "Livro 1, 4.6",
      "tags": [
        "Livro 1",
        "criacao",
        "atributos"
      ],
      "summary": "Role 7d6, descarte o menor resultado e distribua os seis restantes. Cada atributo final e igual a 7 mais o dado escolhido."
    },
    {
      "id": "regra-final-pericias",
      "name": "Pericias treinadas e ignorancias",
      "source": "Livro 1, 4.10; Livro 2, 18.6",
      "tags": [
        "Livro 1",
        "Livro 2",
        "pericias"
      ],
      "summary": "Pericia treinada concede vantagem; ignorancia concede desvantagem; foco de profissao concede +1 fixo na area indicada."
    },
    {
      "id": "regra-final-jp",
      "name": "Jogadas de Protecao",
      "source": "Livro 1, 4.17; Livro 2, 18.7",
      "tags": [
        "Livro 1",
        "Livro 2",
        "JPF",
        "JPR",
        "JPC"
      ],
      "summary": "JPF usa FOR ou CON; JPR usa REF; JPC usa MEN contra energia e distorcao ou PRE contra medo, panico e pressao espiritual."
    },
    {
      "id": "regra-final-estresse",
      "name": "Estresse e Colapso",
      "source": "Livro 1, Capitulo 11; Livro 2, 18.8",
      "tags": [
        "Livro 1",
        "Livro 2",
        "estresse"
      ],
      "summary": "A trilha padrao vai de 0 a 6. De 0 a 5, testes usam 3d6; em 6, o personagem entra em Colapso e passa a usar 2d6 ate reduzir o Estresse."
    },
    {
      "id": "regra-final-turno",
      "name": "Estrutura do turno",
      "source": "Livro 1, 16; Livro 2, 18.10",
      "tags": [
        "Livro 1",
        "Livro 2",
        "combate"
      ],
      "summary": "Um turno padrao possui movimento, uma acao principal, uma acao simples e uma reacao por rodada quando uma regra permitir."
    },
    {
      "id": "regra-final-iniciativa",
      "name": "Iniciativa",
      "source": "Livro 1, 4.16 e 16.4",
      "tags": [
        "Livro 1",
        "iniciativa",
        "1d20"
      ],
      "summary": "Iniciativa e 1d20 + MOD REF. Empates usam maior MOD REF, depois maior MOD MEN e, por fim, nova rolagem."
    },
    {
      "id": "regra-final-economia",
      "name": "Economia em Luzentis",
      "source": "Livro 1, 9.2; Livro 2, 18.21",
      "tags": [
        "Livro 1",
        "Livro 2",
        "Luzentis"
      ],
      "summary": "Luzentis e a unica moeda oficial. Cada personagem comeca com 2.000 Luzentis; arma e armadura iniciais fazem parte do equipamento basico."
    },
    {
      "id": "regra-final-carga",
      "name": "Carga e cubos iniciais",
      "source": "Livro 1, 4.18-4.19 e 9.3",
      "tags": [
        "Livro 1",
        "carga",
        "cubos"
      ],
      "summary": "Carga maxima em kg e metade do peso corporal mais MOD FOR vezes 10. Cubos simples iniciais sao 5 + MOD FOR e nao anulam peso."
    },
    {
      "id": "regra-l5-tiers-equipamento",
      "name": "Tiers de equipamento",
      "source": "Livro 5, 1.2",
      "tags": [
        "Livro 5",
        "equipamento",
        "tier"
      ],
      "summary": "Os Tiers F, E, D, C, B, A e S indicam qualidade, raridade, acesso e potencia. Tier alto exige contexto, manutencao e disponibilidade adequados."
    },
    {
      "id": "regra-l5-slots-mod",
      "name": "Espacos de mod",
      "source": "Livro 5, 1.12-1.17",
      "tags": [
        "Livro 5",
        "mods",
        "slots"
      ],
      "summary": "Armas, armaduras, corpos, robos e sistemas possuem espacos proprios. Um mod so funciona se for compativel, instalado e couber nos espacos livres."
    },
    {
      "id": "regra-l5-rachaduras",
      "name": "Rachaduras e colapso de equipamento",
      "source": "Livro 5, 1.18-1.25",
      "tags": [
        "Livro 5",
        "rachaduras",
        "reparo"
      ],
      "summary": "Rachaduras medem dano estrutural. Elas afetam armas, armaduras, focos e sistemas individualmente e exigem reparo, material, ferramenta e teste apropriados."
    },
    {
      "id": "regra-l5-jammed",
      "name": "Jammed",
      "source": "Livro 5, 1.22",
      "tags": [
        "Livro 5",
        "Jammed",
        "tecnologia"
      ],
      "summary": "Jammed representa travamento de arma, equipamento ou sistema. Engenharia, Tecnologia, manutencao ou uma acao especifica podem remover a condicao."
    },
    {
      "id": "regra-l5-cubos",
      "name": "Cubos materializadores",
      "source": "Livro 5, 4.1-4.5",
      "tags": [
        "Livro 5",
        "cubos",
        "carga"
      ],
      "summary": "Todo cubo padrao pesa 1 kg. Cubo simples guarda uma unidade; cubo de carga guarda ate 10 unidades do mesmo recurso; cubo especializado guarda ate 10 unidades da mesma categoria tecnica."
    },
    {
      "id": "regra-l5-crafting",
      "name": "Crafting e forja",
      "source": "Livro 5, Capitulo 5",
      "tags": [
        "Livro 5",
        "crafting",
        "forja"
      ],
      "summary": "Criar ou melhorar equipamento exige projeto, materiais, ferramentas, bancada, tempo, Luzentis e testes. Tier, qualidade e falhas alteram custo e resultado."
    },
    {
      "id": "regra-l5-utilitarios",
      "name": "Utilitarios em cena",
      "source": "Livro 5, Capitulo 6",
      "tags": [
        "Livro 5",
        "utilitarios",
        "acao"
      ],
      "summary": "Kits, granadas, drones e torretas usam acoes, bateria, controle, alcance e manutencao proprios. O local de armazenamento define o acesso durante a cena."
    },
    {
      "id": "regra-l5-veiculos",
      "name": "Veiculos e perseguicoes",
      "source": "Livro 5, Capitulo 7",
      "tags": [
        "Livro 5",
        "veiculos",
        "perseguicao"
      ],
      "summary": "Veiculos controlam PV, CA, velocidade, manobrabilidade, combustivel, carga, tripulacao, sistemas, rachaduras e falhas durante viagens e perseguicoes."
    },
    {
      "id": "regra-l5-robos",
      "name": "Robos, drones e torretas",
      "source": "Livro 5, Capitulo 8",
      "tags": [
        "Livro 5",
        "robos",
        "drones"
      ],
      "summary": "Maquinas usam chassi, nucleo, autonomia, processador, controle, slots, modulos, sensores, resistencias, vulnerabilidades e SR para hacking."
    }
  ]
};


(function reconcileSolarisOfficialBooksData() {
  const data = globalThis.SOLARIS_OFFICIAL_BOOKS;
  if (!data || data.__phase19Reconciled) return;

  const reconciledAt = "2026-06-23";
  const currentSources = data.sourceGovernance && data.sourceGovernance.sourceFilesCurrent
    ? data.sourceGovernance.sourceFilesCurrent
    : {};

  function applyGovernance(entry, bookId, section) {
    if (!entry || typeof entry !== "object") return;
    if (!entry.officialId && entry.id) entry.officialId = entry.id;
    if (!entry.bookId && bookId) entry.bookId = bookId;
    if (!entry.bookTitle && bookId === "book5") entry.bookTitle = "Livro 5 - Itens, Equipamentos e Habilidades";
    if (!entry.bookTitle && bookId === "book3") entry.bookTitle = "Livro 3 - Bestiario";
    if (!entry.sourceFileCurrent && bookId && currentSources[bookId]) entry.sourceFileCurrent = currentSources[bookId];
    if (!entry.sourceStatus) entry.sourceStatus = "current-source-needs-review";
    if (!entry.sourceLastReconciledAt) entry.sourceLastReconciledAt = reconciledAt;
    if (!entry.dataStability) entry.dataStability = bookId === "book5" ? "provisional" : "unstable";
    if (!entry.sourceSection && entry.source) entry.sourceSection = entry.source;
    if (!entry.reconciliationSection && section) entry.reconciliationSection = section;
    if (entry.needsReview && !entry.reviewReason) {
      entry.reviewReason = "Entrada marcada para revisao manual durante a reconciliacao oficial de dados.";
    }
  }

  (data.templates || []).forEach((entry) => applyGovernance(entry, "book5", "templates"));
  Object.entries(data.catalog || {}).forEach(([section, entries]) => {
    (entries || []).forEach((entry) => applyGovernance(entry, "book5", section));
  });
  (data.bestiary || []).forEach((entry) => applyGovernance(entry, "book3", "bestiary"));
  (data.rules || []).forEach((entry) => applyGovernance(entry, "book5", "rules"));

  data.__phase19Reconciled = true;
})();

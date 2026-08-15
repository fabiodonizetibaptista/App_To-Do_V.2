# 📝 TO DO - Gerenciador Inteligente de Tarefas

Aplicação web moderna, responsiva e desenvolvida com **HTML5, CSS3 e JavaScript puro (Vanilla)**, sem o uso de frameworks externos.

## 🚀 Funcionalidades Implementadas

1. **Tela de Autenticação:**
   - Login seguro e cadastro de novos usuários.
   - Credenciais de teste pré-configuradas integradas diretamente.
2. **Gerenciamento de Listas (Tela 2):**
   - Criação de novas listas categorizadas por ícones personalizados (Mercado, Estudos, Trabalho, Saúde, etc.).
   - Visualização do progresso e exclusão de listas.
3. **Gerenciamento de Tarefas (Tela 3):**
   - Adição, conclusão (com feedback visual em tachado) e remoção de tarefas.
   - Botões dedicados para reordenar itens (mover para cima/baixo).
   - Barra de progresso dinâmica atualizada em tempo real.
4. **Modo Dark / Light:**
   - Botão discreto no canto superior para alternância instantânea de temas.
5. **Persistência de Dados:**
   - Todos os dados (listas, tarefas e preferências de tema) são salvos automaticamente no `localStorage` do navegador.

---

## 🔑 Credenciais de Teste
Para testar a aplicação instantaneamente na tela de login, utilize:
- **E-mail:** `eu@eu.com`
- **Senha:** `1234`

---

## 📂 Estrutura de Arquivos
```text
/
├── index.html       # Estrutura HTML principal contendo todas as telas e modais
├── style.css        # Estilização responsiva, sistema de temas Dark/Light e variáveis
├── script.js        # Lógica da aplicação, manipulação de estado e localStorage
├── logo.svg         # Logotipo vetorial moderno do aplicativo
└── README.md        # Documentação do projeto
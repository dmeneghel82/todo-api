# Todo API

REST API para gerenciamento de tarefas (todos) com operações CRUD, validação de entrada e testes automatizados.

## Tecnologias

- Node.js
- Express 5.x
- Jest + Supertest (testes)

## Instalação

```bash
git clone https://github.com/dmeneghel82/todo-api.git
cd todo-api
npm install
```

## Uso

```bash
# Iniciar servidor (porta 3000)
npm start

# Rodar testes
npm test

# Testes em modo watch
npm run test:watch
```

## Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/health` | Health check |
| GET | `/todos` | Listar todos os todos |
| GET | `/todos/:id` | Buscar todo por ID |
| POST | `/todos` | Criar novo todo |
| PUT | `/todos/:id` | Atualizar todo |
| DELETE | `/todos/:id` | Deletar todo |

## Exemplos

### Criar todo
```bash
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Comprar leite", "description": "Ir ao mercado"}'
```

### Listar todos
```bash
curl http://localhost:3000/todos
```

### Atualizar todo
```bash
curl -X PUT http://localhost:3000/todos/{id} \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

### Deletar todo
```bash
curl -X DELETE http://localhost:3000/todos/{id}
```

## Modelo de Dados

```json
{
  "id": "uuid",
  "title": "string (obrigatório, max 200 chars)",
  "description": "string (opcional, max 1000 chars)",
  "completed": "boolean (default: false)",
  "createdAt": "ISO 8601 timestamp",
  "updatedAt": "ISO 8601 timestamp"
}
```

## Validações

- `title`: obrigatório, string, máximo 200 caracteres
- `description`: opcional, string, máximo 1000 caracteres
- `completed`: boolean
- `id`: formato UUID válido

## Testes

30 testes cobrindo:
- Operações CRUD
- Validações de entrada
- Tratamento de erros (404, 400)
- Edge cases

```bash
npm test
```

Cobertura: 95%+

## Licença

ISC

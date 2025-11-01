let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];
const generateId = (arr) => {
  const maxId = arr.length > 0
    ? Math.max(...arr.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}

const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(express.json());
app.use(morgan((tokens, req, res) => {
  const response = ':method :url :status :res[content-length] - :response-time ms';
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.method(req, res) === 'POST' ? JSON.stringify(req.body) : ''
  ].join(' ');
}));
app.use(express.static("dist"));

app.get('/api/persons', (request, response) => {
  response.json(persons);
});
app.get('/api/info', (request, response) => {
  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
  `);
});
app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const person = persons.find(p => p.id === id);

  if (person) {
    response.json(person);
  }
  else {
    response.status(404).end();
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  persons = persons.filter(p => p.id !== id);
  response.status(204).end();
});

app.post('/api/persons', (request, response) => {
  const body = request.body;
  const nameIsExists = persons.some(p => p.name === body.name);
 
  if (!body.name || !body.number) {
    const missedField = !body.name  === undefined ? 'Name' 
      : !body.number === undefined ? 'Number' : 'Some';

    return response.status(400).json({
      error: `${missedField} was missing`,
    });
  }
  if (nameIsExists) {
    return response.status(400).json({
      error: 'name must be unique'
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(persons)
  }

  persons = persons.concat(person);
 
  response.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
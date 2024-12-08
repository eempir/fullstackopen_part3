const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(express.static('dist'))
morgan.token('body', (req) => JSON.stringify(req.body))

app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms :body', {
      skip: (req) => req.method !== 'POST'
    })
  )
  
  app.use(
    morgan('tiny', {
      skip: (req) => req.method === 'POST'
    })
  )

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122"
  }
]

app.get('/api/persons', (request, response) => {
response.json(persons)
})

app.get('/info', (request, response) => {
    const currentTime = new Date();
    response.send(`Phonebook has info for ${persons.length} people<br>${currentTime}`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const id = Math.floor(Math.random() * 1_000_000) + 1
    const person = request.body

    if (!person.name) {
        return response.status(400).json({
            error: 'person requires a name'
        })
    }
    
    if (!person.number) {
        return response.status(400).json({
            error: 'person requires a number'
        })
    }

    if(persons.find(existingPerson => existingPerson.name === person.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    person.id = String(id)
    persons = persons.concat(person)
    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})
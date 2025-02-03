require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
app.use(express.json())//Convierte los datos del objeto 'request' a javascript y los inserta en el body, para que se puedan leer dentro de un controlador
const Person = require('./models/person')




/*
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
  ]
*/

app.get('/', (request, response) => {
  response.send('<h1>Agenda telefónica</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/info', (request, response) => {
  const date = new Date()
  response.send(
    `
      <p>Phonebook has info for ${persons.length} people</p>
      ${date}
    `
  )
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(p => p.id === id)
  
  if(person){
    response.json(person)
  }else{
    response.status(204).end
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(p => p.id !== id)

  response.status(204).end()
})

//MIDDLEWARE MORGAN
//token personalizado
morgan.token('content', function getContent(req){
  const name = req.body.name
  const number = req.body.number
  return JSON.stringify({name, number})
})
//Este ejemplo lo saqué con la ayuda de la documentación de morgan y de Roberto
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))


app.post('/api/persons', (request, response) => {
  const body = request.body

  if(!body.name || !body.number){
    return response.status(400).json({error: "Falta información en el body"})
  }else{

    //Revisamos si ya existe un usuario con ese nombre
    //const check = persons.find(p => p.name === body.name)

    //creamos el nuevo objeto 'person'
    const person = new Person({
      name: body.name,
      number: body.number,
      id: generateId()
    })

    //Guardamos el objeto 'person' recien creado
    person.save().then(savedPerson => {
      return response.status(201).json(savedPerson)
    })
  }
})


const generateId = () => {
  const newId = Math.floor(Math.random() * 1000)
  return newId.toString()
}






const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
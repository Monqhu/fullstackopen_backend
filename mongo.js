const mongoose = require('mongoose')

if(process.argv.length < 3){
  console.log("Introduzca más parámetros")
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://fullstack:${password}@cluster0.udgdw.mongodb.net/agendatelefonica?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)


const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)



if(process.argv.length == 3){
  //Función de buscar
  console.log("Contactos")
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
}





if(process.argv.length == 5){
  const person = new Person({
    name: `${process.argv[3]}`,
    number: `${process.argv[4]}`
  })
  
  person.save().then(result => {
    console.log(`contacto guardado: ${process.argv[3]} ${process.argv[4]}`)
    mongoose.connection.close()
  })
}









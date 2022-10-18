const mongoose = require('mongoose')
const slugify = require('slugify')
const createDOMPurify = require('dompurify')
const {JSDOM} = require ('jsdom')
const dompurify = createDOMPurify(new JSDOM().window) 
const bcrypt = require('bcryptjs') //Importo todo el módulo

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true 
        },
           
    }, 
    {
        timestamps : true //
    }
)

userSchema.methods.encryptPassword =async password =>{ //recibe la psw como parámetro- password será el string de hash
    const salt= await bcrypt.genSalt(10); // asíncrono
    return await bcrypt.hash(password, salt); //hash genera el cifrado y recibe 2 param el string y el salt que generé
}
//encryptPassword recibe la contraseña, la cifra y devuelve cifrada
//Cuando el usuario se registre se logee, hay que comprar su contraseña,cifrarlay compararla cifrada con la
//contraseña cifrada en la DB. Comparar 2 cifrados
userSchema.methods.matchPassword = async function(password){
     return await bcrypt.compare(password, this.password); //si el esquema tiene password, la utliza
} //devuelve true o false.True si la contraseña coincide y se puede ingresar


 module.exports = mongoose.model('user', userSchema)
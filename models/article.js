const mongoose = require('mongoose')
const {marked} = require('marked')
const slugify = require('slugify')
const createDOMPurify = require('dompurify')
const {JSDOM} = require ('jsdom')
const dompurify = createDOMPurify(new JSDOM().window) //crea el objeto

const articleSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String
        },
        markdown: {
            type: String,
            required: true 
        },
        createdAt: {
            type: Date,
            default: Date.now //va a decir la fecha de creación  
        },
        slug: {
            type: String,
            required: true,
            unique: true //para que no vuelva a repetirse el slug,construye indices unicos
        },
        sanitizedHtml:{
            type: String,
            required: true
        }       
    },
    {
        versionKey: false //para q cuando se cree un documento en la DB no ponga el versionado
    }
)

// Middleware .pre()
articleSchema.pre('validate', function (next){
    if(this.title){
        this.slug = slugify(this.title, {lower: true, strict: true}) //minus y sin caracteres especiales
    } //si existe titulo realiza la conversion y lo guarda en slug
    if(this.markdown){
        this.sanitizedHtml = dompurify.sanitize(marked(this.markdown))
    } //si existe markdown lo sanitiza al html 
    next(); //luego continúa
})

module.exports = mongoose.model('Article', articleSchema)
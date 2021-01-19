const mongoose = require ('mongoose')
const marked  = require('marked')
const slugify = require('slugify')
const createDomPurify = require('dompurify')
const {JSDOM} = require('jsdom')
// cleans HTML, sanitizes it
const dompurify = createDomPurify(new JSDOM().window)
const articleSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    markdown: {
        type:String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now()
    },
    slug: {
        type: String,
        required: true,
        unique:true
    },
    sanitizedHtml:
    {
        type: String,
        required:true
    }
})
//validation, function will be called before validation and will be done before any button is completed
articleSchema.pre('validate', function(next){
    if (this.title){
        this.slug = slugify(this.title,{
            lower:true,
            //force slug to get rid of characters that dont fit in URL, like wier
            strict:true
        })
    }
    if (this.markdown){
        //converts markdown to HTML and then santizes HTML to prevent bad HTML code
        this.sanitizedHtml = dompurify.sanitize(marked(this.markdown))
    }
    next()
})
module.exports = mongoose.model('Article',articleSchema)
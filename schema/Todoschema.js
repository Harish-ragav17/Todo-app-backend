const mongoose=require('mongoose')

const todo=mongoose.Schema({
text:{
    type:String,
    require:true
},
checked:Boolean,
})

module.exports=mongoose.model('Todo',todo)
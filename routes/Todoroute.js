const {Router}=require("express")
const { gettodo, savetodo,updatetodo,deletetodo, updatetick } = require("../controllers/Todocontroller")
const router=Router()

router.get("/",gettodo)
router.post("/save",savetodo)
router.post("/update",updatetodo)
router.post("/updatetick",updatetick)
router.post("/delete",deletetodo)

module.exports=router
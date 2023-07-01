const { default: mongoose } = require("mongoose");
const Todomodel = require("../schema/Todoschema");

module.exports.gettodo = async (req, res) => {
  const todo = await Todomodel.find();
  res.send(todo);
};
module.exports.savetodo = async (req, res) => {
  const { text } = req.body;
  console.log(text);
  Todomodel.create({ text, checked:false }).then((data) => {
    console.log("Sucessfuly added");
    res.send(data);
  });
};
module.exports.updatetodo = async (req, res) => {
  const { _id, text } = req.body;
  Todomodel.findByIdAndUpdate(_id, { text }).then((data) =>
    res.send("Updated")
  );
};
module.exports.updatetick = async (req, res) => {
  const {_id}=req.body
  const data=await Todomodel.findOne({_id})
  const check=!(data.checked)
  data.checked=check
  await data.save()
};
module.exports.deletetodo = async (req, res) => {
  const { _id } = req.body;
  Todomodel.findByIdAndDelete(_id).then(() => res.send("Deleted"));
};

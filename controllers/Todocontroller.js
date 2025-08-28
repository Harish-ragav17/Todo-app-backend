const { default: mongoose } = require("mongoose");
const Todomodel = require("../schema/Todoschema");
const UserSchema = require("../schema/UserSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = "TODOAPP";
const { ObjectId } = require("mongodb");

module.exports.test = async (req, res) => {
  res.send("API is working");
};

module.exports.updatetodo = async (req, res) => {
  const { _id, text } = req.body;
  Todomodel.findByIdAndUpdate(_id, { text }).then((data) =>
    res.send("Updated")
  );
};
module.exports.updatetick = async (req, res) => {
  const { id } = req.body;
  const data = await Todomodel.findOne({ _id: id });
  const check = !data.checked;
  data.checked = check;
  await data.save();
  res.send("Updated");
};
module.exports.deletetodo = async (req, res) => {
  const { _id } = req.body;

  const userId = TokenParser(req, res, "id");

  if (userId === "Invalid token") {
    res.status(401).json({ error: "Invalid token" });
  }

  await Todomodel.findByIdAndDelete(_id)
    .then(
      async () =>
        await UserSchema.findByIdAndUpdate(userId, { $pull: { todos: _id } })
    )
    .then(() => res.send("Deleted"));
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid credentials" });
  }

  UserSchema.findOne({ email: email })
    .then(async (user) => {
      if (!user) {
        return res.json({
          success: false,
          message: "User Not Found..! Please Sign Up",
        });
      }
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.json({ success: false, message: "Incorrect Password..!" });
      }

      const token = jwt.sign(
        { id: userser._id.toString(), username: user.username },
        secret,
        { expiresIn: "1h" }
      );

      res.json({ success: true, token, username: user.username });
    })
    .catch((err) => {
      console.error(err);
      res.json({ success: false, message: "Server error" });
    });
};

module.exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }
  UserSchema.findOne({ username: email })
    .then(async (user) => {
      if (user) {
        return res.json({ success: false, message: "User already exists" });
      }
      await bcrypt.hash(password, 10).then((hash) => {
        UserSchema.create({ username: name, email: email, password: hash })
          .then((newUser) => {
            res.json({
              success: true,
              message: "User registered successfully",
              userId: newUser._id,
            });
          })
          .catch((err) => {
            console.error(err);
            res.json({ success: false, message: "Server error" });
          });
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({ success: false, message: "Server error" });
    });
};

module.exports.getusernameandpoints = async (req, res) => {
  try {
    const userId = TokenParser(req, res, "id");

    if (userId === "Invalid token") {
      return res.status(401).json({ error: "Invalid token" });
    }

    const user = await UserSchema.findById(userId).select("username points");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ username: user.username, points: user.points });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.addtask = async (req, res) => {
  try {
    const userId = TokenParser(req, res, "id");
    const data = req.body;

    const user = await UserSchema.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await Todomodel.create({
      text: data.text,
      checked: false,
      deadline: data.duedate ? new Date(data.duedate) : null,
    })
      .then((data) => {
        user.todos.push(data._id);
      })
      .then(() => {
        user.save();
      });
    res.json({ message: "Task added successfully", data });
  } catch (error) {
    console.error("Error updating points:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.gettodo = async (req, res) => {
  const id = TokenParser(req, res, "id");

  if (id === "Invalid token") {
    return res.status(401).json({ error: "Invalid token" });
  }
  const objectId = mongoose.Types.ObjectId.isValid(id)
    ? new mongoose.Types.ObjectId(id)
    : id;
  const user = await UserSchema.findOne({ _id: objectId });
  if (!user) return res.status(404).json({ message: "User not found" });

  const todos = await Todomodel.find({ _id: { $in: user.todos } });

  const tododata = todos.map((todo) => ({
    _id: todo._id,
    text: todo.text,
    checked: todo.checked,
    deadline: todo.deadline,
  }));

  res.json(tododata);
};

const TokenParser = (req, res, need) => {
  const authHeader = req?.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader && authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, secret);
    if (need === "id") {
      return decoded.id;
    } else {
      return decoded.username;
    }
  } catch (err) {
    return "Invalid token";
  }
};

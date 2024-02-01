const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

let checkToken = null;
let checkLog = false;
let CheckAdmin = false;
var checkPlan = '';

//DB Connection
mongoose
  .connect("mongodb://localhost:27017/Phish")
  .then(() => {
    console.log("DB Connected");
  })
  .catch((error) => {
    console.log("Connection failed");
    console.log(error);
  });

//User Schema
const userSchema = mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  phoneNumber: {
    type: Number,
  },
  userType: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  plan : {
    type : String,
    enum : ['Basic','Standard','Premium'],
    default : 'Premium'
  },
});


//Msg Schema
messageSchema = new mongoose.Schema({
  email:{
    type:String
  },
  message :{
    type : String
  }
})
const Msg = mongoose.model('Msgs',messageSchema);


const User = mongoose.model("User", userSchema);

const secretKey = "THEPHISHCATCHER";

//Authentication
const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization;

  if (!checkToken) {
    console.log('Authenticated')
    return res.status(401).json({ message: "Authentication required" });
    
  }

  jwt.verify(checkToken, secretKey, (err, user) => {
    if (err) {
      console.log(checkToken)
      console.log('invalid token')
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  });
};

//Contact US Page
app.post('/contact',async (req,resp)=>{

  const {email, message} = req.body;

  try {
    const myMsg = new Msg({email,message})
    await myMsg.save();
    resp.send({message:'Message saved on DB'});
  } 
  catch 
  (error) {
    console.log(error)
    console.log('contact failed')

  }
})


//Login API

app.post("/login", async (req, res) => {
  const { email, password, userType } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      if (user.password === password && user.userType === "admin") {
        const token = jwt.sign({ id: user._id, userType: user.userType }, secretKey);
        res.set('Authorization', 'Bearer ' + token);
        console.log(token+" admin")
        checkToken = token;
        CheckAdmin = true;
        res.send({ message: "Logged in as Admin" });
      } else if (user.password === password) {
        const token = jwt.sign({ id: user._id, userType: user.userType }, secretKey);
        res.set('Authorization', 'Bearer ' + token);
        checkToken = token;
        checkLog = true;

        // Fetch the user's plan from the database
        const userWithPlan = await User.findById(user._id);
         checkPlan = userWithPlan.plan || 'basic'; // Default to 'Premium' if plan not found

        console.log(token+" user")
        res.send({ message: "User Logged In", plan: checkPlan }); // Send the plan to the frontend
      } else {
        res.send({ message: "Wrong Password" });
      }
    } else {
      res.send({ message: "User not registered" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});



//Registration API
app.post("/register", async (req, res) => {
  const { username, email, password, phoneNumber } = req.body;
  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      res.send({ message: "User already registered" });
    } else {
      const user = new User({ username, email, password, phoneNumber, plan});
      await user.save();
      console.log(plan)
      res.send({ message: "Added Successfully" });
      plan = null;
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

//Profile API
app.get("/profile", authenticateUser, async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId);
    if (user) {
      res.send({
        profile: {
          username: user.username,
          email: user.email,
          bio: user.bio,
          profilePicture: user.profilePicture
        }
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

//Profile Update API
app.put("/profile", authenticateUser, async (req, res) => {
  const userId = req.user.id;
  const { username, email, bio } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { username, email, bio },
      { new: true }
    );
    if (user) {
      res.send({
        profile: {
          username: user.username,
          email: user.email,
          bio: user.bio,
          profilePicture: user.profilePicture
        }
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

//User List API for Admin Panel
app.get('/userList', async (req, resp) => {
  try {
    const allUsers = await User.find({});
    resp.send({ data: allUsers });
  } catch (err) {
    console.log(err);
    resp.status(500).send({ error: 'An error occurred while fetching the user list.' });
  }
});

// Messages At Admin Panel
app.get('/messages', async (req, resp) => {
  try {
    const allmsgs = await Msg.find({});
    resp.send({ data: allmsgs });
  } catch (err) {
    console.log(err);
    resp.status(500).send({ error: 'An error occurred while fetching the user list.' });
  }
});
//Remove User via Admin Panel
app.delete('/users/:email', async (req, res) => {
  const userEmail = req.params.email;
  console.log('API Called')
  try {
    const deletedUser = await User.findOneAndDelete({ email: userEmail });
    console.log(userEmail)

    if (deletedUser) {
      res.status(200).json({ message: 'User deleted successfully' });
      console.log('deleted')
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Checking email for Payment

app.post("/check-email", async (req, res) => {
  const { email } = req.body;
  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      res.send("email found");
    } else {
      res.send("not registered");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

//Checking if the user is logged In
app.post('/checkLogin', async (req,res) => {
  

  if(checkLog == true)
  {
    res.send({message:'User Logged In'})
  }
  else if(CheckAdmin == true)
  {
    res.send({message:'Admin Logged In'})
  }
  else
  {
    res.send({message:'log out'})
  }
})

// Log Out
app.get('/logout', (req, res) => {
  const { query } = req;

  if (query && query.logout === 'true') {
    checkLog = false;
    CheckAdmin = false;
    checkPlan = '';
    res.send({ message: 'Logged out successfully' });
  } else {
    res.status(400).send({ message: 'Invalid request' });
  }
});

//setPlan
app.post('/getPlan', async (req, res) => {
  const { Selectedplan } = req.body;

 plan = Selectedplan;
 
 
  // if (!plan) {
  //   return res.status(400).json({ error: 'Please provide a plan.' });
  // }

  // try {
  //   const user = new User({ plan });
  //   await user.save();
  //   return res.status(200).json({ message: 'Subscription successful.' });
  // } catch (err) {
  //   console.error('Error subscribing to plan:', err);
  //   return res.status(500).json({ error: 'Failed to subscribe to plan.' });
  // }
});

// Returning Plan to dashbaord

// User Plan API
app.get('/userPlan', (req, res) => {
  if (checkLog) {
    res.send({ plan: checkPlan });
  } else {
    res.status(401).send({ message: 'User not logged in' });
  }
});



app.listen(4000, () => {
  console.log("Server running on port 4000");
});
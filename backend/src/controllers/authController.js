const bcrypt = require("bcryptjs");

const {
  createUser,
  findUserByEmail
} = require("../models/userModel");

const {
  loginUser
} = require("../services/authService");


// ======================
// Register User
// ======================

const register = async (req, res) => {

  try {

    const {
      full_name,
      email,
      phone,
      password
    } = req.body;


    // Check existing user
    const existingUser = await findUserByEmail(email);


    if (existingUser) {

      return res.status(400).json({
        success: false,
        message: "Email already exists"
      });

    }


    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);


    await createUser({

      full_name,
      email,
      phone,
      password: hashedPassword,
      role: "CUSTOMER"

    });


    res.status(201).json({

      success: true,
      message: "User registered successfully"

    });


  } catch(error) {


    console.error(error);


    res.status(500).json({

      success:false,
      message:"Internal Server Error"

    });

  }

};




// ======================
// Login User
// ======================

const login = async (req,res)=>{


  try {


    const {
      email,
      password
    } = req.body;



    const result = await loginUser(
      email,
      password
    );



    res.status(200).json({

      success:true,

      message:"Login successful",

      token: result.token,

      user: result.user

    });



  } catch(error){


    console.error(error);


    res.status(401).json({

      success:false,

      message:error.message

    });


  }


};





module.exports = {

  register,
  login

};
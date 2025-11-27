import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";
import chalk from "chalk";
import inquirer from "inquirer";
import dotenv from "dotenv";

dotenv.config();

// Environment variables
const DB_URL = process.env.DB_URL || "mongodb://localhost:27017/AssignmentApproval";
const DB_NAME = "AssignmentApproval";

// Database connection
let db = null;
MongoClient.connect(DB_URL)
  .then((conn) => {
    db = conn.db(DB_NAME);
    console.log(chalk.green.bold("\n✅ Database connected successfully!"));
    createUser(); // Start prompt after DB connects
  })
  .catch((err) => {
    console.log(chalk.red.bold("\n❌ Failed to connect to database"), err);
    process.exit();
  });

// Console Header
console.log(chalk.bgRed.white.bold.underline("⭐ ADMIN SIGNUP CONSOLE ⭐"));

// Role selection options
const options = [
  {
    type: "list",
    name: "role",
    message: chalk.yellow("Press arrow up and down key to choose role -"),
    choices: [
      chalk.green("Admin"),
      chalk.blue("Professor"),
      chalk.yellow("Student"),
      chalk.magenta("HOD"),
      chalk.red("Exit"),
    ],
  },
];

// Input fields (added phone number)
const input = [
  {
    type: "input",
    name: "fullname",
    message: "Enter your fullname ?",
    validate: (input) => (input.length > 0 ? true : "Fullname is required!"),
  },
  {
    type: "input",
    name: "email",
    message: "Enter your email ?",
    validate: (input) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!input.length) return "Email is required!";
      if (!emailRegex.test(input)) return "Enter valid email!";
      return true;
    },
  },
  {
    type: "input",
    name: "phone",
    message: "Enter your phone number (10 digits, without +91):",
    validate: (input) => {
      const phoneRegex = /^[0-9]{10}$/;
      if (!input.length) return "Phone number is required!";
      if (!phoneRegex.test(input))
        return "Enter a valid 10-digit phone number without +91 or spaces!";
      return true;
    },
  },
  {
    type: "password",
    name: "password",
    mask: "*",
    message: "Enter your password ?",
    validate: (input) => (input.length ? true : "Password is required!"),
  },
];

// Common function to create user
const addUser = async (role) => {
  try {
    const user = await inquirer.prompt(input);
    user.role = role.toLowerCase();
    user.password = await bcrypt.hash(user.password, 12);

    const userCollection = db.collection("users");
    await userCollection.insertOne(user);

    console.log(chalk.bgGreen(`✅ ${role} created successfully!`));
    process.exit();
  } catch (err) {
    console.log(chalk.red("❌ Failed to create user. Please consult the developer."), err);
    process.exit();
  }
};

// Exit function
const exit = () => {
  console.log(chalk.blue("Goodbye! Exiting the program."));
  process.exit();
};

// Main function
const createUser = async () => {
  try {
    const option = await inquirer.prompt(options);

    if (option.role.includes("Admin")) return addUser("Admin");
    if (option.role.includes("Professor")) return addUser("Professor");
    if (option.role.includes("Student")) return addUser("Student");
    if (option.role.includes("HOD")) return addUser("HOD");
    if (option.role.includes("Exit")) return exit();
  } catch (err) {
    console.log(chalk.red("❌ Something went wrong!"), err);
  }
};

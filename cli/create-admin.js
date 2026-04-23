// create-admin.js (Pure CommonJS compatible)
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const inquirer = require("inquirer");

// CLI Config imports (Inhe bhi require banana padega agar wo .js hain)
const connectDBForCLI = require("./cli-config/db.cli.js");
const hashPassword = require("./cli-config/hashPassword.js");

dotenv.config();

const main = async () => {
    try {
        // 1. Saari modern libraries ko runtime par load karein
        const { default: chalk } = await import("chalk");
        const { default: gradient } = await import("gradient-string");
        const { default: boxen } = await import("boxen");
        const { default: inquirer } = await import("inquirer"); // Inquirer fix yahan hai

        const devSyncLogo = gradient(["#00c6ff", "#0072ff"]).multiline(
            "  ____             ____                  \n" +
            " |  _ \\  _____   _/ ___| _   _ _ __   ___ \n" +
            " | | | |/ _ \\ \\ / \\___ \\| | | | '_ \\ / __|\n" +
            " | |_| |  __/\\ V / ___) | |_| | | | | (__ \n" +
            " |____/ \\___| \\_/ |____/ \\__, |_| |_|\\___|\n" +
            "                         |___/            "
        );

        console.clear();
        console.log(devSyncLogo);
        console.log(
            boxen(chalk.cyan.bold("ADMIN REGISTRATION PORTAL"), {
                padding: 0.5,
                margin: 1,
                borderStyle: "double",
                borderColor: "cyan",
            })
        );

        // Database connection
        console.log(chalk.blue("⏳ Connecting to DevSync Database..."));
        await connectDBForCLI();
        console.log(chalk.green("✔ Connection established!\n"));

        // Questions mangne ke liye inquirer.prompt ab kaam karega
        const signupPayload = await inquirer.prompt([
            {
                type: "input",
                name: "fullname",
                message: chalk.yellow("Enter Full Name:"),
                validate: (input) => input.trim() !== "" || "Name cannot be empty",
            },
            {
                type: "input",
                name: "email",
                message: chalk.yellow("Enter Admin Email:"),
                validate: (input) =>
                    /\S+@\S+\.\S+/.test(input) || "Please enter a valid email address",
            },
            {
                type: "password",
                name: "password",
                message: chalk.yellow("Set Secret Password:"),
                mask: "•",
                validate: (input) =>
                    input.length >= 6 || "Minimum 6 characters required",
            },
        ]);

        // Hashing and DB Logic...
        console.log(`\n${chalk.blue("⚙️ Processing security encryption...")}`);
        const hashedPassword = await hashPassword(signupPayload.password);

        const db = mongoose.connection.db;
        const userCollection = db.collection("users");

        const isUserExists = await userCollection.findOne({ email: signupPayload.email.toLowerCase() });

        if (isUserExists) {
            console.log(`\n${chalk.red.bold("✖ Error:")} ${signupPayload.email} is already registered.`);
            process.exit(1);
        }

        await userCollection.insertOne({
            fullname: signupPayload.fullname,
            email: signupPayload.email.toLowerCase(),
            password: hashedPassword,
            role: "ADMIN",
            createdAt: new Date(),
            updatedAt: new Date(),
            status: "ACTIVE",
            verify: true,
        });

        console.log("\n" + boxen(chalk.green.bold("SUCCESS! Admin Account Created."), { padding: 1, borderColor: "green" }));
        process.exit(0);

    } catch (error) {
        // Chalk yahan load nahi hua hoga agar error shuru mein aaya
        console.log("\n❌ System Error:", error.message);
        process.exit(1);
    }
};
main();
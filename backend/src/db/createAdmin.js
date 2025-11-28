require("dotenv").config();
const db = require("./prisma");
const bcrypt = require("bcryptjs");
const username = process.env.ADMIN_USERNAME;
const password = process.env.ADMIN_PASSWORD;
console.log("Creating user: ", username);

async function main() {
    try {
        const user = await db.users.findFirst({
            where: {
                username: username,
            },
        });
        if (user) {
            console.log("User already exists! Disconnecting...");
            await db.$disconnect();
            console.log("Done");
            process.exit(1);
        }
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log("Password hashed");
        await db.users.create({
            data: {
                username: username,
                passwordHash: hashedPassword,
                admin: true,
            },
        });
        console.log("User created");
    } catch (err) {
        console.error(err.stack);
    } finally {
        console.log("Disconnecting");
        await db.$disconnect();
        console.log("Done");
        process.exit(0);
    }
}

main();

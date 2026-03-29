import mongoose from "mongoose";
import dbConnect from "./src/lib/mongodb";
import Knowledge from "./src/models/Knowledge";

async function dumpKnowledge() {
    await dbConnect();
    const all = await Knowledge.find().limit(20);
    console.log(JSON.stringify(all, null, 2));
    process.exit(0);
}

dumpKnowledge();

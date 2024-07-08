import mongoose from "mongoose";
import config from "./config/default";
import log from "./logger/logger";

async function connect() {
    log.info("Database connect called");

    //const dbUri = config.get("dbUri") as string;
    const dbUri = config.dbUri;

    try {
        await mongoose
            .connect(dbUri);
        log.info("Database connected");
    } catch (error) {
        log.error("db error", error);
        process.exit(1);
    }
}

export default connect;
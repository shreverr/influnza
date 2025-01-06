import connectToDb from "./config/db";
import setHeaders from "./config/headers";
import { httpLogger, logger } from "./logger";
import { youtube } from "./datasource";

import express from "express";

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(setHeaders);
app.use(httpLogger);

(async () => {
    await connectToDb();
})();

if (process.env.NODE_ENV === "development") {
    app.get("/", async (req, res) => {
        const data = await youtube.getVideoDetails('cmoTikG4DhQ')
        res.json(data)
    });
}

app.listen(PORT, () => {
    logger.info(`-> now listening at http://localhost:${PORT}/`);
});

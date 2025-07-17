import express from 'express';
import { setupApp } from './setup-app';
import {SETTINGS} from "./core/setting/setting";
import {runDB} from "./db/mongodb";
const bootstrap = async () => {
    const app = express();
    setupApp(app);

    const PORT = SETTINGS.PORT;

    await runDB(SETTINGS.MONGO_URL);

    app.listen(PORT, () => {
        console.log(`Example app listening on port ${PORT}`);
    });
};
bootstrap();
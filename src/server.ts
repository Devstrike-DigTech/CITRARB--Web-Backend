import 'dotenv/config';
import 'module-alias/register';
import validateEnv from '@/utils/validateEnv';
import App from './app';

// controller imports below
import UserController from '@/resources/user/user.controller';
import OccupationController from '@/resources/occupation/occupation.controller';

validateEnv();

const app = new App(
    [
        new UserController(),
        new OccupationController
    ],
    Number(process.env.PORT)
);

app.listen();

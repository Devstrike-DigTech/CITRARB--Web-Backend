import 'dotenv/config';
import 'module-alias/register';
import validateEnv from '@/utils/validateEnv';
import App from './app';

// controller imports below
import UserController from '@/resources/user/user.controller';
import OccupationController from '@/resources/occupation/occupation.controller';
import FriendController from '@/resources/friend/friend.controller'
import FriendRequestController from '@/resources/friendRequest/friendRequest.controller'

validateEnv();

const app = new App(
    [
        new UserController(),
        new OccupationController(),
        new FriendController(),
        new FriendRequestController()
    ],
    Number(process.env.PORT)
);

app.listen();

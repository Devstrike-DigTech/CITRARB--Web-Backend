import 'dotenv/config';
import 'module-alias/register';
import validateEnv from '@/utils/validateEnv';
import App from './app';

// controller imports below
import UserController from '@/resources/user/user.controller';
import OccupationController from '@/resources/occupation/occupation.controller';
import FriendController from '@/resources/friend/friend.controller'
import FriendRequestController from '@/resources/friendRequest/friendRequest.controller'
import EventController from '@/resources/event/event.controller'
import EventAttendanceController from '@/resources/eventAttendance/eventAttendance.controller'
import RatingController from '@/resources/rating/rating.controller'
import MarketController from './resources/market/market.controller';
import EyeWitnessController from './resources/eyeWitness/eyeWitness.controller';
import ReactionUploadController from './resources/reactionUploads/rating.controller'
import MusicController from './resources/music/music.controller';
import ReactionMusicController from './resources/reactionMusic/rating.controller';
import NewsController from './resources/news/news.controller';
import YoutubeAPIController from './resources/youtube/youtube.controller';

validateEnv();

const app = new App(
    [
        new UserController(),
        new OccupationController(),
        new FriendController(),
        new FriendRequestController(),
        new EventController(),
        new EventAttendanceController(),
        new RatingController(),
        new ReactionUploadController(),
        new EyeWitnessController(),
        new MarketController(),
        new MusicController(),
        new ReactionMusicController(),
        new NewsController(),
        new YoutubeAPIController()
    ],
    Number(process.env.PORT)
);

app.listen();

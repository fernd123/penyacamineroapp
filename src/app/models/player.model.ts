import { User } from './user.model';
import { Parent } from './parent.model';

export class Player extends Parent {
    firstname: string;
    lastname: string;
    nickname: string;
    birthday: Date;
    mainPosition: string;
    secondPosition: string;
    thirdPosition: string;
    profileImage: string;
    leg: string;
    status: string;
    user: User;
}
import { IBaseInterface } from "../baseInterface";

export interface IProfile extends IBaseInterface {
    // type any is used to prevent error on validation level
    // profile data
    religion: any;
    sexual_orientation: any;
    relationship_status: any;
    occupation: any;
    ethnic_group: any;
    location: any;
    highest_education: any;
    current_education: any;
    bio: any;
    facebook_url: any;
    twitter_url: any;
    instagram_url: any;
    snapchat_id: any;
}

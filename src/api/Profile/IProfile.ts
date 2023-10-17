import { IBaseInterface } from "../baseInterface";

export interface IProfile extends IBaseInterface {
  // type any is used to prevent error on validation level
  // profile data
  current_position: any;
}

import { IBaseInterface } from "../baseInterface";

export interface IAdmin extends IBaseInterface {
  // type any is used to prevent error on validation level
  title: any;
  content: any;
  slug: any;
}

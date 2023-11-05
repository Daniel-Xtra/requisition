import { IBaseInterface } from "../baseInterface";

export interface IRequests extends IBaseInterface {
  requests: IRequest[];
}

export interface IRequest extends IBaseInterface {
  item: string;
  qty_required: string;
  purpose: string;
  qty_approved: string;
  comment: string;
  qty_issued: string;
  status: any;
}

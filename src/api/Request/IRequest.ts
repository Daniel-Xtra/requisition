import { IBaseInterface } from "../baseInterface";

export interface IRequests extends IBaseInterface {
  requests: IRequest[];
  division: string;
  purpose: string;
}

export interface IRequest extends IBaseInterface {
  item: string;
  division: string;
  qty_required: string;
  purpose: string;
  qty_approved: string;
  comment: string;
  qty_issued: string;
  status: any;
}

import { Op } from "sequelize";
import { AppError } from "../../utils/app-error";
import {
  GENERAL_EXCLUDES,
  USER_EXCLUDES,
  generateUniqueIdentifier,
  getPagination,
  getPagingData,
} from "../../utils/helpers";
import { DivisionModel } from "../Division";

import { IUser, UserModel } from "../User";
import { IRequest, IRequests } from "./IRequest";
import { RequestModel } from "./requestModel";

import moment from "moment";
import { IctService } from "../ICT/ictService";

export class RequestService {
  private _ictService = new IctService();

  /**
   * Fetches single request using its unique id
   * @param {String} unique_id
   * @returns {Object} fetched request
   */
  public fetchRequest = async (unique_id: string) => {
    let fetch = await RequestModel.findOne({
      where: { unique_id },
      include: [
        {
          model: UserModel,

          required: true,
          attributes: { exclude: USER_EXCLUDES },
        },
        {
          model: DivisionModel,
          attributes: { exclude: GENERAL_EXCLUDES },
        },
      ],
    });

    if (fetch) {
      let all = fetch.toJSON();
      let approved_by = await UserModel.findOne({
        where: { id: all.approved_by },

        attributes: { exclude: USER_EXCLUDES },
      });

      let issued_by = await UserModel.findOne({
        where: { id: all.issued_by },

        attributes: { exclude: USER_EXCLUDES },
      });
      all.approved_name = approved_by;
      all.issuer_name = issued_by;

      return all;
    }
    throw new AppError(`Request ${unique_id} not found`, null, 400);
  };

  /**
   * Making a request by any staff
   * @param {Object} user
   * @param {Object} data
   * @returns {Object} on success
   */
  public makeRequest = async (user: any, data: IRequests) => {
    let bulkData: any = [];

    const de = await DivisionModel.findOne({ where: { slug: data.division } });

    if (!de) throw new AppError("Division not found");

    data.requests.forEach(async (element) => {
      element.unique_id = generateUniqueIdentifier();
      element.status = "ict_pending";
      element.divisionId = de.id;

      bulkData.push(element);
    });

    if (bulkData.length <= 0)
      throw new AppError("Could not create request", null, 400);

    const fresh = await RequestModel.bulkCreate(bulkData);

    if (!fresh) throw new AppError("bulk not saved");
    await user.addRequest(fresh);
    const ids = await fresh.map((data) => data.id);

    const newRefresh = await this.justCreated(ids);

    return newRefresh;
  };

  public justCreated = async (ids: number[]) => {
    let merger = await RequestModel.findAll({
      where: { id: { [Op.in]: ids } },
      include: [
        {
          model: UserModel,
          required: true,
          attributes: { exclude: USER_EXCLUDES },
        },
        {
          model: DivisionModel,
          required: true,
        },
      ],
    });
    if (!merger) return [];
    return merger;
  };

  /**
   * Approval by ICT personnel
   * @param {Object} user
   * @param {String} unique_id
   * @param {Object} data
   */
  public reviewICT = async (user: any, unique_id: string, data: IRequest) => {
    const check = await this.fetchRequest(unique_id);
    if (check) {
      if (check.status == "ict_pending") {
        data.approved_by = user.id;
        data.date_approved = new Date(Date.now());
        data.status = "store_pending";
        const review = await RequestModel.update(data, {
          where: { unique_id },
        });
        if (review) return this._ictService.allRequest();
        throw new AppError("Could not update request", null, 400);
      }
      throw new AppError("Request already approved", null, 400);
    }

    throw new AppError(check);
  };

  /**
   * Approval by Store manager
   * @param {Object} user
   * @param {String} unique_id
   * @param {Object} data
   */
  public reviewStore = async (user: any, unique_id: string, data: IRequest) => {
    const check = await this.fetchRequest(unique_id);
    if (check) {
      if (check.status == "store_pending") {
        data.issued_by = user.id;
        data.date_issued = new Date(Date.now());
        data.status = "issued";
        const review = await RequestModel.update(data, {
          where: { unique_id },
        });
        if (review) return this.fetchRequest(check.unique_id);
        throw new AppError("Could not update request", null, 400);
      }
      throw new AppError("Requested items already issued", null, 400);
    }

    throw new AppError(check);
  };

  /**
   * Fetches request made by single user
   * @param {Object} user
   * @param {String} sort_by
   * @param {Number} page_no
   * @param {Number} per_page
   * @param {String} from
   * @param {String} to
   */
  public individualRequest = async (
    user: IUser,
    sort_by: "all",
    page_no = 0,
    per_page = 15,
    from?: any,
    to?: any
  ) => {
    const { limit, offset } = getPagination(page_no, per_page);

    let findObject: any = {
      order: [["updated_at", "desc"]],
      limit,
      offset,
      include: [
        {
          model: UserModel,
          required: true,
          attributes: { exclude: USER_EXCLUDES },
        },
        { model: DivisionModel, attributes: { exclude: GENERAL_EXCLUDES } },
      ],
    };

    if (sort_by == "all") {
      if (sort_by == "all") {
        findObject.where = {
          [Op.and]: [
            {
              status: {
                [Op.or]: [
                  "store_pending",
                  "issued",
                  "ict_pending",
                  "cancelled",
                ],
              },
            },
            { requested_by: user.id },
          ],
        };
      }
      if (sort_by == "all" && from && to) {
        const start = new Date(
          new Date(moment(from).format()).setHours(0, 0, 0)
        );
        const end = new Date(
          new Date(moment(to).format()).setHours(23, 59, 59)
        );

        findObject.where = {
          [Op.and]: [
            { updated_at: { [Op.gt]: start, [Op.lt]: end } },
            {
              status: {
                [Op.or]: [
                  "store_pending",
                  "issued",
                  "ict_pending",
                  "cancelled",
                ],
              },
            },
            { requested_by: user.id },
          ],
        };
      }
    } else {
      if (sort_by) {
        findObject.where = {
          [Op.and]: [
            { status: { [Op.like]: `${sort_by}` } },
            { requested_by: user.id },
          ],
        };
      }

      if (sort_by && from && to) {
        const start = new Date(
          new Date(moment(from).format()).setHours(0, 0, 0)
        );
        const end = new Date(
          new Date(moment(to).format()).setHours(23, 59, 59)
        );

        findObject.where = {
          [Op.and]: [
            { updated_at: { [Op.gt]: start, [Op.lt]: end } },
            { status: { [Op.like]: `${sort_by}` } },
            { requested_by: user.id },
          ],
        };
      }
    }

    let requests = await RequestModel.findAndCountAll(findObject);
    let count = requests.count;
    requests = await Promise.all(
      requests.rows.map(async (e) => {
        e = e.toJSON();

        let approved_by = await UserModel.findOne({
          where: { id: e.approved_by },

          attributes: { exclude: USER_EXCLUDES },
        });

        let issued_by = await UserModel.findOne({
          where: { id: e.issued_by },

          attributes: { exclude: USER_EXCLUDES },
        });
        e.approved_name = approved_by;
        e.issuer_name = issued_by;

        return e;
      })
    );

    let data = await {
      count: count,
      rows: requests,
    };
    return getPagingData(data, page_no, limit);
  };
}

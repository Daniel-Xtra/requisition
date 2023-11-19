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

export class RequestService {
  /**
   * Fetches single request using its unique id
   * @param {String} unique_id
   * @returns {Object} fetched request
   */
  public fetchRequest = async (unique_id: string) => {
    const fetch = await RequestModel.findOne({
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
    if (fetch) return fetch;
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
    // console.log(de);
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

    if (fresh && user.addRequest(fresh)) return fresh;
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
      console.log(check.status);
      if (check.status == "ict_pending") {
        data.approved_by = user.id;
        data.date_approved = new Date(Date.now());
        data.status = "store_pending";
        const review = await RequestModel.update(data, {
          where: { unique_id },
        });
        if (review) return this.fetchRequest(check.unique_id);
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
      console.log(check.status);
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
    per_page = 3,
    from?: any,
    to?: any
  ) => {
    let condition: any = {};

    const { limit, offset } = getPagination(page_no, per_page);

    if (sort_by == "all") {
      condition.requested_by = user.id;
    } else {
      condition = {
        [Op.and]: [
          { requested_by: user.id },
          { status: { [Op.like]: `%${sort_by}%` } },
        ],
      };
      // if (sort_by == "ict_pending") {
      //   condition = {
      //     [Op.and]: [{ requested_by: user.id }, { status: "ict_pending" }],
      //   };
      // }
      // if (sort_by == "store_pending") {
      //   condition = {
      //     [Op.and]: [{ requested_by: user.id }, { status: "store_pending" }],
      //   };
      // }
      // if (sort_by == "issued") {
      //   condition = {
      //     [Op.and]: [{ requested_by: user.id }, { status: "issued" }],
      //   };
      // }
      if (from && to) {
        const start = new Date(
          new Date(moment(from).format()).setHours(0, 0, 0)
        );
        const end = new Date(
          new Date(moment(to).format()).setHours(23, 59, 59)
        );

        condition = {
          [Op.and]: [
            { updated_at: { [Op.gt]: start, [Op.lt]: end } },

            { requested_by: user.id },
          ],
        };
      }
      if (from && to && sort_by) {
        const start = new Date(
          new Date(moment(from).format()).setHours(0, 0, 0)
        );
        const end = new Date(
          new Date(moment(to).format()).setHours(23, 59, 59)
        );

        condition = {
          [Op.and]: [
            { updated_at: { [Op.gt]: start, [Op.lt]: end } },
            { status: { [Op.like]: `%${sort_by}%` } },
            { requested_by: user.id },
          ],
        };
      }
    }
    let findObject: any = {
      where: condition,
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

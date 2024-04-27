import { UserModel } from "../User/userModel";
import {
  GENERAL_EXCLUDES,
  USER_EXCLUDES,
  getPagination,
  getPagingData,
} from "../../utils/helpers";
import { ProfileModel } from "../Profile/profileModel";
import { AppError } from "../../utils/app-error";

import { DivisionModel } from "../Division";
import moment from "moment";
import { Op } from "sequelize";
import { RequestModel } from "../Request";

export class AdminService {
  /**
   * Get Admin Home
   * @param {Object} user the current user
   * @memberof AdminController
   */

  /**
   * Get All Users
   * @param {Object} user the current user
   * @param {Number} per_page
   * @param {String} post_next
   * @param {String} post_prev
   * @memberof AdminController
   */

  public getAllUsers = async (sort_by = "all", page_no = 0, per_page = 15) => {
    const { limit, offset } = getPagination(page_no, per_page);

    let findObject: any = {
      order: [["updated_at", "desc"]],
      limit,
      offset,
      attributes: {
        exclude: USER_EXCLUDES,
      },

      include: [
        {
          model: ProfileModel,
          attributes: {
            exclude: GENERAL_EXCLUDES,
          },
        },
        {
          model: DivisionModel,
        },
      ],
    };

    if (sort_by == "true") {
      findObject.where = { verified: 1 };
      let users = await UserModel.findAndCountAll(findObject);
      return getPagingData(users, page_no, limit);
    } else if (sort_by == "false") {
      findObject.where = { verified: 0 };
      let users = await UserModel.findAndCountAll(findObject);
      return getPagingData(users, page_no, limit);
    } else {
      let users = await UserModel.findAndCountAll(findObject);
      return getPagingData(users, page_no, limit);
    }
  };

  /**
   * Updates a user resource
   * @public
   * @param {String} username the current user
   * @param {Object} data the data to be updated
   * @returns {(Object|null)} the updated user resource
   * @memberof AdminController
   */

  public updateUser = async (email: string, data: any) => {
    // update user data by username
    const fetch = await this.getUser(email);
    if (fetch) {
      if (data.division) {
        const confirm = await DivisionModel.findOne({
          where: { name: data.division },
        });
        if (!confirm) {
          throw new AppError("Division not found");
        }
        data.divisionId = confirm.id;

        const updated = await UserModel.update(data, { where: { email } });
        if (!updated) {
          throw new AppError("Could not update user data");
        }
        return await this.getUser(email);
      }
    }
    return fetch;
  };

  /**
   * Get user
   * @param {String} username
   * @returns user on success
   * @memberof AdminController
   */

  public getUser = async (email: string) => {
    // find user from user model by username
    let user = await UserModel.findOne({
      where: { email },
      attributes: {
        exclude: USER_EXCLUDES,
      },
      include: [
        {
          model: ProfileModel,
          attributes: {
            exclude: GENERAL_EXCLUDES,
          },
        },
        {
          model: DivisionModel,
        },
      ],
    });

    if (user) {
      return user;
    }
    throw new AppError(`User '${email}' not found.`, null, 404);
  };

  public allRequest = async (
    sort_by = "all",
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
          status: {
            [Op.or]: ["store_pending", "issued", "ict_pending", "cancelled"],
          },
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
          ],
        };
      }
    } else {
      if (sort_by) {
        findObject.where = { status: { [Op.like]: `${sort_by}` } };
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

  public memberAnalytics = async () => {
    let active = await UserModel.findAndCountAll({
      where: { verified: true },
    });
    let inactive = await UserModel.findAndCountAll({
      where: { verified: false },
    });
    return {
      active: active.count,
      inactive: inactive.count,
    };
  };

  public analysis = async () => {
    const ict = await RequestModel.findAndCountAll({
      where: { status: "ict_pending" },
    });
    const store = await RequestModel.findAndCountAll({
      where: { status: "store_pending" },
    });
    const issued = await RequestModel.findAndCountAll({
      where: { status: "issued" },
    });
    return {
      ict_pending: ict.count,
      store_pending: store.count,
      issued: issued.count,
    };
  };
}

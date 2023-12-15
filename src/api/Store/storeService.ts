import moment from "moment";
import { Op } from "sequelize";

import {
  getPagination,
  USER_EXCLUDES,
  GENERAL_EXCLUDES,
  getPagingData,
} from "../../utils/helpers";
import { DivisionModel } from "../Division";
import { RequestModel } from "../Request";
import { UserModel } from "../User";

export class StoreService {
  /**
   * allRequest
   * @param {String} sort_by
   * @param {Number} page_no
   * @param {Number} per_page
   * @param {String} from
   * @param {String} to
   */
  public allRequest = async (
    sort_by = "all",
    page_no = 0,
    per_page = 15,
    from?: any,
    to?: any
  ) => {
    let condition: any = {};

    const { limit, offset } = getPagination(page_no, per_page);

    if (sort_by == "all") {
      condition.status = { [Op.or]: ["store_pending", "issued"] };
    } else {
      if (sort_by) {
        condition = {
          [Op.and]: [{ status: { [Op.like]: `%${sort_by}%` } }],
        };
      }
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
            { status: { [Op.or]: ["store_pending", "issued"] } },
          ],
        };

        // condition = {updated_at:{ [Op.gt]: start, [Op.lt]: end }};
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

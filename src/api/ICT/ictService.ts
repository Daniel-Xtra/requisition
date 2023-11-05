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

export class IctService {
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
    per_page = 3,
    from?: any,
    to?: any
  ) => {
    let condition: any = {};

    const { limit, offset } = getPagination(page_no, per_page);

    if (sort_by == "all") {
      condition.status = {
        [Op.or]: ["ict_pending", "store_pending", "issued"],
      };
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
            { status: { [Op.or]: ["ict_pending", "store_pending", "issued"] } },
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
    const requests = await RequestModel.findAndCountAll(findObject);

    return getPagingData(requests, page_no, limit);
  };
}

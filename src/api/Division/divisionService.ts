import { AppError } from "../../utils/app-error";

import { IDivision } from "./IDivision";
import { DivisionModel } from "./divisionModel";
import { createSlug } from "../../utils/helpers";
import { Op } from "sequelize";

export class DivisionService {
  /**
   * createDivision

   * @param {Object} data
   * @returns {Object} return the just created division
   * @memberof divisionController
   */
  public createDivision = async (data: IDivision) => {
    const duplicate = await DivisionModel.findOne({
      where: {
        [Op.or]: [{ name: data.name }, { abbreviation: data.abbreviation }],
      },
    });
    if (!duplicate) {
      data.slug = createSlug(data.abbreviation);
      const newDivision = await DivisionModel.create(data);

      if (!newDivision) {
        throw new AppError("Could not create division", null);
      }

      return this.getDivision(newDivision.slug);
    }

    throw new AppError("Division already exist", null);
  };

  /**
   * updateDivision

   * @param {String} slug
   * @param {Object} data 
   * @returns {Object} return the updated division
   * @memberof divisionController
   */

  public updateDivision = async (slug: string, data: IDivision) => {
    const confirm = await this.getDivision(slug);
    if (confirm) {
      const duplicate = await DivisionModel.findOne({
        where: {
          [Op.or]: [{ name: data.name }, { abbreviation: data.abbreviation }],
        },
      });
      if (!duplicate) {
        data.slug = createSlug(data.abbreviation);
        const updatedDivision = await DivisionModel.update(data, {
          where: { slug },
        });

        if (!updatedDivision) {
          throw new AppError("Could not update division", null);
        }

        return this.getDivision(data.slug);
      }

      throw new AppError("Division already exist", null);
    }
    throw new AppError(confirm);
  };

  /**
   * deleteDivision

   * @param {String} slug 
   * @returns {String} on success
   * @memberof divisionController
   */

  public delDivision = async (slug: string) => {
    const check = await DivisionModel.findOne({ where: { slug } });
    if (!check) {
      throw new AppError(
        "You are not allowed to perform this operation",
        null,
        400
      );
    }
    const remove = await DivisionModel.destroy({
      where: { slug },
    });

    if (remove) return "Division deleted";
    throw new AppError("Could not delete division", null, 400);
  };

  // public delDivision = async (slug: string) => {
  //   const check = await DivisionModel.findOne({ where: { slug } });
  //   if (!check) {
  //     throw new AppError(
  //       "You are not allowed to perform this operation",
  //       null,
  //       400
  //     );
  //   }
  //   const remove = await DivisionModel.destroy({
  //     where: { slug },
  //     force: true,
  //   });

  //   if (remove) return "Division deleted";
  //   throw new AppError("Could not delete division", null, 400);
  // };

  /**
   * getDivisions
   * @return {Object[]} array containing divisions
   */
  public getDivisions = async () => {
    const all = await DivisionModel.findAll();
    return all;
  };

  /**
   * getDivision
   * @param {String} slug
   * @returns {Object} single division
   */
  public getDivision = async (slug: string) => {
    const single = await DivisionModel.findOne({ where: { slug } });
    if (single) return single;
    throw new AppError("Division not found", null, 400);
  };
}

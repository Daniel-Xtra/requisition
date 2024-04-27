import { logger } from "../utils/logger";
import { USER_EXCLUDES } from "../utils/helpers";
import { UserModel, UserConnectionsModel } from "../api/User";

export class SocketService {
  /**
   * New socket connection
   * @param {String} email
   * @param {String} socket_id
   * @returns {String} on success
   * @memberof SocketController
   */

  public connect = async (email: string, socket_id: string) => {
    // find user from user model by email
    let user = await UserModel.findOne({
      where: { email },
      attributes: {
        exclude: USER_EXCLUDES,
      },
    });

    if (user) {
      user = user.toJSON();
      const userConnectionExist = await this.getUser(socket_id);
      if (userConnectionExist) {
        return user;
      } else {
        const connectionData = { socket_id, user_id: user.id };
        // add user socket id
        const connectionSaved = await UserConnectionsModel.create(
          connectionData
        );
        if (connectionSaved) {
          return user;
        }
        return {
          message: `Could not add socket ID for ${email}`,
          status: false,
        };
      }
    }

    return {
      message: `Could not add socket ID for ${email}`,
      status: false,
    };
  };

  /**
   * join
   */
  public join = async (socket_id: string) => {
    let user = await this.getUser(socket_id);
    if (user) {
      user.user.toJSON();
      return user.user;
    }
    logger.error("Could not join room");
  };

  public message = async (socket_id: string, data: any) => {
    const user = await this.getUser(socket_id);
    if (user) {
      user.user.toJSON();
      const recipientConnection = await this.getUserConnections(data.sent_to);
      if (recipientConnection && recipientConnection.length > 0) {
        let datas = {
          id: user.id,
          email: user.user.email,
          message: data.message,
        };
        return {
          datas,
          to_sockets: recipientConnection,
        };
      }

      logger.error("Could not message");
    }
  };

  public getUserConnections = async (user_id: number) => {
    const userConnections = await UserConnectionsModel.findAll({
      where: {
        user_id,
      },
      attributes: ["socket_id"],
      group: ["socket_id"],
    });
    if (userConnections) {
      return userConnections;
    }
  };

  /**
   * Disconnect
   * @param {String} socket_id
   * @param {String} reason
   * @returns email on success
   * @memberof SocketController
   */

  public disconnect = async (reason: string, socket_id: string) => {
    let user = await this.getUser(socket_id);

    if (user) {
      user = user.toJSON();
      if (user.user) {
        // Delete user connection
        let destroyed = await UserConnectionsModel.destroy({
          where: { socket_id },
          force: true,
        });

        if (destroyed) {
          logger.info(`User ${user.user.email} disconnected due to: ${reason}`);
          return user.user.id;
        }
        logger.error("Could not disconnect user");
      }
      logger.error("Could not disconnect user");
    }

    logger.error("Could not disconnect user");
  };

  /**
   * Get user status
   * @param {Number} user_id
   * @returns user on success
   * @memberof SocketController
   */

  public getUserStatus = async (user_id: number) => {
    let user = await UserModel.findOne({
      where: { id: user_id },
      attributes: {
        exclude: USER_EXCLUDES,
      },
    });
    if (user) {
      const userConnections = await UserConnectionsModel.count({
        where: {
          user_id,
        },
      });
      user = user.toJSON();
      if (userConnections > 0) {
        user.isOnline = true;
      } else {
        user.isOnline = false;
      }
      return user;
    }
  };

  /**
   * Get user
   * @param {String} socket_id
   * @returns {Object} on success
   * @memberof SocketController
   */

  private getUser = (socket_id: string) => {
    // get user by socket_id and return it
    return UserConnectionsModel.findOne({
      where: {
        socket_id,
      },
      include: [
        {
          model: UserModel,
          attributes: {
            exclude: USER_EXCLUDES,
          },
        },
      ],
    });
  };
}

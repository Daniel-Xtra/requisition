import { instrument } from "@socket.io/admin-ui";
import { Server, Socket } from "socket.io";
import * as events from "./events";
import { SocketService } from "./socketService";

export class SocketController {
  io: Server;
  server: any;
  private _socketService = new SocketService();

  constructor(app) {
    this.server = app;
    this.io = new Server(this.server, {
      cors: { origin: ["https://admin.socket.io"], credentials: true },
    });
  }

  public startSocket = () => {
    this.io.on("connection", (socket: Socket) => {
      socket.on(events.NEW_CONNECTION, async (email: string) => {
        const res = await this._socketService.connect(email, socket.id);

        if (res) {
          const status = await this._socketService.getUserStatus(res.id);

          if (status) {
            socket.broadcast.emit(events.ONLINE_STATUS, status);
            this.emit(socket, events.NEW_CONNECTION, res);
          }
        }
      });
      socket.on(events.JOINED, async (room) => {
        const roo = await this._socketService.join(socket.id);

        if (roo) {
          socket.join(room);
          this.emit(socket, events.MESSAGE, `You joined ${room}`);
          socket.broadcast
            .to(room)
            .emit(events.MESSAGE, { text: `${roo.email} has joined!` });
        }
      });

      socket.on(events.MESSAGE, async (data: any) => {
        const res = await this._socketService.message(socket.id, data);
        if (res != undefined) {
          if (res.to_sockets && res.to_sockets.length > 0) {
            res.to_sockets.forEach((element) => {
              element = element.toJSON();
              this.emit(socket, events.MESSAGE, res.datas, element.socket_id);
            });
          }
        }
      });

      socket.on("disconnect", async (reason: string) => {
        const res = await this._socketService.disconnect(reason, socket.id);

        if (res) {
          const status = await this._socketService.getUserStatus(res);
          if (status) {
            socket.broadcast.emit(events.ONLINE_STATUS, status);
          }
        }
      });
    });
    instrument(this.io, { auth: false, mode: "development" });
  };

  /**
   * Emits data to a socket
   */
  private emit = (
    socket: Socket,
    event: string,
    data: any,
    recipient?: string
  ) => {
    if (recipient) {
      return socket.to(recipient).emit(event, data);
    }

    return socket.emit(event, data);
  };
}

import { Hocuspocus, Server } from '@hocuspocus/server';
import { WebSocketGateway } from '@nestjs/websockets';
import { IncomingMessage } from 'http';
import { parse as urlParse } from 'url';

@WebSocketGateway(3000)
export class CollabGateway {
  private _hocuspocus: Hocuspocus;

  constructor() {
    const hocuspocus = Server.configure({
      async onConfigure(data: any) {
        console.log(`Server was configured!`);
      },
      async onListen(data: any) {
        console.log(`Server is listening on port "${data.port}"!`);
      },
      async onConnect(data: any) {
        console.log(`New websocket connection`);
      },
      async connected() {
        console.log('connections:', hocuspocus.getConnectionsCount());
      },
      async onDisconnect(data: any) {
        console.log(`"${data.context.user.name}" has disconnected.`);
      },
      async onDestroy(data: any) {
        console.log(`Server was shut down!`);
      },
    });
    this._hocuspocus = hocuspocus;
  }

  async handleConnection(client: WebSocket, request: IncomingMessage) {
    const URL = urlParse(request.url!, true);
    const userID = URL.query.userID;

    console.log('tryConnect', request.url, userID);

    const context = {
      user: {
        id: userID,
      },
    };

    this._hocuspocus.handleConnection(client, request, context);
  }
}

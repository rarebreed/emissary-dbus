/* @flow */
import Rx from "rxjs/Rx";              // Default import es6 style
import { Stack } from "immutable"; // Import named es6 style
const dbus = require("dbus-native");   // commonjs(node) style import
import WebSocket from 'ws';


/**
 * Create a websocket server
 */
class DBusWSServer {
  svcName: string;
  objPath: string;
  ifaceName: string;
  sysbus: MessageBus;
  targetSvc: DBusService;

  constructor( svcName: string = 'com.redhat.SubscriptionManager'
             , objPath: string = "/EntitlementStatus"
             , ifaceName: string = svcName + ".EntitlementStatus"
             , port: number = 13172
             ) {
    this.wss = new WebSocket.Server({port: port});
    this.svcName = svcName;
    this.objPath = objPath;
    this.ifaceName = ifaceName;

    // TODO: Figure out how to type these.  I don't think we have to create a class for each object here, but we
    // need to at least specify an interface.
    this.sysbus = dbus.getSystemBus();
    this.targetSvc = sb.getService(svcName);
  }

  makeWebSocketServer(port: number = 13172): void {
    this.wss.on('connection', (ws, req) => {
      let clientIP = req.connection.remoteAddress;
      console.log(`Connection from ${clientIP}`);
      ws.on('message', (message) => {
        console.log('received: %s', message);
        let msg: RequestMessage = JSON.parse(message);
        let {op, body, to, from} = msg;
        switch(op) {
          case "get-status":
            console.log("TODO: Get status for client");
            ws.send("Sorry, status is not yet implemented");
            break;
          case "quit":
            console.log(`Closing down the server`);
            ws.close();
            break;
          case "disconnect":
            console.log("Sorry, disconnect is not yet implemented");
          default:
            console.log("Unknown operation");
            break;
        }
      });

      ws.send(history.peek());
    });

    statusHandler(status) {
      // FIXME: get the starting status instead of 0
      this.subject
        .scan((acc: Stack<number>, current: number) => {
          history.push(current), 0
        })
        .subscribe(statusObserver);
    };
  }

  /*
   * This code basically registers a handler for when the entitlement_status_changed event is emitted.  Here, we
   * accumulate the status over time in a stack so that we can easily retrieve the most recent status.  It does this
   * by using the Subject.  As the event is received the scan method will store it in an immutable stack
   */
  setInterfaceHandler(hdlr) {
    this.targetSvc.getInterface (this.objPath, this.ifaceName, hdlr);
  }
}



const entitlementStatusHandler: Listener2<string, IEventEmitter> = (e: string, iface: IEventEmitter) => {
   if (e || !iface) {
       console.error ('Could not query interface the error was: ' + e ? e : '(no error)')
   }

   /* Here, 'iface' represents the service's interface. It is an event emitter, so to listen to signals, we
    * just have to do like any other event emitter and listen for signals: on('signalName')
    */
   iface.on ('entitlement_status_changed', statusHandler);
};

// TODO: Whenever node support es6 module syntax, change it to use it
module.exports = {
  entitlementStatusHandler: entitlementStatusHandler,
  DBusWSServer: DBusWSServer
}

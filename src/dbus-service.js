/* @flow */
import Rx from "rxjs/Rx";              // Default import es6 style
const dbus = require("dbus-native");   // commonjs(node) style import
import WebSocket from "ws";
const http = require("http");
const express = require("express");
const immutable = require("immutable");
const Stack = immutable.Stack;

/**
 * Create a websocket server
 */
class DBusWSServer {
  svcName: string;
  objPath: string;
  ifaceName: string;
  sysbus: MessageBus;
  targetSvc: DBusService;
  wss: IWebSocketServer;
  subject: Rx.BehaviorSubject;
  history: Stack<number>;

  constructor( svcName: string = 'com.redhat.SubscriptionManager'
             , objPath: string = "/EntitlementStatus"
             , ifaceName: string = svcName + ".EntitlementStatus"
             , port: number = 13172
             ) {
    this.wss = this.makeServer(port);
    this.svcName = svcName;
    this.objPath = objPath;
    this.ifaceName = ifaceName;

    this.subject = Rx.BehaviorSubject(0);
    this.history = immutable.Stack();

    // TODO: Figure out how to type these.
    this.sysbus = dbus.getSystemBus();
    this.targetSvc = this.sysbus.getService(svcName);
  }

  makeServer(port: number): IWebSocketServer {
    const app = express();
    const server = http.createServer(app);
    const wss = WebSocket.Server({ server, port: port });
    return wss;
  }

  setupWebSocketServer(port: number = 13172): void {
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
        ws.send(this.history.peek().toString());
      });
    });
  }

  statusHandler(status: number): void {
      // FIXME: get the starting status instead of 0
      this.subject
        .scan((acc: Stack<number>, current: number) => {
          this.history.push(current), 0
        })
        .subscribe({ next: (status: number) => console.log(`the status is now ${status}`) });
  }

  /*
   * This code basically registers a handler for when the entitlement_status_changed event is emitted.  Here, we
   * accumulate the status over time in a stack so that we can easily retrieve the most recent status.  It does this
   * by using the Subject.  As the event is received the scan method will store it in an immutable stack
   */
  setInterfaceHandler(): void {
    this.targetSvc.getInterface (this.objPath, this.ifaceName, (e: string, iface: IEventEmitter) => {
       if (e || !iface) {
           console.error ('Could not query interface the error was: ' + e ? e : '(no error)')
       }

       /* Here, 'iface' represents the service's interface. It is an event emitter, so to listen to signals, we
        * just have to do like any other event emitter and listen for signals: on('signalName')
        */
       iface.on ('entitlement_status_changed', this.statusHandler);
    });
  }
}

// TODO: Whenever node support es6 module syntax, change it to use it
module.exports = {
  DBusWSServer: DBusWSServer
}

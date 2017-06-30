// libdef for the node-bus v 0.2.1 module

/*
 * We are telling flow that when you say:
 * const dbus = require("dbus-native")
 * that dbus has this interface MessageBus (which could either be a System or Session bus)
 */
declare interface MessageBus {
  getService() : DBusService;
}

declare interface DBusService {
  getInterface(objPath: string, ifacename: string,  Listener2<string, IEventEmitter>): void;
}

declare type onWebSocketHandler = (signal: string, message: string) => void;

declare interface IWebSocket {
  on(signalName: string, handler: onWebSocketHandler): void;
  send(body: string): void;
  close(): void;
}

declare interface IWebSocketServer {
  on(signalName: string, handler: (ws: IWebSocket, req: http$IncomingRequest) => void): void;
}

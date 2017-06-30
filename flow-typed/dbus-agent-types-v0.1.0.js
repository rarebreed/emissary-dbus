declare type Ops = "get-status" | "quit" | "disconnect";
declare type RequestMessage = { op: Ops
    , body: string
    , to: string
    , from: string
    // auth: Add a json webtoken
    };

/* The ListenerX type tries to model listeners is javascript which can take a variable number of arguments
 * with a variable number of types.  Here, we just declare the arity of the listener, and the type(s) of the args and
 * the return type of the listener.  Add more ListenerX types if you need a listener with more args
 *
 * To make a function of this type:
 * const errHandler: Listener1<string, void> = (err) => console.log(err);
 * const fooHandler: Listener2<string, number, ?number> = (err, status) => {
 *   if (err) console.log(err)
 *   else {
 *     console.log(`Got a status of ${status}`);
 *     return status;
 *   }
 * }
 */
declare type Listener1<T> = <T>(arg1: T) => void;
declare type Listener2<T1, T2> = <T1, T2>(arg1: T1, arg2: T2) => void;

/*
 * Start of an EventEmitter type. I foresee a problem here though.  An EventEmitter can supply the on() method with
 * different kinds of handlers.  I suppose this could be solved with a Union type, though that will get ugly
 */
declare interface IEventEmitter {
  on(signal: string, listener: Listener1<T> | Listener2<T1, T2>): void;
}

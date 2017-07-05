declare type emissary$Ops = "get-status" | "quit" | "disconnect";
declare type emissary$RequestMessage = { op: Ops
    , body: string
    , to: string
    , from: string
    // auth: Add a json webtoken
    };

/* The ListenerX type tries to model listeners in javascript which can take a variable number of arguments
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
declare type emissary$Listener1<T> = <T>(arg1: T) => void;
declare type emissary$Listener2<T1, T2> = <T1, T2>(arg1: T1, arg2: T2) => void;

// Alternately, the above could be:
// declare function listener1<T>(arg1: T) => void;
// declare function listener2<T1, T2>(arg1: T1, arg2: T2) => void;

/*
 * Start of an EventEmitter type. I foresee a problem here though.  An EventEmitter can supply the on() method with
 * different kinds of handlers.  For example, you could have:
 * on("some-signal", (name: string) => console.log(name));
 * on("other-signal", (age: number) => someOtherFunction(age));
 *
 * Need to find out if flow supports method overloading.  In a dynamic language only arity counts with respect to the
 * args, since there is no distinction of types being passed in.  For a statically typed language, we need to know
 * the types so if a function has the same name but two different arg types, that would be overloading (or multiple
 * dispatch)
 */
declare interface emissary$IEventEmitter {
  on(signal: string, listener: Listener1<T> | Listener2<T1, T2>): void;
}

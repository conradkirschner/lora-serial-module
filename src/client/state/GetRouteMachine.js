
import {assign, createMachine, interpret} from 'xstate';
import packages from "../packages";
import {DEVICEID} from "../../_global_constrains";
import {sequenceNumber} from "../InputParser";
import commands from "../commands";
function sendRouteReplyAck(context) {
    const {originAddress, destinationAddress, requestId, lifetime} = context;

    return new Promise((resolve) => {
        setTimeout(()=>{
            resolve(Date.now());
        }, 140)
    });
}

function sendRouteReply(context) {
    const {originAddress, destinationAddress, requestId, lifetime} = context;
}

function isValid(context) {
    return true;
}

function sendRouteRequest(context) {
    const { originAddress, destinationAddress, requestId, lifetime } = context;

    // const rreq = packages.send.rreq(
    //     1,
    //     0,
    //     0,
    //     DEVICEID,
    //     sequenceNumber,
    //     clientId,
    //     0
    // );
    // that.pushCommand(commands.lora.setBroadcast());
    // that.pushSendCommand(rreq);

    return new Promise((resolve) => {
        setTimeout(()=>{
            resolve(Date.now());
        }, 100)
    });
}


export const getRouteMachine = createMachine({
    id: 'get_route',
    initial: 'idle',
    context: {
        uflag: null,
        hopCount: null,
        rreq_id: null,
        originAddress: null,
        originSequenceNumber: null,
        destinationAddress: null,
        destinationSequenceNumber: null,
        sendRouteRequestTime: null,
        sendRouteReplyTime: null,
        valid: false,
    },
    states: {
        idle: {},
        request_route: {
            initial: 'loading',
            states: {
                loading: {
                    invoke: {
                        id: 'send-route-request',
                        src: sendRouteRequest,
                        onDone: {
                            target: 'waitForRouteReply',
                            actions: assign({
                                sendRouteRequestTime: (context, event) => event.data
                            })
                        },
                        onError: 'failed'
                    }
                },
                failed: {

                }
            },
            on: {
                sended: {
                    target: 'waitForRouteReply'
                }
            }
        },
        waitForRouteReply:{
            initial: 'waiting',
            states: {
                waiting: {},
            }
        },

        route_reply: {
            initial: 'received',
            states: {
                received: {
                    invoke: {
                        id: 'send-route-reply-ack',
                        src: sendRouteReplyAck,
                        onDone: {
                            target: 'sended',
                            actions: assign({
                                sendRouteReplyTime: (context, event) => event.data
                            })
                        },
                        onError: 'failed'
                    }
                },
                sended: {

                },
                failed: {

                }
            }
        },
    },
    on: {
        REQUEST_ROUTE_TO_DESTINATION: {
            invoke: {
                id: 'send-route-request',
                src: sendRouteRequest,
                onDone: {
                    target: 'sended',
                    actions: assign({
                        sendRouteRequestTime: (context, event) => event.data
                    })
                },
                onError: 'failed'
            },
            target: '.request_route',
            actions: assign({
                uflag: (context, event) => event.uflag,
                hopCount: (context, event) => event.hopCount,
                rreq_id: (context, event) => event.rreq_id,
                originAddress: (context, event) => event.originAddress,
                originSequenceNumber: (context, event) => event.originSequenceNumber,
                destinationAddress: (context, event) => event.destinationAddress,
                destinationSequenceNumber: (context, event) => event.destinationSequenceNumber,
            })
        },
        WAIT_FOR_ROUTE_REPLY: {

        },
        RECEIVE_ROUTE_REPLY_TO_DESTINATION: {
            target: '.route_reply',
            actions: assign({
                uflag: (context, event) => event.uflag,
                hopCount: (context, event) => event.hopCount,
                rreq_id: (context, event) => event.rreq_id,
                originAddress: (context, event) => event.originAddress,
                originSequenceNumber: (context, event) => event.originSequenceNumber,
                destinationAddress: (context, event) => event.destinationAddress,
                destinationSequenceNumber: (context, event) => event.destinationSequenceNumber,
            })
        },
        CHECK_VALIDITY: {
            actions: assign({
                valid: (context, event) => isValid(context),
            })
        },

    }
});
const GOT_ROUTE_EVENT =  {
    type: 'SELECT', // event type
    name: 'reactjs' // subreddit name
};
export const getRouteMachineFactory = (destinationAddress, routeRequestId) => {


    const promiseService = interpret(promiseMachine.withContext({
        destinationAddress,
        routeRequestId
    })).onTransition((state) =>
        console.log(state.value)
    );

// Start the service
    promiseService.start();
// => 'pending'

    promiseService.send({ type: 'RESOLVE' });
}


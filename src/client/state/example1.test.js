const {createMachine} = require("xstate");
const {interpret} = require("xstate");
const {getRouteMachine} = require("./GetRouteMachine");
describe('reddit machine (live)', () => {
    it('should load posts of a selected subreddit', (done) => {

        const wizardMachine = createMachine({
            id: 'get_route',
            initial: 'idle',
            states: {
                idle:{},
                requesting_route: {
                    initial: 'send_route_request',
                    states: {
                        send_route_request: {
                            on: {
                                NEXT: { target: 'wait_for_route_reply' }
                            }
                        },
                        wait_for_route_reply: {
                            on: {
                                NEXT: { target: 'send_route_ack' }
                            }
                        },
                        send_route_ack: {
                            /* ... */
                        }
                    },
                    on: {
                        NEXT: { target: 'valid_route' },
                        CLOSE: { target: 'closed' }
                    }
                },
                valid_route: {
                    states:{
                        isValid :{
                            on: {
                                VALID: { target: 'isValid' },
                                INVALID: { target: 'inValid' }
                            }
                        },
                        inValid: {},
                    },
                    on: {
                        CLOSE: { target: 'closed' },
                        VALIDATE: { target: 'closed' }
                    }
                },
                closed: {
                    type: 'final'
                }
            }
        });

// { open: 'step1' }
        const { initialState } = wizardMachine;

// the NEXT transition defined on 'open.step1'
// supersedes the NEXT transition defined
// on the parent 'open' state
        const nextStepState = wizardMachine.transition(initialState, { type: 'NEXT' });
        console.log(nextStepState.value);
// => { open: 'step2' }

// there is no CLOSE transition on 'open.step1'
// so the event is passed up to the parent
// 'open' state, where it is defined
        const closedState = wizardMachine.transition(initialState, { type: 'CLOSE' });
        console.log(closedState.value);

    });
});

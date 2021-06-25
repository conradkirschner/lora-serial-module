const {interpret} = require("xstate");
const {getRouteMachine} = require("./GetRouteMachine");
describe('reddit machine (live)', () => {
    it('should load posts of a selected subreddit', (done) => {
        const routeService = interpret(getRouteMachine)
            .onTransition((state) => {
                // when the state finally reaches 'selected.loaded',
                // the test has succeeded.
                if (state.matches({ waitForRouteReply: 'waiting' })) {
                    console.log(state);

                    done();
                }
                console.log(state);

            })
            .start(); // remember to start the service!

        // Test that when the 'SELECT' event is sent, the machine eventually
        // reaches the { selected: 'loaded' } state with posts
        routeService.send('CHECK_VALIDITY')
        routeService.send('REQUEST_ROUTE_TO_DESTINATION', {
            uflag: 1,
            hopCount: 0,
            rreq_id: 1,
            originAddress: 12,
            originSequenceNumber: 1,
            destinationAddress: 10,
            destinationSequenceNumber: 0,
        });

        setTimeout(()=> {
            const { initialState } = routeService;

// => 'pending'
            const nextState = routeService.transition('request_route', { type: 'RESOLVE' });

            // // Test that when the 'SELECT' event is sent, the machine eventually
            // // reaches the { selected: 'loaded' } state with posts
            // routeService.send('RECEIVE_ROUTE_REPLY_TO_DESTINATION', {
            //     uflag: 1,
            //     hopCount: 0,
            //     rreq_id: 1,
            //     originAddress: 12,
            //     originSequenceNumber: 1,
            //     destinationAddress: 10,
            //     destinationSequenceNumber: 0,
            // });
        }, 1500);

    });
});

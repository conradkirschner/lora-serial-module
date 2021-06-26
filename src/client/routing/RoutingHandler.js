import {LIFETIME} from "./RouteEntry";
import {log} from '../../logger';

export class RoutingHandler {
    /**
     *
     * @type {}
     */
    routes = [];
    updateRoute(route) {
        const index = this.findRoute(route);
        const updateRoute = this.routes[index];
    }

    getDirectNodes(nodeId) {
        for (let i = 0; i < this.routes.length; i++) {
            // direct route
            const currentReachableNode = this.routes[i].source;
            if (currentReachableNode == nodeId) {
                return currentReachableNode;
            }
        }
        return null;
    }

    /**
     *
     * @param nodeId
     * @returns {RouteEntry|null}
     */
    getRoute(nodeId) {
        if (!nodeId) return null;
        for (let i = 0; i < this.routes.length; i++) {
            if (this.routes[i].source == nodeId) { // direct route
                return this.routes[i];
            }
            const currentRoute = this.routes[i].route;
            if (currentRoute.nextNode == nodeId) {
                return this.routes[i];
            }
        }
        return null;
    }

    /**
     *
     * @param route RouteEntry
     * @param source
     */
    addRouteIfNotExist(route, source) {
        const index = this.findRoute(source);
        if (index === -1) {
            this.addRoute({route, source: parseInt(source)});
            log('[router]', route);
            return;
        } else {
            // @todo update
            // this.routes[index].valid = route.valid;
            // this.routes[index].nextNode = parseInt(source);
            // this.routes[index].hopCount = route.hopCount;
            // this.routes[index].expiringTime = route.expiringTime;
            // this.routes[index].sequenceNumber = route.sequenceNumber;
            // this.routes[index].sequenceNumber = route.sequenceNumber;

        }
        log('[router]', route);
    }

    addRoute(route) {
        this.routes.push(route);
    }
    findRoute(source) {
        let index = -1
        for (let i = 0; i < this.routes.length; i++) {
            if (this.routes[i].source === source){
                index = i;
                break;
            }
        }
        return index;
    }
    removeRoute(route) {

        this.routes.splice(this.findRoute(route), 1)
    }
    invalidateRoutes(){
        for (let i = 0; i < this.routes.length; i++) {
            if (!this.routes[i].valid){
                delete this.routes[i];
            }
        }
    }
}

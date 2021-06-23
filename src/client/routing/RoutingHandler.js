
export class RoutingHandler {
    /**
     *
     * @type {RouteEntry[]}
     */
    routes = [];
    updateRoute(route) {
        const index = this.findRoute(route);
        const updateRoute = this.routes[index];
    }

    getRoutingNode(nodeId) {
        for (let i = 0; i < this.routes.length; i++) {
            // direct route
            const currentRoute = this.routes[i];
            // routeable through node pick first one
            if (currentRoute.destination_addr == nodeId) {
                return currentRoute.precursors[0];
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
        for (let i = 0; i < this.routes.length; i++) {
            // direct route
            const currentRoute = this.routes[i];
            // routeable through node pick first one
            if (currentRoute.destination_addr == nodeId) {
                return currentRoute;
            }
        }
        return null;
    }

    addRouteIfNotExist(route) {
        if (this.findRoute(route) === -1) {
            this.addRoute(route);
            return;
        }
        console.log('Route already exist', route);
    }

    addRoute(route) {
        this.routes.push(route);
    }
    findRoute(route) {
        let index = -1
        for (let i = 0; i < this.routes.length; i++) {
            if (this.routes[i].isEqual(route)){
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

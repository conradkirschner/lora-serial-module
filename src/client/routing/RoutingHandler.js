
export class RoutingHandler {
    /**
     *
     * @type {RouteEntry[]}
     */
    routes = [];

    getRoute(nodeId) {
        for (let i = 0; i < this.routes.length; i++) {
            // direct route
            const currentRoute = this.routes[i];
            if (currentRoute.destination_addr === nodeId) {
                return currentRoute;
            }
            // routeable through node
            for (let x = 0; currentRoute.precursors.length; x++) {
                const currentNode = cu
            }

        }
        return null;
    }
    addRouteIfNotExist(route) {
        if (this.findRoute(route) === -1) {
            this.addRoute(route);
        }
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

export class RoutingHandler {
    routes = [];

    getRoute(nodeId) {
        return null;
    }

    addRoute(route) {
        this.routes.push(route);
    }
    removeRoute(route) {
        let index = -1
        for (let i = 0; i < this.routes.length; i++) {
            if (this.routes[i].isEqual(route)){
                index = i;
                break;
            }
        }
        this.routes.splice(index, 1)
    }
    invalidateRoutes(){
        for (let i = 0; i < this.routes.length; i++) {
            if (!this.routes[i].valid){
                delete this.routes[i];
            }
        }
    }
}

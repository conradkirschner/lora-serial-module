import hash from 'object-hash';
/**
 * @source: https://gomakethings.com/how-to-check-if-two-arrays-are-equal-with-vanilla-js/#:~:text=To%20check%20for%20equality%2C%20we,the%20same%20length%20if%20(arr1.
 * @param arr1
 * @param arr2
 * @returns {boolean}
 */
const arraysMatch = function (arr1, arr2) {

    // Check if the arrays are the same length
    if (arr1.length !== arr2.length) return false;

    // Check if all items exist and are in the same order
    for (var i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }

    // Otherwise, return true
    return true;

};
export class RouteEntry {
    LIFETIME = 180;
    precursors;
    destination_addr;
    dest_sequence_num;

    hops;
    nextNode;

    expiry_time;
    is_dest_seq_valid;
    is_route_valid;

    constructor(destination_addr, nextNode, hops, dest_sequence_num, lastHopInRoute) {
        this.precursors = [];
        this.precursors.push(lastHopInRoute);
        this.destination_addr = destination_addr;
        this.dest_sequence_num = dest_sequence_num;
        this.nextNode = nextNode;
        this.hops = hops;
        this.expiry_time = Date.now();
    }

    get valid() {
        return (this.expiry_time + this.LIFETIME) < Date.now();
    }

    get time_to_life() {
        return (this.expiry_time + this.LIFETIME) - Date.now();
    }
    updatePrecursor(address) {
        if(!this.precursors.contains(address))
        {
            this.precursors.add(address);
        }
    }


    updateRoute(route) {
        this.nextNode = route.nextNode;
        this.dest_sequence_num = route.dest_sequence_num;
        this.hops = route.hops;
    }
    getHash() {
        hash(this);
    }

    isEqual({destination_addr,
    dest_sequence_num,
    is_dest_seq_valid,
    is_route_valid,
    hops,
    nextNode,
    precursors
    }) {
        if (this.destination_addr !== destination_addr) {
            return false;
        }
        if (this.dest_sequence_num !== dest_sequence_num) {
            return false;
        }
        if (this.is_dest_seq_valid !== is_dest_seq_valid) {
            return false;
        }
        if (this.is_route_valid !== is_route_valid) {
            return false;
        }
        if (this.hops !== hops) {
            return false;
        }
        if (this.nextNode !== nextNode) {
            return false;
        }
        if (!arraysMatch(this.precursors, precursors)) {
            return false;
        }
        return true;
    }
}

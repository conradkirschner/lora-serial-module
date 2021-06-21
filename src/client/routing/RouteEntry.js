import hash from 'object-hash';

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
    precursors,
    expiry_time}) {
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
        if (this.precursors !== precursors) {
            return false;
        }
        if (this.expiry_time !== expiry_time) {
            return false;
        }
        return true;
    }
}

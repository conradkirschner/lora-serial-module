class RouteEntry {
    destination_addr;
    dest_sequence_num;
    is_dest_seq_valid;
    is_route_valid;
    hops;
    next_hop;
    precursors;
    expiry_time;

    constructor(destination_addr, dest_sequence_num, is_dest_seq_valid, is_route_valid, hops, next_hop, precursors) {
        this.destination_addr = destination_addr;
        this.dest_sequence_num = dest_sequence_num;
        this.is_dest_seq_valid = is_dest_seq_valid;
        this.is_route_valid = is_route_valid;
        this.hops = hops;
        this.next_hop = next_hop;
        this.precursors = precursors;
        this.expiry_time = Date.now();
    }

    get valid() {
        if ((this.expiry_time + process.env.LIFETIME) < Date.now()) {

        }
    }
}

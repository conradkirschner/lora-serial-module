import packages from "../src/client/packages";

const createFakeResponse = (sender, binary) => {
    return `LR,${sender},${binary.length},${binary.toString('ascii')}`
}
export const B_route_request_broadcast = createFakeResponse(
    12,
    packages.send.rreq(
        1,
        1,
        10,
        1,
        13,
        0,
    )
);
export const B_send_hop_ack = createFakeResponse(
    12,
    packages.send.send_hop_ack(
        1,
        1,
        10,
        1,
        13,
        0,
    )
);
export const B_route_reply_unicast = createFakeResponse(
    12,
    packages.send.rrep(
        2,
        10,
        13,
        1,
        180,
    )
);

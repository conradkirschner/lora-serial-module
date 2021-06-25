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
export const LIFETIME = 180*1000;

export class RouteEntry {
    nextNode;
    hopCount;
    requestId;
    sequenceNumber = undefined;
    precursors = [];
    expiringTime;
    valid;

    /**
     *
     * @param  nextNode string
     * @param hopCount
     * @param requestId
     * @param sequenceNumber
     * @param precursors
     * @param expiringTime
     * @param valid
     */
    constructor(nextNode, hopCount,  requestId, sequenceNumber, precursors, expiringTime, valid) {
        this.nextNode = nextNode;
        this.hopCount = hopCount;
        this.requestId = requestId;
        this.sequenceNumber = sequenceNumber;
        this.precursors = precursors;
        this.expiringTime = expiringTime;
        this.valid = valid;
    }

    isValid() {
        return this.valid && this.expiringTime >= Date.now();
    }
        isEqual({   nextNode,
                    hopCount,
                    requestId,
                    sequenceNumber = undefined,
                    precursors = [],
                    expiringTime,
                    valid,
        }) {
        if (this.nextNode !== nextNode) {
            return false;
        }

        if (this.hopCount !== hopCount) {
            return false;
        }

        if (this.sequenceNumber !== sequenceNumber) {
            return false;
        }

        if (this.expiringTime !== expiringTime) {
            return false;
        }
        if (this.valid !== valid) {
            return false;
        }
        return true;
    }
}
//
// export class RouteEntry {
//     LIFETIME = 180;
//     precursor = [];
//     destination_addr;
//     dest_sequence_num;
//
//     hops;
//
//     expiry_time;
//     is_dest_seq_valid;
//     is_route_valid;
//
//     constructor(
//         destination_addr,
//         hops,
//         dest_sequence_num,
//
//     ) {
//         this.reachableNodes = [];
//
//         this.destination_addr = destination_addr;
//         this.dest_sequence_num = dest_sequence_num;
//         this.hops = hops;
//         this.expiry_time = Date.now();
//     }
//
//     get valid() {
//         return (this.expiry_time + this.LIFETIME) < Date.now();
//     }
//
//     reset_lifetime() {
//         this.expiry_time = Date.now();
//     }
//
//     get time_to_life() {
//         return (this.expiry_time + this.LIFETIME) - Date.now();
//     }
//
//     updateRoutes(address) {
//         if(!this.reachableNodes.contains(address))
//         {
//             this.reachableNodes.add(address);
//         }
//     }
//
//
//     updateRoute(route) {
//         this.nextNode = route.nextNode;
//         this.dest_sequence_num = route.dest_sequence_num;
//         this.hops = route.hops;
//     }
//
//
//     getHash() {
//         hash(this);
//     }
//
//     isEqual({destination_addr,
//     dest_sequence_num,
//     is_dest_seq_valid,
//     is_route_valid,
//     hops,
//     nextNode,
//     reachableNodes
//     }) {
//         if (this.destination_addr !== destination_addr) {
//             return false;
//         }
//         if (this.dest_sequence_num !== dest_sequence_num) {
//             return false;
//         }
//         if (this.is_dest_seq_valid !== is_dest_seq_valid) {
//             return false;
//         }
//         if (this.is_route_valid !== is_route_valid) {
//             return false;
//         }
//         if (this.hops !== hops) {
//             return false;
//         }
//         if (this.nextNode !== nextNode) {
//             return false;
//         }
//         if (!arraysMatch(this.reachableNodes, reachableNodes)) {
//             return false;
//         }
//         return true;
//     }
// }

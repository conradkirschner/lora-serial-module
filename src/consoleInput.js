const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
export const askValue = (title) => {
    return new Promise((resolve, reject) => {
        rl.question(title, function(value) {
            resolve(value);
        });
    })
}


rl.on("close", function() {
    process.exit(0);
});

/* --------------------------------------------------
    < LOGGER MODULE > --- < THÔNG BÁO SỰ KIỆN >
--------------------------------------------------- */

const logger = {
    info: (args) => {
        console.log(`\x1b[32m[- INFO -]\x1b[0m ${args}`);
    },
    warn: (args) => {
        console.log(`\x1b[33m[- WARN -]\x1b[0m ${args}`);
    },
    error: (args) => {
        console.log(`\x1b[31m[- ERROR -]\x1b[0m ${args}`);
    },
    system: (args) => {
        console.log(`\x1b[36m[- SYSTEM -]\x1b[0m ${args}`);
    },
    message: (args) => {
        console.log(`\x1b[34m[- MESSAGE -]\x1b[0m ${args}`);
    }
};

// ----- < [ EXPORT ] - XUẤT MODULE > ----- //
module.exports = { logger };
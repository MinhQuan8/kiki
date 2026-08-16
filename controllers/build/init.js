/* -------------------------------------------------------------------
    < INIT MODULE > --- < TỔNG HỢP MOUDLE GLOBAL VÀ MODULE LOADER >
---------------------------------------------------------------------- */

// ----- < [ KHAI BÁO ] - REQUIRE MODULE CẦN THIẾT > ----- //
const { buildGlobal } = require("./global");
const { buildModules } = require("./loader");
const { logger } = require('./logger');

// ----- < [ HÀM ] - XÂY DỰNG BIẾN GLOBAL VÀ HÀM LOADER > ----- //
async function buildInit() {
    logger.system("Building init");
    try {
        buildGlobal();
        await buildModules();
    } catch(err) {
        console.log(err);
    }
}

// ----- < [ EXPORT ] - XUẤT MODULE > ----- //
module.exports = { buildInit };
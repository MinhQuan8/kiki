/* -------------------------------------------------------------------------------------------
    < LOADER MODULE > --- < TẢI TẤT CẢ CÁC MODULE COMMANDS VÀ COMMUNICATES TRONG MODULES >
---------------------------------------------------------------------------------------------- */

// ----- < [ KHAI BÁO ] - REQUIRE MODULE CẦN THIẾT > ----- //
const { resolve } = require("path");
const { pathToFileURL } = require("url");
const fs = require("fs");
const { logger } = require('./logger');

// ----- < [ HÀM ] - TẢI VÀ XỬ LÍ CÁC MODULE LỆNH > ----- //
async function loadCommands() {
    logger.system("Loading commands");

    const commandsPath = resolve(global.modulesPath, "commands");
    const commandCategories = fs.readdirSync(commandsPath);

    for (let i = 0; i < commandCategories.length; i++) {
        const category = commandCategories[i];
        const categoryPath = resolve(commandsPath, category);
        const categoryFiles = fs.readdirSync(categoryPath).filter(file => file.endsWith(".js"));

        for (const command of categoryFiles) {
            const commandName = command;
            
            try {
                const commandPath = resolve(commandsPath, category, commandName);
                const commandUrl = pathToFileURL(commandPath);

                let commandExport = await import(commandUrl);
                commandExport = commandExport.default || commandExport;

                if (typeof(commandExport) === "object" && commandExport !== null & !Array.isArray(commandExport)) {
                    let { config, onCall } = commandExport;

                    global.modules.commands.set(config.name, onCall);
                    global.modules.commandsConfig.set(config.name, config);
                }
            } catch(err) {
                console.log(err);
            }
        }
    }

    global.modules.commandsConfig = new Map([...global.modules.commandsConfig.entries()].sort((x, y) => y[1].priority - x[1].priority));
}

// ----- < [ HÀM ] - TẢI VÀ XỬ LÍ CÁC MODULE GIAO TIẾP > ----- //
async function loadCommunications() {
    logger.system("Loading communications");
    const communicationsPath = resolve(global.modulesPath, "communications");
    const communicationFiles = fs.readdirSync(communicationsPath).filter(file => file.endsWith(".js"));

    for (const communication of communicationFiles) {
        const communicationName = communication;
        
        try {
            const communicationPath = resolve(communicationsPath, communicationName);
            const communicationUrl = pathToFileURL(communicationPath);

            let communicationExport = await import(communicationUrl);
            communicationExport = communicationExport.default || communicationExport;

            if (typeof(communicationExport) === "object" && communicationExport !== null & !Array.isArray(communicationExport)) {
                let { config, onCall } = communicationExport;

                global.modules.communications.set(config.name, onCall);
                global.modules.communicationsConfig.set(config.name, config);
            }
        } catch(err) {
            console.log(err);
        }
    }

    global.modules.communicationsConfig = new Map([...global.modules.communicationsConfig.entries()].sort((x, y) => y[1].priority - x[1].priority));
}

// ----- < [ HÀM ] - TỔNG HỢP TẢI VÀ XỬ LÍ > ----- //
async function buildModules() {
    await loadCommands();
    await loadCommunications();
}

// ----- < [ EXPORT ] - XUẤT MODULE > ----- //
module.exports = { buildModules };
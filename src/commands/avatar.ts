import Avatar from "../db/Avatar";
import AvatarExcelTable from "../data/excel/AvatarExcelTable.json";
import Logger from "../util/Logger";
import Interface, { Command } from "./Interface";
const c = new Logger("/avatar", "blue");

export default async function handle(command: Command) {
    if (!Interface.target) {
        c.log("No target specified");
        return;
    }

    const actionType = command.args[0];
    const avatarId = Number(command.args[1]);
    const uid = Interface.target.player.db._id;

    switch (actionType) {
        default:
            c.log(`Usage: /avatar <add|remove> <avatarId>`);
            break;
        case "add":
            if (!avatarId) return c.log("No avatarId specified");
            // Check if it already exists
            const avatar = await Avatar.fromUID(uid, avatarId);
            if (avatar.length > 0) return c.log(`Avatar ${avatarId} already exists`);
            Avatar.create(uid, avatarId).then(a => c.log(`Avatar ${avatarId} added to ${a.ownerUid}`));
            break;
        case "remove":
            if (!avatarId) return c.log("No avatarId specified");
            Avatar.remove(uid, avatarId).then(() => c.log(`Avatar ${avatarId} removed from ${uid}`));
            break;
        case "giveall":
            for (const id in AvatarExcelTable) {
                Avatar.create(uid, parseInt(id)).then(() => c.log(`All Avatar has been added to ${uid}`));
            }
            break;
        case "removeall":
            for (const id in AvatarExcelTable) {
                Avatar.remove(uid, parseInt(id)).then(() => c.log(`All Avatar has been removed from ${uid}`));
            }
            break;
    }

    Interface.target.sync();
}
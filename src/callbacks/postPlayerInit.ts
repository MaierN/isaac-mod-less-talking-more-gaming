import { ModCallback } from "isaac-typescript-definitions";
import { ModUpgraded } from "isaacscript-common";
import { initNewPlayer } from "./postUpdate";

export function initCbPostPlayerInit(mod: ModUpgraded): void {
  mod.AddCallback(ModCallback.POST_PLAYER_INIT, main);
}

function main(player: EntityPlayer) {
  initNewPlayer(player);
}

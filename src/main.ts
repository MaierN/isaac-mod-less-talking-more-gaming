import { log, upgradeMod } from "isaacscript-common";
import { initCbExecuteCmd } from "./callbacks/executeCmd";
import { initCbPostPlayerInit } from "./callbacks/postPlayerInit";
import { initCbPostRender } from "./callbacks/postRender";
import { initCbPreItemPickup } from "./callbacks/preItemPickup";
import { initCbPrePickupCollision } from "./callbacks/prePickupCollision";
import { initPlayerCtrl } from "./playerCtrl";
import { initState } from "./state";

const MOD_NAME = "Less talking. More gaming.";

main();

function main() {
  const modVanilla = RegisterMod(MOD_NAME, 1);
  const mod = upgradeMod(modVanilla);

  initState();
  initPlayerCtrl();

  initCbPostRender(mod);
  initCbPrePickupCollision(mod);
  initCbPreItemPickup(mod);
  initCbExecuteCmd(mod);
  initCbPostPlayerInit(mod);

  log(`${MOD_NAME} initialized.`);
}

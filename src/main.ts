import { log, upgradeMod } from "isaacscript-common";
import { initCbExecuteCmd } from "./callbacks/executeCmd";
import { initCbPostPlayerInit } from "./callbacks/postPlayerInit";
import { initCbPostRender } from "./callbacks/postRender";
import { initCbPostUpdate } from "./callbacks/postUpdate";
import { initCbPreItemPickup } from "./callbacks/preItemPickup";
import { initCbPrePickupCollision } from "./callbacks/prePickupCollision";
import { initConfig, MOD_NAME } from "./config";
import { initPlayerCtrl } from "./playerCtrl";
import { initState } from "./state";

main();

function main() {
  const modVanilla = RegisterMod(MOD_NAME, 1);
  const mod = upgradeMod(modVanilla);

  initState();
  initPlayerCtrl();
  initConfig();

  initCbPostRender(mod);
  initCbPrePickupCollision(mod);
  initCbPreItemPickup(mod);
  initCbExecuteCmd(mod);
  initCbPostPlayerInit(mod);
  initCbPostUpdate(mod);

  log(`${MOD_NAME} initialized.`);
}

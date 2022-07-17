import { log, upgradeMod } from "isaacscript-common";
import { initCbExecuteCmd } from "./callbacks/executeCmd";
import { initCbPostRender } from "./callbacks/postRender";
import { initCbPreItemPickup } from "./callbacks/preItemPickup";
import { initCbPrePickupCollision } from "./callbacks/prePickupCollision";
import { initState } from "./state";

const MOD_NAME = "Less talking. More gaming.";

main();

function main() {
  const modVanilla = RegisterMod(MOD_NAME, 1);
  const mod = upgradeMod(modVanilla);

  initState();
  initCbPostRender(mod);
  initCbPrePickupCollision(mod);
  initCbPreItemPickup(mod);
  initCbExecuteCmd(mod);

  log(`${MOD_NAME} initialized.`);
}

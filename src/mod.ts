import { ISCFeature, upgradeMod } from "isaacscript-common";
import { MOD_NAME } from "./constants";

const ISC_FEATURES_FOR_THIS_MOD = [
  ISCFeature.SAVE_DATA_MANAGER,
  ISCFeature.TAINTED_LAZARUS_PLAYERS,
  ISCFeature.COLLECTIBLE_ITEM_POOL_TYPE,
  ISCFeature.PICKUP_INDEX_CREATION,
  ISCFeature.EXTRA_CONSOLE_COMMANDS,
] as const;

const modVanilla = RegisterMod(MOD_NAME, 1);
export const mod = upgradeMod(modVanilla, ISC_FEATURES_FOR_THIS_MOD);

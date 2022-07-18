import { CollectibleType } from "isaac-typescript-definitions";
import { CollectibleIndex, DefaultMap, isBlindCollectible, PlayerIndex, saveDataManager } from "isaacscript-common";

export const state = {
  run: {
    itemCounts: new DefaultMap<PlayerIndex, DefaultMap<string, number>>(() => new DefaultMap<string, number>(0)),
    itemPlayerPriorities: new DefaultMap<PlayerIndex, DefaultMap<string, number>>(() => new DefaultMap<string, number>(() => Math.random())),
  },
  room: {
    itemGroups: new Map<CollectibleType, string>(),
    hiddenItems: new DefaultMap<CollectibleIndex, boolean, [arg: EntityPickupCollectible]>((pedestal) => isBlindCollectible(pedestal)),
  },
};

export function initState(): void {
  saveDataManager("mainState", state);
}

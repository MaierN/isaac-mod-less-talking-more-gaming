import { CollectibleType, ItemPoolType, ItemType, ModCallback } from "isaac-typescript-definitions";
import { DefaultMap, ModCallbackCustom, PickingUpItem, getCollectibles } from "isaacscript-common";
import { isInterestingCollectible } from "../helpers/collectibles";
import { PersonIndex, getAllPersons, getPersonForPlayer } from "../helpers/persons";
import { mapToString, sortByKeys } from "../helpers/utils";
import { mod } from "../mod";
import { addDebugCommand } from "./consoleCommands";

const v = {
  run: {
    itemCounts: new DefaultMap<string, number>(0),
    randomPriorities: new DefaultMap<string, number>(() => Math.random()),
  },
};

const vEphemeral = {
  room: {
    itemPools: new Map<CollectibleType, ItemPoolType>(),
  },
};

export function itemCounterInit(): void {
  mod.saveDataManager("itemCounter", v);
  mod.saveDataManager("itemCounterEphemeral", vEphemeral, () => false);

  mod.AddCallback(ModCallback.POST_UPDATE, postUpdate);
  mod.AddCallbackCustom(ModCallbackCustom.PRE_ITEM_PICKUP, preItemPickup);

  addDebugCommand("itemCounts", (_params) => {
    print(mapToString(v.run.itemCounts));
  });
  addDebugCommand("randomPriorities", (_params) => {
    print(mapToString(v.run.randomPriorities));
  });
  addDebugCommand("itemPools", (_params) => {
    print(mapToString(vEphemeral.room.itemPools));
  });
}

export function getCounterKey(person: PersonIndex, pool: ItemPoolType): string {
  return `${person}/${ItemPoolType[pool]}`;
}

export function getAttributedPerson(collectible: EntityPickupCollectible): PersonIndex | undefined {
  const persons = getAllPersons();
  const pool = mod.getCollectibleItemPoolType(collectible);

  const sortedPersons = sortByKeys(
    [...persons],
    [
      (person) => v.run.itemCounts.getAndSetDefault(getCounterKey(person, pool)),
      (person) => getTotalItemCount(person),
      (person) => v.run.randomPriorities.getAndSetDefault(getCounterKey(person, pool)),
    ],
  );

  return sortedPersons[0];
}

function getTotalItemCount(person: PersonIndex): number {
  const counts = [...v.run.itemCounts.entries()].filter(([key]) => key.startsWith(`${person}/`));
  const sum = counts.reduce((acc, [, count]) => acc + count, 0);

  return sum;
}

function postUpdate() {
  let collectibles = getCollectibles();
  collectibles = collectibles.filter((collectible) => isInterestingCollectible(collectible));
  collectibles.forEach((collectible) => {
    const pool = mod.getCollectibleItemPoolType(collectible);
    vEphemeral.room.itemPools.set(collectible.SubType, pool);
  });
}

function preItemPickup(player: EntityPlayer, pickingUpItem: PickingUpItem) {
  if ([ItemType.PASSIVE, ItemType.FAMILIAR].includes(pickingUpItem.itemType)) {
    const person = getPersonForPlayer(player);
    const pool = vEphemeral.room.itemPools.get(pickingUpItem.subType as CollectibleType);

    if (pool !== undefined) {
      const key = getCounterKey(person, pool);
      const newCount = v.run.itemCounts.getAndSetDefault(key) + 1;
      v.run.itemCounts.set(key, newCount);
    }
  }
}

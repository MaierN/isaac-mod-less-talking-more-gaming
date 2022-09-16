import { ButtonAction, Keyboard, ModCallback } from "isaac-typescript-definitions";
import { CollectibleIndex, DefaultMap, getCollectibleIndex, getCollectibles, ModUpgraded, saveDataManager } from "isaacscript-common";
import { config } from "../config";
import { isInterestingCollectible } from "../helpers/collectibles";
import { getAllPersons, getPersonForPlayer, getPlayerForPerson, PersonIndex } from "../helpers/persons";
import { getAttributedPerson } from "./itemCounter";

const v = {
  room: {
    offeredItems: new DefaultMap<PersonIndex, Set<CollectibleIndex>>(() => new Set()),
  },
};

export function offeringInit(mod: ModUpgraded): void {
  saveDataManager("offering", v);

  mod.AddCallback(ModCallback.POST_UPDATE, postUpdate);
}

export function isPersonOfferingItem(person: PersonIndex, item: EntityPickupCollectible): boolean {
  return v.room.offeredItems.getAndSetDefault(person).has(getCollectibleIndex(item));
}

function postUpdate() {
  if (!config.run.enableMod) {
    return;
  }

  getAllPersons().forEach((person) => {
    const player = getPlayerForPerson(person);
    if (player === undefined) {
      return;
    }

    if (
      [ButtonAction.SHOOT_LEFT, ButtonAction.SHOOT_RIGHT, ButtonAction.SHOOT_UP, ButtonAction.SHOOT_DOWN].every((action) =>
        Input.IsActionPressed(action, player.ControllerIndex),
      ) || Input.IsButtonPressed(Keyboard.O, player.ControllerIndex)
    ) {
      offerAvailableItems(player);
    }
  });
}

function offerAvailableItems(player: EntityPlayer) {
  if (player.IsExtraAnimationFinished()) {
    player.AnimateHappy();
  }
  const person = getPersonForPlayer(player);

  getCollectibles()
    .filter((collectible) => isInterestingCollectible(collectible))
    .forEach((collectible) => {
      const owner = getAttributedPerson(collectible);
      if (owner === undefined) {
        return;
      }

      if (owner === person) {
        v.room.offeredItems.getAndSetDefault(person).add(getCollectibleIndex(collectible));
      }
    });
}

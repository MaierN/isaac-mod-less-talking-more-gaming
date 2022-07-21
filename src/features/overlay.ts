import { ModCallback } from "isaac-typescript-definitions";
import {
  CollectibleIndex,
  DefaultMap,
  game,
  getCollectibleIndex,
  getCollectibles,
  isBlindCollectible,
  ModUpgraded,
  saveDataManager,
} from "isaacscript-common";
import { config } from "../config";
import { isInterestingCollectible } from "../helpers/collectibles";
import { getAllPersons, getPlayerForPerson } from "../helpers/persons";
import { getAttributedPerson } from "./itemCounter";
import { isPersonOfferingItem } from "./offering";

const vEphemeral = {
  room: {
    hiddenItems: new DefaultMap<CollectibleIndex, boolean, [arg: EntityPickupCollectible]>((pedestal) => isBlindCollectible(pedestal)),
  },
};

export function overlayInit(mod: ModUpgraded): void {
  saveDataManager("overlayEphemeral", vEphemeral, () => false);

  mod.AddCallback(ModCallback.POST_RENDER, postRender);
}

function postRender() {
  if (!config.run.enableMod) {
    return;
  }

  let collectibles = getCollectibles();
  collectibles = collectibles.filter((collectible) => isInterestingCollectible(collectible));
  collectibles.forEach((collectible) => {
    if (getAllPersons().size <= 1 || vEphemeral.room.hiddenItems.getAndSetDefault(getCollectibleIndex(collectible), collectible)) {
      return;
    }

    addItemOverlay(collectible);
  });
}

const playerSprite = Sprite();
playerSprite.Load("gfx/ui/coop menu.anm2", true);
function addItemOverlay(collectible: EntityPickupCollectible) {
  const owner = getAttributedPerson(collectible);
  if (owner === undefined) {
    return;
  }

  if (!isPersonOfferingItem(owner, collectible)) {
    const player = getPlayerForPerson(owner);
    if (player === undefined) {
      return;
    }

    const pos = game.GetRoom().WorldToScreenPosition(collectible.Position);

    playerSprite.Scale = Vector(0.8, 0.8);
    playerSprite.Play("Main", true);
    playerSprite.SetFrame((player.GetPlayerType() as number) + 1);
    playerSprite.RenderLayer(0, pos);

    Isaac.RenderScaledText(`P${player.Index + 1}`, pos.X + 6, pos.Y, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0);
  }
}

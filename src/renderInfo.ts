import { game, getCollectibleIndex } from "isaacscript-common";
import { getSortedRealPlayers } from "./playerCtrl";
import { state } from "./state";

const playerSprite = Sprite();
playerSprite.Load("gfx/ui/coop menu.anm2", true);

export function addTextInfoCollectible(pedestal: EntityPickupCollectible): void {
  const index = getCollectibleIndex(pedestal);
  if (state.room.hiddenItems.getAndSetDefault(index, pedestal)) {
    return;
  }

  const pos = game.GetRoom().WorldToScreenPosition(pedestal.Position);
  const allPlayerCounts = getSortedRealPlayers(pedestal);

  const first = allPlayerCounts[0];
  if (first !== undefined) {
    if (!first[0].isOfferingItems()) {
      const player = first[0];
      playerSprite.Scale = Vector(0.8, 0.8);
      playerSprite.Play("Main", true);
      playerSprite.SetFrame((player.mainCharacter.GetPlayerType() as number) + 1);
      playerSprite.RenderLayer(0, pos);

      Isaac.RenderScaledText(`P${player.mainCharacter.Index + 1}`, pos.X + 6, pos.Y, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0);
    }
  }
}

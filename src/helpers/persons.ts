import { PlayerType, PlayerVariant } from "isaac-typescript-definitions";
import {
  ModCallbackCustom,
  PlayerIndex,
  getPlayerIndex,
  getPlayers,
} from "isaacscript-common";
import { config } from "../config";
import { addDebugCommand } from "../features/consoleCommands";
import { mod } from "../mod";
import { mapToString } from "./utils";

const v = {
  run: {
    deadToAliveTaintedLazarus: new Map<PlayerIndex, PlayerIndex>(),
  },
};

export type PersonIndex = PlayerIndex;

export function personsInit(): void {
  mod.saveDataManager("persons", v);

  mod.AddCallbackCustom(
    ModCallbackCustom.POST_PLAYER_INIT_LATE,
    postPlayerInitLate,
  );

  addDebugCommand("deadToAliveTaintedLazarus", (_params) => {
    print(mapToString(v.run.deadToAliveTaintedLazarus));
  });
}

export function getAllPersons(): Set<PersonIndex> {
  let players = getPlayers();
  players = players.filter(
    (player) =>
      player.Variant === PlayerVariant.PLAYER && !player.IsCoopGhost(),
  );

  return new Set(players.map((player) => getPersonForPlayer(player)));
}

export function getPersonForPlayer(player: EntityPlayer): PersonIndex {
  player = player.GetMainTwin();
  let playerIndex = getPlayerIndex(player);

  const aliveTaintedLazarus = v.run.deadToAliveTaintedLazarus.get(playerIndex);
  if (aliveTaintedLazarus !== undefined) {
    playerIndex = aliveTaintedLazarus;
  }

  return playerIndex;
}

export function getPlayerForPerson(
  person: PersonIndex,
): EntityPlayer | undefined {
  return getPlayers()
    .find((player) => getPersonForPlayer(player) === person)
    ?.GetMainTwin();
}

function postPlayerInitLate(player: EntityPlayer) {
  if (player.GetPlayerType() === PlayerType.LAZARUS_B) {
    const deadPlayer = mod.getTaintedLazarusSubPlayer(player);
    if (deadPlayer === undefined) {
      return;
    }

    const aliveIndex = getPlayerIndex(player);
    const deadIndex = getPlayerIndex(deadPlayer);

    v.run.deadToAliveTaintedLazarus.set(deadIndex, aliveIndex);
  }

  if (player.GetPlayerType() === PlayerType.CAIN_B) {
    config.run.enableMod = false;
  }
}

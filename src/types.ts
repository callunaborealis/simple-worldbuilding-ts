import { SimpleActor } from './module/actor';
import { GAME_NAME } from './module/constants';
import { createWorldbuildingMacro } from './module/macro';

interface OwnGame extends Game {
  // TODO: Add custom types for this game
  [GAME_NAME]: {
    createWorldbuildingMacro: typeof createWorldbuildingMacro;
    SimpleActor: typeof SimpleActor;
  };
}

type ActorDataDataShape = ConstructorParameters<
  typeof foundry.documents.BaseActor
>[0] & {
  abil?: Record<string, any>;
  attr?: Record<string, any>;
  groups?: Record<string, any>;
  attributes?: Record<string, any>;
};

export type { ActorDataDataShape, OwnGame };

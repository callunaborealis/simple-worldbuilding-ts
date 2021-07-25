/**
 * A simple and flexible system for world-building using an arbitrary collection of character and item attributes
 * Author: Atropos
 */

// Import Modules
import { SimpleActor } from './actor';
import { GAME_NAME } from './constants';
import { SimpleItem } from './item.js';
import { SimpleItemSheet } from './item-sheet.js';
import { SimpleActorSheet } from './actor-sheet.js';
import { preloadHandlebarsTemplates } from './templates.js';
import { createWorldbuildingMacro } from './macro.js';

import type { OwnGame } from '../types';

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

/**
 * Init hook.
 */
Hooks.once('init', async function () {
  console.log(`Initializing Simple Worldbuilding System`);

  /**
   * Set an initiative formula for the system. This will be updated later.
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: '1d20',
    decimals: 2,
  };

  /**
   * @typeissue
   * - Game doesn't accept a generic here to assign a space for the game name
   * - Must I write (game as OwnGame) everywhere??
   */
  (game as OwnGame)[GAME_NAME] = {
    SimpleActor,
    createWorldbuildingMacro,
  };

  // Define custom Entity classes
  CONFIG.Actor.documentClass = SimpleActor;
  CONFIG.Item.documentClass = SimpleItem;

  // Register sheet application classes
  Actors.unregisterSheet('core', ActorSheet);
  Actors.registerSheet('worldbuilding', SimpleActorSheet, {
    makeDefault: true,
  });
  Items.unregisterSheet('core', ItemSheet);
  Items.registerSheet('worldbuilding', SimpleItemSheet, { makeDefault: true });

  // Register system settings
  (game as OwnGame).settings.register('worldbuilding', 'macroShorthand', {
    name: 'SETTINGS.SimpleMacroShorthandN',
    hint: 'SETTINGS.SimpleMacroShorthandL',
    scope: 'world',
    type: Boolean,
    default: true,
    config: true,
  });

  // Register initiative setting.
  (game as OwnGame).settings.register('worldbuilding', 'initFormula', {
    name: 'SETTINGS.SimpleInitFormulaN',
    hint: 'SETTINGS.SimpleInitFormulaL',
    scope: 'world',
    /**
     * @typeissue
     * using type as a value prop instead of a generic creates weird
     * cases for TypeScript. See onChange prop below
     */
    type: String,
    default: '1d20',
    config: true,
    /**
     * @typeissue
     * initFormula is String, but expecting string Typescript type
     */
    onChange: (formula: string) => _simpleUpdateInit(formula, true),
  });

  // Retrieve and assign the initiative formula setting.
  const initFormula = (game as OwnGame).settings.get(
    'worldbuilding',
    'initFormula',
  );
  /**
   * @typeissue
   * initFormula is String, but expecting string Typescript type
   */
  _simpleUpdateInit(initFormula as string);

  /**
   * Update the initiative formula.
   * @param {string} formula - Dice formula to evaluate.
   * @param {boolean} notify - Whether or not to post nofications.
   */
  function _simpleUpdateInit(formula: string, notify: boolean = false) {
    const isValid = Roll.validate(formula);
    if (!isValid) {
      if (notify && typeof ui.notifications?.error === 'function') {
        ui.notifications.error(
          `${(game as OwnGame).i18n.localize(
            'SIMPLE.NotifyInitFormulaInvalid',
          )}: ${formula}`,
        );
      }
      return;
    }
    CONFIG.Combat.initiative.formula = formula;
  }

  /**
   * Slugify a string.
   */
  Handlebars.registerHelper('slugify', function (value) {
    return value.slugify({ strict: true });
  });

  // Preload template partials
  await preloadHandlebarsTemplates();
});

/**
 * Macrobar hook.
 */
Hooks.on('hotbarDrop', (bar, data, slot) =>
  createWorldbuildingMacro(data, slot),
);

/**
 * Adds the actor template context menu.
 */
Hooks.on(
  'getActorDirectoryEntryContext',
  (html: JQuery, options: ContextMenu.Item[]) => {
    // Define an actor as a template.
    options.push({
      name: (game as OwnGame).i18n.localize('SIMPLE.DefineTemplate'),
      icon: '<i class="fas fa-stamp"></i>',
      condition: (li) => {
        const actor = (game as OwnGame).actors?.get(li.data('entityId'));
        return !actor?.getFlag('worldbuilding', 'isTemplate');
      },
      callback: (li) => {
        const actor = (game as OwnGame).actors?.get(li.data('entityId'));
        actor?.setFlag('worldbuilding', 'isTemplate', true);
      },
    });

    // Undefine an actor as a template.
    options.push({
      name: (game as OwnGame).i18n.localize('SIMPLE.UnsetTemplate'),
      icon: '<i class="fas fa-times"></i>',
      condition: (li) => {
        const actor = (game as OwnGame).actors?.get(li.data('entityId'));
        return actor?.getFlag('worldbuilding', 'isTemplate') as boolean;
      },
      callback: (li) => {
        const actor = (game as OwnGame).actors?.get(li.data('entityId'));
        actor?.setFlag('worldbuilding', 'isTemplate', false);
      },
    });
  },
);

/**
 * Adds the item template context menu.
 */
Hooks.on(
  'getItemDirectoryEntryContext',
  (html: JQuery, options: ContextMenu.Item[]) => {
    // Define an item as a template.
    options.push({
      name: (game as OwnGame).i18n.localize('SIMPLE.DefineTemplate'),
      icon: '<i class="fas fa-stamp"></i>',
      condition: (li) => {
        const item = (game as OwnGame).items?.get(li.data('entityId'));
        return !item?.getFlag('worldbuilding', 'isTemplate');
      },
      callback: (li) => {
        const item = (game as OwnGame).items?.get(li.data('entityId'));
        item?.setFlag('worldbuilding', 'isTemplate', true);
      },
    });

    // Undefine an item as a template.
    options.push({
      name: (game as OwnGame).i18n.localize('SIMPLE.UnsetTemplate'),
      icon: '<i class="fas fa-times"></i>',
      condition: (li) => {
        const item = (game as OwnGame).items?.get(li.data('entityId'));
        return item?.getFlag('worldbuilding', 'isTemplate') as boolean;
      },
      callback: (li) => {
        const item = (game as OwnGame).items?.get(li.data('entityId'));
        item?.setFlag('worldbuilding', 'isTemplate', false);
      },
    });
  },
);

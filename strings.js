/*---------------------------------
strings.js

Constant string values serving as
names and descriptions of various
game objects.
---------------------------------*/
// Weapon name arrays
Game.fast_melee_generic = ["Shortsword","Dagger","Quickblade","Knife"];
Game.mid_melee_generic = ["Gladius","Longblade","Hand-Axe","Machete"];
Game.slow_melee_generic = ["Morningstar","Cleaver","Broadsword","Warmaul"];
Game.fast_range_generic = ["Shuriken","Throwing Knife","Throwing Axe"];
Game.mid_range_generic = ["Repeater","Shortbow","Javelin"];
Game.slow_range_generic = ["Crossbow","Longbow","Composite Bow"];
Game.fast_magic_generic = ["Spellblade","Tome of Thunder","Quarterstaff"];
Game.mid_magic_generic = ["Mageblade","Tome of Flame","Spell Focus"];
Game.slow_magic_generic = ["War Staff","Tome of Frost","Grimoire"];
Game.debuffs_generic = [[Game.DEBUFF_SHRED, "Ruthlessness", 4, -1],
                        [Game.DEBUFF_MULTI, "Frenzy", 3, 50],
                        [Game.DEBUFF_DRAIN, "Bloodthirst", 5, 20],
                        [Game.DEBUFF_SLOW, "Cripple", 5, 15],
                        [Game.DEBUFF_MC, "Mind Control", 1, -1],
                        [Game.DEBUFF_DOT, "Wound Poison", 5, -1],[],[]];
// Always need more names!
Game.fast_melee_special = ["Blinkstrike|They'll never know what hit 'em...",
                           "Adder's Fang|Not to scale.",
                           "Torturer's Poker|Tell me all your dirty little secrets..."];
Game.fast_melee_debuffs = [[Game.DEBUFF_MULTI, "Frenzy", 3, 70],
                           [Game.DEBUFF_DOT, "Wound Poison", 5, -1],
                           [Game.DEBUFF_MC, "Domination", 1, -1]];
Game.mid_melee_special = ["Edge of Depravity|I think it's just misunderstood...",
                          "Storm's Herald|Whatever you do, don't hold it above your head.",
                          "Flametongue|Good for those long cold nights in camp.",
                          "Zenith Blade|Glows brighter than the sun."];
Game.mid_melee_debuffs = [[Game.DEBUFF_SHRED, "Ruthlessness", 5, -1],
                          [Game.DEBUFF_PARAHAX, "Static Shock", 5, 25],
                          [Game.DEBUFF_DRAIN, "Cauterize", 5, 40],
                          [Game.DEBUFF_DISARM, "Dazzle", 5, -1]];
Game.slow_melee_special = ["Planetary Edge|Rare, if only because planets are usually spherical.",
                           "Death Sentence|Bears a passing resemblance to Death's own scythe.",
                           "The Ambassador|Diplomacy? I do not think it means what you think it means."];
Game.slow_melee_debuffs = [[Game.DEBUFF_SLOW, "Hamstring", 5, 20],
                           [Game.DEBUFF_DOOM, "Impending Doom", 3, 5],
                           [Game.DEBUFF_SHRED, "Ruthlessness", 5, -1]];
Game.fast_range_special = ["Ace of Spades|Who throws a card? I mean, come on, really?",
                           "Tomahawk|Serving native tribes for centuries.",
                           "Throat Piercers|Also perfect for piercing other parts."];
Game.fast_range_debuffs = [[Game.DEBUFF_DOT, "Paper Cut", 5, -1],
                           [Game.DEBUFF_SLOW, "Cripple", 5, 25],
                           [Game.DEBUFF_SHRED, "Piercing Throw", 5, -1]];
Game.mid_range_special = ["Death From Above|Or below, or far away, depending on where you stand.",
                          "Tidebreaker's Harpoon|They might want it back at some point.",
                          "Starshatter Recurve|Has been known to shoot rainbows on occasion."];
Game.mid_range_debuffs = [[Game.DEBUFF_DOOM, "Impending Doom", 3, 5],
                          [Game.DEBUFF_DRAIN, "Bloodthirst", 5, 40],
                          [Game.DEBUFF_MULTI, "Multishot", 3, 70]];
Game.slow_range_special = ["The Stakeholder|Raising the stakes, one corpse at a time.",
                           "Artemis Bow|Comes with a free built in harp, no strings attached.",
                           "Parting Shot|This isn't going to end well for at least one of us...",
                           "Star Searcher|I wonder what we'll find today?"];
Game.slow_range_debuffs = [[Game.DEBUFF_PARAHAX, "Unbalanced", 5, 20],
                           [Game.DEBUFF_MC, "Charm", 1, -1],
                           [Game.DEBUFF_SHRED, "Ruthlessness", 5, -1],
                           [Game.DEBUFF_DISARM, "Arm Shot", 5, 20]];
Game.fast_magic_special = ["Thundercaller|When used in battle, it chants the name 'Thor' repeatedly.",
                           "Cosmic Fury|Dr. Tyson would like a word with you...",
                           "Spark-Touched Fetish|Rubber gloves are strongly recommended.",
                           "Theory of Everything|It works! At least in theory..."];
Game.fast_magic_debuffs = [[Game.DEBUFF_PARAHAX, "Static Shock", 5, 20],
                           [Game.DEBUFF_MULTI, "Frenzy", 3, 65],
                           [Game.DEBUFF_MC, "Confuse", 1, -1],
                           [Game.DEBUFF_DRAIN, "Expert Strategy", 5, 40]];
Game.mid_magic_special = ["Flamecore Battlestaff|Still warm to the touch.",
                          "Gift of the Cosmos|Just keeps on giving.",
                          "Emberleaf War Tome|Not actually made of embers, which are terrible for books.",
                          "Encyclopedia of the Realm|Knowledge is power."];
Game.mid_magic_debuffs = [[Game.DEBUFF_DOT, "Slow Burn", 5, -1],
                          [Game.DEBUFF_SLOW, "Cripple", 5, 25],
                          [Game.DEBUFF_DRAIN, "Drain Life", 5, 40],
                          [Game.DEBUFF_SHRED, "Find Weakness", 5, -1]];
Game.slow_magic_special = ["The Tetranomicon|Written and bound by Tetradigm. Mostly incomprehensible.",
                           "Comet Chaser|Note: Comets are dangerous, DO NOT TRY THIS AT HOME.",
                           "Absolute Zero|Not quite. But it's close!"];
Game.slow_magic_debuffs = [[Game.DEBUFF_DOOM, "Flames of Tetradigm", 3, 5],
                           [Game.DEBUFF_DOT, "Slow Burn", 3, 65],
                           [Game.DEBUFF_PARAHAX, "Bitter Cold", 5, 25]];
// Prefixes for non-great items
// Yes there's a blank one, it's so the item has no prefix :)
Game.weaponQualityDescriptors = [["Worthless","Damaged","Inept","Decayed","Flawed","Decrepit"],
                           ["Average","Unremarkable","","Passable","Basic","Simple"],
                           ["Pristine","Enhanced","Powerful","Well-Maintained","Powerful","Superior"]];
Game.armourQualityDescriptors = [["Tattered","Frayed","Threadbare","Cracked","Battleworn"],
                                 ["Average","Unremarkable","","Passable","Basic","Simple"],
                                 ["Polished","Well-Kept","Reinforced","Tempered","Heavy"]];
Game.armour_generic = ["Robe","Jerkin","Poncho","Overcoat","Tunic","Cuirass","Brigandine","Chestplate","Buckler","Deflector"];
Game.armour_special = ["The Blue Collar|If this won't stop attackers, the guy wearing it will.",
                       "Xena's Breastplate|It was padded all along!",
                       "Dual-Wielded Shields|But how am I meant to attack?",
                       "Steel Cage|If they can't hit me, I can't hit them!",
                       "Golden Helmet|Works purely by distraction value.",
                       "Iron Boots|Definitely not made for walking.",
                       "The Emperor's Clothes|Trust me, they're magnificent.",
                       "Ze Goggles|Zey do nothing!",
                       "Zenith Shield|Glows brighter than the sun.",
                       "Generic Armour Name|Relic of a bygone era."];
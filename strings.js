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
Game.debuffs_generic = [[241, "Ruthlessness", 10, -1],
                        [242, "Frenzy", 10, 50],
                        [243, "Bloodthirst", 10, 20],
                        [244, "Cripple", 10, 15],
                        [245, "Mind Control", 5, -1],
                        [246, "Wound Poison", 10, 15],
                        [247, "Nerve Strike", 10, 20],
                        [248, "Mounting Dread", 5, 3],
                        [249, "Disarmed", 10, -1]];
Game.debuff_names = ["Armour Shred","Double Attack","Health Drain","Slower Attacks","Confusion","Damage over Time","Paralysis","Doom","Disarm"];
// Always need more names!
Game.fast_melee_special = ["Blinkstrike|They'll never know what hit 'em...",
                           "Adder's Fang|Not to scale.",
                           "Torturer's Poker|Tell me all your dirty little secrets..."];
Game.fast_melee_debuffs = [[242, "Frenzy", 15, 70],
                           [246, "Wound Poison", 15, 20],
                           [245, "Domination", 5, -1]];
Game.mid_melee_special = ["Edge of Depravity|I think it's just misunderstood...",
                          "Storm's Herald|Whatever you do, don't hold it above your head.",
                          "Flametongue|Good for those long cold nights in camp.",
                          "Zenith Blade|Glows brighter than the sun."];
Game.mid_melee_debuffs = [[241, "Ruthlessness", 15, -1],
                          [247, "Static Shock", 15, 25],
                          [243, "Cauterize", 15, 30],
                          [249, "Dazzle", 15, -1]];
Game.slow_melee_special = ["Planetary Edge|Rare, if only because planets are usually spherical.",
                           "Death Sentence|Bears a passing resemblance to Death's own scythe.",
                           "The Ambassador|Diplomacy? I do not think it means what you think it means."];
Game.slow_melee_debuffs = [[244, "Hamstring", 15, 25],
                           [248, "Impending Doom", 5, 5],
                           [241, "Ruthlessness", 15, -1]];
Game.fast_range_special = ["Ace of Spades|Who throws a card? I mean, come on, really?",
                           "Tomahawk|Serving native tribes for centuries.",
                           "Throat Piercers|Also perfect for piercing other parts."];
Game.fast_range_debuffs = [[246, "Paper Cut", 15, 25],
                           [244, "Cripple", 15, 25],
                           [241, "Piercing Throw", 15, -1]];
Game.mid_range_special = ["Death From Above|Or below, or far away, depending on where you stand.",
                          "Tidebreaker's Harpoon|They might want it back at some point.",
                          "Starshatter Recurve|Has been known to shoot rainbows on occasion."];
Game.mid_range_debuffs = [[248, "Impending Doom", 5, 5],
                          [243, "Bloodthirst", 15, 30],
                          [242, "Multishot", 15, 70]];
Game.slow_range_special = ["The Stakeholder|Raising the stakes, one corpse at a time.",
                           "Artemis Bow|Comes with a free built in harp, no strings attached.",
                           "Parting Shot|This isn't going to end well for at least one of us...",
                           "Star Searcher|I wonder what we'll find today?"];
Game.slow_range_debuffs = [[247, "Unbalanced", 15, 20],
                           [245, "Charm", 5, -1],
                           [241, "Ruthlessness", 15, -1],
                           [249, "Arm Shot", 15, -1]];
Game.fast_magic_special = ["Thundercaller|When used in battle, it chants the name 'Thor' repeatedly.",
                           "Cosmic Fury|Dr. Tyson would like a word with you...",
                           "Spark-Touched Fetish|Rubber gloves are strongly recommended.",
                           "Theory of Everything|It works! At least in theory..."];
Game.fast_magic_debuffs = [[247, "Static Shock", 15, 20],
                           [242, "Frenzy", 15, 65],
                           [245, "Confuse", 5, -1],
                           [243, "Expert Strategy", 15, 30]];
Game.mid_magic_special = ["Flamecore Battlestaff|Still warm to the touch.",
                          "Gift of the Cosmos|Just keeps on giving.",
                          "Emberleaf War Tome|Not actually made of embers, which are terrible for books.",
                          "Encyclopedia of the Realm|Knowledge is power."];
Game.mid_magic_debuffs = [[246, "Slow Burn", 15, 20],
                          [244, "Cripple", 15, 25],
                          [243, "Drain Life", 15, 30],
                          [241, "Find Weakness", 15, -1]];
Game.slow_magic_special = ["The Tetranomicon|Written and bound by Tetradigm. Mostly incomprehensible.",
                           "Comet Chaser|Note: Comets are dangerous, DO NOT TRY THIS AT HOME.",
                           "Absolute Zero|Not quite. But it's close!"];
Game.slow_magic_debuffs = [[248, "Flames of Tetradigm", 5, 5],
                           [246, "Slow Burn", 15, 20],
                           [247, "Bitter Cold", 15, 25]];
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
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
Game.enemy_generic = ["Rat","Cat","Man","Woman","Angry Redditor","Goat","Boar","Tiger","Skeleton","Unicyclist","Hipster","Desperate Brigand","Wolf","Irradiated Worker","Blacksmith","Gnomish Inventor","Dwarven Miner","Disgruntled Shopkeeper","Treant","Disembodied Tentacle","Incremental Developer","Angry Mob","Gelatinous Blob","Crocodile","Young Dragon","Beholder","Small Child","Unicorn","Lesser Demon","Donut Throwing Policeman"];
// Mostly friendly redditors...
Game.enemy_special = ["Sky Monkey","John the Leprechaun","Ragekai","Flirty Lover","Mike Handers","Feld O' Propane","42nd Saren","Reelix","Ralph","Kung Fu Hamster","Detratigm","Kryzodoze","Chromega","Literal Hitler","Seiyria", "Generic Enemy Name"];
Game.enemy_boss = ["Tetradigm","The Solver","Giant Enemy Dragon","Generic Boss Name","Warlord","Dr. Tyson","Greater Demon"];
Game.powerList = [["Proper Care","Grants a 2% chance per level to ignore armour/weapon decay in combat.",101],
                  ["Hanging By a Thread","Grants a 2% chance per level to fully repair weapon and armour after combat.",1011],
                  ["High Maintenance","Preserves an additional 10% per level of your weapon's effect when broken.",1012],
                  ["Pickpocket","Grants an additional 5% gain per level in seeds from combat.",102],
                  ["Cavity Search","Grants a 2% chance per level to triple seed gains from combat.",1021],
                  ["Thorough Looting","Grants a 2% chance per level to salvage a piece of scrap from combat.",1022],
                  ["Keen Eye","Grants a 3% chance per level to critically strike the target for 50% more damage.",103],
                  ["Keener Eye","Increases the critical strike damage bonus by 10% per level.",1031],
                  ["Adrenaline Rush","Increases damage dealt by 5% per level for 3 rounds after a critical strike.",1032],
                  ["Divine Shield","Grants a 1% chance per level to completely negate an enemy attack.",104],
                  ["Absorption Shield","Causes your Divine Shield effect to heal you for the damage you would have taken.",1041],
                  ["Reflective Shield","Causes your Divine Shield effect to deal the damage you would have taken to the enemy.",1042],
                  ["Luck of the Draw","Grants a 1% chance per level to gain an additional Power Point on level up.",105],
                  ["Lucky Star","Grants a 1% chance per level to gain an additional Skill Point on level up.",1051],
                  ["Fast Learner","Grants a 5% increase per level to experience gains.",106],
                  ["Patience and Discipline","Grants a 3% chance per level to gain an additional point in a random stat on level up.",1061],
                  ["Flurry","Grants a 1% chance per level to strike a target again after an attack for 50% damage.",107],
                  ["Empowered Flurry","Grants a 4% increase per level in the damage of Flurry's additional strike.",1071],
                  ["Survival Instincts","Grants a 2% per level increase in health regeneration and repair speeds.",108],
                  ["Will To Live","Grants a 2% chance per level to be fully healed after combat.",1081],
                  ["Deadly Force","Grants a 2% per level increase to all damage dealt.",109],
                  ["Wild Swings","Causes your Burst Attack to deal a number of 50% damage hits equal to this power's level plus 1.",1091],
                  ["Execute","Grants a 5% chance per level to instantly kill a target below 25% health.",1092],
                  ["Ancestral Fortitude","Grants a 2% per level reduction to all damage taken",110],
                  ["Last Bastion","Reduces damage taken by 10% per level when your health is below 30%.",1101],
                  ["Vengeance","Grants a 2% chance per level to return 50% of damage taken to the target.",1102],
                  ["Nimble Fingers","Grants a 2% increase per level in attack speeds.",111],
                  ["Sneak Attack","Increases your chance to attack first by 10% per level.",1111],
                  ["Five-Finger Discount","Grants a 1% chance per level to steal seeds equal to your character level on attack.",1112]];
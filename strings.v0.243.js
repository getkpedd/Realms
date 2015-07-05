/*---------------------------------
strings.js

Constant string values serving as
names and descriptions of various
game objects.
---------------------------------*/
// Weapon name arrays
Game.fast_melee_generic = ["Shortsword","Dagger","Quickblade","Knife","Shiv"];
Game.mid_melee_generic = ["Gladius","Longblade","Hand-Axe","Machete","Lance"];
Game.slow_melee_generic = ["Morningstar","Cleaver","Broadsword","Warmaul","Halberd"];
Game.fast_range_generic = ["Shuriken","Throwing Knife","Throwing Axe","Mini-Crossbow","Darts"];
Game.mid_range_generic = ["Repeater","Shortbow","Javelin","Slingshot","Musket"];
Game.slow_range_generic = ["Crossbow","Longbow","Composite Bow","Sling","Hand-Cannon"];
Game.fast_magic_generic = ["Spellblade","Tome of Thunder","Quarterstaff","Scepter"];
Game.mid_magic_generic = ["Mageblade","Tome of Flame","Spell Focus","Battlestaff"];
Game.slow_magic_generic = ["War Staff","Tome of Frost","Grimoire","Crozier"];
Game.debuffs_generic = [[241, "Ruthlessness", 10, -1],
                        [242, "Frenzy", 10, 50],
                        [243, "Bloodthirst", 10, 20],
                        [244, "Cripple", 10, 15],
                        [245, "Mind Control", 5, -1],
                        [246, "Wound Poison", 10, 20],
                        [247, "Nerve Strike", 10, 15],
                        [248, "Mounting Dread", 5, 6],
                        [249, "Disarmed", 10, -1],
                        [250, "Comatose", 10, 20]];
Game.debuff_names = ["Armour Shred","Double Attack","Health Drain","Slower Attacks","Confusion","Damage over Time","Paralysis","Doom","Disarm","Sleep"];
// Always need more names!
Game.fast_melee_special = ["Blinkstrike|They'll never know what hit 'em...",
                           "Adder's Fang|Not to scale.",
                           "Torturer's Poker|Tell me all your dirty little secrets...",
                           "Excalibur|Yes, I pulled it out of a rock.",
                           "Sword Breaker|Serrated for your pleasure."];
Game.fast_melee_debuffs = [[242, "Frenzy", 15, 70],
                           [246, "Wound Poison", 15, 30],
                           [245, "Domination", 5, -1],
                           [243, "Holy Light", 15, 30],
                           [249, "Break Weapon", 15, -1]];
Game.mid_melee_special = ["Edge of Depravity|I think it's just misunderstood...",
                          "Storm's Herald|Whatever you do, don't hold it above your head.",
                          "Flametongue|Good for those long cold nights in camp.",
                          "Zenith Blade|Glows brighter than the sun.",
                          "Gunblade|Bringing a sword to a gunfight."];
Game.mid_melee_debuffs = [[241, "Ruthlessness", 15, -1],
                          [247, "Static Shock", 15, 25],
                          [243, "Cauterize", 15, 30],
                          [249, "Dazzle", 15, -1],
                          [247, "Staggered", 15, 25]];
Game.slow_melee_special = ["Planetary Edge|Rare, because planets aren't edgy.",
                           "Death Sentence|The Grim Reaper has arrived.",
                           "The Ambassador|Diplomatic immunity!",
                           "Excalibur II|Do it the same, but better!",
                           "Mjolnir|They're not worthy!",
                           "Generic Melee Weapon|Relic of a bygone era."];
Game.slow_melee_debuffs = [[244, "Hamstring", 15, 25],
                           [248, "Dark Omen", 5, 10],
                           [241, "Diplomacy", 15, -1],
                           [243, "Holy Radiance", 15, 30],
                           [244, "Concussion", 15, 25],
                           [244, "Generic Slow", 15, 25]];
Game.fast_range_special = ["Ace of Spades|Who throws a card? I mean, come on, really?",
                           "Tomahawk|Serving native tribes for centuries.",
                           "Throat Piercers|Also perfect for piercing other parts.",
                           "Miniature Shurikens|Why throw one when you can throw ten?"];
Game.fast_range_debuffs = [[246, "Paper Cut", 15, 30],
                           [244, "Cripple", 15, 25],
                           [241, "Piercing Throw", 15, -1],
                           [242, "Barrage", 15, 70]];
Game.mid_range_special = ["Death From Above|Or below, or far away, depending on where you stand.",
                          "Tidebreaker's Harpoon|They might want it back at some point.",
                          "The Dreamer|Shoots rainbows and sunshine.",
                          "Sagittarius|Making the stars align for you.",
                          "Generic Ranged Weapon|Relic of a bygone era."];
Game.mid_range_debuffs = [[248, "Impending Doom", 5, 10],
                          [243, "Bloodthirst", 15, 30],
                          [250, "Counting Sheep", 15, 10],
                          [242, "Starfall", 15, 70],
                          [246, "Generic Bleed", 15, 30]];
Game.slow_range_special = ["The Stakeholder|Raising the stakes, one corpse at a time.",
                           "Artemis Bow|Comes with a free built in harp, no strings attached.",
                           "Parting Shot|Something to remember them by.",
                           "Star Searcher|I wonder what we'll find today?",
                           "C4-Laced Boomerang|It better not come back..."];
Game.slow_range_debuffs = [[247, "Unbalanced", 15, 20],
                           [245, "Charm", 5, -1],
                           [241, "Ruthlessness", 15, -1],
                           [249, "Arm Shot", 15, -1],
                           [246, "Shrapnel", 15, 30]];
Game.fast_magic_special = ["Thundercaller|When used in battle, it chants the name 'Thor' repeatedly.",
                           "Cosmic Fury|Dr. Tyson would like a word with you...",
                           "Spark-Touched Fetish|Rubber gloves are strongly recommended.",
                           "Theory of Everything|It works! At least in theory...",
                           "Generic Magic Weapon|Relic of a bygone era."];
Game.fast_magic_debuffs = [[247, "Static Shock", 15, 20],
                           [242, "Frenzy", 15, 65],
                           [245, "Confuse", 5, -1],
                           [243, "Expert Strategy", 15, 30],
                           [243, "Generic Heal", 15, 30]];
Game.mid_magic_special = ["Flamecore Battlestaff|Still warm to the touch.",
                          "Gift of the Cosmos|Just keeps on giving.",
                          "Emberleaf War Tome|Not actually made of embers, which are terrible for books.",
                          "Encyclopedia of the Realm|Knowledge is power.",
                          "\"How to Maim Your Dragon\"|Now featuring step by step guides!"];
Game.mid_magic_debuffs = [[246, "Slow Burn", 15, 30],
                          [244, "Cripple", 15, 25],
                          [243, "Drain Life", 15, 30],
                          [241, "Find Weakness", 15, -1],
                          [249, "Wing Clip", 15, -1]];
Game.slow_magic_special = ["The Tetranomicon|Written and bound by Tetradigm. Mostly incomprehensible.",
                           "Comet Chaser|Note: Comets are dangerous, DO NOT TRY THIS AT HOME.",
                           "Absolute Zero|Not quite. But it's close!",
                           "Judgement Staff|Bear the weight of your crimes!",
                           "Cock of the Infinite|I put on my robe and wizard hat."];
Game.slow_magic_debuffs = [[248, "Flames of Tetradigm", 5, 10],
                           [246, "Slow Burn", 15, 30],
                           [247, "Bitter Cold", 15, 25],
                           [248, "Judgement Bolt", 5, 10],
                           [241, "Penetration", 15, -1]];
// Prefixes for non-great items
// Yes there's a blank one, it's so the item has no prefix :)
Game.weaponQualityDescriptors = [["Worthless","Damaged","Inept","Decayed","Flawed","Decrepit","Useless"],
                           ["Average","Unremarkable","","Passable","Basic","Simple","Usable","Adequate"],
                           ["Pristine","Enhanced","Powerful","Well-Maintained","Powerful","Superior","Exceptional"]];
Game.armourQualityDescriptors = [["Tattered","Frayed","Threadbare","Cracked","Battleworn","Useless","Worthless"],
                                 ["Average","Unremarkable","","Passable","Basic","Simple","Usable","Adequate"],
                                 ["Polished","Well-Kept","Reinforced","Tempered","Heavy","Spotless","Exceptional"]];
Game.armour_generic = ["Robe","Jerkin","Poncho","Overcoat","Tunic","Cuirass","Brigandine","Chestplate","Buckler","Deflector","Longcoat","Wrap","Tower Shield","Kite Shield","Legplates","Shorts","Tights","Hat","Beanie","Kilt"];
Game.armour_special = ["The Blue Collar|If this won't stop attackers, the guy wearing it will.",
                       "Xena's Breastplate|It was padded all along!",
                       "Dual-Wielded Shields|But how am I meant to attack?",
                       "Steel Cage|Sure, I can't hit them, but they can't hit me!",
                       "Golden Helmet|Unrealistically heavy.",
                       "Iron Boots|Definitely not made for walking.",
                       "The Emperor's Clothes|Trust me, they're magnificent.",
                       "Ze Goggles|Zey do nothing!",
                       "Zenith Shield|Glows brighter than the sun.",
                       "Generic Armour Name|Relic of a bygone era.",
                       "Aegis Shield|Don't stare directly at it.",
                       "Planetary Bulwark|You will not go to space today.",
                       "Chainmail Bikini|Covers all the important bits."];
Game.enemy_generic = ["Rat","Cat","Man","Woman","Angry Redditor","Goat","Boar","Tiger","Skeleton","Unicyclist","Hipster","Desperate Brigand","Wolf","Irradiated Worker","Blacksmith","Gnomish Inventor","Dwarven Miner","Disgruntled Shopkeeper","Treant","Disembodied Tentacle","Incremental Developer","Angry Mob","Gelatinous Blob","Crocodile","Young Dragon","Beholder","Small Child","Unicorn","Lesser Demon","Donut Throwing Policeman","Android","Deer","Irish Plumber","Cartoon Mascot","Irate Cosplayer","French Maid"];
// Mostly friendly redditors...
Game.enemy_special = ["Sky Monkey","John the Leprechaun","Ragekai","Flirty Lover","Mike Handers","Feld O' Propane","42nd Saren","Reelix","Ralph","Kung Fu Hamster","Detratigm","Kryzodoze","Chromega","Literal Hitler","Seiyria", "Generic Enemy Name","Paranoid Android","Scary Bee","Mitschu"];
Game.enemy_boss = ["Tetradigm","The Solver","Giant Enemy Dragon","Generic Boss Name","Warlord","Dr. Tyson","Greater Demon","Brave Powerful Ruler","The Emperor"];
Game.powerList = [["Proper Care","Grants a 2% chance per level to ignore armour/weapon decay in combat.",101],
                  ["High Maintenance","Grants a 2% chance per level to fully repair weapon and armour after combat.",1011],
                  ["Hanging By A Thread","Preserves an additional 10% per level of your weapon's effect when broken.",1012],
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
                  ["Lucky Star","Grants a 1% chance per level to gain an additional Stat Point on level up.",1051],
                  ["Fast Learner","Grants a 5% increase per level to experience gains.",106],
                  ["Patience and Discipline","Grants a 3% chance per level to gain an additional point in a random stat on level up.",1061],
                  ["Flurry","Grants a 1% chance per level to strike a target again after an attack for 50% damage.",107],
                  ["Empowered Flurry","Grants a 4% increase per level in the damage of Flurry's additional strike.",1071],
                  ["Wild Swings","Causes your Burst Attack to deal a number of 50% damage hits equal to this power's level plus 1.",1072],
                  ["Survival Instincts","Grants a 2% per level increase in health regeneration and repair speeds.",108],
                  ["Will To Live","Grants a 2% chance per level to be fully healed after combat.",1081],
                  ["Deadly Force","Grants a 2% per level increase to all damage dealt.",109],
                  ["Execute","Grants a 5% chance per level to instantly kill a target below 25% health.",1091],
                  ["Ancestral Fortitude","Grants a 2% per level reduction to all damage taken",110],
                  ["Last Bastion","Reduces damage taken by 10% per level when your health is below 30%.",1101],
                  ["Vengeance","Grants a 2% chance per level to return 50% of damage taken to the target.",1102],
                  ["Nimble Fingers","Grants a 2% increase per level in attack speeds.",111],
                  ["Sneak Attack","Increases your chance to attack first by 10% per level.",1111],
                  ["Five-Finger Discount","Grants a 1% chance per level to steal seeds equal to your character level when attacking.",1112],
                  ["Expose Weakness", "Grants a 1% increase per level in the debuff application rate.",112],
		              ["Press The Advantage", "Decreases the cooldown on Burst Attack by 1 second per level when used on debuffed foes.",1121],
                  ["Turn The Tables", "Increases the debuff application rate when using Burst Attack by 20% per level.",1122],
                  ["Bartering", "Lowers the cost of item level upgrades by 2% per level.",113],
                  ["Haggling", "Increases the amount of seeds received from selling items by 5% per level",1131],
                  ["Disassembly", "Guarantees an additional piece of scrap from destroying items.",1132]];
// ["Down But Not Out","When your health reaches zero, grants an additional attack before death.",1082]
// ["Overcharge","Increases weapon damage by 30% at the cost of an extra point of durability loss per attack.",1092]
// ["Intuition","When using Burst Attack, the enemy's resistance to your attack type is treated as a vulnerability.",1123]
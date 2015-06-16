Game = {};
/*
Changes in this version (0.232)
  Balance changes
TODO:
  Reforging (change the debuff on a weapon for a cost of scrap)
   - Allow for improved versions of debuffs for more scrap (Great or better weapon required)
  Power Reset (no cost)
  Names
   - The Player
*/
Game.init = function() {
	//Define some constants we can use later
  this.GAME_VERSION = 0.23; // Used to purge older saves between major version changes
	this.XP_MULT = 1.1;
	this.XP_RANGEMIN = 2.3;
	this.XP_RANGEMAX = 3.0;
	this.XP_BASE = 30;
	this.XP_INIT = 100;
  this.WEAPON_BASE_MULT = 0.6;
	//Player states
	this.STATE_IDLE = 0;
	this.STATE_REPAIR = 1;
	this.STATE_COMBAT = 2;
  //New Boost Set
  this.BOOST_CARE = 101; // Proper Care
  this.BOOST_BROKEN = 1011; // Hanging By a Thread
  this.BOOST_REPAIR = 1012; // High Maintenance
  this.BOOST_CURRENCY = 102; // Pickpocket
  this.BOOST_EXTRA = 1021; // Cavity Search
  this.BOOST_SCRAP = 1022; // Thorough Looting
  this.BOOST_CRIT = 103; // Keen Eye
  this.BOOST_CRITDMG = 1031; // Keener Eye
  this.BOOST_ENRAGE = 1032; // Adrenaline Rush
  this.BOOST_SHIELD = 104; // Divine Shield
  this.BOOST_ABSORB = 1041; // Absorption Shield
  this.BOOST_REFLECT = 1042; // Reflective Shield
  this.BOOST_MOREPP = 105; // Luck of the Draw
  this.BOOST_MORESP = 1051; // Lucky Star
  this.BOOST_XP = 106; // Fast Learner
  this.BOOST_STATUP = 1061; // Patience and Discipline
  this.BOOST_DOUBLE = 107; // Flurry
  this.BOOST_DBLPOWER = 1071; // Empowered Flurry
  this.BOOST_REGEN = 108; // Survival Instincts
  this.BOOST_FULLHEAL = 1081; // Will To Live
  this.BOOST_DAMAGE = 109; // Deadly Force
  this.BOOST_BURST = 1091; // Wild Swings
  this.BOOST_EXECUTE = 1092; // Execute
  this.BOOST_DEFENCE = 110; // Ancestral Fortitude
  this.BOOST_LASTSTAND = 1101; // Last Bastion
  this.BOOST_VENGEANCE = 1102; // Vengeance
  this.BOOST_SPEED = 111; // Nimble Fingers
  this.BOOST_FIRST = 1111; // Sneak Attack
  this.BOOST_PICKPOCKET = 1112; // Five-Finger Discount
	//Weapon Types
	this.WEAPON_MELEE = 201;
	this.WEAPON_RANGE = 202;
	this.WEAPON_MAGIC = 203;
	//Weapon Speeds
	this.WSPEED_SLOW = 211;
	this.WSPEED_MID = 212;
	this.WSPEED_FAST = 213;
  // Armour strengths
  this.ARMOUR_STR_MELEE = 231;
  this.ARMOUR_STR_RANGE = 232;
  this.ARMOUR_STR_MAGIC = 233;
  // Armour vulnerabilities
  this.ARMOUR_VULN_MELEE = 234;
  this.ARMOUR_VULN_RANGE = 235;
  this.ARMOUR_VULN_MAGIC = 236;
  // Debuff types
  this.DEBUFF_SHRED = 241; // Negates opponent's armour
  this.DEBUFF_MULTI = 242; // Delivers a second attack with each hit
  this.DEBUFF_DRAIN = 243; // Restores a percentage of damage dealt as health
  this.DEBUFF_SLOW = 244; // Lowers the enemy's attack speed
  this.DEBUFF_MC = 245; // Causes the enemy's next attack to hit themselves
  this.DEBUFF_DOT = 246; // Deals an arbitrary amount of extra damage
  this.DEBUFF_PARAHAX = 247; // May cause the enemy to be unable to attack
  this.DEBUFF_DOOM = 248; // Kills the enemy instantly
  this.DEBUFF_DISARM = 249; // Negates opponent's weapon
	// Item Quality
	this.QUALITY_POOR = 221;
	this.QUALITY_NORMAL = 222;
	this.QUALITY_GOOD = 223;
	this.QUALITY_GREAT = 224;
	this.QUALITY_AMAZING = 225;
	// Point assignment stats
	this.STAT_STR = 301;
	this.STAT_DEX = 302;
	this.STAT_INT = 303;
	this.STAT_CON = 304;
	// Player variables
  this.MAX_INVENTORY = 10;
	this.p_HP = 0; this.p_MaxHP = 0;
	this.p_Str = 0; this.p_Dex = 0;
	this.p_Int = 0; this.p_Con = 0;
	this.p_EXP = 0; this.p_NextEXP = 0;
	this.p_SkillPoints = 0;
	this.p_Level = 0; this.p_PP = 0; // Power points.
	this.p_Powers = []; // Selected powers.
	this.p_Weapon = []; // Player weapon.
  this.p_Armour = []; // Player armour
	this.p_State = Game.STATE_IDLE; // Player states
	this.p_specUsed = false;
	this.p_autoSaved = true;
	this.p_RepairInterval = null;
  this.p_RepairValue = 0;
  this.p_Currency = 0;
  this.p_Scrap = 0;
	this.p_IdleInterval = null;
  this.p_Debuff = [];
  this.p_Adrenaline = 0;
  this.bossChance = 1;
  this.activePanel = "";
  this.p_WeaponInventory = [];
  this.p_ArmourInventory = [];
  this.updateInv = true;
  this.updatePowerPanel = true;
  this.flurryActive = false;
  this.player_debuffInterval = null;
  this.player_debuffTimer = 0;
  this.enemy_debuffInterval = null;
  this.enemy_debuffTimer = 0;
	this.combat_enemyInterval = null;
  this.combat_playerInterval = null;
  this.toastTimer = null;
	// Enemy variables
	this.e_HP = 0; this.e_MaxHP = 0;
	this.e_MainStat = 0; this.e_Level = 0;
  this.e_Name = "";
	this.e_isBoss = false;
	this.e_Weapon = []; // Enemy weapon
  this.e_Armour = []; // Enemy armour
	this.e_DebuffStacks = 0;
  this.e_Debuff = [];
  this.e_ProperName = false; // Used for name output
	this.last_Weapon = []; // Weapon to take
  this.last_Armour = [];
  this.autoBattle = false;
  this.autoBattleTicker = null;
  if(!this.load()) {
 		this.initPlayer(1);
    this.showPanel("helpTable");
 		this.save();
 	}
  else {
    this.showPanel(this.activePanel);
    this.toastNotification("Game loaded.");
  }
	if(Game.p_State != Game.STATE_COMBAT) { Game.idleHeal(); }
	this.drawActivePanel();
}
Game.reset = function() {
	if(confirm("Are you sure you wish to erase your save? It will be lost permanently...")) {
		window.localStorage.removeItem("gameSave");
		window.location.reload();
	}
}
Game.save = function() {
  var STS = {};
  STS.p_HP = Game.p_HP;
  STS.p_MaxHP = Game.p_MaxHP;
  STS.p_Str = Game.p_Str;
  STS.p_Dex = Game.p_Dex;
  STS.p_Int = Game.p_Int;
  STS.p_Con = Game.p_Con;
  STS.p_EXP = Game.p_EXP;
  STS.p_NextEXP = Game.p_NextEXP;
  STS.p_Powers = Game.p_Powers;
  STS.p_Level = Game.p_Level;
  STS.p_State = Game.p_State;
  STS.p_PP = Game.p_PP;
  STS.p_Currency = Game.p_Currency;
  STS.p_Scrap = Game.p_Scrap;
  STS.p_SkillPoints = Game.p_SkillPoints;
  STS.p_WeaponInventory = Game.p_WeaponInventory
  STS.p_Weapon = Game.p_Weapon;
  STS.p_ArmourInventory = Game.p_ArmourInventory;
  STS.p_Armour = Game.p_Armour;
  STS.last_Weapon = Game.last_Weapon;
  STS.last_Armour = Game.last_Armour;
  STS.activePanel = Game.activePanel;
  STS.bossChance = Game.bossChance;
  STS.GAME_VERSION = Game.GAME_VERSION;
  window.localStorage.setItem("gameSave",JSON.stringify(STS));
  Game.toastNotification("Game saved.");
}
Game.load = function() {
	//localStorage yeeeeee
	var g;
	try {
		g = JSON.parse(window.localStorage.getItem("gameSave"));
	}
	catch(x) {
		g = null;
		console.log("Failed to load save. Is localStorage a thing on this browser?");
	}
	if(g !== null && g.GAME_VERSION == Game.GAME_VERSION) {
		Game.p_HP = g.p_HP;
		Game.p_MaxHP = g.p_MaxHP;
		Game.p_Str = g.p_Str;
		Game.p_Dex = g.p_Dex;
		Game.p_Int = g.p_Int;
		Game.p_Con = g.p_Con;
		Game.p_EXP = g.p_EXP;
		Game.p_NextEXP = g.p_NextEXP;
		Game.p_Powers = g.p_Powers;
		Game.p_Level = g.p_Level;
		Game.p_State = g.p_State;
		Game.p_PP = g.p_PP;
    Game.p_Currency = g.p_Currency;
    Game.p_Scrap = g.p_Scrap;
		Game.p_SkillPoints = g.p_SkillPoints;
    Game.p_WeaponInventory = g.p_WeaponInventory
		Game.p_Weapon = g.p_Weapon;
    Game.p_ArmourInventory = g.p_ArmourInventory;
    Game.p_Armour = g.p_Armour;
		Game.last_Weapon = g.last_Weapon;
    Game.last_Armour = g.last_Armour;
    Game.activePanel = g.activePanel;
    if(g.bossChance === undefined) { Game.bossChance = 1; }
    else { Game.bossChance = g.bossChance; }
		return true;
	}
	else { return false; }
}
Game.RNG = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
Game.padLeft = function(nr, n, str){
    return Array(n-String(nr).length+1).join(str||'0')+nr;
}
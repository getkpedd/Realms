Game = {};

Game.init = function() {
	//Define some constants we can use later
	//Player states
	this.STATE_IDLE = 0;
	this.STATE_REPAIR = 1;
	this.STATE_COMBAT = 2;
	//Available boosts
	this.BOOST_REPAIR = 101; // High Maintenance
	this.BOOST_ASPD = 102; // Nimble Fingers
	this.BOOST_HEAL = 103; // Survival Instincts
	this.BOOST_WSPEC = 104; // Keen Eye
	this.BOOST_SKILLPT = 105; // Fortuitous Growth
	this.BOOST_XP = 106; // Fast Learner
	this.BOOST_MELEEDMG = 107; // Brutal Strikes
	this.BOOST_RANGEDMG = 108; // Sniper Training
	this.BOOST_MAGICDMG = 109; // Unleashed Elements
	this.BOOST_MELEEDEF = 110; // Stoneskin
	this.BOOST_RANGEDEF = 111; // Iron Carapace
	this.BOOST_MAGICDEF = 112; // Aetheric Resilience
	this.BOOST_DOUBLE = 113; // Flurry
	this.BOOST_SHIELD = 114; // Divine Shield
	//Weapon Types
	this.WEAPON_MELEE = 201;
	this.WEAPON_RANGE = 202;
	this.WEAPON_MAGIC = 203;
	//Weapon Speeds
	this.WSPEED_SLOW = 211;
	this.WSPEED_MID = 212;
	this.WSPEED_FAST = 213;
	// Player variables
	this.p_HP = 0; this.p_MaxHP = 0;
	this.p_Str = 0; this.p_Dex = 0;
	this.p_Int = 0; this.p_Con = 0;
	this.p_EXP = 0; this.p_SkillPoints = 0;
	this.p_Level = 0; this.p_PP = 0; // Power points.
	this.p_Powers = []; // Selected powers.
	this.p_Weapon = Game.makeWeapon(1); // Player weapon.
	this.p_State = Game.STATE_IDLE; // Player states
}

Game.initPlayer = function() {
	Game.p_MaxHP = Game.RNG(25,30);
	Game.p_HP = Game.p_MaxHP;
}

Game.load = function() {
	//Read from localStorage or cookies?
}

Game.makeWeapon = function(level) {
	// Returns a weapon as an array in the format
	// [level,type,speed,damage,decay]
	var type = Game.RNG(1,3);
	type += 200; // Brings it in line with weapon type constants
	var sType = Game.RNG(1,3);
	sType += 210; // Brings it in line with weapon speed constants
	var speed = 0; 
	var damage = 0;
	var decay = 50;
	switch(type) {
		case Game.WEAPON_MAGIC:
			switch(sType) {
				case Game.WSPEED_FAST:
					damage = Game.RNG(2*level,4*level); 
					break;
				case Game.WSPEED_MID:
					damage = Game.RNG(4*level,6*level); 
					break;
				case Game.WSPEED_SLOW:
					damage = Game.RNG(6*level,8*level); 
					break;
			}
			break;
		default:
			switch(sType) {
				case Game.WSPEED_FAST:
					damage = Game.RNG(3*level,6*level); 
					break;
				case Game.WSPEED_MID:
					damage = Game.RNG(6*level,9*level); 
					break;
				case Game.WSPEED_SLOW:
					damage = Game.RNG(9*level,12*level); 
					break;
			}
	}
	switch(sType) {
		case Game.WSPEED_FAST:
			speed = Game.RNG(10,20); 
			break;
		case Game.WSPEED_MID:
			speed = Game.RNG(20,30); 
			break;
		case Game.WSPEED_SLOW:
			speed = Game.RNG(30,40); 
			break;
	}
	speed = speed/10;
	if(type == Game.WEAPON_MAGIC) { decay = -1; }
	return new Array(level,type,speed,damage,decay);
}

Game.RNG = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
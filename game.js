Game = {};

Game.init = function() {
	//Define some constants we can use later
	this.XP_MULT = 1.116;
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
	this.BOOST_CONSERVE = 115; // Proper Care
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
	this.p_EXP = 0; this.p_NextEXP = 0;
	this.p_SkillPoints = 0;
	this.p_Level = 0; this.p_PP = 0; // Power points.
	this.p_Powers = []; // Selected powers.
	this.p_Weapon = []; // Player weapon.
	this.p_State = Game.STATE_IDLE; // Player states
	if(!Game.load()) {
		Game.initPlayer();
		Game.save();
	}
	Game.displayStats();
}

Game.initPlayer = function() {
	Game.p_MaxHP = Game.RNG(50,60);
	Game.p_HP = Game.p_MaxHP;
	Game.p_Str = Game.RNG(5,7);
	Game.p_Dex = Game.RNG(5,7);
	Game.p_Int = Game.RNG(5,7);
	Game.p_Con = Game.RNG(5,7);
	Game.p_EXP = 0;
	Game.p_NextEXP = 100;
	Game.p_SkillPoints = 0;
	Game.p_Level = 1;
	Game.p_PP = 0;
	Game.p_Weapon = Game.makeWeapon(1);
}

Game.displayStats = function() {
	var lv = document.getElementById("p_Level");
	lv.innerHTML = Game.p_Level;
	var exp = document.getElementById("p_EXP");
	exp.innerHTML = Game.p_EXP;
	var nextxp = document.getElementById("p_NextEXP");
	nextxp.innerHTML = Game.p_NextEXP;
	var hp = document.getElementById("p_HP");
	hp.innerHTML = Game.p_HP;
	var maxhp = document.getElementById("p_MaxHP");
	maxhp.innerHTML = Game.p_MaxHP;
	var str = document.getElementById("p_Str");
	str.innerHTML = Game.p_Str;
	var dex = document.getElementById("p_Dex");
	dex.innerHTML = Game.p_Dex;
	var intel = document.getElementById("p_Int");
	intel.innerHTML = Game.p_Int;
	var con = document.getElementById("p_Con");
	con.innerHTML = Game.p_Con;
	var w_name = document.getElementById("w_Name");
	w_name.innerHTML = Game.getWeaponName(Game.p_Weapon);
	var w_type = document.getElementById("w_Type");
	switch(Game.p_Weapon[1]) {
		case Game.WEAPON_MELEE:
			w_type.innerHTML = "Melee"; break;
		case Game.WEAPON_RANGE:
			w_type.innerHTML = "Ranged"; break;
		case Game.WEAPON_MAGIC:
			w_type.innerHTML = "Magic"; break;
	}
	var w_speed = document.getElementById("w_Speed");
	w_speed.innerHTML = Game.p_Weapon[3];
	var w_damage = document.getElementById("w_Damage");
	w_damage.innerHTML = Game.p_Weapon[4];
	var w_DPS = document.getElementById("w_DPS");
	w_DPS.innerHTML = Math.floor(Game.p_Weapon[4]/Game.p_Weapon[3]*100)/100;
	var w_decay = document.getElementById("w_Decay");
	if(Game.p_Weapon[5] >= 0) { w_decay.innerHTML = Game.p_Weapon[5]; }
	else { w_Decay.innerHTML = "N/A"; }
}

Game.reset = function() {
	window.localStorage.removeItem("gameSave");
	window.location.reload();
}

Game.save = function() {
	var g = JSON.stringify(Game);
	window.localStorage.setItem("gameSave",g);
}

Game.load = function() {
	//localStorage yeeeeee
	var g = JSON.parse(window.localStorage.getItem("gameSave"));
	if(g !== null) { 
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
		Game.p_SkillPoints = g.p_SkillPoints;
		Game.p_Weapon = g.p_Weapon;
		return true;
	}
	else { return false; }
}

Game.getWeaponName = function(weapon) {
	var ret = "Level " + weapon[0] + " ";
	switch(weapon[1]) {
		case Game.WEAPON_MELEE:
			switch(weapon[2]) {
				case Game.WSPEED_FAST:
					if(weapon[3] < 1.5) { ret += "Shortsword"; }
					else { ret += "Longsword"; }
					break;
				case Game.WSPEED_MID:
					if(weapon[3] < 2.5) { ret += "Hand Axe"; }
					else { ret += "Broad Axe"; }
					break;
				case Game.WSPEED_SLOW:
					if(weapon[3] < 3.5) { ret += "Flail"; }
					else { ret += "Morningstar"; }
					break;
			}
			break;
		case Game.WEAPON_RANGE:
			switch(weapon[2]) {
				case Game.WSPEED_FAST:
					if(weapon[3] < 1.5) { ret += "Throwing Knife"; }
					else { ret += "Throwing Axe"; }
					break;
				case Game.WSPEED_MID:
					if(weapon[3] < 2.5) { ret += "Repeater"; }
					else { ret += "Crossbow"; }
					break;
				case Game.WSPEED_SLOW:
					if(weapon[3] < 3.5) { ret += "Shortbow"; }
					else { ret += "Longbow"; }
					break;
			}
			break;
		case Game.WEAPON_MAGIC:
			switch(weapon[2]) {
				case Game.WSPEED_FAST:
					ret += "Staff of Thunder"; break;
				case Game.WSPEED_MID:
					ret += "Staff of Flame"; break;
				case Game.WSPEED_SLOW:
					ret += "Staff of Frost"; break;
			}
			break;
	}
	return ret;
}

Game.makeWeapon = function(level) {
	// Returns a weapon as an array in the format
	// [level,type,speedBracket,speed,damage,decay]
	var type = Game.RNG(1,3);
	type += 200; // Brings it in line with weapon type constants
	var sType = Game.RNG(1,3);
	sType += 210; // Brings it in line with weapon speed constants
	var speed = 0; 
	var damage = 0;
	var decay = 100 + 5*(level-1);
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
	return new Array(level,type,sType,speed,damage,decay);
}

Game.RNG = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
Game = {};
/* Comments
Realm of Decay - An RPG Incremental
Copyright Martin Hayward (Psychemaster) 2014
Version 0.2 beta

Changes in this version:
  Balance change in weapon quality
  Increased enemy scaling with level
TODO:
  Combat buttons on combat tab
	A way to idle:
		Initiate a battle at full health
		After a battle, take enemy weapon if it has better DPS
		Don't assign skill or power points
  All those flashy interface tabs
  Revamp powers
*/
Game.init = function() {
	//Define some constants we can use later
	this.XP_MULT = 1.1;
	this.XP_RANGEMIN = 2.3;
	this.XP_RANGEMAX = 3.0;
	this.XP_BASE = 30;
	this.XP_INIT = 100;
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
	this.p_HP = 0; this.p_MaxHP = 0;
	this.p_Str = 0; this.p_Dex = 0;
	this.p_Int = 0; this.p_Con = 0;
	this.p_EXP = 0; this.p_NextEXP = 0;
	this.p_SkillPoints = 0;
	this.p_Level = 0; this.p_PP = 0; // Power points.
	this.p_Powers = []; // Selected powers.
	this.p_Weapon = []; // Player weapon.
	this.p_State = Game.STATE_IDLE; // Player states
	this.p_specUsed = false;
	this.p_autoSaved = false;
	this.p_RepairInterval = null;
  this.p_RepairValue = 0;
	this.p_IdleInterval = null;
	this.combat_enemyInterval = null;
  this.combat_playerInterval = null;
	// Enemy variables
	this.e_HP = 0; this.e_MaxHP = 0;
	this.e_Str = 0; this.e_Dex = 0;
	this.e_Int = 0; this.e_Level = 0;
	this.e_isBoss = false;
	this.e_Weapon = []; // Enemy weapon
	this.e_DebuffStacks = 0;
	this.last_Weapon = []; // Weapon to take
  this.activePanel = "";
	this.showPanel("coreTable");
  if(!this.load()) {
 		this.initPlayer(1);
 		this.save();
 	}
	if(Game.p_State != Game.STATE_COMBAT) { Game.idleHeal(); }
	this.drawActivePanel();
}
Game.drawActivePanel = function() {
  //Nothing yet
  Game.updateLeftPanel();
  switch(Game.activePanel) {
    case "combatTable":
      Game.updateCombatPanel(); break;
    case "powersTable":
      Game.updatePowersPanel(); break;
  }
}
Game.updateLeftPanel = function() {
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
	// Player weapon
	var w_name = document.getElementById("w_Name");
  w_name.className = "q" + Game.p_Weapon[7];
  var w_flavourHandle = document.getElementById("w_flavourTextHandle");
  if(Game.p_Weapon[7] >= Game.QUALITY_GREAT) {
    var wepText = Game.p_Weapon[0].split("|");
    w_name.innerHTML = wepText[0];
    var w_flavour = document.getElementById("w_flavourText");
    w_flavour.innerHTML = wepText[1];
    w_flavourHandle.style.display = "";
  } else {
    w_name.innerHTML = Game.p_Weapon[0];
    w_flavourHandle.style.display = "none";
  }
  var w_level = document.getElementById("w_Level");
  w_level.innerHTML = Game.p_Weapon[1];
	var w_type = document.getElementById("w_Type");
	switch(Game.p_Weapon[2]) {
		case Game.WEAPON_MELEE:
			w_type.innerHTML = "Melee"; break;
		case Game.WEAPON_RANGE:
			w_type.innerHTML = "Ranged"; break;
		case Game.WEAPON_MAGIC:
			w_type.innerHTML = "Magic"; break;
	}
	var w_speed = document.getElementById("w_Speed");
	w_speed.innerHTML = Game.p_Weapon[3];
	var w_mindamage = document.getElementById("w_minDamage");
	w_mindamage.innerHTML = Game.p_Weapon[4];
  var w_maxdamage = document.getElementById("w_maxDamage");
	w_maxdamage.innerHTML = Game.p_Weapon[5];
	var w_DPS = document.getElementById("w_DPS");
	w_DPS.innerHTML = Game.p_Weapon[6];
	var w_decay = document.getElementById("w_Decay");
	var pp = document.getElementById("p_PP");
	pp.innerHTML = Game.p_PP;
	w_decay.innerHTML = Game.p_Weapon[8];
  var lvPanel = document.getElementById("levelUpPanel");
	if(Game.p_SkillPoints > 0 && Game.p_State != Game.STATE_COMBAT) {
		lvPanel.style.display = "";
		var spDisp = document.getElementById("skillPoints");
		spDisp.innerHTML = Game.p_SkillPoints;
	}
	else {
		lvPanel = document.getElementById("levelUpPanel");
		lvPanel.style.display = "none";
	}
}
Game.updateCombatPanel = function() {
  var e_panel = document.getElementById("enemyInfo");
	switch(Game.p_State) {
		case Game.STATE_IDLE:
      e_panel.style.display = "none";
      break;
      // Hide enemy panel
		case Game.STATE_COMBAT:
			// Enemy stat panel
      e_panel.style.display = "";
      var e_name = document.getElementById("enemyName");
      e_name.innerHTML = "Generic Enemy Name";
			var e_lv = document.getElementById("enemyLevel");
      e_lv.innerHTML = "Level: " + Game.e_Level;
			var e_hp = document.getElementById("enemyHealth");
      e_hp.innerHTML = "Health: " + Game.e_HP + " / " + Game.e_MaxHP;
      var e_mainStat = document.getElementById("enemyMainStat");
      switch(Game.e_Weapon[2]) {
        case Game.WEAPON_MELEE:
          e_mainStat.innerHTML = "Main Stat: " + Game.e_Str;
          break;
        case Game.WEAPON_RANGE:
          e_mainStat.innerHTML = "Main Stat: " + Game.e_Dex;
          break;
        case Game.WEAPON_MAGIC:
          e_mainStat.innerHTML = "Main Stat: " + Game.e_Int;
          break;
      }
			var e_Debuff = document.getElementById("enemyDebuffOutput");
      e_Debuff.innerHTML = "Debuff Stacks: " + Game.e_DebuffStacks;
			// Enemy weapon
			var e_Weapon = document.getElementById("enemyWeapon");
			var ew_type = ""
			switch(Game.e_Weapon[2]) {
				case Game.WEAPON_MELEE:
					ew_type = "Melee"; break;
				case Game.WEAPON_RANGE:
					ew_type = "Ranged"; break;
				case Game.WEAPON_MAGIC:
					ew_type = "Magic"; break;
			}
      e_Weapon.innerHTML = "Weapon: <span class='q" + Game.e_Weapon[7] + "'>" + Game.e_Weapon[0].split("|")[0] + "</span> (" + ew_type + "), " + Game.e_Weapon[4] + " - " + Game.e_Weapon[5] + " Damage, " + Game.e_Weapon[3] + " speed, " + Game.e_Weapon[6] + " DPS";
			break;
		case Game.STATE_REPAIR:
      e_panel.style.display = "none";
			break;
	}
/*	if(Game.last_Weapon.length > 0 && Game.p_State != Game.STATE_COMBAT) {
		var lastWep = document.getElementById("lastEnemyWeapon");
		lastWep.style.display = "";
		var takeWep = document.getElementById("takeWeapon");
		takeWep.style.display = "";
		var ew_name = document.getElementById("lastw_Name");
		ew_name.innerHTML = Game.last_Weapon[0].split("|")[0];
		var ew_type = document.getElementById("lastw_Type");
		switch(Game.last_Weapon[1]) {
			case Game.WEAPON_MELEE:
				ew_type.innerHTML = "Melee"; break;
			case Game.WEAPON_RANGE:
				ew_type.innerHTML = "Ranged"; break;
			case Game.WEAPON_MAGIC:
				ew_type.innerHTML = "Magic"; break;
		}
		var ew_speed = document.getElementById("lastw_Speed");
		ew_speed.innerHTML = Game.last_Weapon[3];
		var ew_damage = document.getElementById("lastw_Damage");
		ew_damage.innerHTML = Game.last_Weapon[4] + "/" + Game.last_Weapon[5];
		var ew_DPS = document.getElementById("lastw_DPS");
		ew_DPS.innerHTML = Math.floor(Game.last_Weapon[6]);
	}
	else {
		lastWep = document.getElementById("lastEnemyWeapon");
		lastWep.style.display = "none";
		takeWep = document.getElementById("takeWeapon");
		takeWep.style.display = "none";
	}
  */
}
Game.updatePowersPanel = function() {
	//Available Powers Panel
	var ppp = document.getElementById("availablePowers");
	if(Game.p_PP > 0) {
		ppp.style.display = "";
		for(var x = 0; x < Game.p_Powers.length; x++) {
			var targetControl;
			switch(Game.p_Powers[x]) {
				case Game.BOOST_REPAIR: // High Maintenance
					targetControl = document.getElementById("repair");
					break;
				case Game.BOOST_ASPD: // Nimble Fingers
					targetControl = document.getElementById("aspd");
					break;
				case Game.BOOST_HEAL: // Survival Instincts
					targetControl = document.getElementById("heal");
					break;
				case Game.BOOST_WSPEC: // Keen Eye
					targetControl = document.getElementById("wspec");
					break;
				case Game.BOOST_SKILLPT: // Fortuitous Growth
					targetControl = document.getElementById("skillpt");
					break;
				case Game.BOOST_XP: // Fast Learner
					targetControl = document.getElementById("xp");
					break;
				case Game.BOOST_MELEEDMG: // Brutal Strikes
					targetControl = document.getElementById("meleedmg");
					break;
				case Game.BOOST_RANGEDMG: // Sniper Training
					targetControl = document.getElementById("rangedmg");
					break;
				case Game.BOOST_MAGICDMG:// Unleashed Elements
					targetControl = document.getElementById("magicdmg");
					break;
				case Game.BOOST_MELEEDEF: // Stoneskin
					targetControl = document.getElementById("meleedef");
					break;
				case Game.BOOST_RANGEDEF: // Iron Carapace
					targetControl = document.getElementById("rangedef");
					break;
				case Game.BOOST_MAGICDEF: // Aetheric Resilience
					targetControl = document.getElementById("magicdef");
					break;
				case Game.BOOST_DOUBLE: // Flurry
					targetControl = document.getElementById("double");
					break;
				case Game.BOOST_SHIELD:// Divine Shield
					targetControl = document.getElementById("shield");
					break;
				case Game.BOOST_CONSERVE: // Proper Care
					targetControl = document.getElementById("conserve");
					break;
			}
			targetControl.style.display = "none";
		}
	} else { ppp.style.display = "none"; }
	//Selected Powers Panel
	var spp = document.getElementById("selectedPowers");
	if(Game.p_Powers.length > 0) {
		spp.style.display = "";
		for(var x = 0; x < Game.p_Powers.length; x++) {
			var targetControl;
			switch(Game.p_Powers[x]) {
				case Game.BOOST_REPAIR: // High Maintenance
					targetControl = document.getElementById("selected_repair");
					break;
				case Game.BOOST_ASPD: // Nimble Fingers
					targetControl = document.getElementById("selected_aspd");
					break;
				case Game.BOOST_HEAL: // Survival Instincts
					targetControl = document.getElementById("selected_heal");
					break;
				case Game.BOOST_WSPEC: // Keen Eye
					targetControl = document.getElementById("selected_wspec");
					break;
				case Game.BOOST_SKILLPT: // Fortuitous Growth
					targetControl = document.getElementById("selected_skillpt");
					break;
				case Game.BOOST_XP: // Fast Learner
					targetControl = document.getElementById("selected_xp");
					break;
				case Game.BOOST_MELEEDMG: // Brutal Strikes
					targetControl = document.getElementById("selected_meleedmg");
					break;
				case Game.BOOST_RANGEDMG: // Sniper Training
					targetControl = document.getElementById("selected_rangedmg");
					break;
				case Game.BOOST_MAGICDMG:// Unleashed Elements
					targetControl = document.getElementById("selected_magicdmg");
					break;
				case Game.BOOST_MELEEDEF: // Stoneskin
					targetControl = document.getElementById("selected_meleedef");
					break;
				case Game.BOOST_RANGEDEF: // Iron Carapace
					targetControl = document.getElementById("selected_rangedef");
					break;
				case Game.BOOST_MAGICDEF: // Aetheric Resilience
					targetControl = document.getElementById("selected_magicdef");
					break;
				case Game.BOOST_DOUBLE: // Flurry
					targetControl = document.getElementById("selected_double");
					break;
				case Game.BOOST_SHIELD:// Divine Shield
					targetControl = document.getElementById("selected_shield");
					break;
				case Game.BOOST_CONSERVE: // Proper Care
					targetControl = document.getElementById("selected_conserve");
					break;
			}
			targetControl.style.display = "";
		}
	} else { spp.style.display = "none"; }
}
Game.combatLog = function(combatant, message) {
	var d = document.createElement("div");
	d.setAttribute("class",combatant);
	var x = document.createElement("span");
	x.innerHTML = message;
	d.appendChild(x);
	var logBox = document.getElementById("logBody");
	logBox.appendChild(d);
}
Game.startRepair = function() {
	if(Game.p_Weapon[8] >= (50 + 5*(Game.p_Weapon[1]-1))) {
		// Repair not required, do nothing
	}
	else {
		Game.p_State = Game.STATE_REPAIR;
		Game.p_RepairValue = Game.p_Weapon[1];
		if(Game.hasPower(Game.BOOST_HEAL)) {
			Game.p_RepairInterval = window.setInterval(Game.repairTick,800);
		}
		else { Game.p_RepairInterval = window.setInterval(Game.repairTick,1000); }
	}
	Game.drawActivePanel();
}
Game.repairTick = function() {
	if(Game.p_RepairValue === 0) {
		Game.p_Weapon[8] = 50 + 5*(Game.p_Weapon[1]-1);
		if(Game.hasPower(Game.BOOST_REPAIR)) { Game.p_Weapon[8]*=2; }
		Game.p_State = Game.STATE_IDLE;
		window.clearInterval(Game.p_RepairInterval);
	}
	else {
		Game.p_RepairValue-=1;
		Game.p_State = Game.STATE_REPAIR;
	}
	Game.drawActivePanel();
}
Game.idleHeal = function() {
	if(Game.p_State != Game.STATE_COMBAT) {
		Game.p_HP = Math.min(Game.p_HP + Game.p_Con,Game.p_MaxHP);
		if(!Game.p_autoSaved && Game.p_HP == Game.p_MaxHP) {
			Game.p_autoSaved = true;
			Game.save();
		}
	}
	if(Game.hasPower(Game.BOOST_HEAL)) {
		Game.p_IdleInterval = window.setTimeout(Game.idleHeal,800);
	}
	else { Game.p_IdleInterval = window.setTimeout(Game.idleHeal,1000); }
	Game.drawActivePanel();
}
Game.startCombat = function() {
	if(Game.p_State == Game.STATE_IDLE) {
		if(Game.p_Level >= 5 && Game.RNG(1,100) == 1) {
			Game.makeBoss(Game.p_Level);
		}
		else {
			Game.makeEnemy(Game.p_Level);
		}
		Game.p_State = Game.STATE_COMBAT;
		if(Game.RNG(1,2) == 1) {
			Game.combat_playerInterval = window.setTimeout(Game.playerCombatTick,100);
			Game.combat_enemyInterval = window.setTimeout(Game.enemyCombatTick,1100);
		}
		else {
			Game.combat_playerInterval = window.setTimeout(Game.enemyCombatTick,100);
			Game.combat_enemyInterval = window.setTimeout(Game.playerCombatTick,1100);
		}
	}
	var log = document.getElementById("logBody");
	log.innerHTML = "";
  Game.showPanel('combatTable');
	Game.drawActivePanel();
}
Game.playerCombatTick = function() {
	if(Game.p_State == Game.STATE_COMBAT) {
		var playerDMG = Game.RNG(Game.p_Weapon[4],Game.p_Weapon[5]);
		switch(Game.p_Weapon[2]) {
			case Game.WEAPON_MAGIC:
				playerDMG += Math.floor(Game.p_Int/2);
				if(Game.hasPower(Game.BOOST_MAGICDMG)) { playerDMG = Math.floor(playerDMG*1.2); }
				break;
			case Game.WEAPON_RANGE:
				playerDMG += Math.floor(Game.p_Dex/2);
				if(Game.hasPower(Game.BOOST_RANGEDMG)) { playerDMG = Math.floor(playerDMG*1.2); }
				break;
			case Game.WEAPON_MELEE:
				playerDMG += Math.floor(Game.p_Str/2);
				if(Game.hasPower(Game.BOOST_MELEEDMG)) { playerDMG = Math.floor(playerDMG*1.2); }
				break;
		}
		// Decay handling
			if(Game.p_Weapon[8]>0) {
				if(Game.hasPower(Game.BOOST_CONSERVE) && Game.RNG(1,5) == 1) {
					Game.combatLog("player","<strong>Proper Care</strong> prevented weapon decay.");
				}
				else { Game.p_Weapon[8]--; }
			}
			else {
				playerDMG = Math.floor(playerDMG/2);
			}
			Game.e_HP = Math.max(Game.e_HP-playerDMG,0);
		Game.drawActivePanel();
		Game.combatLog("player","You hit the enemy with your <span class='q" + Game.p_Weapon[7] + "'>" + Game.p_Weapon[0].split("|")[0] + "</span> for <strong>" + playerDMG + "</strong> damage.");
		// Debuff effect for melee
		if(Game.p_Weapon[2] == Game.WEAPON_MELEE && Game.e_DebuffStacks > 0) {
			var selfHeal = Game.e_DebuffStacks * Game.p_Weapon[1];
			Game.p_HP = Math.min(Game.p_HP + selfHeal, Game.p_MaxHP);
			Game.combatLog("player","Healed <strong>" + selfHeal + "</strong> from Blood Siphon.");
		}
		// Debuff effect for magic
		if(Game.p_Weapon[2] == Game.WEAPON_MAGIC && Game.e_DebuffStacks > 0) {
			var bonusDMG = Game.e_DebuffStacks * Game.p_Weapon[1];
			Game.e_HP = Math.max(Game.e_HP - bonusDMG, 0);
			Game.combatLog("player","&nbsp;Dealt <strong>" + bonusDMG + "</strong> damage from Residual Burn.");
		}
		var debuffApplyChance = 2;
		if(Game.hasPower(Game.BOOST_WSPEC)) { debuffApplyChance++; }
		if(Game.RNG(1,10) <= debuffApplyChance) {
			Game.e_DebuffStacks++;
			switch(Game.p_Weapon[2]) {
				case Game.WEAPON_MAGIC:
					Game.combatLog("player","The enemy suffers from <strong>Residual Burn.</strong>");
					break;
				case Game.WEAPON_RANGE:
					Game.combatLog("player","The enemy suffers from <strong>Infected Wound.</strong>");
					break;
				case Game.WEAPON_MELEE:
					Game.combatLog("player","The enemy suffers from <strong>Blood Siphon.</strong>");
					break;
			}
		}
		if(Game.e_HP > 0) {
			var timerLength = 1000*Game.p_Weapon[3];
			if(Game.hasPower(Game.BOOST_ASPD)) { timerLength = Math.floor(timerLength*0.8); }
			if(Game.hasPower(Game.BOOST_DOUBLE) && Game.RNG(1,5) == 1) {
				Game.combatLog("player","<strong>Flurry</strong> activated for an additional strike!");
				Game.playerCombatTick();
			}
			else {
				window.clearTimeout(Game.combat_playerInterval);
				Game.combat_playerInterval = window.setTimeout(Game.playerCombatTick,timerLength);
			}
		}
		else { Game.endCombat(); }
	}
	else { window.clearInterval(Game.combat_playerInterval); }
	Game.drawActivePanel();
}
Game.enemyCombatTick = function() {
	if(Game.p_State == Game.STATE_COMBAT) {
		var enemyDMG = Game.RNG(Game.e_Weapon[4],Game.e_Weapon[5]);
		switch(Game.e_Weapon[2]) {
			case Game.WEAPON_MAGIC:
				enemyDMG += Math.floor(Game.e_Int/2);
				if(Game.hasPower(Game.BOOST_MAGICDEF)) { enemyDMG = Math.floor(enemyDMG*0.8); }
				break;
			case Game.WEAPON_RANGE:
				enemyDMG += Math.floor(Game.e_Dex/2);
				if(Game.hasPower(Game.BOOST_RANGEDEF)) { enemyDMG = Math.floor(enemyDMG*0.8); }
				break;
			case Game.WEAPON_MELEE:
				enemyDMG += Math.floor(Game.e_Str/2);
				if(Game.hasPower(Game.BOOST_MELEEDEF)) { enemyDMG = Math.floor(enemyDMG*0.8); }
				break;
		}
		if(Game.hasPower(Game.BOOST_SHIELD) && Game.RNG(1,10) == 1) {
			Game.combatLog("player","Your <strong>Divine Shield</strong> absorbed the damage.");
		}
		else {
			// Debuff effect for range
			if(Game.p_Weapon[2] == Game.WEAPON_RANGE && Game.e_DebuffStacks > 0) {
				var damageDown = Game.e_DebuffStacks * Game.p_Weapon[1];
				enemyDMG = Math.max(enemyDMG - damageDown,0);
				Game.combatLog("enemy","<strong>" + damageDown + "</strong> prevented by Infected Wound.");
			}
			Game.p_HP = Math.max(Game.p_HP-enemyDMG,0);
			Game.combatLog("enemy","The enemy hits you with their <span class='q" + Game.e_Weapon[7] + "'>" + Game.e_Weapon[0].split("|")[0] + "</span> for <strong>" + enemyDMG + "</strong> damage.");
		}

		if(Game.p_HP > 0) { Game.combat_enemyInterval = window.setTimeout(Game.enemyCombatTick,1000*Game.e_Weapon[3]); }
		else { Game.endCombat(); }
	}
	else { window.clearTimeout(Game.combat_enemyInterval); }
	Game.drawActivePanel();
}
Game.specialAttack = function() {
	Game.p_specUsed = true;
	switch(Game.p_Weapon[2]) {
		case Game.WEAPON_MELEE:
			// Bloodthirst: Heal 10% per stack
			var healAmount = Math.floor(Game.p_MaxHP/10)*Game.e_DebuffStacks;
			Game.p_HP = Math.min(Game.p_MaxHP, Game.p_HP + healAmount);
			Game.combatLog("player","<strong>Bloodthirst</strong> healed for <strong>" + healAmount + "</strong>.");
			break;
		case Game.WEAPON_RANGE:
			// Power Shot: Deal 10% per stack
			var dmgAmount = Math.floor(Game.e_MaxHP/10)*Game.e_DebuffStacks;
			Game.e_HP = Math.max(0, Game.e_HP - dmgAmount);
			Game.combatLog("player","<strong>Power Shot</strong> hit for <strong>" + dmgAmount + "</strong>.");
			if(Game.e_HP <= 0) { Game.endCombat(); }
			break;
		case Game.WEAPON_MAGIC:
			// Wild Magic: Fire one attack per stack
			Game.combatLog("player","<strong>Wild Magic</strong> activated!");
			for(var x = Game.e_DebuffStacks; x > 0; x--) { Game.playerCombatTick(); }
			if(Game.e_HP > 0) { Game.combatLog("player","<strong>Wild Magic</strong> ended."); }
			break;
	}
	Game.e_DebuffStacks = 0;
	Game.p_specUsed = false;
	// Perform a special function based on weapon type and debuff stacks.
}
Game.fleeCombat = function() {
	window.clearTimeout(Game.combat_playerInterval);
	window.clearTimeout(Game.combat_enemyInterval);
	Game.p_State = Game.STATE_IDLE;
	Game.combatLog("","You fled from the battle.");
	Game.drawActivePanel();
}
Game.endCombat = function() {
	window.clearTimeout(Game.combat_playerInterval);
	window.clearTimeout(Game.combat_enemyInterval);
	Game.p_State = Game.STATE_IDLE;
	if(Game.p_specUsed && Game.p_Weapon[1] == Game.WEAPON_MAGIC) { Game.combatLog("player","<strong>Wild Magic</strong> ended."); }
	if(Game.p_HP > 0) {
		// Player won, give xp and maybe, just maybe, a level.
		Game.combatLog("","You won!");
		Game.last_Weapon = Game.e_Weapon.slice();
		var xpToAdd = Math.floor(Game.XP_BASE+(Game.RNG(Game.XP_RANGEMIN*Game.e_Level,Game.XP_RANGEMAX*Game.e_Level)));
		if(Game.hasPower(Game.BOOST_XP)) { xpToAdd = Math.floor(xpToAdd*1.2); }
		Game.combatLog("","You gained <strong>" + xpToAdd + "</strong> experience.");
		Game.p_EXP += xpToAdd;
		if(Game.p_EXP >= Game.p_NextEXP) {
			Game.levelUp();
		}
	}
	else {
		// Enemy won, dock XP
		Game.combatLog("","You lost...");
		var xpDrop = Math.floor(Game.p_EXP/4);
		Game.combatLog("","You lose <strong>" + xpDrop + "</strong> experience...");
		Game.p_EXP -= xpDrop;
		Game.p_HP = Game.p_MaxHP;
	}
	Game.p_autoSaved = false;
	Game.drawActivePanel();
}
Game.levelUp = function() {
	Game.combatLog("","Level up! You are now level <strong>" + (Game.p_Level+1) + "</strong>.");
	var hpUp = Game.RNG(25,30);
	Game.p_MaxHP += hpUp
	Game.p_HP = Game.p_MaxHP;
	Game.combatLog("","You gained <strong>" + hpUp + "</strong> HP.")
	var strUp = Game.RNG(1,5) == 1 ? 2 : 1;
	Game.p_Str += strUp;
	Game.combatLog("","You gained <strong>" + strUp + "</strong> Strength.")
	var dexUp = Game.RNG(1,5) == 1 ? 2 : 1;
	Game.p_Dex += dexUp;
	Game.combatLog("","You gained <strong>" + dexUp + "</strong> Dexterity.")
	var intUp = Game.RNG(1,5) == 1 ? 2 : 1;
	Game.p_Int += intUp;
	Game.combatLog("","You gained <strong>" + intUp + "</strong> Intelligence.")
	var conUp = Game.RNG(1,5) == 1 ? 2 : 1;
	Game.p_Con += conUp;
	Game.combatLog("","You gained <strong>" + conUp + "</strong> Constitution.")
	Game.p_Level += 1;
	Game.p_EXP = 0;
	Game.p_NextEXP = Math.floor(100*Math.pow(Game.XP_MULT,Game.p_Level-1));
	Game.p_SkillPoints += 1;
	Game.combatLog("","You gained a skill point.");
	if(Game.hasPower(Game.BOOST_SKILLPT) && Game.RNG(1,5) == 1) {
		Game.p_SkillPoints++;
		Game.combatLog("","Your <strong>Fortuitous Growth</strong> granted another skill point!");
	}
	if(Game.p_Level % 5 === 0) {
		Game.p_PP += 1;
		Game.combatLog("","You gained a Power point.");
	}
}
Game.buyPower = function(power) {
	if(Game.p_PP > 0) {
		if(!Game.hasPower(power)) {
			Game.p_Powers.push(power);
			Game.p_PP--;
		}
	}
	Game.drawActivePanel();
}
Game.takeWeapon = function() {
	Game.p_Weapon = Game.last_Weapon.slice(0);
	Game.last_Weapon = [];
	Game.drawActivePanel();
}
Game.addStat = function(stat) {
	if(Game.p_SkillPoints > 0) {
		switch(stat) {
			case Game.STAT_STR:
				Game.p_Str++; break;
			case Game.STAT_DEX:
				Game.p_Dex++; break;
			case Game.STAT_INT:
				Game.p_Int++; break;
			case Game.STAT_CON:
				Game.p_Con++; break;
		}
		Game.p_SkillPoints--;
	}
	Game.drawActivePanel();
}
Game.initPlayer = function(level) {
	Game.p_MaxHP = Game.RNG(100,120) + Game.RNG(25*(level-1),30*(level-1));
	Game.p_HP = Game.p_MaxHP;
	Game.p_Str = Game.RNG(5,7) + Game.RNG(level-1,2*(level-1));
	Game.p_Dex = Game.RNG(5,7) + Game.RNG(level-1,2*(level-1));
	Game.p_Int = Game.RNG(5,7) + Game.RNG(level-1,2*(level-1));
	Game.p_Con = Game.RNG(5,7) + Game.RNG(level-1,2*(level-1));
	Game.p_EXP = 0;
	Game.p_NextEXP = Math.floor(Game.XP_INIT*Math.pow(Game.XP_MULT,level-1));
	Game.p_SkillPoints = level;
	Game.p_Level = level;
	Game.p_PP = 0;
	Game.p_Weapon = Game.makeWeapon(level);
}
Game.makeEnemy = function(level) {
	Game.e_MaxHP = Game.RNG(80,100) + Game.RNG(25*(level-1),30*(level-1));
	Game.e_Str = Game.RNG(5,7) + Game.RNG(level-1,2*(level-1));
	Game.e_Dex = Game.RNG(5,7) + Game.RNG(level-1,2*(level-1));
	Game.e_Int = Game.RNG(5,7) + Game.RNG(level-1,2*(level-1));
  var scalingFactor = Math.min(1.8,0.8+((level-1)*0.04));
  Game.e_MaxHP = Math.floor(Game.e_MaxHP*scalingFactor);
  Game.e_Str = Math.floor(Game.e_Str*scalingFactor);
  Game.e_Dex = Math.floor(Game.e_Dex*scalingFactor);
  Game.e_Int = Math.floor(Game.e_Int*scalingFactor);
  Game.e_HP = Game.e_MaxHP;
	Game.e_Level = level;
	Game.e_DebuffStacks = 0;
	Game.e_isBoss = false;
	Game.e_Weapon = Game.makeWeapon(Game.RNG(1,5) == 1 ? level+1 : level);
}
Game.makeBoss = function(level) {
	Game.e_MaxHP = Game.RNG(80,100) + Game.RNG(25*(level-1),30*(level-1));
	Game.e_Str = Game.RNG(5,7) + Game.RNG(Math.floor((level-1)*1.5),2*(level-1));
	Game.e_Dex = Game.RNG(5,7) + Game.RNG(Math.floor((level-1)*1.5),2*(level-1));
	Game.e_Int = Game.RNG(5,7) + Game.RNG(Math.floor((level-1)*1.5),2*(level-1));
  var scalingFactor = Math.min(3.0,1+((level-1)*0.05));
  Game.e_MaxHP = Math.floor(Game.e_MaxHP*scalingFactor);
  Game.e_Str = Math.floor(Game.e_Str*scalingFactor);
  Game.e_Dex = Math.floor(Game.e_Dex*scalingFactor);
  Game.e_Int = Math.floor(Game.e_Int*scalingFactor);
  Game.e_HP = Game.e_MaxHP;
	Game.e_Level = level;
	Game.e_DebuffStacks = 0;
	Game.e_isBoss = true;
	Game.e_Weapon = Game.makeWeapon(level+3);
}
Game.reset = function() {
	if(confirm("Are you sure you wish to erase your save? It will be lost permanently...")) {
		window.localStorage.removeItem("gameSave");
		window.location.reload();
	}
}
Game.save = function() {
	var g = JSON.stringify(Game);
	window.localStorage.setItem("gameSave",g);
	var saveToast = document.getElementById("saveToast");
	saveToast.style.display = "";
	window.setTimeout(function() { 	var saveToast = document.getElementById("saveToast"); saveToast.style.display = "none"; },3000);
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
		Game.last_Weapon = g.last_Weapon;
		return true;
	}
	else { return false; }
}
Game.makeWeapon = function(level) {
	// Returns a weapon as an array with the form
	// [name,level,type,speed,minDmg,maxDmg,dps,quality,decay]
	var type = Game.RNG(Game.WEAPON_MELEE,Game.WEAPON_MAGIC);
	var sType = Game.RNG(Game.WSPEED_SLOW, Game.WSPEED_FAST);
	var speed = 0;
	var minDmg = 0; var maxDmg = 0;
	var dps = 0;
	var decay = 50 + 5*(level-1);
	var qualityMult = 1; var qualityID = Game.QUALITY_NORMAL;
	// Quality generator
	var qT = Game.RNG(1,100);
	if(qT == 1) {
		qualityMult = 1.4;
		qualityID = Game.QUALITY_AMAZING;
	} else if(qT < 6) {
		qualityMult = 1.2;
		qualityID = Game.QUALITY_GREAT;
	} else if(qT < 16) {
		qualityMult = 1.1;
		qualityID = Game.QUALITY_GOOD;
	} else if(qT < 26) {
		qualityMult = 0.8;
		qualityID = Game.QUALITY_POOR;
	} else {
		qualityMult = 1;
		qualityID = Game.QUALITY_NORMAL;
	}
	// Weapon speed
	switch(sType) {
		case Game.WSPEED_FAST:
			speed = Game.RNG(16,20);
			break;
		case Game.WSPEED_MID:
			speed = Game.RNG(21,25);
			break;
		case Game.WSPEED_SLOW:
			speed = Game.RNG(26,30);
			break;
	}
	speed = speed/10;
	var base = 0; var variance = 0; var perLv = 0;
	switch(sType) {
		case Game.WSPEED_FAST:
			base = Game.RNG(8,9);
			perLv = 2;
			variance = 0.3;
			break;
		case Game.WSPEED_MID:
			base = Game.RNG(10,12);
			perLv = 2.5;
			variance = 0.4;
			break;
		case Game.WSPEED_SLOW:
			base = Game.RNG(12,15);
			perLv = 3;
			variance = 0.5;
			break;
	}
  var name = Game.getWeaponName(type,qualityID,sType);
	minDmg = Math.floor((base + ((level-1)*perLv)-(1+(variance*(level-1)/2)))*qualityMult);
	maxDmg = Math.ceil((base + ((level-1)*perLv)+(1+(variance*(level-1)/2)))*qualityMult);
	dps = Math.floor((minDmg + maxDmg)/2/speed*100)/100;
	return new Array(name,level,type,speed,minDmg,maxDmg,dps,qualityID,decay);
}
Game.getWeaponName = function(type,quality,speedTier) {
  var nameArray = [];
  switch(type) {
    case Game.WEAPON_MELEE:
      switch(speedTier) {
        case Game.WSPEED_SLOW:
          if(quality>=Game.QUALITY_GREAT) {
            nameArray = Game.slow_melee_special;
          } else { nameArray = Game.slow_melee_generic; }
          break;
        case Game.WSPEED_MID:
          if(quality>=Game.QUALITY_GREAT) {
            nameArray = Game.mid_melee_special;
          } else { nameArray = Game.mid_melee_generic; }
          break;
        case Game.WSPEED_FAST:
          if(quality>=Game.QUALITY_GREAT) {
            nameArray = Game.fast_melee_special;
          } else { nameArray = Game.fast_melee_generic; }
          break;
      }
      break;
    case Game.WEAPON_RANGE:
      switch(speedTier) {
        case Game.WSPEED_SLOW:
          if(quality>=Game.QUALITY_GREAT) {
            nameArray = Game.slow_range_special;
          } else { nameArray = Game.slow_range_generic; }
          break;
        case Game.WSPEED_MID:
          if(quality>=Game.QUALITY_GREAT) {
            nameArray = Game.mid_range_special;
          } else { nameArray = Game.mid_range_generic; }
          break;
        case Game.WSPEED_FAST:
          if(quality>=Game.QUALITY_GREAT) {
            nameArray = Game.fast_range_special;
          } else { nameArray = Game.fast_range_generic; }
          break;
      }
      break;
    case Game.WEAPON_MAGIC:
      switch(speedTier) {
        case Game.WSPEED_SLOW:
          if(quality>=Game.QUALITY_GREAT) {
            nameArray = Game.slow_magic_special;
          } else { nameArray = Game.slow_magic_generic; }
          break;
        case Game.WSPEED_MID:
          if(quality>=Game.QUALITY_GREAT) {
            nameArray = Game.mid_magic_special;
          } else { nameArray = Game.mid_magic_generic; }
          break;
        case Game.WSPEED_FAST:
          if(quality>=Game.QUALITY_GREAT) {
            nameArray = Game.fast_magic_special;
          } else { nameArray = Game.fast_magic_generic; }
          break;
      }
      break;
  }
  if(quality >= Game.QUALITY_GREAT) {
    return nameArray[Game.RNG(0,nameArray.length-1)];
  } else {
    var qualityState = Game.qualityDescriptors[quality-Game.QUALITY_POOR];
    return (qualityState[Game.RNG(0,qualityState.length-1)] + " " + nameArray[Game.RNG(0,nameArray.length-1)]).trim();
  }
}
Game.hasPower = function(power) {
	return Game.p_Powers.indexOf(power) >= 0;
}
Game.RNG = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
Game.showPanel = function(panelID) {
	var panelList = document.getElementsByTagName("table");
	for(var x = 0; x < panelList.length; x++) {
		if(panelList[x].id == panelID) {
			panelList[x].style.display = "";
		}
		else if(panelList[x].id.match(/(\w+)Table/g) !== null) {
			panelList[x].style.display = "none";
		}
	}
  Game.activePanel = panelID;
  Game.drawActivePanel();
}
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
// Always need more names!
Game.fast_melee_special = ["Blinkstrike|They'll never know what hit 'em...",
                           "Adder's Fang|Not to scale.",
                           "Torturer's Poker|Tell me all your dirty little secrets..."];
Game.mid_melee_special = ["Edge of Depravity|I think it's just misunderstood...",
                          "Storm's Herald|Whatever you do, don't hold it above your head.",
                          "Flametongue|Good for those long cold nights in camp."];
Game.slow_melee_special = ["Planetary Edge|Rare, if only because planets are usually spherical.",
                           "Death Sentence|Bears a passing resemblance to Death's own scythe.",
                           "The Ambassador|Diplomacy? I do not think it means what you think it means."];
Game.fast_range_special = ["Ace of Spades|Who throws a card? I mean, come on, really?",
                           "Tomahawk|Serving native tribes for centuries.",
                           "Throat Piercers|Also perfect for piercing other parts."];
Game.mid_range_special = ["Death From Above|Or below, or far away, depending on where you stand.",
                          "Tidebreaker's Harpoon|They might want it back at some point.",
                          "Starshatter Recurve|Has been known to shoot rainbows on occasion."];
Game.slow_range_special = ["The Stakeholder|Raising the stakes, one corpse at a time.",
                           "Artemis Bow|Comes with a free built in harp, no strings attached.",
                           "Parting Shot|This isn't going to end well for at least one of us..."];
Game.fast_magic_special = ["Thundercaller|When used in battle, it chants the name 'Thor' repeatedly.",
                           "Cosmic Fury|Dr. Tyson would like a word with you...",
                           "Spark-Touched Fetish|Rubber gloves are strongly recommended."];
Game.mid_magic_special = ["Flamecore Battlestaff|Still warm to the touch.",
                          "Gift of the Cosmos|Just keeps on giving.",
                          "Emberleaf War Tome|Not actually made of embers, which are terrible for books.",
                          "Encyclopedia of the Realm|Knowledge is power."];
Game.slow_magic_special = ["The Tetranomicon|Written and bound by Tetradigm. Mostly incomprehensible.",
                           "Comet Chaser|Note: Comets are dangerous, DO NOT TRY THIS AT HOME.",
                           "Absolute Zero|Not quite. But it's close!"];
// Prefixes for non-great items
// Yes there's a blank one, it's so the item has no prefix :)
Game.qualityDescriptors = [["Worthless","Damaged","Inept","Decayed","Flawed","Decrepit"],
                           ["Average","Unremarkable","","Passable","Basic","Simple"],
                           ["Pristine","Enhanced","Powerful","Well-Maintained","Powerful","Superior"]];
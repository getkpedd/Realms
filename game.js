Game = {};
/*
Changes in this version:
  Amazing weapons now have 130% of normal stats (down from 140%)
  Poor weapons now have 90% of normal stats (up from 80%)
  Weapon upgrade cost now scales with weapon quality
  Weapon sale price now scales with weapon quality
  Weapons now guarantee an extra relevant stat point on level up
  Items dropped by enemies are now shown in the inventory window.
  Fix: Weapon speeds now show in inventory
  Fix: Great/Amazing weapon names display properly when selling/scrapping
  Fix: Repair not required messages show properly
  Players and enemies now come with armour:
    Armour provides a flat damage reduction against some combat styles.
    Armour also carries weaknesses to some combat styles.
    Strengths and weaknesses are flat increases and reductions.
    Quality increases the amount and power of strengths, and removes vulnerabilities.
TODO:
  IMPORTANT: Range debuff is now OP as hell, nerf!!!!
  Armour names + prefixes
  Rewrite save function
  Debuff + special revamp
  Enemy names
  Upgrade weapon quality
  Help tab
	A way to idle:
		Initiate a battle at full health
		After a battle, take enemy weapon if it has better DPS
		Don't assign skill or power points
  Revamp powers
*/
Game.init = function() {
	//Define some constants we can use later
  this.GAME_VERSION = 0.216; // Used to purge older saves between major version changes
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
  this.BOOST_CURRENCY = 116; // Pickpocket
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
  this.DEBUFF_SHRED = 241;
  this.DEBUFF_MULTI = 242;
  this.DEBUFF_DRAIN = 243;
  this.DEBUFF_SLOW = 244;
  this.DEBUFF_MC = 245;
  this.DEBUFF_DOT = 246;
  this.DEBUFF_PARAHAX = 247;
  this.DEBUFF_DOOM = 248;
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
  this.p_Armour = []; // Player armour
	this.p_State = Game.STATE_IDLE; // Player states
	this.p_specUsed = false;
	this.p_autoSaved = true;
	this.p_RepairInterval = null;
  this.p_RepairValue = 0;
  this.p_Currency = 0;
  this.p_Scrap = 0;
	this.p_IdleInterval = null;
	this.combat_enemyInterval = null;
  this.combat_playerInterval = null;
  this.toastTimer = null;
	// Enemy variables
	this.e_HP = 0; this.e_MaxHP = 0;
	this.e_Str = 0; this.e_Dex = 0;
	this.e_Int = 0; this.e_Level = 0;
	this.e_isBoss = false;
	this.e_Weapon = []; // Enemy weapon
  this.e_Armour = []; // Enemy armour
	this.e_DebuffStacks = 0;
	this.last_Weapon = []; // Weapon to take
  this.last_Armour = [];
  this.activePanel = "";
  this.p_WeaponInventory = [];
  this.p_ArmourInventory = [];
  this.updateInv = true;
  this.flurryActive = false;
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
Game.drawActivePanel = function() {
  //Nothing yet
  Game.updateLeftPanel();
  switch(Game.activePanel) {
    case "combatTable":
      Game.updateCombatPanel(); break;
    case "powersTable":
      Game.updatePowersPanel(); break;
    case "inventoryTable":
      Game.updateInventoryPanel(); break;
    case "storeTable":
      Game.updateStorePanel(); break;
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
  var currency = document.getElementById("CurrencyOut");
  currency.innerHTML = Game.p_Currency;
  var scrap = document.getElementById("ScrapOut");
  scrap.innerHTML = Game.p_Scrap;
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
  var wrPanel = document.getElementById("weaponRepairPanel");
  if(Game.p_State == Game.STATE_IDLE) { wrPanel.style.display = ""; }
  else { wrPanel.style.display = "none"; }
	pp.innerHTML = Game.p_PP;
	w_decay.innerHTML = Game.p_Weapon[8];
  // Armour display
  var a_name = document.getElementById("a_Name");
  a_name.className = "q" + Game.p_Armour[2];
  var a_flavourHandle = document.getElementById("a_flavourTextHandle");
  if(Game.p_Armour[2] >= Game.QUALITY_GREAT) {
    var armText = Game.p_Armour[0].split("|");
    a_name.innerHTML = armText[0];
    var a_flavour = document.getElementById("a_flavourText");
    a_flavour.innerHTML = armText[1];
    a_flavourHandle.style.display = "";
  } else {
    a_name.innerHTML = Game.p_Armour[0];
    a_flavourHandle.style.display = "none";
  }
  var a_level = document.getElementById("a_Level");
  a_level.innerHTML = Game.p_Armour[1];
  var a_decay = document.getElementById("a_Decay");
  a_decay.innerHTML = Game.p_Armour[3];
  var a_statOut = document.getElementById("armourStats");
  a_statOut.innerHTML = "";
  var a_strengths = document.createElement("div");
  for(var a = 0; a < Game.p_Armour[4].length; a++) {
    var strData = Game.p_Armour[4][a];
    var strType = "";
    switch(strData[0]) {
      case Game.ARMOUR_STR_MELEE:
        strType = "Melee Resist"; break;
      case Game.ARMOUR_STR_RANGE:
        strType = "Range Resist"; break;
      case Game.ARMOUR_STR_MAGIC:
        strType = "Magic Resist"; break;
    }
    var strOut = document.createElement("span");
    strOut.style.color = "#33cc33";
    strOut.innerHTML = "+" + strData[1] + " " + strType;
    a_strengths.appendChild(strOut);
    if(a != Game.p_Armour[4].length) { a_strengths.appendChild(document.createElement("br")); }
  }
  a_statOut.appendChild(a_strengths);
    var a_vulns = document.createElement("div");
  for(var b = 0; b < Game.p_Armour[5].length; b++) {
    var vulnData = Game.p_Armour[5][b];
    var vulnType = "";
    switch(vulnData[0]) {
      case Game.ARMOUR_VULN_MELEE:
        vulnType = "Melee Resist"; break;
      case Game.ARMOUR_VULN_RANGE:
        vulnType = "Range Resist"; break;
      case Game.ARMOUR_VULN_MAGIC:
        vulnType = "Magic Resist"; break;
    }
    var vulnOut = document.createElement("span");
    vulnOut.style.color = "red";
    vulnOut.innerHTML = "-" + vulnData[1] + " " + vulnType;
    a_vulns.appendChild(vulnOut);
    if(b != Game.p_Armour[5].length) { a_vulns.appendChild(document.createElement("br")); }
  }
  a_statOut.appendChild(a_vulns);
  var arPanel = document.getElementById("armourRepairPanel");
  if(Game.p_State == Game.STATE_IDLE) { arPanel.style.display = ""; }
  else { arPanel.style.display = "none"; }
  // Need a button here to go to inventory if enemy drops available
}
Game.updateCombatPanel = function() {
  var e_panel = document.getElementById("enemyInfo");
  var ooc_panel = document.getElementById("oocActionBar");
  var ic_panel = document.getElementById("combatActionBar");
	switch(Game.p_State) {
		case Game.STATE_IDLE:
      e_panel.style.display = "none";
      ooc_panel.style.display = "";
      ic_panel.style.display = "none";
      break;
      // Hide enemy panel
		case Game.STATE_COMBAT:
			// Enemy stat panel
      e_panel.style.display = "";
      ooc_panel.style.display = "none";
      ic_panel.style.display = "";
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
      // Enemy armour
      var e_Armour = document.getElementById("enemyArmour");
      e_Armour.innerHTML = "Armour: <span class='q" + Game.e_Armour[2] + "'>" + Game.e_Armour[0].split("|")[0] + "</span><br />"
      for(var st = 0; st < Game.e_Armour[4].length; st++) {
        var thisStr = Game.e_Armour[4][st];
        var strType = "";
        switch(thisStr[0]) {
          case Game.ARMOUR_STR_MELEE:
            strType = "Melee Resist"; break;
          case Game.ARMOUR_STR_RANGE:
            strType = "Range Resist"; break;
          case Game.ARMOUR_STR_MAGIC:
            strType = "Magic Resist"; break;
        }
        e_Armour.innerHTML += "<span style='color:#33cc33;'>+" + thisStr[1] + " " + strType + "</span> ";
      }
      for(var vu = 0; vu < Game.e_Armour[5].length; vu++) {
        var thisVul = Game.e_Armour[5][vu];
        var vulType = "";
        switch(thisVul[0]) {
          case Game.ARMOUR_VULN_MELEE:
            vulType = "Melee Resist"; break;
          case Game.ARMOUR_VULN_RANGE:
            vulType = "Range Resist"; break;
          case Game.ARMOUR_VULN_MAGIC:
            vulType = "Magic Resist"; break;
        }
        e_Armour.innerHTML += "<span style='color:red;'>-" + thisVul[1] + " " + vulType + "</span> ";
      }
			break;
		case Game.STATE_REPAIR:
      e_panel.style.display = "none";
      ooc_panel.style.display = "none";
      ic_panel.style.display = "none";
			break;
	}
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
        case Game.BOOST_CURRENCY: // Pickpocket
					targetControl = document.getElementById("currency");
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
        case Game.BOOST_CURRENCY: // Pickpocket
					targetControl = document.getElementById("selected_currency");
					break;
			}
			targetControl.style.display = "";
		}
	} else { spp.style.display = "none"; }
  // Level up panel
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
Game.updateInventoryPanel = function() {
  if(Game.updateInv === true) {
    var invPanel = document.getElementById("weaponOut");
    invPanel.innerHTML = "";
    if(Game.p_WeaponInventory.length > 0) { document.getElementById("weaponCache").style.display = ""; }
    else { document.getElementById("weaponCache").style.display = "none"; }
    for(var x = 0; x < Game.p_WeaponInventory.length; x++) {
      // Table row
      var inventoryObject = document.createElement("tr");
      var leftAlign = document.createAttribute("style");
      leftAlign.value = "text-align:left;";
      inventoryObject.setAttributeNode(leftAlign);
      var infopane = document.createElement("td");
      var nameColor = document.createElement("span");
      nameColor.className = "q" + Game.p_WeaponInventory[x][7];
      var flavourText = document.createElement("span");
      if(Game.p_WeaponInventory[x][7] >= Game.QUALITY_GREAT) {
        var wepText = Game.p_WeaponInventory[x][0].split("|");
        nameColor.innerHTML = wepText[0];
        flavourText.innerHTML = "<span style='font-style:italic;'> " + wepText[1] + "</span>";
        flavourText.style.display = "";
      } else {
        nameColor.innerHTML = Game.p_WeaponInventory[x][0];
        flavourText.style.display = "none";
      }
      infopane.appendChild(nameColor);
      infopane.appendChild(flavourText);
      var weaponType = "";
      switch(Game.p_WeaponInventory[x][2]) {
        case Game.WEAPON_MELEE:
          weaponType = "Melee"; break;
        case Game.WEAPON_RANGE:
          weaponType = "Ranged"; break;
        case Game.WEAPON_MAGIC:
          weaponType = "Magic"; break;
      }
      var textContent = document.createTextNode(" (" + weaponType + ") - Level " + Game.p_WeaponInventory[x][1] + " - " + Game.p_WeaponInventory[x][3] + " speed - " + Game.p_WeaponInventory[x][4] + "-" + Game.p_WeaponInventory[x][5] + " damage (" + Game.p_WeaponInventory[x][6] + " DPS) - " + Game.p_WeaponInventory[x][8] + " durability");
      infopane.appendChild(document.createElement("br"));
      infopane.appendChild(textContent);
      inventoryObject.appendChild(infopane);
      // Column for buttons
      if(Game.p_State !== Game.STATE_REPAIR) {
        var buttons = document.createElement("td");
        var rightAlign = document.createAttribute("style");
        rightAlign.value = "text-align:right;";
        buttons.setAttributeNode(rightAlign);
        var equipButton = document.createElement("span");
        equipButton.className = "bigButton";
        equipButton.onclick = function(a){ return function() { Game.equipWeapon(a); }; }(x);
        equipButton.innerHTML = "Equip";
        buttons.appendChild(equipButton);
        var sellButton = document.createElement("span");
        sellButton.className = "bigButton";
        sellButton.onclick = function(a){ return function() { Game.sellWeapon(a); }; }(x);
        sellButton.innerHTML = "Sell";
        buttons.appendChild(sellButton);
        var scrapButton = document.createElement("span");
        scrapButton.className = "bigButton";
        scrapButton.onclick = function(a){ return function() { Game.scrapWeapon(a); }; }(x);
        scrapButton.innerHTML = "Scrap";
        buttons.appendChild(scrapButton);
        var discardButton = document.createElement("span");
        discardButton.className = "bigButton";
        discardButton.onclick = function(a){ return function() { Game.discardWeapon(a); }; }(x);
        discardButton.innerHTML = "Discard";
        buttons.appendChild(discardButton);
        inventoryObject.appendChild(buttons);
      }
      invPanel.appendChild(inventoryObject);
    }
    // Armour panel
    invPanel = document.getElementById("armourOut");
    invPanel.innerHTML = "";
    if(Game.p_ArmourInventory.length > 0) { document.getElementById("armourCache").style.display = ""; }
    else { document.getElementById("armourCache").style.display = "none"; }
    for(var y = 0; y < Game.p_ArmourInventory.length; y++) {
      // Table row
      var inventoryObject = document.createElement("tr");
      var leftAlign = document.createAttribute("style");
      leftAlign.value = "text-align:left;";
      inventoryObject.setAttributeNode(leftAlign);
      var infopane = document.createElement("td");
      var nameColor = document.createElement("span");
      nameColor.className = "q" + Game.p_ArmourInventory[y][2];
      var flavourText = document.createElement("span");
      if(Game.p_ArmourInventory[y][2] >= Game.QUALITY_GREAT) {
        var wepText = Game.p_ArmourInventory[y][0].split("|");
        nameColor.innerHTML = wepText[0];
        flavourText.innerHTML = "<span style='font-style:italic;'> " + wepText[1] + "</span>";
        flavourText.style.display = "";
      } else {
        nameColor.innerHTML = Game.p_ArmourInventory[y][0];
        flavourText.style.display = "none";
      }
      infopane.appendChild(nameColor);
      infopane.appendChild(flavourText);
      var armText = "Level " + Game.p_ArmourInventory[y][1] + " - " + Game.p_ArmourInventory[y][3] + " durability";
      infopane.appendChild(document.createElement("br"));
      infopane.appendChild(document.createTextNode(armText));
      infopane.appendChild(document.createElement("br"));
      var armStrs = "";
      for(var st = 0; st < Game.p_ArmourInventory[y][4].length; st++) {
        var thisStr = Game.p_ArmourInventory[y][4][st];
        var strType = "";
        switch(thisStr[0]) {
          case Game.ARMOUR_STR_MELEE:
            strType = "Melee Resist"; break;
          case Game.ARMOUR_STR_RANGE:
            strType = "Range Resist"; break;
          case Game.ARMOUR_STR_MAGIC:
            strType = "Magic Resist"; break;
        }
        armStrs = armStrs + "+" + thisStr[1] + " " + strType + ", ";
      }
      armStrs = armStrs.slice(0,-2);
      var armStrSpan = document.createElement("span");
      armStrSpan.style.color = "#33cc33";
      armStrSpan.innerHTML = armStrs;
      infopane.appendChild(armStrSpan);
      infopane.appendChild(document.createElement("br"));
      // Vulnerabilities
      var armVulns = "";
      for(var vu = 0; vu < Game.p_ArmourInventory[y][5].length; vu++) {
        var thisVul = Game.p_ArmourInventory[y][5][vu];
        var vulType = "";
        switch(thisVul[0]) {
          case Game.ARMOUR_VULN_MELEE:
            vulType = "Melee Resist"; break;
          case Game.ARMOUR_VULN_RANGE:
            vulType = "Range Resist"; break;
          case Game.ARMOUR_VULN_MAGIC:
            vulType = "Magic Resist"; break;
        }
        armVulns = armVulns + "-" + thisVul[1] + " " + vulType + ", ";
      }
      armVulns = armVulns.slice(0,-2);
      var armVulnsSpan = document.createElement("span");
      armVulnsSpan.style.color = "red";
      armVulnsSpan.innerHTML = armVulns;
      infopane.appendChild(armVulnsSpan);
      inventoryObject.appendChild(infopane);
      // Column for buttons
      if(Game.p_State !== Game.STATE_REPAIR) {
        var buttons = document.createElement("td");
        var rightAlign = document.createAttribute("style");
        rightAlign.value = "text-align:right;";
        buttons.setAttributeNode(rightAlign);
        var equipButton = document.createElement("span");
        equipButton.className = "bigButton";
        equipButton.onclick = function(a){ return function() { Game.equipArmour(a); }; }(y);
        equipButton.innerHTML = "Equip";
        buttons.appendChild(equipButton);
        var sellButton = document.createElement("span");
        sellButton.className = "bigButton";
        sellButton.onclick = function(a){ return function() { Game.sellArmour(a); }; }(y);
        sellButton.innerHTML = "Sell";
        buttons.appendChild(sellButton);
        var scrapButton = document.createElement("span");
        scrapButton.className = "bigButton";
        scrapButton.onclick = function(a){ return function() { Game.scrapArmour(a); }; }(y);
        scrapButton.innerHTML = "Scrap";
        buttons.appendChild(scrapButton);
        var discardButton = document.createElement("span");
        discardButton.className = "bigButton";
        discardButton.onclick = function(a){ return function() { Game.discardArmour(a); }; }(y);
        discardButton.innerHTML = "Discard";
        buttons.appendChild(discardButton);
        inventoryObject.appendChild(buttons);
      }
      invPanel.appendChild(inventoryObject);
    }
    // Enemy loot panel
    invPanel = document.getElementById("enemyInvOut");
    invPanel.innerHTML = "";
    if(Game.last_Weapon.length > 0 || Game.last_Armour.length > 0) {
      document.getElementById("enemyItems").style.display = "";
    }
    else { document.getElementById("enemyItems").style.display = "none";
    }
    if(Game.last_Weapon.length > 0) {
      var inventoryObject = document.createElement("tr");
      var leftAlign = document.createAttribute("style");
      leftAlign.value = "text-align:left;";
      inventoryObject.setAttributeNode(leftAlign);
      var infopane = document.createElement("td");
      var nameColor = document.createElement("span");
      nameColor.className = "q" + Game.last_Weapon[7];
      var flavourText = document.createElement("span");
      if(Game.last_Weapon[7] >= Game.QUALITY_GREAT) {
        var wepText = Game.last_Weapon[0].split("|");
        nameColor.innerHTML = wepText[0];
        flavourText.innerHTML = "<span style='font-style:italic;'> " + wepText[1] + "</span>";
        flavourText.style.display = "";
      } else {
        nameColor.innerHTML = Game.last_Weapon[0];
        flavourText.style.display = "none";
      }
      infopane.appendChild(nameColor);
      infopane.appendChild(flavourText);
      var weaponType = "";
      switch(Game.last_Weapon[2]) {
        case Game.WEAPON_MELEE:
          weaponType = "Melee"; break;
        case Game.WEAPON_RANGE:
          weaponType = "Ranged"; break;
        case Game.WEAPON_MAGIC:
          weaponType = "Magic"; break;
      }
      var textContent = document.createTextNode(" (" + weaponType + ") - Level " + Game.last_Weapon[1] + " - " + Game.last_Weapon[3] + " speed - " + Game.last_Weapon[4] + "-" + Game.last_Weapon[5] + " damage (" + Game.last_Weapon[6] + " DPS) - " + Game.last_Weapon[8] + " durability");
      infopane.appendChild(document.createElement("br"));
      infopane.appendChild(textContent);
      inventoryObject.appendChild(infopane);
      // Column for buttons
      if(Game.p_State !== Game.STATE_REPAIR) {
        var buttons = document.createElement("td");
        var rightAlign = document.createAttribute("style");
        rightAlign.value = "text-align:right;";
        buttons.setAttributeNode(rightAlign);
        var equipButton = document.createElement("span");
        equipButton.className = "bigButton";
        equipButton.onclick = function() { Game.takeWeapon(); }
        equipButton.innerHTML = "Take Weapon";
        buttons.appendChild(equipButton);
        inventoryObject.appendChild(buttons);
      }
      invPanel.appendChild(inventoryObject);
    }
    if(Game.last_Armour.length > 0) {
      var inventoryObject = document.createElement("tr");
      var leftAlign = document.createAttribute("style");
      leftAlign.value = "text-align:left;";
      inventoryObject.setAttributeNode(leftAlign);
      var infopane = document.createElement("td");
      var nameColor = document.createElement("span");
      nameColor.className = "q" + Game.last_Armour[2];
      var flavourText = document.createElement("span");
      if(Game.last_Armour[2] >= Game.QUALITY_GREAT) {
        var wepText = Game.last_Armour[0].split("|");
        nameColor.innerHTML = wepText[0];
        flavourText.innerHTML = "<span style='font-style:italic;'> " + wepText[1] + "</span>";
        flavourText.style.display = "";
      } else {
        nameColor.innerHTML = Game.last_Armour[0];
        flavourText.style.display = "none";
      }
      infopane.appendChild(nameColor);
      infopane.appendChild(flavourText);
      var lastArmText = "Level " + Game.last_Armour[1] + " - " + Game.last_Armour[3] + " durability";
      infopane.appendChild(document.createElement("br"));
      infopane.appendChild(document.createTextNode(lastArmText));
      infopane.appendChild(document.createElement("br"));
      var lastArmStrs = "";
      for(var st = 0; st < Game.last_Armour[4].length; st++) {
        var thisStr = Game.last_Armour[4][st];
        var strType = "";
        switch(thisStr[0]) {
          case Game.ARMOUR_STR_MELEE:
            strType = "Melee Resist"; break;
          case Game.ARMOUR_STR_RANGE:
            strType = "Range Resist"; break;
          case Game.ARMOUR_STR_MAGIC:
            strType = "Magic Resist"; break;
        }
        lastArmStrs = lastArmStrs + "+" + thisStr[1] + " " + strType + ", ";
      }
      lastArmStrs = lastArmStrs.slice(0,-2);
      var lastArmStrSpan = document.createElement("span");
      lastArmStrSpan.style.color = "#33cc33";
      lastArmStrSpan.innerHTML = lastArmStrs;
      infopane.appendChild(lastArmStrSpan);
      infopane.appendChild(document.createElement("br"));
      // Vulnerabilities
      var lastArmVulns = "";
      for(var vu = 0; vu < Game.last_Armour[5].length; vu++) {
        var thisVul = Game.last_Armour[5][vu];
        var vulType = "";
        switch(thisVul[0]) {
          case Game.ARMOUR_VULN_MELEE:
            vulType = "Melee Resist"; break;
          case Game.ARMOUR_VULN_RANGE:
            vulType = "Range Resist"; break;
          case Game.ARMOUR_VULN_MAGIC:
            vulType = "Magic Resist"; break;
        }
        lastArmVulns = lastArmVulns + "-" + thisVul[1] + " " + vulType + ", ";
      }
      lastArmVulns = lastArmVulns.slice(0,-2);
      var lastArmVulnsSpan = document.createElement("span");
      lastArmVulnsSpan.style.color = "red";
      lastArmVulnsSpan.innerHTML = lastArmVulns;
      infopane.appendChild(lastArmVulnsSpan);
      inventoryObject.appendChild(infopane);
      // Column for buttons
      if(Game.p_State !== Game.STATE_REPAIR) {
        var buttons = document.createElement("td");
        var rightAlign = document.createAttribute("style");
        rightAlign.value = "text-align:right;";
        buttons.setAttributeNode(rightAlign);
        var takeButton = document.createElement("span");
        takeButton.className = "bigButton";
        takeButton.onclick = function() { Game.takeArmour(); };
        takeButton.innerHTML = "Take Armour";
        buttons.appendChild(takeButton);
        inventoryObject.appendChild(buttons);
      }
      invPanel.appendChild(inventoryObject);
    }
    Game.updateInv = false;
  }
}
Game.updateStorePanel = function() {
  var wlUPCost = document.getElementById("weaponLevelUpgradeCost");
  var upgradeCost = Math.floor(200 * Math.pow(1.15,Game.p_Weapon[1]));
  upgradeCost = Math.floor(upgradeCost*(10+(Game.p_Weapon[7]-Game.QUALITY_NORMAL))/10);
  wlUPCost.innerHTML = upgradeCost;
  var alUPCost = document.getElementById("armourLevelUpgradeCost");
  upgradeCost = Math.floor(200 * Math.pow(1.15,Game.p_Armour[1]));
  upgradeCost = Math.floor(upgradeCost*(10+(Game.p_Armour[2]-Game.QUALITY_NORMAL))/10);
  alUPCost.innerHTML = upgradeCost;
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
Game.startWeaponRepair = function() {
  var maxRepair = 50 + (5*(Game.p_Weapon[1]-1));
  if(Game.hasPower(Game.BOOST_REPAIR)) { maxRepair*=2; }
	if(Game.p_Weapon[8] >= maxRepair) {
		Game.toastNotification("Repair not required.")
	}
	else {
		Game.p_State = Game.STATE_REPAIR;
		Game.p_RepairValue = Game.p_Weapon[1];
    Game.toastNotification("Repairing weapon...");
		if(Game.hasPower(Game.BOOST_HEAL)) {
			Game.p_RepairInterval = window.setInterval(Game.repairWeaponTick,800);
		}
		else { Game.p_RepairInterval = window.setInterval(Game.repairWeaponTick,1000); }
	}
  Game.updateInv = true;
	Game.drawActivePanel();
}
Game.startArmourRepair = function() {
  var maxRepair = 50 + (5*(Game.p_Armour[1]-1));
  if(Game.hasPower(Game.BOOST_REPAIR)) { maxRepair*=2; }
	if(Game.p_Armour[3] >= maxRepair) {
		Game.toastNotification("Repair not required.")
	}
	else {
		Game.p_State = Game.STATE_REPAIR;
		Game.p_RepairValue = Game.p_Armour[1];
    Game.toastNotification("Repairing armour...");
		if(Game.hasPower(Game.BOOST_HEAL)) {
			Game.p_RepairInterval = window.setInterval(Game.repairArmourTick,800);
		}
		else { Game.p_RepairInterval = window.setInterval(Game.repairArmourTick,1000); }
	}
  Game.updateInv = true;
	Game.drawActivePanel();
}
Game.repairWeaponTick = function() {
	if(Game.p_RepairValue === 0) {
		Game.p_Weapon[8] = 50 + 5*(Game.p_Weapon[1]-1);
		if(Game.hasPower(Game.BOOST_REPAIR)) { Game.p_Weapon[8]*=2; }
		Game.p_State = Game.STATE_IDLE;
    Game.toastNotification("Weapon repaired.");
    Game.updateInv = true;
		window.clearInterval(Game.p_RepairInterval);
	}
	else {
    Game.toastNotification("Ticks to repair: " + Game.p_RepairValue);
		Game.p_RepairValue-=1;
		Game.p_State = Game.STATE_REPAIR;
	}
	Game.drawActivePanel();
}
Game.repairArmourTick = function() {
	if(Game.p_RepairValue === 0) {
		Game.p_Armour[3] = 50 + 5*(Game.p_Armour[1]-1);
		if(Game.hasPower(Game.BOOST_REPAIR)) { Game.p_Armour[3]*=2; }
		Game.p_State = Game.STATE_IDLE;
    Game.toastNotification("Armour repaired.");
    Game.updateInv = true;
		window.clearInterval(Game.p_RepairInterval);
	}
	else {
    Game.toastNotification("Ticks to repair: " + Game.p_RepairValue);
		Game.p_RepairValue-=1;
		Game.p_State = Game.STATE_REPAIR;
	}
	Game.drawActivePanel();
}
Game.idleHeal = function() {
	if(Game.p_State != Game.STATE_COMBAT) {
		Game.p_HP = Math.min(Game.p_HP + Game.p_Con,Game.p_MaxHP);
		if(!Game.p_autoSaved && Game.p_HP == Game.p_MaxHP && Game.p_State == Game.STATE_IDLE) {
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
				if(Game.hasPower(Game.BOOST_MAGICDMG)) { playerDMG = Math.floor(playerDMG*0.8); }
        for(var a = 0; a < Game.e_Armour[4].length; a++) {
          if(Game.e_Armour[4][a][0] == Game.ARMOUR_STR_MAGIC) { playerDMG = Math.max(playerDMG-Game.e_Armour[4][a][1],0); }
        }
        for(var b = 0; b < Game.e_Armour[5].length; b++) {
          if(Game.e_Armour[5][b][0] == Game.ARMOUR_VULN_MAGIC) { playerDMG += Game.e_Armour[5][b][1]; }
        }
				break;
			case Game.WEAPON_RANGE:
				playerDMG += Math.floor(Game.p_Dex/2);
				if(Game.hasPower(Game.BOOST_RANGEDMG)) { playerDMG = Math.floor(playerDMG*0.8); }
        for(var c = 0; c < Game.e_Armour[4].length; c++) {
          if(Game.e_Armour[4][c][0] == Game.ARMOUR_STR_RANGE) { playerDMG = Math.max(playerDMG-Game.e_Armour[4][c][1],0); }
        }
        for(var d = 0; d < Game.e_Armour[5].length; d++) {
          if(Game.e_Armour[5][d][0] == Game.ARMOUR_VULN_RANGE) { playerDMG += Game.e_Armour[5][d][1]; }
        }
				break;
			case Game.WEAPON_MELEE:
				playerDMG += Math.floor(Game.p_Str/2);
				if(Game.hasPower(Game.BOOST_MELEEDMG)) { playerDMG = Math.floor(playerDMG*0.8); }
        for(var e = 0; e < Game.e_Armour[4].length; e++) {
          if(Game.e_Armour[4][e][0] == Game.ARMOUR_STR_MELEE) { playerDMG = Math.max(playerDMG-Game.e_Armour[4][e][1],0); }
        }
        for(var f = 0; f < Game.e_Armour[5].length; f++) {
          if(Game.e_Armour[5][f][0] == Game.ARMOUR_VULN_MELEE) { playerDMG += Game.e_Armour[5][f][1]; }
        }
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
			if(Game.hasPower(Game.BOOST_DOUBLE) && Game.RNG(1,5) == 1 && !Game.flurryActive) {
        Game.flurryActive = true;
				Game.combatLog("player","<strong>Flurry</strong> activated for an additional strike!");
				Game.playerCombatTick();
			}
			else {
        Game.flurryActive = false;
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
        if(Game.p_Armour[3] > 0) {
          for(var a = 0; a < Game.p_Armour[4].length; a++) {
            if(Game.p_Armour[4][a][0] == Game.ARMOUR_STR_MAGIC) { enemyDMG = Math.max(enemyDMG-Game.p_Armour[4][a][1],0); }
          }
          for(var b = 0; b < Game.p_Armour[5].length; b++) {
            if(Game.p_Armour[5][b][0] == Game.ARMOUR_VULN_MAGIC) { enemyDMG += Game.p_Armour[5][b][1]; }
          }
        }
				break;
			case Game.WEAPON_RANGE:
				enemyDMG += Math.floor(Game.e_Dex/2);
				if(Game.hasPower(Game.BOOST_RANGEDEF)) { enemyDMG = Math.floor(enemyDMG*0.8); }
        if(Game.p_Armour[3] > 0) {
          for(var c = 0; c < Game.p_Armour[4].length; c++) {
            if(Game.p_Armour[4][c][0] == Game.ARMOUR_STR_RANGE) { enemyDMG = Math.max(enemyDMG-Game.p_Armour[4][c][1],0); }
          }
          for(var d = 0; d < Game.p_Armour[5].length; d++) {
            if(Game.p_Armour[5][d][0] == Game.ARMOUR_VULN_RANGE) { enemyDMG += Game.p_Armour[5][d][1]; }
          }
        }
				break;
			case Game.WEAPON_MELEE:
				enemyDMG += Math.floor(Game.e_Str/2);
				if(Game.hasPower(Game.BOOST_MELEEDEF)) { enemyDMG = Math.floor(enemyDMG*0.8); }
        if(Game.p_Armour[3] > 0) {
          for(var e = 0; e < Game.p_Armour[4].length; e++) {
            if(Game.p_Armour[4][e][0] == Game.ARMOUR_STR_MELEE) { enemyDMG = Math.max(enemyDMG-Game.p_Armour[4][e][1],0); }
          }
          for(var f = 0; f < Game.p_Armour[5].length; f++) {
            if(Game.p_Armour[5][f][0] == Game.ARMOUR_VULN_MELEE) { enemyDMG += Game.p_Armour[5][f][1]; }
          }
        }
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
      if(Game.hasPower(Game.BOOST_CONSERVE) && Game.RNG(1,5) == 1) {
        Game.combatLog("player","<strong>Proper Care</strong> prevented armour decay.");
      }
      else { Game.p_Armour[3]--; }
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
  if(Game.e_DebuffStacks > 0 && Game.e_HP > 0 && !Game.p_specUsed) {
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
  }
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
    Game.last_Armour = Game.e_Armour.slice();
    Game.updateInv = true;
		var xpToAdd = Math.floor(Game.XP_BASE+(Game.RNG(Game.XP_RANGEMIN*Game.e_Level,Game.XP_RANGEMAX*Game.e_Level)));
    var currencyToAdd = xpToAdd;
		if(Game.hasPower(Game.BOOST_XP)) { xpToAdd = Math.floor(xpToAdd*1.2); }
    if(Game.e_isBoss) { xpToAdd *= 2; }
		Game.combatLog("","You gained <strong>" + xpToAdd + "</strong> experience.");
		if(Game.hasPower(Game.BOOST_CURRENCY)) { currencyToAdd = Math.floor(currencyToAdd*1.2); }
    if(Game.e_isBoss) { currencyToAdd *= 2; }
		Game.combatLog("","You gained <strong>" + currencyToAdd + "</strong> seeds.");
		Game.p_EXP += xpToAdd;
    Game.p_Currency += currencyToAdd;
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
  var strUp = 1 + (Game.p_Weapon[2] == Game.WEAPON_MELEE ? 1 : 0);
	Game.p_Str += strUp;
	Game.combatLog("","You gained <strong>" + strUp + "</strong> Strength.")
	var dexUp = 1 + (Game.p_Weapon[2] == Game.WEAPON_RANGE ? 1 : 0);
	Game.p_Dex += dexUp;
	Game.combatLog("","You gained <strong>" + dexUp + "</strong> Dexterity.")
	var intUp = 1 + (Game.p_Weapon[2] == Game.WEAPON_MAGIC ? 1 : 0);
	Game.p_Int += intUp;
	Game.combatLog("","You gained <strong>" + intUp + "</strong> Intelligence.")
	var conUp = Game.RNG(1,4) == 1 ? 2 : 1;
	Game.p_Con += conUp;
	Game.combatLog("","You gained <strong>" + conUp + "</strong> Constitution.")
	Game.p_Level++;
	Game.p_EXP = 0;
	Game.p_NextEXP = Math.floor(100*Math.pow(Game.XP_MULT,Game.p_Level-1));
	Game.p_SkillPoints++;
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
  if(Game.p_WeaponInventory.length < 20) {
    Game.p_WeaponInventory.push(Game.last_Weapon.slice(0));
    Game.last_Weapon = [];
  }
  else { Game.toastNotification("Weapon inventory is full."); }
  Game.updateInv = true;
	Game.drawActivePanel();
}
Game.takeArmour = function() {
  if(Game.p_ArmourInventory.length < 20) {
    Game.p_ArmourInventory.push(Game.last_Armour.slice(0));
    Game.last_Armour = [];
  }
  else { Game.toastNotification("Armour inventory is full."); }
  Game.updateInv = true;
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
  Game.p_Armour = Game.makeArmour(level);
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
  Game.e_Armour = Game.makeArmour(Game.RNG(1,5) == 1 ? level+1 : level);
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
  Game.e_Armour = Game.makeArmour(level+3);
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
  Game.toastNotification("Game saved.");
}
Game.toastNotification = function(message) {
  if(Game.toastTimer !== null) { window.clearTimeout(Game.toastTimer); }
  var toastFrame = document.getElementById("saveToast");
  var toast = document.getElementById("toastContent");
  toast.innerHTML = message;
  toastFrame.style.display = "";
  Game.toastTimer = window.setTimeout(function() { 	var saveToast = document.getElementById("saveToast"); saveToast.style.display = "none"; },3000);
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
		return true;
	}
	else { return false; }
}
Game.equipWeapon = function(index) {
  var currentWep = Game.p_Weapon.slice(0);
  var newWep = Game.p_WeaponInventory[index].slice(0);
  Game.p_Weapon = newWep.slice(0);
  Game.p_WeaponInventory[index] = currentWep.slice(0);
  if(Game.p_State == Game.STATE_COMBAT && Game.e_DebuffStacks > 0) {
    Game.e_DebuffStacks = 0;
    Game.combatLog("player","Switching weapons has allowed the enemy to recover from inflicted debuffs.");
  }
  Game.updateInv = true;
  Game.toastNotification("Equipped " + Game.p_Weapon[0].split("|")[0] + ".");
  Game.drawActivePanel();
}
Game.discardWeapon = function(index) {
  var thrownWepName = Game.p_WeaponInventory[index][0].split("|")[0];
  Game.p_WeaponInventory.splice(index,1);
  Game.updateInv = true;
  Game.toastNotification(thrownWepName + " tossed away.");
  Game.drawActivePanel();
}
Game.sellWeapon = function(index) {
  var salePrice = Math.floor(25*Math.pow(1.1,Game.p_WeaponInventory[index][1]));
  salePrice = Math.floor(salePrice*(10+(Game.p_WeaponInventory[index][7]-Game.QUALITY_NORMAL))/10);
  var soldWepName = Game.p_WeaponInventory[index][0].split("|")[0];
  Game.p_WeaponInventory.splice(index,1);
  Game.updateInv = true;
  Game.p_Currency += salePrice;
  Game.toastNotification(soldWepName + " sold for " + salePrice + " seeds.");
  Game.drawActivePanel();
}
Game.scrapWeapon = function(index) {
  var salePrice = 0;
  var scrappedWepName = Game.p_WeaponInventory[index][0].split("|")[0];
  switch(Game.p_WeaponInventory[index][7]) {
    case Game.QUALITY_AMAZING:
      salePrice = Game.RNG(7,10);
      break;
    case Game.QUALITY_GREAT:
      salePrice = Game.RNG(4,6);
      break;
    case Game.QUALITY_GOOD:
      salePrice = Game.RNG(2,3);
      break;
    case Game.QUALITY_NORMAL:
      salePrice = Game.RNG(1,2);
      break;
    case Game.QUALITY_POOR:
      salePrice = Game.RNG(0,1);
      break;
  }
  Game.p_WeaponInventory.splice(index,1);
  Game.updateInv = true;
  Game.p_Scrap += salePrice;
  Game.toastNotification(scrappedWepName + " converted into " + salePrice + " scrap.");
  Game.drawActivePanel();
}
Game.equipArmour = function(index) {
  var currentArm = Game.p_Armour.slice(0);
  var newArm = Game.p_ArmourInventory[index].slice(0);
  Game.p_Armour = newArm.slice(0);
  Game.p_ArmourInventory[index] = currentArm.slice(0);
  Game.updateInv = true;
  Game.toastNotification("Equipped " + Game.p_Armour[0].split("|")[0] + ".");
  Game.drawActivePanel();
}
Game.discardArmour = function(index) {
  var thrownArmName = Game.p_ArmourInventory[index][0].split("|")[0];
  Game.p_ArmourInventory.splice(index,1);
  Game.updateInv = true;
  Game.toastNotification(thrownArmName + " tossed away.");
  Game.drawActivePanel();
}
Game.sellArmour = function(index) {
  var salePrice = Math.floor(25*Math.pow(1.1,Game.p_ArmourInventory[index][1]));
  salePrice = Math.floor(salePrice*(10+(Game.p_ArmourInventory[index][2]-Game.QUALITY_NORMAL))/10);
  var soldArmName = Game.p_ArmourInventory[index][0].split("|")[0];
  Game.p_ArmourInventory.splice(index,1);
  Game.updateInv = true;
  Game.p_Currency += salePrice;
  Game.toastNotification(soldArmName + " sold for " + salePrice + " seeds.");
  Game.drawActivePanel();
}
Game.scrapArmour = function(index) {
  var salePrice = 0;
  var scrappedArmName = Game.p_ArmourInventory[index][0].split("|")[0];
  switch(Game.p_ArmourInventory[index][2]) {
    case Game.QUALITY_AMAZING:
      salePrice = Game.RNG(7,10);
      break;
    case Game.QUALITY_GREAT:
      salePrice = Game.RNG(4,6);
      break;
    case Game.QUALITY_GOOD:
      salePrice = Game.RNG(2,3);
      break;
    case Game.QUALITY_NORMAL:
      salePrice = Game.RNG(1,2);
      break;
    case Game.QUALITY_POOR:
      salePrice = Game.RNG(0,1);
      break;
  }
  Game.p_ArmourInventory.splice(index,1);
  Game.updateInv = true;
  Game.p_Scrap += salePrice;
  Game.toastNotification(scrappedArmName + " converted into " + salePrice + " scrap.");
  Game.drawActivePanel();
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
		qualityMult = 1.3;
		qualityID = Game.QUALITY_AMAZING;
	} else if(qT < 6) {
		qualityMult = 1.2;
		qualityID = Game.QUALITY_GREAT;
	} else if(qT < 16) {
		qualityMult = 1.1;
		qualityID = Game.QUALITY_GOOD;
	} else if(qT < 26) {
		qualityMult = 0.9;
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
Game.makeArmour = function(level) {
  // Returns a piece of armour in the following form:
  // [name,level,quality,durability,[[str1,value],[str2,value],[str3,value]],[[vuln1,value],[vuln2,value]]]
  var armName = "Generic Armour Name";
  var armLevel = level;
  var armDura = 50+(5*(level-1));
  if(Game.hasPower(Game.BOOST_REPAIR)) { armDura *= 2; }
  var armQuality = 0;
  var qualityPlus = 1;
  var armStrengths = 0; var armVulns = 0;
  var qT = Game.RNG(1,100);
	if(qT == 1) {
		qualityPlus = 4;	armQuality = Game.QUALITY_AMAZING;
    armStrengths = 3; armVulns = 0;
	} else if(qT < 6) {
		qualityPlus = 3; armQuality = Game.QUALITY_GREAT;
    armStrengths = 2; armVulns = 0;
	} else if(qT < 16) {
		qualityPlus = 2;armQuality = Game.QUALITY_GOOD;
    armStrengths = 2; armVulns = 1;
	} else if(qT < 26) {
		qualityPlus = 0; armQuality = Game.QUALITY_POOR;
    armStrengths = 1; armVulns = 2;
	} else {
		qualityPlus = 1; armQuality = Game.QUALITY_NORMAL;
    armStrengths = 1; armVulns = 1;
	}
  var availableTypes = [0,1,2];
  var armStrList = [];
  var armVulnList = [];
  for(var x = 0; x < armStrengths; x++) {
    var added = false;
    while(!added) {
      var strType = Game.RNG(Game.ARMOUR_STR_MELEE, Game.ARMOUR_STR_MAGIC);
      if(availableTypes.indexOf(strType - Game.ARMOUR_STR_MELEE) != -1) {
        var strPower = 1 + Math.floor(qualityPlus + Game.RNG(Math.floor(level/2),level));
        var str = [strType, strPower];
        armStrList.push(str.slice(0));
        availableTypes.splice(availableTypes.indexOf(strType - Game.ARMOUR_STR_MELEE),1);
        added = true;
      }
    }
  }
  for(var y = 0; y < armVulns; y++) {
    var added = false;
    while(!added) {
      var vulnType = Game.RNG(Game.ARMOUR_VULN_MELEE, Game.ARMOUR_VULN_MAGIC);
      if(availableTypes.indexOf(vulnType - Game.ARMOUR_VULN_MELEE) != -1) {
        var vulnPower = 1 + Math.floor(qualityPlus + Game.RNG(Math.floor(level/2),level));
        var vuln = [vulnType, vulnPower];
        armVulnList.push(vuln.slice(0));
        availableTypes.splice(availableTypes.indexOf(vulnType - Game.ARMOUR_VULN_MELEE),1);
        added = true;
      }
    }
  }
  return [armName, armLevel, armQuality, armDura, armStrList.slice(0), armVulnList.slice(0)];
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
Game.upgradeWeaponLevel = function(weapon) {
  weapon[1]++;
  var qualityMult = 1.0;
  switch(weapon[7]) {
    case Game.QUALITY_POOR:
      qualityMult = 0.8; break;
    case Game.QUALITY_GOOD:
      qualityMult = 1.1; break;
    case Game.QUALITY_GREAT:
      qualityMult = 1.2; break;
    case Game.QUALITY_AMAZING:
      qualityMult = 1.4; break;
  }
  switch(weapon[3]) {
    case 1.6:
    case 1.7:
    case 1.8:
    case 1.9:
    case 2.0:
      weapon[4] = Math.floor(weapon[4]+1.7*qualityMult);
      weapon[5] = Math.floor(weapon[5]+2.3*qualityMult);
      break;
    case 2.1:
    case 2.2:
    case 2.3:
    case 2.4:
    case 2.5:
      weapon[4] = Math.floor(weapon[4]+2.1*qualityMult);
      weapon[5] = Math.floor(weapon[5]+2.9*qualityMult);
      break;
    case 2.6:
    case 2.7:
    case 2.8:
    case 2.9:
    case 3.0:
      weapon[4] = Math.floor(weapon[4]+2.5*qualityMult);
      weapon[5] = Math.floor(weapon[5]+3.5*qualityMult);
      break;
  }
  weapon[6] = Math.floor((weapon[4] + weapon[5])/2/weapon[3]*100)/100;
  return weapon;
}
Game.upgradeArmourLevel = function(armour) {
  armour[1]++;
  for(var x = 0; x < armour[4].length; x++) {
    armour[4][x][1]++;
  }
  for(var y = 0; y < armour[5].length; y++) {
    armour[5][y][1]++;
  }
  return armour;
}
Game.buyWeaponLevelUpgrade = function() {
  var upgradeCost = Math.floor(200 * Math.pow(1.15,Game.p_Weapon[1]));
  upgradeCost = Math.floor(upgradeCost*(10+(Game.p_Weapon[7]-Game.QUALITY_NORMAL))/10);
  if(Game.p_Currency >= upgradeCost) {
    Game.p_Currency -= upgradeCost;
    Game.upgradeWeaponLevel(Game.p_Weapon);
    Game.toastNotification("Weapon level upgraded.");
    Game.drawActivePanel();
  }
  else { Game.toastNotification("Not enough seeds..."); }
}
Game.buyArmourLevelUpgrade = function() {
  var upgradeCost = Math.floor(200 * Math.pow(1.15,Game.p_Armour[1]));
  upgradeCost = Math.floor(upgradeCost*(10+(Game.p_Armour[2]-Game.QUALITY_NORMAL))/10);
  if(Game.p_Currency >= upgradeCost) {
    Game.p_Currency -= upgradeCost;
    Game.upgradeArmourLevel(Game.p_Armour);
    Game.toastNotification("Armour level upgraded.");
    Game.drawActivePanel();
  }
  else { Game.toastNotification("Not enough seeds..."); }
}
Game.upgradeWeaponQuality = function(weapon) {
  
}
Game.buyWeaponQualityUpgrade = function() {
  
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
Game.fast_melee_debuffs = [[Game.DEBUFF_MULTI, "Frenzy", 3, 70],
                           [Game.DEBUFF_DOT, "Wound Poison", 5, 0],
                           [Game.DEBUFF_MC, "Domination", 1, 0]];
Game.mid_melee_special = ["Edge of Depravity|I think it's just misunderstood...",
                          "Storm's Herald|Whatever you do, don't hold it above your head.",
                          "Flametongue|Good for those long cold nights in camp."];
Game.mid_melee_debuffs = [[Game.DEBUFF_SHRED, "Ruthlessness", 5, 0],
                          [Game.DEBUFF_PARAHAX, "Static Shock", 5, 25],
                          [Game.DEBUFF_DRAIN, "Cauterize", 5, 0]];
Game.slow_melee_special = ["Planetary Edge|Rare, if only because planets are usually spherical.",
                           "Death Sentence|Bears a passing resemblance to Death's own scythe.",
                           "The Ambassador|Diplomacy? I do not think it means what you think it means."];
Game.slow_melee_debuffs = [[Game.DEBUFF_SLOW, "Hamstring", 5, 20],
                           [Game.DEBUFF_DOOM, "Impending Doom", 3, 5],
                           [Game.DEBUFF_SHRED, "Ruthlessness", 5, 0]];
Game.fast_range_special = ["Ace of Spades|Who throws a card? I mean, come on, really?",
                           "Tomahawk|Serving native tribes for centuries.",
                           "Throat Piercers|Also perfect for piercing other parts."];
Game.fast_range_debuffs = [[Game.DEBUFF_DOT, "Paper Cut", 5, 0],
                           [Game.DEBUFF_SLOW, "Cripple", 5, 25],
                           [Game.DEBUFF_SHRED, "Piercing Throw", 5, 0]];
Game.mid_range_special = ["Death From Above|Or below, or far away, depending on where you stand.",
                          "Tidebreaker's Harpoon|They might want it back at some point.",
                          "Starshatter Recurve|Has been known to shoot rainbows on occasion."];
Game.mid_range_debuffs = [[Game.DEBUFF_DOOM, "Impending Doom", 3, 5],
                          [Game.DEBUFF_DRAIN, "Bloodthirst", 5, 0],
                          [Game.DEBUFF_MULTI, "Multishot", 3, 70]];
Game.slow_range_special = ["The Stakeholder|Raising the stakes, one corpse at a time.",
                           "Artemis Bow|Comes with a free built in harp, no strings attached.",
                           "Parting Shot|This isn't going to end well for at least one of us..."];
Game.slow_range_debuffs = [[Game.DEBUFF_PARAHAX, "Unbalanced", 5, 20],
                           [Game.DEBUFF_MC, "Charm", 1, 0],
                           [Game.DEBUFF_SHRED, "Ruthlessness", 5, 0]];
Game.fast_magic_special = ["Thundercaller|When used in battle, it chants the name 'Thor' repeatedly.",
                           "Cosmic Fury|Dr. Tyson would like a word with you...",
                           "Spark-Touched Fetish|Rubber gloves are strongly recommended."];
Game.fast_magic_debuffs = [[Game.DEBUFF_PARAHAX, "Static Shock", 5, 20],
                           [Game.DEBUFF_MULTI, "Frenzy", 3, 65],
                           [Game.DEBUFF_MC, "Confuse", 1, 0]];
Game.mid_magic_special = ["Flamecore Battlestaff|Still warm to the touch.",
                          "Gift of the Cosmos|Just keeps on giving.",
                          "Emberleaf War Tome|Not actually made of embers, which are terrible for books.",
                          "Encyclopedia of the Realm|Knowledge is power."];
Game.mid_magic_debuffs = [[Game.DEBUFF_DOT, "Slow Burn", 5, 0],
                          [Game.DEBUFF_SLOW, "Cripple", 5, 25],
                          [Game.DEBUFF_DRAIN, "Drain Life", 5, 0],
                          [Game.DEBUFF_SHRED, "Find Weakness", 5, 0]];
Game.slow_magic_special = ["The Tetranomicon|Written and bound by Tetradigm. Mostly incomprehensible.",
                           "Comet Chaser|Note: Comets are dangerous, DO NOT TRY THIS AT HOME.",
                           "Absolute Zero|Not quite. But it's close!"];
Game.slow_magic_debuffs = [[Game.DEBUFF_DOOM, "Flames of Tetradigm", 3, 5],
                           [Game.DEBUFF_DOT, "Slow Burn", 3, 65],
                           [Game.DEBUFF_PARAHAX, "Frozen", 5, 25]];
// Prefixes for non-great items
// Yes there's a blank one, it's so the item has no prefix :)
Game.qualityDescriptors = [["Worthless","Damaged","Inept","Decayed","Flawed","Decrepit"],
                           ["Average","Unremarkable","","Passable","Basic","Simple"],
                           ["Pristine","Enhanced","Powerful","Well-Maintained","Powerful","Superior"]];
Game.armour_generic = [];
Game.armour_special = [];
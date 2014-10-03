/*-----------------------------
inventory.js

Functions for inventory control
and management. Includes store.
-----------------------------*/
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
Game.takeWeapon = function() {
  if(Game.p_WeaponInventory.length < Game.MAX_INVENTORY) {
    Game.p_WeaponInventory.push(Game.last_Weapon.slice(0));
    Game.last_Weapon = [];
  }
  else { Game.toastNotification("Weapon inventory is full."); }
  Game.updateInv = true;
	Game.drawActivePanel();
}
Game.takeArmour = function() {
  if(Game.p_ArmourInventory.length < Game.MAX_INVENTORY) {
    Game.p_ArmourInventory.push(Game.last_Armour.slice(0));
    Game.last_Armour = [];
  }
  else { Game.toastNotification("Armour inventory is full."); }
  Game.updateInv = true;
	Game.drawActivePanel();
}
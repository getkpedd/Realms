/*---------------------------------
ui.js

Functions for drawing and updating
the various interface panels
----------------------------------*/
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
    case "forgeTable":
      Game.updateForgePanel(); break;
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
  var debuffFrame = document.getElementById("p_debuffHeader");
  if(Game.p_Debuff.length > 0) {
    debuffFrame.style.display = "";
    var debuffOut = document.getElementById("p_debuffOut");
    var debuffText = Game.p_Debuff[1] + "("+ Game.player_debuffTimer + "s)";
    debuffOut.innerHTML = debuffText;
  }
  else {
    debuffFrame.style.display = "none";
    var debuffOut = document.getElementById("p_debuffOut");
    debuffOut.innerHTML = "";
  }
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
  var BC = document.getElementById("bossChanceOut");
  BC.innerHTML = Game.bossChance + "%";
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
  // Debuff
  var debuffPanel = document.getElementById("weaponDebuff");
  if(Game.p_Weapon[9].length > 0) {
    debuffPanel.style.display = "";
    var debuffOut = document.getElementById("weaponDebuffOut");
    var debuffText = Game.p_Weapon[9][1] + " (" + Game.debuff_names[Game.p_Weapon[9][0]-Game.DEBUFF_SHRED] + ")<br />Lasts " + Game.p_Weapon[9][2] + " sec ";
    var debuffPower = 0;
    debuffOut.innerHTML = debuffText;
  }
  else { debuffPanel.style.display = "none"; }
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
  var abState = document.getElementById("autoBattleState");
  if(Game.autoBattle) { abState.innerHTML = "Active"; } else { abState.innerHTML = "Inactive"; }
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
		case Game.STATE_COMBAT:
			// Enemy stat panel
      e_panel.style.display = "";
      ooc_panel.style.display = "none";
      ic_panel.style.display = "";
      var e_name = document.getElementById("enemyName");
      e_name.innerHTML = Game.e_Name;
			var e_lv = document.getElementById("enemyLevel");
      e_lv.innerHTML = "Level: " + Game.e_Level;
			var e_hp = document.getElementById("enemyHealth");
      e_hp.innerHTML = "Health: " + Game.e_HP + " / " + Game.e_MaxHP;
      var e_mainStat = document.getElementById("enemyMainStat");
      e_mainStat.innerHTML = "Main Stat: " + Game.e_MainStat;
			var e_Debuff = document.getElementById("enemyDebuffOutput");
      if(Game.getEnemyDebuff()[0] > 0) {
        e_Debuff.innerHTML = "Debuff: " + Game.e_Debuff[1] + " (" + Game.enemy_debuffTimer + "s)";
      }
      else { e_Debuff.innerHTML = ""; }
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
      e_Weapon.innerHTML = "Weapon: <span class='q" + Game.e_Weapon[7] + "'>" + Game.e_Weapon[0].split("|")[0] + "</span> (" + ew_type + ")<br /> " + Game.e_Weapon[4] + " - " + Game.e_Weapon[5] + " Damage, " + Game.e_Weapon[3] + " speed, " + Game.e_Weapon[6] + " DPS";
      if(Game.e_Weapon[9].length > 0) {
        e_Weapon.innerHTML = e_Weapon.innerHTML + "<br />Applies <strong>" + Game.e_Weapon[9][1] + "</strong>";
      }
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
        e_Armour.innerHTML += "<span style='color:#33cc33;'>+" + thisStr[1] + " " + strType + " </span> ";
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
        e_Armour.innerHTML += "<span style='color:red;'>-" + thisVul[1] + " " + vulType + " </span> ";
      }
      var specButton = document.getElementById("specialButton");
      if(Game.p_specUsed) { specButton.innerHTML = "Burst Unavailable"; }
      else { specButton.innerHTML = "Burst Attack"; }
			break;
		case Game.STATE_REPAIR:
      e_panel.style.display = "none";
      ooc_panel.style.display = "none";
      ic_panel.style.display = "none";
			break;
	}
  // Some logic
  // 100 to 75%: Green
  // 75 to 50%: Yellow
  // 50 to 25%: Orange
  // 25 to 0%: Red
  var PHB = document.getElementById("playerHPBar");
  var PH_Percent = Game.p_HP/Game.p_MaxHP;
  if(PH_Percent < 0.25) { PHB.style.background = "#dd0000"; }
  else if(PH_Percent < 0.5) { PHB.style.background = "#dd7700"; }
  else if(PH_Percent < 0.75) { PHB.style.background = "#dddd00"; }
  else { PHB.style.background = "#33cc33"; }
  PHB.style.width = Math.floor(300*PH_Percent) + "px";
  var EHB = document.getElementById("enemyHPBar");
  if(Game.p_State !== Game.STATE_COMBAT) { EHB.style.display = "none"; }
  else {
    EHB.style.display = "";
    var EH_Percent = Game.e_HP/Game.e_MaxHP;
    if(EH_Percent < 0.25) { EHB.style.background = "#dd0000"; }
    else if(EH_Percent < 0.5) { EHB.style.background = "#dd7700"; }
    else if(EH_Percent < 0.75) { EHB.style.background = "#dddd00"; }
    else { EHB.style.background = "#33cc33"; }
    EHB.style.width = Math.floor(300*EH_Percent) + "px";
  }
}
Game.updatePowersPanel = function() {
  //The Powers Panel
  //This bit is important - we set in other functions whether the power panel needs rebuilding, because mass DOM changes cause lag problems when they're done once a second.
  if(Game.updatePowerPanel) {
    var app = document.getElementById("availablePowers");
    app.style.display = "";
    var powerPane = document.getElementById("available_area");
    powerPane.innerHTML = "";
    for(var x = 0; x < Game.powerList.length; x++) {
      var available = true;
      var viewable = true;
      var subsidiary = false;
      // Step 1: Determine if this is a subsidiary power.
      if(Game.powerList[x][2].toString().length > 3) {
        //powerList[x][2] is the constant for the power. If it's more than 3 chars long, it's a subsidiary!
        // Now... we check the level of the base power!
        subsidiary = true;
        var basePower = Math.floor(Game.powerList[x][2] / 10);
        if(Game.powerLevel(basePower) != Game.getPowerLevelCap(basePower)) {
          // The base power isn't capped, we can't buy this
          available = false;
          viewable = false;
        }
        //OK, finally we check the other subsidiary powers on the same level (if there's any)
        for(var z = 0; z < Game.powerList.length; z++) {
          // If they're related to this power...
          if(Math.floor(Game.powerList[z][2] / 10) == basePower) {
            // ...and they're not this power...
            if(Game.powerList[x][2] != Game.powerList[z][2]) {
              // ...and their level is above zero...
              if(Game.powerLevel(Game.powerList[z][2]) > 0) {
                // we can't buy this one!
                available = false;
              }
            }
          }
        }
      }
      // Step 2: Build the HTML element that represents a power purchasing panel.
      var pe = document.createElement("table");
      var topRow = document.createElement("tr");
      var bottomRow = document.createElement("tr");
      var nameColumn = document.createElement("td");
      var descriptionColumn = document.createElement("td");
      var upgradeColumn = document.createElement("td");
      upgradeColumn.setAttribute("rowspan","2");
      // Fade out unavailable items
      if(!available || (Game.p_PP === 0 && Game.powerLevel(Game.powerList[x][2]) === 0)) { pe.setAttribute("style","text-align:left;vertical-align:middle;border:1px solid #440000;margin-bottom:2px;border-collapse:separate;opacity:0.4;"); }
      else { pe.setAttribute("style","text-align:left;vertical-align:middle;border:1px solid #440000;border-collapse:separate;margin-bottom:2px;"); }
      nameColumn.innerHTML = (subsidiary ? "&nbsp;&nbsp;&nbsp;&nbsp;" : "") + "<strong style='font-size:14px;'>" + Game.powerList[x][0] + " (" + Game.powerLevel(Game.powerList[x][2]) + "/" +  Game.getPowerLevelCap(Game.powerList[x][2]) + ")</strong>";
      descriptionColumn.innerHTML = (subsidiary ? "&nbsp;&nbsp;&nbsp;&nbsp;" : "") + Game.powerList[x][1];
      if(available && Game.p_PP > 0 && Game.powerLevel(Game.powerList[x][2]) < Game.getPowerLevelCap(Game.powerList[x][2])) {
        upgradeColumn.innerHTML = "<span style='float:right;' class='bigButton' onclick='Game.buyPower(" + Game.powerList[x][2] + ");'>Upgrade</span>";
      }
      if(viewable) {
        topRow.appendChild(nameColumn);
        topRow.appendChild(upgradeColumn);
        bottomRow.appendChild(descriptionColumn);
        pe.appendChild(topRow);
        pe.appendChild(bottomRow);
        powerPane.appendChild(pe);
      }
    }
    Game.updatePowerPanel = false;
  }
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
      if(Game.p_WeaponInventory[x][9].length > 0) {
        var debuffStr = document.createTextNode("Applies the " + Game.p_WeaponInventory[x][9][1] + " debuff for " + Game.p_WeaponInventory[x][9][2] + "sec.");
        infopane.appendChild(document.createElement("br"));
        infopane.appendChild(debuffStr);
      }

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
Game.updateForgePanel = function() {
  var wlName = document.getElementById("weaponLevelUpgradeName");
  if(Game.p_Weapon[7] >= Game.QUALITY_GREAT) {
    wlName.innerHTML = Game.p_Weapon[0].split("|")[0];
  } else {
    wlName.innerHTML = Game.p_Weapon[0];
  }
  wlName.className = "q" + Game.p_Weapon[7];
  var wlUPCost = document.getElementById("weaponLevelUpgradeCost");
  var upgradeCost = Math.floor(175 * Math.pow(1.12,Game.p_Weapon[1]) * (1-0.02*Game.powerLevel(Game.BOOST_PRICES)));
  upgradeCost = Math.floor(upgradeCost*(10+(Game.p_Weapon[7]-Game.QUALITY_NORMAL))/10);
  wlUPCost.innerHTML = upgradeCost;
  var alName = document.getElementById("armourLevelUpgradeName");
  if(Game.p_Armour[2] >= Game.QUALITY_GREAT) {
    alName.innerHTML = Game.p_Armour[0].split("|")[0];
  } else {
    alName.innerHTML = Game.p_Armour[0];
  }
  alName.className = "q" + Game.p_Armour[2];
  var alUPCost = document.getElementById("armourLevelUpgradeCost");
  upgradeCost = Math.floor(175 * Math.pow(1.12,Game.p_Armour[1]) * (1-0.02*Game.powerLevel(Game.BOOST_PRICES)));
  upgradeCost = Math.floor(upgradeCost*(10+(Game.p_Armour[2]-Game.QUALITY_NORMAL))/10);
  alUPCost.innerHTML = upgradeCost;
 var wepQualityRow = document.getElementById("weaponQualityUpRow");
  if(Game.p_Weapon[7] == Game.QUALITY_AMAZING) { wepQualityRow.style.display = "none"; }
  else {
    var wqName = document.getElementById("weaponQualityUpgradeName");
    if(Game.p_Weapon[7] >= Game.QUALITY_GREAT) {
      wqName.innerHTML = Game.p_Weapon[0].split("|")[0];
    } else {
      wqName.innerHTML = Game.p_Weapon[0];
    }
    wqName.className = "q" + Game.p_Weapon[7];
    wepQualityRow.style.display = "";
    var wQualityCost = document.getElementById("weaponQualityUpgradeCost");
    var scrapCost = Math.pow(4,(Game.p_Weapon[7]-Game.QUALITY_POOR));
    wQualityCost.innerHTML = scrapCost;
  }
  var armQualityRow = document.getElementById("armourQualityUpRow");
  if(Game.p_Armour[2] == Game.QUALITY_AMAZING) { armQualityRow.style.display = "none"; }
  else {
    var aqName = document.getElementById("armourQualityUpgradeName");
    if(Game.p_Armour[2] >= Game.QUALITY_GREAT) {
      aqName.innerHTML = Game.p_Armour[0].split("|")[0];
    } else {
      aqName.innerHTML = Game.p_Armour[0];
    }
    aqName.className = "q" + Game.p_Armour[2];
    armQualityRow.style.display = "";
    var wQualityCost = document.getElementById("armourQualityUpgradeCost");
    var scrapCost = Math.pow(4,(Game.p_Armour[2]-Game.QUALITY_POOR));
    wQualityCost.innerHTML = scrapCost;
  }
}
Game.combatLog = function(combatant, message) {
	var d = document.createElement("div");
	d.setAttribute("class",combatant);
	var x = document.createElement("span");
  var ct = new Date();
  x.innerHTML = message;
  //x.innerHTML = "<span style='font-weight:bold;'>[" + Game.padLeft(ct.getHours(),2) + ":" + Game.padLeft(ct.getMinutes(),2) + ":" + Game.padLeft(ct.getSeconds(),2) + "]</span> " + message;
	d.appendChild(x);
	var logBox = document.getElementById("logBody");
	logBox.appendChild(d);
}
Game.showPanel = function(panelID) {
	var panelList = document.getElementsByTagName("table");
	for(var x = 0; x < panelList.length; x++) {
		if(panelList[x].id == panelID) {
			panelList[x].style.display = "";
      var tabHeader = document.getElementById(panelList[x].id.slice(0,-2));
      tabHeader.style.backgroundColor = "#991010";
      tabHeader.style.fontWeight = "bold";
		}
		else if(panelList[x].id.match(/(\w+)Table/g) !== null) {
			panelList[x].style.display = "none";
      var tabHeader = document.getElementById(panelList[x].id.slice(0,-2));
      tabHeader.style.backgroundColor = "";
      tabHeader.style.fontWeight = "";
		}
	}
  Game.activePanel = panelID;
  Game.drawActivePanel();
}
Game.toastNotification = function(message) {
  if(Game.toastTimer !== null) { window.clearTimeout(Game.toastTimer); }
  var toastFrame = document.getElementById("saveToast");
  var toast = document.getElementById("toastContent");
  toast.innerHTML = message;
  toastFrame.style.display = "";
  Game.toastTimer = window.setTimeout(function() { 	var saveToast = document.getElementById("saveToast"); saveToast.style.display = "none"; },3000);
}
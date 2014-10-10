/*--------------------------
combat.js

Functions relating to combat
and damage calculation.
--------------------------*/

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
				playerDMG += Math.floor(Game.p_Int*Game.WEAPON_BASE_MULT*Game.p_Weapon[3]/3.0);
				if(Game.hasPower(Game.BOOST_MAGICDMG)) { playerDMG = Math.floor(playerDMG*1.2); }
        for(var a = 0; a < Game.e_Armour[4].length; a++) {
          if(Game.e_Armour[4][a][0] == Game.ARMOUR_STR_MAGIC) { playerDMG = Math.max(playerDMG-Game.e_Armour[4][a][1],0); }
        }
        for(var b = 0; b < Game.e_Armour[5].length; b++) {
          if(Game.e_Armour[5][b][0] == Game.ARMOUR_VULN_MAGIC) { playerDMG += Game.e_Armour[5][b][1]; }
        }
				break;
			case Game.WEAPON_RANGE:
				playerDMG += Math.floor(Game.p_Dex*Game.WEAPON_BASE_MULT*Game.p_Weapon[3]/3.0);
				if(Game.hasPower(Game.BOOST_RANGEDMG)) { playerDMG = Math.floor(playerDMG*1.2); }
        for(var c = 0; c < Game.e_Armour[4].length; c++) {
          if(Game.e_Armour[4][c][0] == Game.ARMOUR_STR_RANGE) { playerDMG = Math.max(playerDMG-Game.e_Armour[4][c][1],0); }
        }
        for(var d = 0; d < Game.e_Armour[5].length; d++) {
          if(Game.e_Armour[5][d][0] == Game.ARMOUR_VULN_RANGE) { playerDMG += Game.e_Armour[5][d][1]; }
        }
				break;
			case Game.WEAPON_MELEE:
				playerDMG += Math.floor(Game.p_Str*Game.WEAPON_BASE_MULT*Game.p_Weapon[3]/3.0);
				if(Game.hasPower(Game.BOOST_MELEEDMG)) { playerDMG = Math.floor(playerDMG*1.2); }
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
        Game.combatLog("player"," - <strong>Proper Care</strong> prevented weapon decay.");
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
			var selfHeal = Math.floor(playerDMG * (Game.e_DebuffStacks / 10));
			Game.p_HP = Math.min(Game.p_HP + selfHeal, Game.p_MaxHP);
			Game.combatLog("player"," - Healed <strong>" + selfHeal + "</strong> from Blood Siphon.");
		}
		// Debuff effect for magic
		if(Game.p_Weapon[2] == Game.WEAPON_MAGIC && Game.e_DebuffStacks > 0) {
      var bonusDMG = Math.floor(playerDMG * (Game.e_DebuffStacks / 10));
			Game.e_HP = Math.max(Game.e_HP - bonusDMG, 0);
			Game.combatLog("player"," - Dealt <strong>" + bonusDMG + "</strong> damage from Residual Burn.");
		}
		var debuffApplyChance = 2;
		if(Game.hasPower(Game.BOOST_WSPEC)) { debuffApplyChance++; }
		if(Game.RNG(1,10) <= debuffApplyChance) {
			Game.e_DebuffStacks++;
			switch(Game.p_Weapon[2]) {
				case Game.WEAPON_MAGIC:
					Game.combatLog("player","   - The enemy suffers from <strong>Residual Burn.</strong>");
					break;
				case Game.WEAPON_RANGE:
					Game.combatLog("player","   - The enemy suffers from <strong>Infected Wound.</strong>");
					break;
				case Game.WEAPON_MELEE:
					Game.combatLog("player","   - The enemy suffers from <strong>Blood Siphon.</strong>");
					break;
			}
		}
		if(Game.e_HP > 0) {
			var timerLength = 1000*Game.p_Weapon[3];
			if(Game.hasPower(Game.BOOST_ASPD)) { timerLength = Math.floor(timerLength*0.8); }
			if(Game.hasPower(Game.BOOST_DOUBLE) && Game.RNG(1,5) == 1 && !Game.flurryActive) {
        Game.flurryActive = true;
				Game.combatLog("player"," - <strong>Flurry</strong> activated for an additional strike!");
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
				enemyDMG += Math.floor(Game.e_Int*Game.WEAPON_BASE_MULT*Game.e_Weapon[3]/3.0);
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
				enemyDMG += Math.floor(Game.e_Dex*Game.WEAPON_BASE_MULT*Game.e_Weapon[3]/3.0);
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
				enemyDMG += Math.floor(Game.e_Str*Game.WEAPON_BASE_MULT*Game.e_Weapon[3]/3.0);
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
      var damageDown = 0;
			if(Game.p_Weapon[2] == Game.WEAPON_RANGE && Game.e_DebuffStacks > 0) {
				damageDown = Math.floor(enemyDMG * (Game.e_DebuffStacks/10));
				enemyDMG = Math.max(enemyDMG - damageDown,0);
			}
      if(Game.hasPower(Game.BOOST_CONSERVE) && Game.RNG(1,5) == 1) {
        Game.combatLog("player"," - <strong>Proper Care</strong> prevented armour decay.");
      }
      else { Game.p_Armour[3]--; }
			Game.p_HP = Math.max(Game.p_HP-enemyDMG,0);
			Game.combatLog("enemy","The enemy hits you with their <span class='q" + Game.e_Weapon[7] + "'>" + Game.e_Weapon[0].split("|")[0] + "</span> for <strong>" + enemyDMG + "</strong> damage.");
      if(damageDown > 0) { Game.combatLog("enemy"," - Infected Wound prevented <strong>" + damageDown + "</strong> damage."); }
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
    Game.drawActivePanel();
  }
}
Game.fleeCombat = function() {
	window.clearTimeout(Game.combat_playerInterval);
	window.clearTimeout(Game.combat_enemyInterval);
	Game.p_State = Game.STATE_IDLE;
	Game.combatLog("info","You fled from the battle.");
	Game.drawActivePanel();
}
Game.endCombat = function() {
	window.clearTimeout(Game.combat_playerInterval);
	window.clearTimeout(Game.combat_enemyInterval);
	Game.p_State = Game.STATE_IDLE;
	if(Game.p_specUsed && Game.p_Weapon[2] == Game.WEAPON_MAGIC) { Game.combatLog("player","<strong>Wild Magic</strong> ended."); }
	if(Game.p_HP > 0) {
		// Player won, give xp and maybe, just maybe, a level.
		Game.combatLog("info","You won!");
    if(Game.p_WeaponInventory.length < Game.MAX_INVENTORY) {
      Game.p_WeaponInventory.push(Game.e_Weapon.slice());
      Game.combatLog("info","<span class='q" + Game.e_Weapon[7] + "'>" + Game.e_Weapon[0].split("|")[0] + "</span> added to your inventory.")
    } else {
      Game.last_Weapon = Game.e_Weapon.slice();
      Game.combatLog("info","<span class='q" + Game.e_Weapon[7] + "'>" + Game.e_Weapon[0].split("|")[0] + "</span> could not be taken due to full inventory.")
    }
    if(Game.p_ArmourInventory.length < Game.MAX_INVENTORY) {
      Game.p_ArmourInventory.push(Game.e_Armour.slice());
      Game.combatLog("info","<span class='q" + Game.e_Armour[2] + "'>" + Game.e_Armour[0].split("|")[0] + "</span> added to your inventory.");
    } else {
      Game.last_Armour = Game.e_Armour.slice();
      Game.combatLog("info","<span class='q" + Game.e_Armour[2] + "'>" + Game.e_Armour[0].split("|")[0] + "</span> could not be taken due to full inventory.");
    }
    Game.updateInv = true;
		var xpToAdd = Math.floor(Game.XP_BASE+(Game.RNG(Game.XP_RANGEMIN*Game.e_Level,Game.XP_RANGEMAX*Game.e_Level)));
    var currencyToAdd = xpToAdd;
		if(Game.hasPower(Game.BOOST_XP)) { xpToAdd = Math.floor(xpToAdd*1.2); }
    if(Game.e_isBoss) { xpToAdd *= 2; }
		Game.combatLog("info","You gained <strong>" + xpToAdd + "</strong> experience.");
		if(Game.hasPower(Game.BOOST_CURRENCY)) { currencyToAdd = Math.floor(currencyToAdd*1.2); }
    if(Game.e_isBoss) { currencyToAdd *= 2; }
		Game.combatLog("info","You gained <strong>" + currencyToAdd + "</strong> seeds.");
		Game.p_EXP += xpToAdd;
    Game.p_Currency += currencyToAdd;
		if(Game.p_EXP >= Game.p_NextEXP) {
			Game.levelUp();
		}
	}
	else {
		// Enemy won, dock XP
		Game.combatLog("info","You lost...");
		var xpDrop = Math.floor(Game.p_EXP/4);
		Game.combatLog("info","You lose <strong>" + xpDrop + "</strong> experience...");
		Game.p_EXP -= xpDrop;
		Game.p_HP = Game.p_MaxHP;
	}
	Game.p_autoSaved = false;
	Game.drawActivePanel();
}
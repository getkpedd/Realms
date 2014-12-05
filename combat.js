/*--------------------------
combat.js

Functions relating to combat
and damage calculation.
--------------------------*/

Game.startCombat = function() {
	if(Game.p_State == Game.STATE_IDLE) {
    Game.p_Adrenaline = 0;
		if(Game.p_Level >= 5 && Game.RNG(1,100) <= Game.bossChance) {
			Game.makeBoss(Game.p_Level);
      Game.bossChance = 0;
		}
		else {
			Game.makeEnemy(Game.p_Level);
		}
		Game.p_State = Game.STATE_COMBAT;
		if(Game.RNG(1,10) <= 5+Game.powerLevel(Game.BOOST_FIRST)) {
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
	Game.drawActivePanel();
}
Game.playerCombatTick = function() {
	if(Game.p_State == Game.STATE_COMBAT) {
    var playerDMG = Game.RNG(Game.p_Weapon[4],Game.p_Weapon[5]);
    playerDMG = Math.floor(playerDMG*(1+(0.02*Game.powerLevel(Game.BOOST_DAMAGE))));
    if(Game.getPlayerDebuff()[0] == Game.DEBUFF_DISARM) { playerDMG = Math.floor(playerDMG/2); }
		switch(Game.p_Weapon[2]) {
			case Game.WEAPON_MAGIC:
				playerDMG += Math.floor(Game.p_Int*Game.WEAPON_BASE_MULT*Game.p_Weapon[3]/3.0);
        if(Game.getEnemyDebuff()[0] != Game.DEBUFF_SHRED) {
          for(var a = 0; a < Game.e_Armour[4].length; a++) {
            if(Game.e_Armour[4][a][0] == Game.ARMOUR_STR_MAGIC) { playerDMG = Math.max(playerDMG-Game.e_Armour[4][a][1],0); }
          }
        }
        for(var b = 0; b < Game.e_Armour[5].length; b++) {
          if(Game.e_Armour[5][b][0] == Game.ARMOUR_VULN_MAGIC) { playerDMG += Game.e_Armour[5][b][1]; }
        }
				break;
			case Game.WEAPON_RANGE:
				playerDMG += Math.floor(Game.p_Dex*Game.WEAPON_BASE_MULT*Game.p_Weapon[3]/3.0);
          if(Game.getEnemyDebuff()[0] != Game.DEBUFF_SHRED) {
            for(var c = 0; c < Game.e_Armour[4].length; c++) {
              if(Game.e_Armour[4][c][0] == Game.ARMOUR_STR_RANGE) { playerDMG = Math.max(playerDMG-Game.e_Armour[4][c][1],0); }
            }
           }
        for(var d = 0; d < Game.e_Armour[5].length; d++) {
          if(Game.e_Armour[5][d][0] == Game.ARMOUR_VULN_RANGE) { playerDMG += Game.e_Armour[5][d][1]; }
        }
				break;
			case Game.WEAPON_MELEE:
				playerDMG += Math.floor(Game.p_Str*Game.WEAPON_BASE_MULT*Game.p_Weapon[3]/3.0);
          if(Game.getEnemyDebuff()[0] != Game.DEBUFF_SHRED) {
            for(var e = 0; e < Game.e_Armour[4].length; e++) {
              if(Game.e_Armour[4][e][0] == Game.ARMOUR_STR_MELEE) { playerDMG = Math.max(playerDMG-Game.e_Armour[4][e][1],0); }
            }
          }
        for(var f = 0; f < Game.e_Armour[5].length; f++) {
          if(Game.e_Armour[5][f][0] == Game.ARMOUR_VULN_MELEE) { playerDMG += Game.e_Armour[5][f][1]; }
        }
				break;
		}
    if(Game.flurryActive) {
      var flurryDMG = 0.5+(0.04*Game.powerLevel(Game.BOOST_DBLPOWER));
      playerDMG = Math.floor(playerDMG*flurryDMG);
    }
    if(Game.p_Adrenaline > 0) {
      playerDMG = Math.floor(playerDMG*(1+(0.05*Game.powerLevel(Game.BOOST_ENRAGE))));
      Game.p_Adrenaline--;
      if(Game.p_Adrenaline === 0) { Game.combatLog("player", "The <strong>Adrenaline Rush</strong> fades..."); }
    }
    var critChance = 3*Game.powerLevel(Game.BOOST_CRIT);
    if(Game.RNG(1,100) <= critChance) {
      var critBoost = 1.5+(0.1*Game.powerLevel(Game.BOOST_CRITDMG));
      playerDMG = Math.floor(playerDMG*critBoost);
      Game.combatLog("player", " - <span class='q222'>Critical hit!</span>");
      if(Game.powerLevel(Game.BOOST_ENRAGE) > 0 && Game.p_Adrenaline === 0) {
        Game.combatLog("player", " - You feel an <strong>Adrenaline Rush</strong>!");
        Game.p_Adrenaline = 3;
      }
    }
		// Decay handling
    if(Game.p_Weapon[8]>0) {
      if(Game.RNG(1,100) <= 2*(Game.powerLevel(Game.BOOST_CARE))) {
        Game.combatLog("player"," - <strong>Proper Care</strong> prevented weapon decay.");
      }
      else {
        Game.p_Weapon[8]--;
        if(Game.p_Weapon[8] === 0) {
          Game.combatLog("player", " - Your <span class='q" + Game.p_Weapon[7] + "'>" + Game.p_Weapon[0].split("|")[0] + "</span> has broken!");
        }
      }
    }
    else {
      var preservedDamage = 0.25+(0.1*Game.powerLevel(Game.BOOST_BROKEN));
      playerDMG = Math.floor(playerDMG*preservedDamage);
    }
    playerDMG = Math.max(playerDMG,0);
    if(Game.getPlayerDebuff()[0] == Game.DEBUFF_PARAHAX && Game.RNG(1,100) <= Game.p_Debuff[3]) {
      Game.combatLog("player","<strong>" + Game.p_Debuff[1] + "</strong> prevented you from attacking.");
    }
    else if(Game.e_HP / Game.e_MaxHP <= 0.25 && Game.RNG(1,20) < Game.powerLevel(Game.BOOST_EXECUTE)) {
      Game.e_HP = 0;
      Game.combatLog("player","<strong>Execute</strong> activated, instantly dealing a killing blow.");
      Game.endCombat();
      return;
    }
    else if(Game.getPlayerDebuff()[0] == Game.DEBUFF_MC) {
      playerDMG = Game.RNG(Game.p_Weapon[4],Game.p_Weapon[5]);
      var mainStat = 0;
      switch(Game.p_Weapon[2]) {
        case Game.WEAPON_MELEE:
          mainStat = Game.p_Str; break;
        case Game.WEAPON_RANGE:
          mainStat = Game.p_Dex; break;
        case Game.WEAPON_MAGIC:
          mainStat = Game.p_Int; break;
      }
      playerDMG += Math.floor(mainStat*Game.WEAPON_BASE_MULT*Game.p_Weapon[3]/3.0);
      Game.p_HP = Math.max(Game.p_HP-playerDMG,0);
      Game.combatLog("enemy","<strong>" + Game.p_Debuff[1] + "</strong> causes you to attack yourself for <strong>" + playerDMG + "</strong> damage.");
      Game.player_debuffTimer = 0;
    }
    else {
      if(Game.wildSwing) { playerDMG = Math.floor(playerDMG/2); }
      Game.e_HP = Math.max(Game.e_HP-playerDMG,0);
      if(Game.getPlayerDebuff()[0] == Game.DEBUFF_DISARM) {
        Game.combatLog("player","You hit " + (Game.e_ProperName ? "" : "the ") + Game.e_Name + " with your fists for <strong>" + playerDMG + "</strong> damage.");
      }
      else {
      Game.combatLog("player","You hit " + (Game.e_ProperName ? "" : "the ") + Game.e_Name + " with your <span class='q" + Game.p_Weapon[7] + "'>" + Game.p_Weapon[0].split("|")[0] + "</span> for <strong>" + playerDMG + "</strong> damage.");
      }
    }
    if(Game.RNG(1,100) <= Game.powerLevel(Game.BOOST_PICKPOCKET)) {
      Game.p_Currency += Game.p_Level;
      Game.combatLog("player","<strong>Five-Finger Discount</strong> allowed you to steal " + Game.p_Level + " seeds.");
    }
    if(Game.getEnemyDebuff()[0] == Game.DEBUFF_MULTI) {
      // DOUBLE STRIKEU
      var secondDmg = Math.floor(playerDMG*Game.e_Debuff[3]/100);
      Game.e_HP = Math.max(Game.e_HP-secondDmg,0);
      Game.combatLog("player"," - <strong>" + Game.e_Debuff[1] + "</strong> allows you to strike again for <strong>" + secondDmg + "</strong> damage.");
    }
    Game.drawActivePanel();
		var debuffApplyChance = 1;
		if(Game.p_Weapon[9].length > 0 && Game.e_Debuff.length === 0 && Game.getEnemyDebuff()[0] !== Game.DEBUFF_DISARM && Game.RNG(1,10) <= debuffApplyChance) {
      Game.e_Debuff = Game.p_Weapon[9].slice();
		  Game.combatLog("player"," - " + (Game.e_ProperName ? "" : "The ") + Game.e_Name + " suffers from <strong>" + Game.p_Weapon[9][1] + "</strong>.");
      Game.enemy_debuffTimer = Game.p_Weapon[9][2];
      Game.enemy_debuffInterval = window.setInterval(Game.enemyDebuffTicker,1000);
		}
		if(Game.e_HP > 0 && Game.p_HP > 0) {
			var timerLength = 1000*Game.p_Weapon[3]*(1-(0.02*Game.powerLevel(Game.BOOST_SPEED)));
			if(Game.RNG(1,100) <= Game.powerLevel(Game.BOOST_DOUBLE) && !Game.flurryActive) {
        Game.flurryActive = true;
				Game.combatLog("player"," - <strong>Flurry</strong> activated for an additional strike!");
				Game.playerCombatTick();
			}
			else {
        Game.flurryActive = false;
				window.clearTimeout(Game.combat_playerInterval);
        var mult = Game.getPlayerDebuff()[0] == Game.DEBUFF_SLOW ? (1 + Game.p_Debuff[3]/100) : 1;
        Game.combat_playerInterval = window.setTimeout(Game.playerCombatTick,timerLength*mult);
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
    enemyDMG = Math.floor(enemyDMG*(1-0.02*Game.powerLevel(Game.BOOST_DEFENCE)));
    if(Game.getEnemyDebuff()[0] == Game.DEBUFF_DISARM) { enemyDMG = Math.floor(enemyDMG/2); }
		switch(Game.e_Weapon[2]) {
			case Game.WEAPON_MAGIC:
				enemyDMG += Math.floor(Game.e_MainStat*Game.WEAPON_BASE_MULT*Game.e_Weapon[3]/3.0);
        if(Game.getPlayerDebuff()[0] !== Game.DEBUFF_SHRED && Game.p_Armour[3] > 0) {
          for(var a = 0; a < Game.p_Armour[4].length; a++) {
            if(Game.p_Armour[4][a][0] == Game.ARMOUR_STR_MAGIC) { enemyDMG = Math.max(enemyDMG-Game.p_Armour[4][a][1],0); }
          }
        }
        for(var b = 0; b < Game.p_Armour[5].length; b++) {
            if(Game.p_Armour[5][b][0] == Game.ARMOUR_VULN_MAGIC) { enemyDMG += Game.p_Armour[5][b][1]; }
        }
				break;
			case Game.WEAPON_RANGE:
				enemyDMG += Math.floor(Game.e_MainStat*Game.WEAPON_BASE_MULT*Game.e_Weapon[3]/3.0);
        if(Game.getPlayerDebuff()[0] !== Game.DEBUFF_SHRED && Game.p_Armour[3] > 0) {
          for(var c = 0; c < Game.p_Armour[4].length; c++) {
            if(Game.p_Armour[4][c][0] == Game.ARMOUR_STR_RANGE) { enemyDMG = Math.max(enemyDMG-Game.p_Armour[4][c][1],0); }
          }
        }
          for(var d = 0; d < Game.p_Armour[5].length; d++) {
            if(Game.p_Armour[5][d][0] == Game.ARMOUR_VULN_RANGE) { enemyDMG += Game.p_Armour[5][d][1]; }
          }
				break;
			case Game.WEAPON_MELEE:
				enemyDMG += Math.floor(Game.e_MainStat*Game.WEAPON_BASE_MULT*Game.e_Weapon[3]/3.0);
        if(Game.getPlayerDebuff()[0] !== Game.DEBUFF_SHRED && Game.p_Armour[3] > 0) {
          for(var e = 0; e < Game.p_Armour[4].length; e++) {
            if(Game.p_Armour[4][e][0] == Game.ARMOUR_STR_MELEE) { enemyDMG = Math.max(enemyDMG-Game.p_Armour[4][e][1],0); }
          }
        }
          for(var f = 0; f < Game.p_Armour[5].length; f++) {
            if(Game.p_Armour[5][f][0] == Game.ARMOUR_VULN_MELEE) { enemyDMG += Game.p_Armour[5][f][1]; }
          }
				break;
		}
		if(Game.RNG(1,100) <= Game.powerLevel(Game.BOOST_SHIELD)) {
      if(Game.powerLevel(Game.BOOST_REFLECT) == 1) {
        Game.e_HP = Math.max(Game.e_HP - enemyDMG, 0);
        Game.combatLog("player","Your <strong>Reflective Shield</strong> dealt <strong>" + enemyDMG + "</strong> damage.");
      }
      else if(Game.powerLevel(Game.BOOST_ABSORB) == 1) {
        Game.p_HP = Math.min(Game.p_HP + enemyDMG, Game.p_MaxHP);
        Game.combatLog("player","Your <strong>Absorption Shield</strong> healed you for  <strong>" + enemyDMG + "</strong>.");
      }
      else {
        Game.combatLog("player","Your <strong>Divine Shield</strong> absorbed the damage.");
      }
		}
		else {
      if(Game.RNG(1,50) <= Game.powerLevel(Game.BOOST_CARE)) {
        Game.combatLog("player"," - <strong>Proper Care</strong> prevented armour decay.");
      }
      else { Game.p_Armour[3] = Math.max(Game.p_Armour[3]-1,0); }
      enemyDMG = Math.max(enemyDMG,0);
      if(Game.getEnemyDebuff()[0] == Game.DEBUFF_PARAHAX && Game.RNG(1,100) <= Game.e_Debuff[3]) {
        Game.combatLog("enemy","<strong>" + Game.e_Debuff[1] + "</strong> prevented " + (Game.e_ProperName ? "" : "the ") + Game.e_Name + " from attacking.");
      }
      else if(Game.getEnemyDebuff()[0] == Game.DEBUFF_MC) {
        enemyDMG = Game.RNG(Game.e_Weapon[4],Game.e_Weapon[5]);
        enemyDMG += Math.floor(Game.e_MainStat*Game.WEAPON_BASE_MULT*Game.e_Weapon[3]/3.0);
        Game.e_HP = Math.max(Game.e_HP-enemyDMG,0);
        Game.combatLog("player","<strong>" + Game.e_Debuff[1] + "</strong> causes " + (Game.e_ProperName ? "" : "the ") + Game.e_Name + " to attack itself for <strong>" + enemyDMG + "</strong> damage.");
        Game.enemy_debuffTimer = 0;
      }
      else {
        if(Game.powerLevel(Game.BOOST_LASTSTAND) > 0 && (Game.p_HP / Game.p_MaxHP <= 0.3)) {
          enemyDMG = Math.floor(enemyDMG * (1-(0.1*Game.powerLevel(Game.BOOST_LASTSTAND))));
        }
			  Game.p_HP = Math.max(Game.p_HP-enemyDMG,0);
        if(Game.getEnemyDebuff()[0] == Game.DEBUFF_DISARM) {
        	Game.combatLog("enemy",(Game.e_ProperName ? "" : "The ") + Game.e_Name + " hits you with their fists for <strong>" + enemyDMG + "</strong> damage.");
        }
        else {
			    Game.combatLog("enemy",(Game.e_ProperName ? "" : "The ") + Game.e_Name + " hits you with their <span class='q" + Game.e_Weapon[7] + "'>" + Game.e_Weapon[0].split("|")[0] + "</span> for <strong>" + enemyDMG + "</strong> damage.");
        }
        if(Game.RNG(1,50) <= Game.powerLevel(Game.BOOST_VENGEANCE)) {
          var vengDMG = Math.floor(enemyDMG/2);
          Game.e_HP = Math.max(Game.e_HP-vengDMG,0);
          Game.combatLog("player","Your <strong>Vengeance</strong> effect dealt " + vengDMG + " damage.");
        }
      }
		}
    if(Game.getPlayerDebuff()[0] == Game.DEBUFF_MULTI) {
      // DOUBLE STRIKEU
      var secondDmg = Math.floor(enemyDMG*Game.p_Debuff[3]/100);
      Game.p_HP = Math.max(Game.p_HP-secondDmg,0);
      Game.combatLog("enemy"," - <strong>" + Game.p_Debuff[1] + "</strong> allows " + (Game.e_ProperName ? "" : "the ") + Game.e_Name + " to strike again for <strong>" + secondDmg + "</strong> damage.");
    }
    Game.drawActivePanel();
		if(Game.e_Weapon[9].length > 0 && Game.p_Debuff.length === 0 && Game.getEnemyDebuff()[0] !== Game.DEBUFF_DISARM && Game.RNG(1,10) <= 2) {
      Game.p_Debuff = Game.e_Weapon[9].slice();
		  Game.combatLog("enemy"," - You suffer from <strong>" + Game.e_Weapon[9][1] + "</strong>.");
      Game.player_debuffTimer = Game.e_Weapon[9][2];
      Game.player_debuffInterval = window.setInterval(Game.playerDebuffTicker,1000);
		}
		if(Game.p_HP > 0 && Game.e_HP > 0) {
      var mult = Game.getEnemyDebuff()[0] == Game.DEBUFF_SLOW ? (1 + Game.e_Debuff[3]/100) : 1;
      Game.combat_enemyInterval = window.setTimeout(Game.enemyCombatTick,1000*Game.e_Weapon[3]*mult);
    }
		else { Game.endCombat(); }
	}
	else { window.clearTimeout(Game.combat_enemyInterval); }
	Game.drawActivePanel();
}
Game.burstAttack = function() {
  if(Game.e_HP > 0 && !Game.p_specUsed) {
	  Game.p_specUsed = true;
    if(Game.powerLevel(Game.BOOST_BURST) > 0) {
      Game.combatLog("player","<strong>Wild Swings</strong> activated.");
      Game.wildSwing = true;
      for(var x = Game.powerLevel(Game.BOOST_BURST); x >= 0; x--) {
        Game.playerCombatTick();
      }
      Game.combatLog("player","<strong>Wild Swings</strong> ended.");
      Game.wildSwing = false;
    }
    else {
      Game.combatLog("player","<strong>Burst Attack</strong> activated.");
      Game.playerCombatTick();
    }
    window.setTimeout(function() { Game.p_specUsed = false; },10000);
    Game.drawActivePanel();
  }
}
Game.fleeCombat = function() {
	window.clearTimeout(Game.combat_playerInterval);
	window.clearTimeout(Game.combat_enemyInterval);
  if(Game.enemy_debuffInterval !== null) {
    window.clearInterval(Game.enemy_debuffInterval);
    Game.enemy_debuffInterval = null;
    Game.enemy_debuffTimer = 0; }
  if(Game.player_debuffInterval !== null) {
    window.clearInterval(Game.player_debuffInterval);
    Game.player_debuffInterval = null;
    Game.player_debuffTimer = 0; }
  Game.p_Debuff = [];
  Game.e_Debuff = [];
  Game.p_Adrenaline = 0;
  if(Game.p_Level >= 5) { Game.bossChance++; }
	Game.p_State = Game.STATE_IDLE;
  Game.p_specUsed = false;
	Game.combatLog("info","You fled from the battle.");
	Game.drawActivePanel();
}
Game.endCombat = function() {
	window.clearTimeout(Game.combat_playerInterval);
	window.clearTimeout(Game.combat_enemyInterval);
  if(Game.enemy_debuffInterval !== null) {
    window.clearInterval(Game.enemy_debuffInterval);
    Game.enemy_debuffInterval = null;
    Game.enemy_debuffTimer = 0; }
  if(Game.player_debuffInterval !== null) {
    window.clearInterval(Game.player_debuffInterval);
    Game.player_debuffInterval = null;
    Game.player_debuffTimer = 0; }
  Game.p_Debuff = [];
  Game.e_Debuff = [];
	Game.p_State = Game.STATE_IDLE;
  Game.p_specUsed = false;
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
		xpToAdd = Math.floor(xpToAdd*(1+(0.05*Game.powerLevel(Game.BOOST_XP))));
    if(Game.e_isBoss) { xpToAdd *= 2; }
		Game.combatLog("info","You gained <strong>" + xpToAdd + "</strong> experience.");
		currencyToAdd = Math.floor(currencyToAdd*(1+(0.05*Game.powerLevel(Game.BOOST_CURRENCY))));
    if(Game.e_isBoss) { currencyToAdd *= 2; }
    if(Game.RNG(1,50) <= Game.powerLevel(Game.BOOST_EXTRA)) {
      currencyToAdd *= 3;
      Game.combatLog("info","<strong>Cavity Search</strong> tripled seed gain!");
    }
    if(Game.RNG(1,50) <= Game.powerLevel(Game.BOOST_SCRAP)) {
      Game.p_Scrap++;
      Game.combatLog("info","<strong>Thorough Looting</strong> yielded an extra piece of scrap!");
    }
		Game.combatLog("info","You gained <strong>" + currencyToAdd + "</strong> seeds.");
		Game.p_EXP += xpToAdd;
    Game.p_Currency += currencyToAdd;
		if(Game.p_EXP >= Game.p_NextEXP) {
			Game.levelUp();
		}
    if(Game.RNG(1,50) <= Game.powerLevel(Game.BOOST_REPAIR)) {
      Game.p_Weapon[8] = 50 + (5*(Game.p_Weapon[1]-1));
      Game.p_Armour[3] = 50 + (5*(Game.p_Armour[1]-1));
      Game.combatLog("info","<strong>High Maintenance</strong> fully repaired your equipment.");
    }
    if(Game.RNG(1,50) <= Game.powerLevel(Game.BOOST_FULLHEAL)) {
      Game.p_HP = Game.p_MaxHP;
      Game.combatLog("info","<strong>Will To Live</strong> restored you to full health.");
    }
	}
	else {
		// Enemy won, dock XP
		Game.combatLog("info","You lost...");
		var xpDrop = Math.floor(Game.p_EXP/4);
		Game.combatLog("info","You lose <strong>" + xpDrop + "</strong> experience...");
		Game.p_EXP -= xpDrop;
	}
  if(Game.p_Level >= 5) { Game.bossChance++; }
	Game.p_autoSaved = false;
	Game.drawActivePanel();
}
Game.getPlayerDebuff = function() {
  if(Game.p_Debuff.length > 0) { return Game.p_Debuff; }
  else return [0,"",0,0];
}
Game.getEnemyDebuff = function() {
  if(Game.e_Debuff.length > 0) { return Game.e_Debuff; }
  else return [0,"",0,0];
}
Game.playerDebuffTicker = function() {
  if(Game.player_debuffTimer <= 0) {
    Game.combatLog("enemy"," - The effect of <strong>" + Game.p_Debuff[1] + "</strong> faded.");
    Game.p_Debuff = [];
    window.clearInterval(Game.player_debuffInterval);
  } else {
    Game.player_debuffTimer -= 1;
    switch(Game.p_Debuff[0]) {
      case Game.DEBUFF_DOT:
        // Do the deeps
        var dotDMG = Math.floor(Game.RNG(Game.e_Weapon[4],Game.e_Weapon[5]) * Game.p_Debuff[3] / 100);
        Game.p_HP = Math.max(Game.p_HP - dotDMG, 0);
        Game.combatLog("enemy"," - <strong>" + Game.p_Debuff[1] + "</strong> dealt an additional <strong>" + dotDMG + "</strong> damage.");
        break;
      case Game.DEBUFF_DRAIN:
        // HEALZ YO
        var selfHeal = Math.floor(Game.RNG(Game.e_Weapon[4],Game.e_Weapon[5]) * Game.p_Debuff[3] / 100);
        Game.e_HP = Math.min(Game.e_HP + selfHeal, Game.e_MaxHP);
        Game.combatLog("enemy"," - <strong>" + Game.p_Debuff[1] + "</strong> healed the enemy for <strong>" + selfHeal + "</strong>.");
        break;
      case Game.DEBUFF_DOOM:
        // YOU GONNA DIE
        if(Game.player_debuffTimer === 0) {
          if(Game.RNG(1,50) <= Game.p_Debuff[3]) {
            Game.combatLog("enemy"," - <strong>" + Game.p_Debuff[1] + "</strong> activates, instantly killing you.");
            Game.p_HP = 0;
          }
          else {
            Game.combatLog("enemy"," - <strong>" + Game.p_Debuff[1] + "</strong> had no effect...");
          }
        }
        break;
    }
    if(Game.p_HP <= 0) { Game.endCombat(); }
  }
  Game.drawActivePanel();
}
Game.enemyDebuffTicker = function() {
  if(Game.enemy_debuffTimer <= 0) {
    Game.combatLog("player"," - The effect of <strong>" + Game.e_Debuff[1] + "</strong> faded.");
    Game.e_Debuff = [];
    window.clearInterval(Game.enemy_debuffInterval);
  } else {
    Game.enemy_debuffTimer -= 1;
    switch(Game.e_Debuff[0]) {
      case Game.DEBUFF_DOT:
        // Do the deeps
        var dotDMG = Math.floor(Game.RNG(Game.p_Weapon[4],Game.p_Weapon[5]) * Game.e_Debuff[3] / 100);
        Game.e_HP = Math.max(Game.e_HP - dotDMG, 0);
        Game.combatLog("player"," - <strong>" + Game.e_Debuff[1] + "</strong> dealt an additional <strong>" + dotDMG + "</strong> damage.");
        break;
      case Game.DEBUFF_DRAIN:
        // HEALZ YO
        var selfHeal = Math.floor(Game.RNG(Game.p_Weapon[4],Game.p_Weapon[5]) * Game.e_Debuff[3] / 100);
        Game.p_HP = Math.min(Game.p_HP + selfHeal, Game.p_MaxHP);
        Game.combatLog("player"," - <strong>" + Game.e_Debuff[1] + "</strong> healed you for <strong>" + selfHeal + "</strong>.");
        break;
      case Game.DEBUFF_DOOM:
        // YOU GONNA DIE
        if(Game.enemy_debuffTimer === 0) {
          if(Game.RNG(1,50) <= Game.e_Debuff[3]) {
            Game.combatLog("player"," - <strong>" + Game.e_Debuff[1] + "</strong> activates, instantly killing the target.");
            Game.e_HP = 0;
          }
          else {
            Game.combatLog("player"," - <strong>" + Game.e_Debuff[1] + "</strong> had no effect...");
          }
        }
        break;
    }
    if(Game.e_HP <= 0) { Game.endCombat(); }
  }
  Game.drawActivePanel();
}
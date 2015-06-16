/*--------------------------
player.js

Functions relating to player
actions and advancement.
--------------------------*/

Game.levelUp = function() {
	Game.combatLog("info","Level up! You are now level <strong>" + (Game.p_Level+1) + "</strong>.");
	var hpUp = Game.p_Con + Game.p_Con + Game.RNG(0,Game.p_Level);
	Game.p_MaxHP += hpUp
	Game.combatLog("info","You gained <strong>" + hpUp + "</strong> HP.");
  var strUp = 1 + (Game.p_Weapon[2] == Game.WEAPON_MELEE ? 1 : 0);
	Game.p_Str += strUp;
	Game.combatLog("info","You gained <strong>" + strUp + "</strong> Strength.");
	var dexUp = 1 + (Game.p_Weapon[2] == Game.WEAPON_RANGE ? 1 : 0);
	Game.p_Dex += dexUp;
	Game.combatLog("info","You gained <strong>" + dexUp + "</strong> Dexterity.");
	var intUp = 1 + (Game.p_Weapon[2] == Game.WEAPON_MAGIC ? 1 : 0);
	Game.p_Int += intUp;
	Game.combatLog("info","You gained <strong>" + intUp + "</strong> Intelligence.");
	var conUp = Game.RNG(1,4) == 1 ? 2 : 1;
	Game.p_Con += conUp;
	Game.combatLog("info","You gained <strong>" + conUp + "</strong> Constitution.");
  var statUpChance = Game.powerLevel(Game.BOOST_STATUP);
  if(statUpChance > 0 && Game.RNG(1,100) <= 3*statUpChance) {
    var chosenStat = Game.RNG(1,4);
    switch(chosenStat) {
      case 1:
        Game.p_Str++; Game.combatLog("info","<strong>Patience and Discipline</strong> granted an additional 1 Strength.");
        break;
      case 2:
        Game.p_Dex++; Game.combatLog("info","<strong>Patience and Discipline</strong> granted an additional 1 Dexterity.");
        break;
      case 3:
        Game.p_Int++; Game.combatLog("info","<strong>Patience and Discipline</strong> granted an additional 1 Intelligence.");
        break;
      case 4:
        Game.p_Con++; Game.combatLog("info","<strong>Patience and Discipline</strong> granted an additional 1 Constitution.");
        break;
    }
  }
	Game.p_Level++;
	Game.p_EXP = 0;
	Game.p_NextEXP = Math.floor(100*Math.pow(Game.XP_MULT,Game.p_Level-1));
	Game.p_SkillPoints++;
	Game.combatLog("info","You gained a skill point.");
  var SPChance = Game.powerLevel(Game.BOOST_MORESP);
	if(Game.RNG(1,100) <= SPChance) {
		Game.p_SkillPoints++;
		Game.combatLog("info","Your <strong>Lucky Star</strong> power granted another skill point!");
	}
  Game.p_PP += 1;
	Game.combatLog("info","You gained a Power point.");
  if(Game.RNG(1,100) <= Game.powerLevel(Game.BOOST_MOREPP)) {
    Game.p_PP++;
    Game.combatLog("info","<strong>Luck of the Draw</strong> granted an additional Power Point.");
  }
  Game.updatePowerPanel = true;
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
	Game.p_PP = level;
	Game.p_Weapon = Game.makeWeapon(level);
  Game.p_Armour = Game.makeArmour(level);
}
Game.getEnemyName = function(isBoss) {
  if(isBoss) { Game.e_ProperName = true; return Game.enemy_boss[Game.RNG(0,Game.enemy_boss.length-1)]; }
  else {
    if(Game.RNG(1,10) == 1) { Game.e_ProperName = true; return Game.enemy_special[Game.RNG(0,Game.enemy_special.length-1)]; }
    else { Game.e_ProperName = false; return Game.enemy_generic[Game.RNG(0,Game.enemy_generic.length-1)]; }
  }
}
Game.makeEnemy = function(level) {
  Game.e_Name = Game.getEnemyName(false);
	Game.e_MaxHP = Game.RNG(80,100) + Game.RNG(25*(level-1),30*(level-1));
	Game.e_MainStat = Game.RNG(5,7) + Game.RNG(level-1,2*(level-1));
  var scalingFactor = 0.8+((level-1)*0.04);
  Game.e_MaxHP = Math.floor(Game.e_MaxHP*scalingFactor);
  Game.e_MainStat = Math.floor(Game.e_MainStat*scalingFactor);
  Game.e_HP = Game.e_MaxHP;
  Game.e_Debuff = [];
	Game.e_Level = level;
	Game.e_DebuffStacks = 0;
	Game.e_isBoss = false;
  Game.e_Weapon = [];
  do {
    Game.e_Weapon = Game.makeWeapon(Game.RNG(1,5) == 1 ? level+1 : level);
  } while(Game.e_Weapon[7] >= Game.QUALITY_GREAT);
  Game.e_Armour = [];
  do {
  Game.e_Armour = Game.makeArmour(Game.RNG(1,5) == 1 ? level+1 : level);
  } while(Game.e_Armour[2] >= Game.QUALITY_GREAT);
}
Game.makeBoss = function(level) {
  Game.e_Name = Game.getEnemyName(true);
	Game.e_MaxHP = Game.RNG(80,100) + Game.RNG(25*(level-1),30*(level-1));
	Game.e_MainStat = Game.RNG(5,7) + Game.RNG(Math.floor((level-1)*1.5),2*(level-1));
  var scalingFactor = 0.9+((level-1)*0.05);
  Game.e_MaxHP = Math.floor(Game.e_MaxHP*scalingFactor);
  Game.e_MainStat = Math.floor(Game.e_MainStat*scalingFactor);
  Game.e_HP = Game.e_MaxHP;
  Game.e_Debuff = [];
	Game.e_Level = level;
	Game.e_DebuffStacks = 0;
	Game.e_isBoss = true;
  Game.e_Weapon = [];
  do {
    Game.e_Weapon = Game.makeWeapon(Game.RNG(1,5) == 1 ? level+1 : level);
  } while(Game.e_Weapon[7] < Game.QUALITY_GREAT);
  Game.e_Armour = [];
  do {
  Game.e_Armour = Game.makeArmour(Game.RNG(1,5) == 1 ? level+1 : level);
  } while(Game.e_Armour[2] < Game.QUALITY_GREAT);
}
Game.toggleAutoBattle = function() {
  Game.autoBattle = !Game.autoBattle;
  if(Game.autoBattle) {
    Game.toastNotification("Auto Battle activated.");
    Game.autoBattleTicker = window.setInterval(Game.autoBattleFunc, 200);
  }
  else {
    Game.toastNotification("Auto Battle deactivated.");
    window.clearInterval(Game.autoBattleTicker);
    Game.autoBattleTicker = null;
  }
}
Game.powerLevel = function(power) {
  for(var x = 0; x < Game.p_Powers.length; x++) {
    if(Game.p_Powers[x][0] == power) { return Game.p_Powers[x][1]; }
  }
  return 0;
}
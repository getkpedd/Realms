/*--------------------------
player.js

Functions relating to player
actions and advancement.
--------------------------*/

Game.levelUp = function() {
	Game.combatLog("info","Level up! You are now level <strong>" + (Game.p_Level+1) + "</strong>.");
	var hpUp = Game.p_Con + Game.p_Con + Game.RNG(0,Game.p_Level);
	Game.p_MaxHP += hpUp
	Game.p_HP = Game.p_MaxHP;
	Game.combatLog("info","You gained <strong>" + hpUp + "</strong> HP.")
  var strUp = 1 + (Game.p_Weapon[2] == Game.WEAPON_MELEE ? 1 : 0);
	Game.p_Str += strUp;
	Game.combatLog("info","You gained <strong>" + strUp + "</strong> Strength.")
	var dexUp = 1 + (Game.p_Weapon[2] == Game.WEAPON_RANGE ? 1 : 0);
	Game.p_Dex += dexUp;
	Game.combatLog("info","You gained <strong>" + dexUp + "</strong> Dexterity.")
	var intUp = 1 + (Game.p_Weapon[2] == Game.WEAPON_MAGIC ? 1 : 0);
	Game.p_Int += intUp;
	Game.combatLog("info","You gained <strong>" + intUp + "</strong> Intelligence.")
	var conUp = Game.RNG(1,4) == 1 ? 2 : 1;
	Game.p_Con += conUp;
	Game.combatLog("info","You gained <strong>" + conUp + "</strong> Constitution.")
	Game.p_Level++;
	Game.p_EXP = 0;
	Game.p_NextEXP = Math.floor(100*Math.pow(Game.XP_MULT,Game.p_Level-1));
	Game.p_SkillPoints++;
	Game.combatLog("info","You gained a skill point.");
	if(Game.hasPower(Game.BOOST_SKILLPT) && Game.RNG(1,5) == 1) {
		Game.p_SkillPoints++;
		Game.combatLog("info","Your <strong>Fortuitous Growth</strong> granted another skill point!");
	}
	if(Game.p_Level % 5 === 0) {
		Game.p_PP += 1;
		Game.combatLog("info","You gained a Power point.");
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
	Game.e_MainStat = Game.RNG(5,7) + Game.RNG(level-1,2*(level-1));
  var scalingFactor = Math.min(2.0,0.8+((level-1)*0.04));
  Game.e_MaxHP = Math.floor(Game.e_MaxHP*scalingFactor);
  Game.e_MainStat = Math.floor(Game.e_MainStat*scalingFactor);
  Game.e_HP = Game.e_MaxHP;
  Game.e_Debuff = [];
	Game.e_Level = level;
	Game.e_DebuffStacks = 0;
	Game.e_isBoss = false;
	Game.e_Weapon = Game.makeWeapon(Game.RNG(1,5) == 1 ? level+1 : level);
  Game.e_Armour = Game.makeArmour(Game.RNG(1,5) == 1 ? level+1 : level);
}
Game.makeBoss = function(level) {
	Game.e_MaxHP = Game.RNG(80,100) + Game.RNG(25*(level-1),30*(level-1));
	Game.e_MainStat = Game.RNG(5,7) + Game.RNG(Math.floor((level-1)*1.5),2*(level-1));
  var scalingFactor = Math.min(3.0,1+((level-1)*0.05));
  Game.e_MaxHP = Math.floor(Game.e_MaxHP*scalingFactor);
  Game.e_MainStat = Math.floor(Game.e_MainStat*scalingFactor);
  Game.e_HP = Game.e_MaxHP;
  Game.e_Debuff = [];
	Game.e_Level = level;
	Game.e_DebuffStacks = 0;
	Game.e_isBoss = true;
	Game.e_Weapon = Game.makeWeapon(level+3);
  Game.e_Armour = Game.makeArmour(level+3);
}
Game.hasPower = function(power) {
	return Game.p_Powers.indexOf(power) >= 0;
}
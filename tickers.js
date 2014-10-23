/*--------------------------------------
tickers.js

Holds functions relating to idle tickers
(specifically regen and repair)
--------------------------------------*/

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
Game.autoBattleFunc = function() {
  if(Game.p_State == Game.STATE_IDLE) {
    if(Game.p_WeaponInventory.length >= Game.MAX_INVENTORY) { Game.sellAllWeapons(); }
    if(Game.p_ArmourInventory.length >= Game.MAX_INVENTORY) { Game.sellAllArmour(); }
    var repairThreshold = document.getElementById("ab_lowdura").options[ab_lowdura.selectedIndex].value;
    if(Game.p_Weapon[8] < repairThreshold) { Game.startWeaponRepair(); }
    if(Game.p_Armour[3] < repairThreshold) { Game.startArmourRepair(); }
    if(Game.p_HP == Game.p_MaxHP) { Game.startCombat(); }
  }
  if(Game.p_State == Game.STATE_COMBAT) {
    var fleePercent = document.getElementById("ab_fleePercent").options[ab_fleePercent.selectedIndex].value;
    var healthThreshold = Math.floor(Game.p_MaxHP / 100 * fleePercent);
    if(Game.p_HP <= healthThreshold && Game.p_HP > 0) { Game.fleeCombat(); }
  }
}
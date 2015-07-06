/*--------------------------------------
tickers.js

Holds functions relating to idle tickers
(specifically regen and repair)
--------------------------------------*/

Game.startWeaponRepair = function() {
  var maxRepair = 50 + (5*(Game.p_Weapon[1]-1));
	if(Game.p_Weapon[8] >= maxRepair) {
		Game.toastNotification("Repair not required.")
	}
	else {
		Game.p_State = Game.STATE_REPAIR;
		Game.p_RepairValue = 1 + Math.floor(Game.p_Weapon[1]/5);
    Game.toastNotification("Repairing weapon...");
    Game.p_RepairInterval = window.setInterval(Game.repairWeaponTick,1000-(20*Game.powerLevel(Game.BOOST_REGEN)))
	}
  Game.updateInv = true;
	Game.drawActivePanel();
}
Game.startArmourRepair = function() {
  var maxRepair = 50 + (5*(Game.p_Armour[1]-1));
	if(Game.p_Armour[3] >= maxRepair) {
		Game.toastNotification("Repair not required.")
	}
	else {
		Game.p_State = Game.STATE_REPAIR;
		Game.p_RepairValue = 1 + Math.floor(Game.p_Armour[1]/5);
    Game.toastNotification("Repairing armour...");
		Game.p_RepairInterval = window.setInterval(Game.repairArmourTick,1000-(20*Game.powerLevel(Game.BOOST_REGEN)));
  }
  Game.updateInv = true;
	Game.drawActivePanel();
}
Game.repairWeaponTick = function() {
	if(Game.p_RepairValue === 0) {
		Game.p_Weapon[8] = 50 + 5*(Game.p_Weapon[1]-1);
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
  Game.p_IdleInterval = window.setTimeout(Game.idleHeal,1000-(20*Game.powerLevel(Game.BOOST_REGEN)));
	Game.drawActivePanel();
}
Game.autoBattleFunc = function() {
  if(Game.p_State == Game.STATE_IDLE) {
    if(Game.p_WeaponInventory.length >= Game.MAX_INVENTORY) {
      if(document.getElementById("ab_wepfull").options[ab_wepfull.selectedIndex].value == "SELL") {
        Game.sellAllWeapons();
      } else {
        Game.scrapAllWeapons();
      }
      if(Game.p_WeaponInventory.length >= Game.MAX_INVENTORY) { Game.toggleAutoBattle(); }
    }
    else if(Game.p_ArmourInventory.length >= Game.MAX_INVENTORY) {
      if(document.getElementById("ab_armfull").options[ab_armfull.selectedIndex].value == "SELL") {
        Game.sellAllArmour();
      } else {
        Game.scrapAllArmour();
      }
      if(Game.p_ArmourInventory.length >= Game.MAX_INVENTORY) { Game.toggleAutoBattle(); }
    }
    else {
    var repairThreshold = document.getElementById("ab_lowdura").options[ab_lowdura.selectedIndex].value;
    if(Game.p_Weapon[8] < repairThreshold) { Game.startWeaponRepair(); }
    else if(Game.p_Armour[3] < repairThreshold) { Game.startArmourRepair(); }
    else if(Game.p_HP == Game.p_MaxHP) { Game.startCombat(); }
    }
  }
  if(Game.p_State == Game.STATE_COMBAT) {
    var fleePercent = document.getElementById("ab_fleePercent").options[ab_fleePercent.selectedIndex].value;
    var healthThreshold = Math.floor(Game.p_MaxHP / 100 * fleePercent);
    if(Game.p_HP <= healthThreshold && Game.p_HP > 0) { Game.fleeCombat(); }
  }
}
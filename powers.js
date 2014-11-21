Game.buyPower = function(power) {
  if(Game.p_PP > 0) {
    var selectionLevel = Game.powerLevel(power);
    var canUpgrade = true;
    switch(power) {
      case Game.BOOST_ABSORB:
      case Game.BOOST_REFLECT:
        if(selectionLevel === 1) {
          Game.toastNotification("This power is at maximum level.");
          canUpgrade = false;
        }
        break;
      case Game.BOOST_SPEED:
      case Game.BOOST_REGEN:
      case Game.BOOST_XP:
      case Game.BOOST_SHIELD:
      case Game.BOOST_CARE:
      case Game.BOOST_CURRENCY:
      case Game.BOOST_MOREPP:
      case Game.BOOST_DOUBLE:
      case Game.BOOST_DAMAGE:
      case Game.BOOST_DEFENCE:
        if(selectionLevel === 10) {
          Game.toastNotification("This power is at maximum level.");
          canUpgrade = false;
        }
        break;
      default:
        if(selectionLevel === 5) {
          Game.toastNotification("This power is at maximum level.");
          canUpgrade = false;
        }
    }
    if(canUpgrade) {
      switch(power) {
        case Game.BOOST_BROKEN:
          if(Game.powerLevel(Game.BOOST_CARE) < 10) {
            Game.toastNotification("You need maximum level in Proper Care to upgrade this power.");
            canUpgrade = false;
          } else if(Game.powerLevel(Game.BOOST_REPAIR) > 0) {
            Game.toastNotification("This power cannot be used in conjunction with High Maintenance.");
            canUpgrade = false;
          }
          break;
        case Game.BOOST_REPAIR:
          if(Game.powerLevel(Game.BOOST_CARE) < 10) {
            Game.toastNotification("You need maximum level in Proper Care to upgrade this power.");
            canUpgrade = false;
          } else if(Game.powerLevel(Game.BOOST_BROKEN) > 0) {
            Game.toastNotification("This power cannot be used in conjunction with Hanging By A Thread.");
            canUpgrade = false;
          }
          break;
        case Game.BOOST_EXTRA:
          if(Game.powerLevel(Game.BOOST_CURRENCY) < 10) {
            Game.toastNotification("You need maximum level in Pickpocket to upgrade this power.");
            canUpgrade = false;
          } else if(Game.powerLevel(Game.BOOST_SCRAP) > 0) {
            Game.toastNotification("This power cannot be used in conjunction with Thorough Looting");
            canUpgrade = false;
          }
          break;
        case Game.BOOST_SCRAP:
          if(Game.powerLevel(Game.BOOST_CURRENCY) < 10) {
            Game.toastNotification("You need maximum level in Pickpocket to upgrade this power.");
            canUpgrade = false;
          } else if(Game.powerLevel(Game.BOOST_EXTRA) > 0) {
            Game.toastNotification("This power cannot be used in conjunction with Cavity Search");
            canUpgrade = false;
          }
          break;
        case Game.BOOST_CRITDMG:
          if(Game.powerLevel(Game.BOOST_CRIT) < 5) {
            Game.toastNotification("You need maximum level in Keen Eye to upgrade this power.");
            canUpgrade = false;
          } else if(Game.powerLevel(Game.BOOST_ENRAGE) > 0) {
            Game.toastNotification("This power cannot be used in conjunction with Adrenaline Rush");
            canUpgrade = false;
          }
          break;
        case Game.BOOST_ENRAGE:
          if(Game.powerLevel(Game.BOOST_CRIT) < 5) {
            Game.toastNotification("You need maximum level in Keen Eye to upgrade this power.");
            canUpgrade = false;
          } else if(Game.powerLevel(Game.BOOST_CRITDMG) > 0) {
            Game.toastNotification("This power cannot be used in conjunction with Keener Eye");
            canUpgrade = false;
          }
          break;
        case Game.BOOST_ABSORB:
          if(Game.powerLevel(Game.BOOST_SHIELD) < 5) {
            Game.toastNotification("You need maximum level in Divine Shield to upgrade this power.");
            canUpgrade = false;
          } else if(Game.powerLevel(Game.BOOST_REFLECT) > 0) {
            Game.toastNotification("This power cannot be used in conjunction with Reflective Shield");
            canUpgrade = false;
          }
          break;
        case Game.BOOST_REFLECT:
          if(Game.powerLevel(Game.BOOST_SHIELD) < 5) {
            Game.toastNotification("You need maximum level in Divine Shield to upgrade this power.");
            canUpgrade = false;
          } else if(Game.powerLevel(Game.BOOST_ABSORB) > 0) {
            Game.toastNotification("This power cannot be used in conjunction with Absorption Shield");
            canUpgrade = false;
          }
          break;
        case Game.BOOST_MORESP:
          if(Game.powerLevel(Game.BOOST_MOREPP) < 10) {
            Game.toastNotification("You need maximum level in Luck of the Draw to upgrade this power.");
            canUpgrade = false;
          }
          break;
        case Game.BOOST_STATUP:
          if(Game.powerLevel(Game.BOOST_XP) < 10) {
            Game.toastNotification("You need maximum level in Fast Learner to upgrade this power.");
            canUpgrade = false;
          }
          break;
        case Game.BOOST_DBLPOWER:
          if(Game.powerLevel(Game.BOOST_DOUBLE) < 10) {
            Game.toastNotification("You need maximum level in Flurry to upgrade this power.");
            canUpgrade = false;
          }
          break;
        case Game.BOOST_FULLHEAL:
          if(Game.powerLevel(Game.BOOST_REGEN) < 10) {
            Game.toastNotification("You need maximum level in Survival Instincts to upgrade this power.");
            canUpgrade = false;
          }
          break;
      }
    }
    if(canUpgrade) {
      if(selectionLevel === 0) {
        Game.p_Powers.push(new Array(power, 1));
      }
      else {
        for(var x = 0; x < Game.p_Powers.length; x++) {
          if(Game.p_Powers[x][0] === power) { Game.p_Powers[x][1]++; }
        }
      }
      Game.p_PP--;
      Game.updatePowerPanel = true;
    }
  }
  Game.drawActivePanel();
}
Game.getPowerLevelCap = function(power) {
  switch(power) {
    case Game.BOOST_CARE:
    case Game.BOOST_CURRENCY:
    case Game.BOOST_SHIELD:
    case Game.BOOST_MOREPP:
    case Game.BOOST_XP:
    case Game.BOOST_REGEN:
    case Game.BOOST_DOUBLE:
    case Game.BOOST_DAMAGE:
    case Game.BOOST_DEFENCE:
    case Game.BOOST_SPEED:
      return 10;
    case Game.BOOST_BROKEN:
    case Game.BOOST_REPAIR:
    case Game.BOOST_EXTRA:
    case Game.BOOST_CRIT:
    case Game.BOOST_SCRAP:
    case Game.BOOST_CRITDMG:
    case Game.BOOST_ENRAGE:
    case Game.BOOST_MORESP:
    case Game.BOOST_STATUP:
    case Game.BOOST_DBLPOWER:
    case Game.BOOST_FULLHEAL:
      return 5;
    case Game.BOOST_ABSORB:
    case Game.BOOST_REFLECT:
      return 1;
    default:
      return 0;
  }
}
Game.getPowerName = function(power) {
  switch(power) {
    case Game.BOOST_CARE: return "Proper Care";
    case Game.BOOST_BROKEN: return "Hanging By a Thread";
    case Game.BOOST_REPAIR: return "High Maintenance";
    case Game.BOOST_CURRENCY: return "Pickpocket";
    case Game.BOOST_EXTRA: return "Cavity Search";
    case Game.BOOST_SCRAP: return "Thorough Looting";
    case Game.BOOST_CRIT: return "Keen Eye";
    case Game.BOOST_CRITDMG: return "Keener Eye";
    case Game.BOOST_ENRAGE: return "Adrenaline Rush";
    case Game.BOOST_SHIELD: return "Divine Shield";
    case Game.BOOST_ABSORB: return "Absorption Shield";
    case Game.BOOST_REFLECT: return "Reflective Shield";
    case Game.BOOST_MOREPP: return "Luck of the Draw";
    case Game.BOOST_MORESP: return "Lucky Star";
    case Game.BOOST_XP: return "Fast Learner";
    case Game.BOOST_STATUP: return "Patience and Discipline";
    case Game.BOOST_DOUBLE: return "Flurry";
    case Game.BOOST_DBLPOWER: return "Empowered Flurry";
    case Game.BOOST_REGEN: return "Survival Instincts";
    case Game.BOOST_FULLHEAL: return "Will To Live";
    case Game.BOOST_DAMAGE: return "Deadly Force";
    case Game.BOOST_DEFENCE: return "Ancestral Fortitude";
    case Game.BOOST_SPEED: return "Nimble Fingers";
  }
}
Game.getPowerDesc = function(power) {
  switch(power) {
    case Game.BOOST_CARE: return "Grants a 2% chance per level to ignore armour/weapon decay in combat.";
    case Game.BOOST_BROKEN: return "Grants a 2% chance per level to fully repair weapon and armour after combat.";
    case Game.BOOST_REPAIR: return "Preserves an additional 10% per level of your weapon's effect when broken.";
    case Game.BOOST_CURRENCY: return "Grants an additional 5% gain per level in seeds from combat.";
    case Game.BOOST_EXTRA: return "Grants a 2% chance per level to triple seed gains from combat.";
    case Game.BOOST_SCRAP: return "Grants a 2% chance per level to salvage a piece of scrap from combat.";
    case Game.BOOST_CRIT: return "Grants a 3% chance per level to critically strike the target for 50% more damage.";
    case Game.BOOST_CRITDMG: return "Increases the critical strike damage bonus by 10% per level.";
    case Game.BOOST_ENRAGE: return "Increases damage dealt by 5% per level for 3 rounds after a critical strike.";
    case Game.BOOST_SHIELD: return "Grants a 1% chance per level to completely negate an enemy attack.";
    case Game.BOOST_ABSORB: return "Causes your Divine Shield effect to heal you for the damage you would have taken.";
    case Game.BOOST_REFLECT: return "Causes your Divine Shield effect to deal the damage you would have taken to the enemy.";
    case Game.BOOST_MOREPP: return "Grants a 1% chance per level to gain an additional Power Point after combat.";
    case Game.BOOST_MORESP: return "Grants a 1% chance per level to gain an additional Skill Point on level up.";
    case Game.BOOST_XP: return "Grants a 5% increase per level to experience gains.";
    case Game.BOOST_STATUP: return "Grants a 3% chance per level to gain an additional point in a random stat on level up.";
    case Game.BOOST_DOUBLE: return "Grants a 2% chance per level to strike a target again after an attack for 50% damage.";
    case Game.BOOST_DBLPOWER: return "Grants a 4% increase per level in the damage of Flurry's additional strike.";
    case Game.BOOST_REGEN: return "Grants a 2% per level increase in health regeneration and repair speeds.";
    case Game.BOOST_FULLHEAL: return "Grants a 2% chance per level to be fully healed after combat.";
    case Game.BOOST_DAMAGE: return "Grants a 2% per level increase to all damage dealt.";
    case Game.BOOST_DEFENCE: return "Grants a 2% per level reduction to all damage taken";
    case Game.BOOST_SPEED: return "Grants a 2% increase per level in attack speeds.";
  }
}
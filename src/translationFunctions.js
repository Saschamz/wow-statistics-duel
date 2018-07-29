export const getClass = (classId) => {
    let classObj = {
        className: null,
        classColor: null 
    };

    switch( +classId ) {

        case 1:
        classObj.className = 'Warrior';
        classObj.classColor = '#C79C6E';
        break;

        case 2:
        classObj.className = 'Paladin';
        classObj.classColor = '#F58CBA';
        break;

        case 3:
        classObj.className = 'Hunter'; //ravencrest/134/102774406-avatar.jpg
        classObj.classColor = '#ABD473';
        break;

        case 4:
        classObj.className = 'Rogue';
        classObj.classColor = '#FFF569';
        break;

        case 5:
        classObj.className = 'Priest';
        classObj.classColor = '#FFFFFF';
        break;

        case 6:
        classObj.className = 'Death Knight';
        classObj.classColor = '#C41F3B';
        break;
        
        case 7:
        classObj.className = 'Shaman';
        classObj.classColor = '#0070DE';
        break;

        case 8:
        classObj.className = 'Mage';
        classObj.classColor = '#40C7EB';
        break;

        case 9:
        classObj.className = 'Warlock';
        classObj.classColor = '#8787ED';
        break;

        case 10:
        classObj.className = 'Monk';
        classObj.classColor = '#00FF96';
        break;

        case 11:
        classObj.className = '#FF7D0A';
        classObj.classColor = 'purple';
        break;

        case 12:
        classObj.className = 'Demon Hunter';
        classObj.classColor = '#A330C9';
        break;

        default:
        break;
    }

    return classObj;
};

export const getRace = (raceId) => {
    let race;

    switch( +raceId ) {

        case 1:
        race = 'Human';
        break;

        case 2:
        race = 'Orc';
        break;

        case 3:
        race = 'Dwarf';
        break;

        case 4:
        race = 'Nightelf';
        break;

        case 5:
        race = 'Undead';
        break;

        case 6:
        race = 'Tauren';
        break;

        case 7:
        race = 'Gnome';
        break;

        case 8:
        race = 'Troll';
        break;
        
        case 10:
        race = 'Bloodelf';
        break;

        case 11:
        race = 'Draenei';
        break;

        default:
        race = 'Unknown';
        break;
    }

    return race;
};
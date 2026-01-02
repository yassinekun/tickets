// Map team names to their flag image paths in /public/flags
const flagMap = {
    // Group A
    'Morocco': '/flags/Morocco.webp',
    'Mali': '/flags/Mali.webp',
    'Zambia': '/flags/Zambia.webp',
    'Comoros': '/flags/Comoros.webp',

    // Group B
    'Egypt': '/flags/egypt.webp',
    'South Africa': '/flags/South Africa.webp',
    'Angola': '/flags/angola.webp',
    'Zimbabwe': '/flags/Zimbabwe.png',

    // Group C
    'Nigeria': '/flags/nigeria.webp',
    'Tunisia': '/flags/Tunisia.webp',
    'Uganda': '/flags/Uganda.webp',
    'Tanzania': '/flags/Tanzania.webp',

    // Group D
    'Senegal': '/flags/senegal.png',
    'DR Congo': '/flags/DR_Congo.webp',
    'Benin': '/flags/Benin.webp',
    'Botswana': '/flags/Botswana.webp',

    // Group E
    'Algeria': '/flags/Algeria.webp',
    'Burkina Faso': '/flags/Burkina_Faso.png',
    'Equatorial Guinea': '/flags/Equatorial_Guinea.webp',
    'Eq. Guinea': '/flags/Equatorial_Guinea.webp',
    'Sudan': '/flags/Sudan.webp',

    // Group F
    'Ivory Coast': '/flags/Côte_D\'Ivoire.png',
    'Côte d\'Ivoire': '/flags/Côte_D\'Ivoire.png',
    'Cameroon': '/flags/Cameroon.webp',
    'Gabon': '/flags/gabon.webp',
    'Mozambique': '/flags/Mozambique.png',

    // Language flags
    'France': '/flags/France.webp',
    'UK': '/flags/UK.webp',
};

/**
 * Get the flag image path for a given team/country name
 * @param {string} teamName - The name of the team/country
 * @returns {string|null} - The path to the flag image or null if not found
 */
export const getFlagPath = (teamName) => {
    if (!teamName) return null;

    // Try exact match first
    if (flagMap[teamName]) {
        return flagMap[teamName];
    }

    // Try case-insensitive match
    const lowerName = teamName.toLowerCase();
    for (const [key, value] of Object.entries(flagMap)) {
        if (key.toLowerCase() === lowerName) {
            return value;
        }
    }

    return null;
};

/**
 * Get a fallback display (initials) if no flag is found
 * @param {string} teamName - The name of the team
 * @returns {string} - Two-letter initials
 */
export const getTeamInitials = (teamName) => {
    if (!teamName) return '??';
    return teamName.substring(0, 2).toUpperCase();
};

export default flagMap;

const axios = require('axios');

/**
 * Fetches the entire game catalog from htmlgames.com official JSON feed.
 */
const fetchHtmlGamesCatalog = async () => {
    try {
        console.log('🔗 Fetching official JSON feed from htmlgames.com...');
        const response = await axios.get('https://www.htmlgames.com/rss/games.php?json');
        
        if (!response.data || !Array.isArray(response.data)) {
            throw new Error('Invalid feed format received from htmlgames.com');
        }

        console.log(`✅ Received ${response.data.length} games from catalog.`);

        return response.data.map(game => ({
            title: game.name,
            slug: generateSlug(game.name),
            description: game.description,
            thumbnail: game.thumb6 || game.thumb5 || game.thumb4, // Prefer 800x450 or 500x300
            playUrl: game.url,
            hasLiveUrl: true,
            category: game.category,
            verified: true,
            active: true,
            stars: Math.floor(Math.random() * (2000 - 500) + 500) // Give them a 'popular' feel
        }));
    } catch (error) {
        console.error('❌ Error fetching HTMLGames catalog:', error.message);
        return [];
    }
};

const generateSlug = (text) => {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           
        .replace(/[^\w\-]+/g, '')       
        .replace(/\-\-+/g, '-')         
        .replace(/^-+/, '')             
        .replace(/-+$/, '');            
};

module.exports = { fetchHtmlGamesCatalog };

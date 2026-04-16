const slugify = require('slugify');

const ALLOWED_LICENSES = [
  'MIT', 'Apache-2.0', 'GPL-2.0', 'GPL-3.0', 'BSD-2-Clause', 'BSD-3-Clause',
  'LGPL-2.1', 'LGPL-3.0', 'CC0-1.0', 'ISC', 'MPL-2.0',
  'GPL-2.0-only', 'GPL-3.0-only', 'LGPL-2.1-only', 'LGPL-3.0-only',
  'GPL-2.0-or-later', 'GPL-3.0-or-later'
];

const CATEGORY_RULES = [
  { keywords: ['shooter', 'fight', 'battle', 'war', 'gun', 'combat', 'weapon', 'fps'], category: 'Action' },
  { keywords: ['puzzle', 'match', 'tetris', 'block', 'logic', 'sudoku', 'brain', 'quiz'], category: 'Puzzle' },
  { keywords: ['rpg', 'quest', 'dungeon', 'adventure', 'fantasy', 'hero', 'roguelike', 'roguelite'], category: 'RPG' },
  { keywords: ['race', 'car', 'sport', 'drive', 'speed', 'racing', 'drift', 'vehicle'], category: 'Racing' },
  { keywords: ['strategy', 'tower', 'defense', 'rts', 'turn', 'tactics', 'td', 'tower-defense'], category: 'Strategy' },
  { keywords: ['retro', 'arcade', 'classic', 'pixel', '8bit', '8-bit', 'pixelart', 'pixel-art'], category: 'Arcade' },
  { keywords: ['multiplayer', 'mmo', 'socket', 'online', 'pvp', 'coop', 'co-op', 'realtime'], category: 'Multiplayer' },
  { keywords: ['board', 'card', 'chess', 'poker', 'dice', 'solitaire', 'mahjong', 'domino'], category: 'Board & Card' },
  { keywords: ['simulation', 'sandbox', 'build', 'city', 'tycoon', 'sim', 'farm', 'craft'], category: 'Simulation' },
  { keywords: ['platform', 'platformer', 'jump', 'run', 'side', 'runner', 'sidescroller', 'side-scroller'], category: 'Platformer' },
];

const ADULT_KEYWORDS = ['adult', 'nsfw', 'porn', 'xxx', 'erotic', 'hentai', 'nude', 'sexual'];

const NON_GAME_KEYWORDS = [
  'template', 'boilerplate', 'starter', 'engine', 'plugin', 'api', 'server', 
  'client', 'tutorial', 'course', 'library', 'lib', 'wrapper', 'effect', 
  'theme', 'framework', 'vfx', 'shader', 'asset', 'resource', 'typescript-template',
  'webpack-template', 'vite-template', 'example-project', 'coding-challenge'
];

function isNonGame(topics, description, name) {
  const searchText = [...(topics || []), (description || ''), (name || '')].join(' ').toLowerCase();
  
  // Explicitly allow if 'game' is in the title but exclude if it's a 'template' or 'engine'
  const isTemplate = NON_GAME_KEYWORDS.some(keyword => searchText.includes(keyword));
  
  // Stricter check: if title contains 'template' or 'boilerplate', it's a non-game
  const lowQualityTitle = name.toLowerCase().includes('template') || 
                           name.toLowerCase().includes('boilerplate') ||
                           name.toLowerCase().includes('starter');
                           
  return isTemplate || lowQualityTitle;
}

function categorizeGame(topics, description, name) {
  const searchText = [...(topics || []), (description || ''), (name || '')].join(' ').toLowerCase();
  
  for (const rule of CATEGORY_RULES) {
    for (const keyword of rule.keywords) {
      if (searchText.includes(keyword)) {
        return rule.category;
      }
    }
  }
  
  return 'Other';
}

function isAdultContent(topics, description, name) {
  const searchText = [...(topics || []), (description || ''), (name || '')].join(' ').toLowerCase();
  return ADULT_KEYWORDS.some(keyword => searchText.includes(keyword));
}

function formatTitle(name) {
  return name
    .replace(/[-_]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, c => c.toUpperCase())
    .trim();
}

function createSlug(name, owner) {
  const base = slugify(name, { lower: true, strict: true, trim: true });
  return base || slugify(`${owner}-${name}`, { lower: true, strict: true, trim: true });
}

async function fetchGamesFromGitHub(token) {
  const allRepos = [];
  const totalPages = 10; // GitHub API search caps at 1000 results (10 pages × 100)
  
  console.log('🔍 Fetching games from GitHub API...');

  for (let page = 1; page <= totalPages; page++) {
    try {
      const url = `https://api.github.com/search/repositories?q=topic:html5-game&sort=stars&order=desc&per_page=100&page=${page}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'PixelVault-GameFetcher'
        }
      });

      if (!response.ok) {
        if (response.status === 403) {
          console.log('⏳ Rate limited, waiting 60 seconds...');
          await new Promise(r => setTimeout(r, 60000));
          page--; // retry
          continue;
        }
        console.error(`Error page ${page}: ${response.status} ${response.statusText}`);
        break;
      }

      const data = await response.json();
      
      if (!data.items || data.items.length === 0) {
        console.log(`📄 No more results at page ${page}`);
        break;
      }

      allRepos.push(...data.items);
      console.log(`📄 Page ${page}: ${data.items.length} repos (total: ${allRepos.length}/${data.total_count})`);

      // Rate limit courtesy delay
      await new Promise(r => setTimeout(r, 2000));
    } catch (error) {
      console.error(`Error fetching page ${page}:`, error.message);
      break;
    }
  }

  console.log(`\n📦 Total repos fetched: ${allRepos.length}`);

  // Filter and transform
  const games = [];
  const seenIds = new Set();
  const seenSlugs = new Set();

  for (const repo of allRepos) {
    // Skip duplicates
    if (seenIds.has(repo.id)) continue;
    seenIds.add(repo.id);

    // Filter: must have allowed license
    if (!repo.license || !repo.license.spdx_id) continue;
    if (!ALLOWED_LICENSES.includes(repo.license.spdx_id)) continue;

    // Filter: no adult content
    if (isAdultContent(repo.topics, repo.description, repo.name)) continue;

    // Filter: no non-games (templates, engines, etc.)
    if (isNonGame(repo.topics, repo.description, repo.name)) continue;

    // Create slug
    let slug = createSlug(repo.name, repo.owner.login);
    if (seenSlugs.has(slug)) {
      slug = `${slug}-${repo.owner.login}`;
    }
    if (seenSlugs.has(slug)) {
      slug = `${slug}-${repo.id}`;
    }
    seenSlugs.add(slug);

    // Determine play URL
    const owner = repo.owner.login;
    const repoName = repo.name;
    let playUrl = '';
    let hasLiveUrl = false;

    if (repo.homepage && repo.homepage.trim() !== '' && repo.homepage.startsWith('http')) {
      playUrl = repo.homepage.trim();
      hasLiveUrl = true;
    } else {
      playUrl = `https://${owner}.github.io/${repoName}/`;
      hasLiveUrl = false; // needs verification
    }

    const thumbnail = `https://opengraph.githubassets.com/1/${owner}/${repoName}`;

    // Detect if the game should be a standalone popup (for sites that block iframes)
    const isStandalone = playUrl.includes('itch.io') || playUrl.includes('royalur.net');

    const game = {
      githubId: repo.id,
      name: repo.name,
      slug,
      title: formatTitle(repo.name),
      description: repo.description || '',
      customDescription: '',
      category: categorizeGame(repo.topics, repo.description, repo.name),
      tags: repo.topics || [],
      license: repo.license.spdx_id,
      githubUrl: repo.html_url,
      playUrl,
      hasLiveUrl,
      standalone: isStandalone,
      stars: repo.stargazers_count || 0,
      forks: repo.forks_count || 0,
      language: repo.language || '',
      thumbnail,
      featured: false,
      verified: false,
      active: true,
      views: 0,
      plays: 0,
      lastUpdated: new Date(repo.updated_at),
      fetchedAt: new Date()
    };

    games.push(game);
  }

  console.log(`✅ Processed ${games.length} valid games (filtered from ${allRepos.length})`);
  
  // Log category breakdown
  const categories = {};
  games.forEach(g => {
    categories[g.category] = (categories[g.category] || 0) + 1;
  });
  console.log('\n📊 Category breakdown:');
  Object.entries(categories).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
    console.log(`   ${cat}: ${count}`);
  });

  return games;
}

module.exports = { fetchGamesFromGitHub, categorizeGame, ALLOWED_LICENSES, CATEGORY_RULES };

// Vercel Serverless Function - Cinema data parser from vkino.com.ua
// Returns movie showtimes for Kyiv cinemas

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=3600');

  try {
    // Step 1: Fetch the afisha page to get list of movies
    const afishaUrl = 'https://vkino.com.ua/ua/afisha/kyiv';
    const afishaResp = await fetch(afishaUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept-Language': 'uk-UA,uk;q=0.9',
      }
    });
    const afishaHtml = await afishaResp.text();

    // Parse movie list from afisha
    const movieList = parseAfisha(afishaHtml);

    // Step 2: Fetch each movie's detail page for showtimes (limit to top 15)
    const top = movieList.slice(0, 15);
    const detailed = await Promise.all(
      top.map(async (movie) => {
        try {
          const showUrl = `https://vkino.com.ua${movie.path}`;
          const showResp = await fetch(showUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              'Accept-Language': 'uk-UA,uk;q=0.9',
            }
          });
          const showHtml = await showResp.text();
          const details = parseShowPage(showHtml, movie);
          return details;
        } catch (e) {
          return { ...movie, cinemas: [], error: e.message };
        }
      })
    );

    res.status(200).json({
      ok: true,
      date: new Date().toISOString(),
      movies: detailed.filter(m => m.cinemas && m.cinemas.length > 0)
    });

  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
}

function parseAfisha(html) {
  const movies = [];
  // Match film-box blocks with title and poster
  const filmBoxRegex = /<div[^>]*class="[^"]*film-box[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/g;

  // Simpler approach: find all film links with show paths
  const linkRegex = /<a[^>]*href="(\/ua\/show\/[^"]+)"[^>]*>/g;
  const titleRegex = /<div[^>]*class="[^"]*film-title[^"]*"[^>]*>([^<]+)<\/div>/g;
  const posterRegex = /data-src="(https:\/\/api\.vkino\.com\.ua\/posters\/[^"]+)"/g;

  // Get all show links
  const links = [];
  let m;
  while ((m = linkRegex.exec(html)) !== null) {
    if (!links.includes(m[1])) links.push(m[1]);
  }

  // Get all titles
  const titles = [];
  while ((m = titleRegex.exec(html)) !== null) {
    titles.push(m[1].trim());
  }

  // Get all posters
  const posters = [];
  while ((m = posterRegex.exec(html)) !== null) {
    if (!posters.includes(m[1])) posters.push(m[1]);
  }

  // Match them up (they appear in order on the page)
  // Each movie has a unique show path - deduplicate
  const seen = new Set();
  for (let i = 0; i < links.length && i < titles.length; i++) {
    const path = links[i];
    if (seen.has(path)) continue;
    seen.add(path);
    movies.push({
      title: titles[movies.length] || '',
      path: path,
      poster: posters[movies.length] || '',
      url: 'https://vkino.com.ua' + path
    });
  }

  return movies;
}

function parseShowPage(html, movie) {
  // Extract movie metadata
  const genreMatch = html.match(/ÐÐ°Ð½Ñ:\s*<[^>]*>([^<]+)/i);
  const durationMatch = html.match(/Ð§Ð°Ñ:\s*<[^>]*>([^<]+)/i) || html.match(/Ð¢ÑÐ¸Ð²Ð°Ð»ÑÑÑÑ:\s*<[^>]*>([^<]+)/i);
  const ageMatch = html.match(/<span[^>]*class="[^"]*age-limit[^"]*"[^>]*>(\d+\+?)<\/span>/);
  const descMatch = html.match(/<div[^>]*class="[^"]*show-description[^"]*"[^>]*>([\s\S]*?)<\/div>/);

  const genre = genreMatch ? genreMatch[1].trim() : '';
  const duration = durationMatch ? durationMatch[1].trim() : '';
  const age = ageMatch ? ageMatch[1] : '';
  const desc = descMatch ? descMatch[1].replace(/<[^>]+>/g, '').trim().substring(0, 200) : '';

  // Extract schedule - each cinema block
  const cinemas = [];

  // Split HTML by cinema sections
  // Pattern: cinema name link followed by schedule rows
  // The structure has schedule-section elements containing cinema name and schedule-row elements

  // Find all schedule blocks between cinema name links
  const scheduleArea = html.match(/class="schedule-section-holder"([\s\S]*?)(?=<footer|<div[^>]*class="[^"]*comment|$)/);
  if (!scheduleArea) return { ...movie, genre, duration, age, desc, cinemas: [] };

  const area = scheduleArea[1];

  // Split by schedule-box which contains each cinema
  const boxRegex = /class="schedule-box"([\s\S]*?)(?=class="schedule-box"|$)/g;
  let boxMatch;

  while ((boxMatch = boxRegex.exec(area)) !== null) {
    const box = boxMatch[1];

    // Extract cinema name - it's in an <a> tag with href containing /cinema/
    const cinemaNameMatch = box.match(/<a[^>]*href="[^"]*\/cinema[^"]*"[^>]*>([^<]+)<\/a>/);
    if (!cinemaNameMatch) continue;

    const cinemaName = cinemaNameMatch[1].trim();
    if (cinemaName === 'Ð·Ð°ÐºÑÑÑÐ¸' || cinemaName.length < 3) continue;

    // Extract times - look for time patterns in schedule-list
    const times = [];
    const timeRegex = /(\d{1,2}:\d{2})\s*(?:<\/a>|<\/span>|\n)/g;
    let timeMatch;

    // Get today's times only (first schedule-row)
    const firstRow = box.match(/class="schedule-row"([\s\S]*?)(?=class="schedule-row"|$)/);
    if (firstRow) {
      const rowContent = firstRow[1];
      while ((timeMatch = timeRegex.exec(rowContent)) !== null) {
        const t = timeMatch[1];
        if (!times.includes(t)) times.push(t);
      }
    }

    if (times.length > 0) {
      cinemas.push({ name: cinemaName, times: times.sort() });
    }
  }

  return {
    title: movie.title,
    url: movie.url,
    poster: movie.poster,
    genre,
    duration,
    age,
    desc,
    cinemas
  };
}

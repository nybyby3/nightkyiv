export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=3600');
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    var hdrs = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Language': 'uk-UA,uk;q=0.9',
      'Cookie': 'city=kyiv; cinemaN=0000000017'
    };

    // Step 1: Fetch homepage to get movie list
    var homeResp = await fetch('https://multiplex.ua/', { headers: hdrs });
    var homeHtml = await homeResp.text();

    // Extract movie IDs and titles
    var movieRe = /<a[^>]*class="mpp_title"[^>]*href="\/movie\/(\d+)"[^>]*>([\s\S]*?)<\/a>/g;
    var movies = [];
    var seen = {};
    var m;
    while ((m = movieRe.exec(homeHtml)) !== null) {
      var id = m[1];
      if (!seen[id]) {
        seen[id] = true;
        movies.push({ id: id, title: m[2].replace(/<[^>]*>/g, '').trim() });
      }
    }

    // Step 2: Fetch movie detail pages in parallel (max 15)
    var toFetch = movies.slice(0, 15);
    var details = await Promise.all(toFetch.map(function(mv) {
      return fetch('https://multiplex.ua/movie/' + mv.id, { headers: hdrs })
        .then(function(r) { return r.text(); })
        .then(function(html) { return parseMovie(html, mv.id, mv.title); })
        .catch(function() { return null; });
    }));

    var result = details.filter(function(d) { return d && d.cinemas && d.cinemas.length > 0; });

    res.status(200).json({
      ok: true,
      date: new Date().toISOString(),
      movies: result
    });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
}

function parseMovie(html, id, fallbackTitle) {
  // Title from <h1>
  var titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  var title = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '').trim() : fallbackTitle;

  // Poster from <div class="poster_container"><img src="/images/...">
  var posterMatch = html.match(/<div[^>]*class="poster_container"[^>]*>[\s\S]*?<img[^>]*src="(\/images\/[^"]+)"/);
  var poster = posterMatch ? 'https://multiplex.ua' + posterMatch[1] : '';

  // Movie credentials list
  var credMatch = html.match(/<ul[^>]*class="movie_credentials"[^>]*>([\s\S]*?)<\/ul>/);
  var creds = credMatch ? credMatch[1] : '';

  // Genre
  var genreMatch = creds.match(/ÐÐ°Ð½Ñ:[\s\S]*?(<a[\s\S]*?)<\/li>/);
  var genre = '';
  if (genreMatch) {
    var genreLinks = genreMatch[1].match(/<a[^>]*>([^<]+)<\/a>/g);
    if (genreLinks) {
      genre = genreLinks.map(function(g) { return g.replace(/<[^>]*>/g, '').trim(); }).join(', ');
    }
  }

  // Duration
  var durMatch = creds.match(/Ð¢ÑÐ¸Ð²Ð°Ð»ÑÑÑÑ:[\s\S]*?(\d+:\d+)/);
  var duration = durMatch ? durMatch[1] : '';

  // Age
  var ageMatch = creds.match(/ÐÑÐºÐ¾Ð²Ñ Ð¾Ð±Ð¼ÐµÐ¶ÐµÐ½Ð½Ñ:[\s\S]*?(\d+\+)/);
  var age = ageMatch ? ageMatch[1] : '';

  // Description
  var descMatch = html.match(/<div[^>]*class="movie_description"[^>]*>([\s\S]*?)<\/div>/);
  var desc = descMatch ? descMatch[1].replace(/<[^>]*>/g, '').trim() : '';

  // URL
  var url = 'https://multiplex.ua/movie/' + id;

  // Schedule - parse first as_schedule block (nearest date)
  var cinemas = [];
  var schedStart = html.indexOf('<div class="as_schedule"');
  if (schedStart !== -1) {
    var schedNext = html.indexOf('<div class="as_schedule"', schedStart + 10);
    var sched = html.substring(schedStart, schedNext !== -1 ? schedNext : schedStart + 15000);

    // Find all cinema divs by indexOf
    var cinemaPositions = [];
    var cIdx = 0;
    while (true) {
      var cs = sched.indexOf('<div class="cinema">', cIdx);
      if (cs === -1) break;
      cinemaPositions.push(cs);
      cIdx = cs + 10;
    }

    for (var i = 0; i < cinemaPositions.length; i++) {
      var cEnd = (i + 1 < cinemaPositions.length) ? cinemaPositions[i + 1] : sched.length;
      var block = sched.substring(cinemaPositions[i], cEnd);

      // Cinema name from <p class="heading..."><a>Name</a></p>
      var nameMatch = block.match(/<p[^>]*class="heading[^"]*"[^>]*>([\s\S]*?)<\/p>/);
      var cinemaName = nameMatch ? nameMatch[1].replace(/<[^>]*>/g, '').trim() : '';

      if (!cinemaName) continue;
      if (block.indexOf('\u041d\u0435\u043c\u0430\u0454 \u0441\u0435\u0430\u043d\u0441\u0456\u0432') !== -1) continue;

      // Session times: <p class="time"><span>HH:MM</span></p>
      var timeRe = /<p[^>]*class="time"[^>]*>[\s\S]*?(\d{1,2}:\d{2})[\s\S]*?<\/p>/g;
      var times = [];
      var tm;
      while ((tm = timeRe.exec(block)) !== null) {
        times.push(tm[1]);
      }

      if (times.length > 0) {
        cinemas.push({ name: cinemaName, times: times });
      }
    }
  }

  return {
    title: title,
    url: url,
    poster: poster,
    genre: genre,
    duration: duration,
    age: age,
    desc: desc.substring(0, 300),
    cinemas: cinemas
  };
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=3600');
  res.setHeader('Access-Control-Allow-Origin', '*');
  var debug = req.query.debug === '1';
  var debugInfo = {};
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
    debugInfo.homeStatus = homeResp.status;
    debugInfo.homeLen = homeHtml.length;
    debugInfo.homeHas_mpp_title = homeHtml.indexOf('mpp_title') !== -1;
    debugInfo.homeSample = homeHtml.substring(0, 500);

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
    debugInfo.moviesFound = movies.length;
    debugInfo.movieIds = movies.map(function(mv) { return mv.id; });

    if (movies.length === 0) {
      // Try alternative extraction - look for any /movie/ links
      var altRe = /href="\/movie\/(\d+)"/g;
      var altIds = [];
      var am;
      while ((am = altRe.exec(homeHtml)) !== null) {
        if (altIds.indexOf(am[1]) === -1) altIds.push(am[1]);
      }
      debugInfo.altMovieIds = altIds;

      // Try to use alt IDs if main regex failed
      if (altIds.length > 0) {
        movies = altIds.slice(0, 15).map(function(aid) { return { id: aid, title: '' }; });
      }
    }

    // Step 2: Fetch movie detail pages in parallel (max 15)
    var toFetch = movies.slice(0, 15);
    var details = await Promise.all(toFetch.map(function(mv) {
      return fetch('https://multiplex.ua/movie/' + mv.id, { headers: hdrs })
        .then(function(r) { return r.text(); })
        .then(function(html) { return parseMovie(html, mv.id, mv.title); })
        .catch(function(e) { return { error: e.message, id: mv.id }; });
    }));

    debugInfo.detailResults = details.map(function(d) {
      if (!d) return 'null';
      if (d.error) return d;
      return { title: d.title, poster: d.poster ? 'yes' : 'no', cinemas: d.cinemas ? d.cinemas.length : 0 };
    });

    var result = details.filter(function(d) { return d && !d.error && d.cinemas && d.cinemas.length > 0; });

    var response = {
      ok: true,
      date: new Date().toISOString(),
      movies: result
    };
    if (debug) response.debug = debugInfo;

    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message, stack: e.stack, debug: debugInfo });
  }
}

function decodeEntities(str) {
  return str.replace(/&#(\d+);/g, function(m, n) { return String.fromCharCode(n); })
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ').replace(/&mdash;/g, '—').replace(/&ndash;/g, '–')
    .replace(/&laquo;/g, '«').replace(/&raquo;/g, '»')
    .replace(/&rsquo;/g, ''').replace(/&ldquo;/g, '"').replace(/&rdquo;/g, '"')
    .replace(/&hellip;/g, '…').trim();
}

function parseMovie(html, id, fallbackTitle) {
  // Title from <h1>
  var titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  var title = titleMatch ? decodeEntities(titleMatch[1].replace(/<[^>]*>/g, '').trim()) : fallbackTitle;

  // Poster from <div class="poster_container"><img src="/images/...">
  var posterMatch = html.match(/<div[^>]*class="poster_container"[^>]*>[\s\S]*?<img[^>]*src="(\/images\/[^"]+)"/);
  var poster = posterMatch ? 'https://multiplex.ua' + posterMatch[1] : '';

  // Movie credentials list
  var credMatch = html.match(/<ul[^>]*class="movie_credentials"[^>]*>([\s\S]*?)<\/ul>/);
  var creds = credMatch ? credMatch[1] : '';

  // Genre
  var genreMatch = creds.match(/\u0416\u0430\u043d\u0440:[\s\S]*?(<a[\s\S]*?)<\/li>/);
  var genre = '';
  if (genreMatch) {
    var genreLinks = genreMatch[1].match(/<a[^>]*>([^<]+)<\/a>/g);
    if (genreLinks) {
      genre = genreLinks.map(function(g) { return g.replace(/<[^>]*>/g, '').trim(); }).join(', ');
    }
  }

  // Duration
  var durMatch = creds.match(/\u0422\u0440\u0438\u0432\u0430\u043b\u0456\u0441\u0442\u044c:[\s\S]*?(\d+:\d+)/);
  var duration = durMatch ? durMatch[1] : '';

  // Age
  var ageMatch = creds.match(/\u0412\u0456\u043a\u043e\u0432\u0456 \u043e\u0431\u043c\u0435\u0436\u0435\u043d\u043d\u044f:[\s\S]*?(\d+\+)/);
  var age = ageMatch ? ageMatch[1] : '';

  // Description
  var descMatch = html.match(/<div[^>]*class="movie_description"[^>]*>([\s\S]*?)<\/div>/);
  var desc = descMatch ? decodeEntities(descMatch[1].replace(/<[^>]*>/g, '').trim()) : '';

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

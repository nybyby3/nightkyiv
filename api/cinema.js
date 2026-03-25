export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=1800');
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

    // Extract movie IDs
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

    if (movies.length === 0) {
      var altRe = /href="\/movie\/(\d+)"/g;
      var altIds = [];
      var am;
      while ((am = altRe.exec(homeHtml)) !== null) {
        if (altIds.indexOf(am[1]) === -1) altIds.push(am[1]);
      }
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
      return { title: d.title, dates: d.schedule ? d.schedule.length : 0 };
    });

    var result = details.filter(function(d) { return d && !d.error && d.schedule && d.schedule.length > 0; });

    // Collect all unique dates across all movies
    var allDates = [];
    var seenDates = {};
    result.forEach(function(mov) {
      mov.schedule.forEach(function(day) {
        if (!seenDates[day.date]) {
          seenDates[day.date] = true;
          allDates.push(day.date);
        }
      });
    });
    allDates.sort();

    var response = {
      ok: true,
      date: new Date().toISOString(),
      dates: allDates,
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
    .replace(/&nbsp;/g, ' ').replace(/&mdash;/g, '\u2014').replace(/&ndash;/g, '\u2013')
    .replace(/&laquo;/g, '\u00AB').replace(/&raquo;/g, '\u00BB')
    .replace(/&rsquo;/g, '\u2019').replace(/&ldquo;/g, '\u201C').replace(/&rdquo;/g, '\u201D')
    .replace(/&hellip;/g, '\u2026').trim();
}

function parseMovie(html, id, fallbackTitle) {
  // Title from <h1>
  var titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  var title = titleMatch ? decodeEntities(titleMatch[1].replace(/<[^>]*>/g, '').trim()) : fallbackTitle;

  // Poster
  var posterMatch = html.match(/<div[^>]*class="poster_container"[^>]*>[\s\S]*?<img[^>]*src="(\/images\/[^"]+)"/);
  var poster = posterMatch ? 'https://multiplex.ua' + posterMatch[1] : '';

  // Movie credentials
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

  // Schedule - parse ALL as_schedule blocks (one per date)
  var schedule = [];

  // Find all as_schedule blocks with data-selector (date)
  var schedRe = /<div[^>]*class="as_schedule"[^>]*data-selector="(\d+)"[^>]*>([\s\S]*?)(?=<div[^>]*class="as_schedule"|<div[^>]*class="cinema_schedule_header|$)/g;
  var schedMatch;

  while ((schedMatch = schedRe.exec(html)) !== null) {
    var rawDate = schedMatch[1]; // e.g. "31032026"
    var schedBlock = schedMatch[2];

    // Parse date: DDMMYYYY -> YYYY-MM-DD
    var dd = rawDate.substring(0, 2);
    var mm = rawDate.substring(2, 4);
    var yyyy = rawDate.substring(4, 8);
    var isoDate = yyyy + '-' + mm + '-' + dd;

    // Find cinemas in this block
    var cinemas = [];
    var cinemaPositions = [];
    var cIdx = 0;
    while (true) {
      var cs = schedBlock.indexOf('<div class="cinema">', cIdx);
      if (cs === -1) break;
      cinemaPositions.push(cs);
      cIdx = cs + 10;
    }

    for (var i = 0; i < cinemaPositions.length; i++) {
      var cEnd = (i + 1 < cinemaPositions.length) ? cinemaPositions[i + 1] : schedBlock.length;
      var block = schedBlock.substring(cinemaPositions[i], cEnd);

      // Cinema name
      var nameMatch = block.match(/<p[^>]*class="heading[^"]*"[^>]*>[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/);
      var cinemaName = nameMatch ? decodeEntities(nameMatch[1].replace(/<[^>]*>/g, '').trim()) : '';

      if (!cinemaName) continue;
      if (block.indexOf('\u041d\u0435\u043c\u0430\u0454 \u0441\u0435\u0430\u043d\u0441\u0456\u0432') !== -1) continue;

      // Sessions: each .ns div has data-id and time
      var nsRe = /<div[^>]*class="ns\s*"[^>]*data-id="([^"]*)"[^>]*>[\s\S]*?<p[^>]*class="time"[^>]*>[\s\S]*?<span>(\d{1,2}:\d{2})<\/span>[\s\S]*?<\/p>(?:[\s\S]*?<p[^>]*class="tag"[^>]*>([\s\S]*?)<\/p>)?/g;
      var sessions = [];
      var nsMatch;
      while ((nsMatch = nsRe.exec(block)) !== null) {
        var sessionObj = { time: nsMatch[2] };
        if (nsMatch[1]) sessionObj.sid = nsMatch[1];
        var fmt = nsMatch[3] ? nsMatch[3].replace(/<[^>]*>/g, '').trim() : '';
        if (fmt) sessionObj.fmt = fmt;
        sessions.push(sessionObj);
      }

      if (sessions.length > 0) {
        cinemas.push({ name: cinemaName, sessions: sessions });
      }
    }

    if (cinemas.length > 0) {
      schedule.push({ date: isoDate, cinemas: cinemas });
    }
  }

  return {
    title: title,
    id: id,
    url: url,
    poster: poster,
    genre: genre,
    duration: duration,
    age: age,
    desc: desc.substring(0, 300),
    schedule: schedule
  };
}

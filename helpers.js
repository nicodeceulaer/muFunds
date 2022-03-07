/* ----------- Data processing functions ----------- */
function isISIN(id) {
  // ISIN have 12 characters
  // Not the most robust way (TODO: improve it)
  return id.length == 12;
}

function processNav(nav) {
  Logger.log('processNav: ' + nav);
  nav = nav.replace(',', '.');
  if(!isNaN(parseFloat(nav)) && isFinite(nav))
    return parseFloat(nav);
  else
    throw new Error("NAV is not available for this asset and source. Please try another data source");
}

// returns AUM in milion
function processAUM(aum) {
  Logger.log('processAUM: ' + aum);
  if (aum == '-'){
    // sometimes Morningstar does not show the AUM of a fund
    return 0;
  }
  aum = aum.replace(',', '.').replace('EUR','').replace('USD','');
  // handle large sizes
  let mult = 1;
  if (aum.endsWith('bil')){
    mult = 1000;
    aum = aum.slice(0,3);
  }
  if(!isNaN(parseFloat(aum)) && isFinite(aum)) {
    const value = parseFloat(aum) * mult;
    Logger.log('processAUM = ' + value);
    return value;
  } else {
    throw new Error("AUM is not available for this asset and source. Please try another data source");
  }
}

function processDate(date) {
  return date;
}

function processChange(change) {
  Logger.log('processChange: ' + change);
  change = change.replace(',', '.').replace('%', '');
  if(!isNaN(parseFloat(change)) && isFinite(change))
    return parseFloat(change)/100;
  else 
    throw new Error("Last change is not available for this asset and source. Please try another data source");
}

function processCurrency(currency) {
  return currency;
}

function processExpenses(expenses) {
  Logger.log('processExpenses: ' + expenses);
  expenses = expenses.replace(',', '.').replace('%', '');
  if(!isNaN(parseFloat(expenses)) && isFinite(expenses))
    return parseFloat(expenses)/100;
  else
    throw new Error("Expenses ratio is not available for this asset and source. Please try another data source");
}

function processCategory(category) {
  return category;
}

function processSource(source) {
  return source;
}


/* -------- Fetching cached/non-cached pages -------- */
function fetchURL(url, cacheid) {
  var cache = CacheService.getScriptCache();
  var cached = cache.get(cacheid);
  if(cached != null) {
    return Cheerio.load(cached);
  }

  let options = { muteHttpExceptions: true,
                  validateHttpsCertificates: false
                  };
  Logger.log('url: ' + url);
  var fetch = UrlFetchApp.fetch(url, options);
  Logger.log('code: ' + fetch.getResponseCode());
  if(fetch.getResponseCode() == 200 && fetch.getContent().length > 0) {
    var xmlstr = fetch.getContentText()
                      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
                      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
                      .replace("xml:space", "space")
                      .replace("xmlns:", "")
                      .replace("ns0:", "")
                      .replace(/<svg(.*)<\/svg>/gm, '');
    var bodyHtml = xmlstr; // fixTags(xmlstr);
    cache.put(cacheid, bodyHtml, 7200);
    return Cheerio.load(bodyHtml);
  } else {
    throw new Error("Wrong combination of asset identifier and source. Please check the accepted ones at the documentation");
  }
}

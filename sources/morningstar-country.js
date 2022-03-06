// Given a 2-letter country code, returns the base URL for a Morningstar website
function getMorningstarCountryBase(country) {
  if(country == "au")
    return "https://www.morningstar.com.au";
  if(country == "es")
    return "http://www.morningstar.es/es";
  if(country == "de")
    return "http://www.morningstar.de/de";
  if(country == "ie")
    return "http://www.morningstarfunds.ie/ie";
  if(country == "fr")
    return "http://www.morningstar.fr/fr";
  if(country == "za")
    return "http://www.morningstar.co.za/za";
  if(country == "at")
    return "http://www.morningstar.at/at";
  if(country == "be")
    return "http://www.morningstar.be/be";
  if(country == "dk")
    return "http://www.morningstar.dk/dk";
  if(country == "fi")
    return "http://www.morningstar.fi/fi";
  if(country == "gb" || country == "uk")
    return "http://www.morningstar.co.uk/uk";
  if(country == "ch")
    return "http://www.morningstar.ch/ch";
  if(country == "is")
    return "http://www.morningstar.is/is";
  if(country == "it")
    return "http://www.morningstar.it/it";
  if(country == "pt")
    return "http://www.morningstar.pt/pt";
  if(country == "no")
    return "http://www.morningstar.no/no";
  if(country == "nl")
    return "http://www.morningstar.nl/nl";
  // As a previous filter has been done, if a user arrives here it is because
  // it comes from failed generic Morningstar and asset country has been searched
  else
    throw new Error("This option is not available for the given asset");
}

// Given a 2-letter country code, returns the location for funds snapshots
function getMorningstarCountryLink(country) {
  if(country == "au")
    return "/Funds/FundReportPrint/";
  return "/funds/snapshot/snapshot.aspx?id=";
}

function getMorningstarCountrySearchLink(country) {
  return "/funds/SecuritySearchResults.aspx?search=";
}

function getMorningstarCountrySearchResultClass(country) {
  return "searchLink";
}

// Returns if an asset's identifier is an asset's Morningstar ID
function isMSID(id) {
  // Morningstar IDs have 10 chars, ISIN have 12
  // Not the most robust way (TODO: improve it)
  return id.length == 10;
}

// Given an asset's identifier and a Morningstar version, searches for the asset's Morningstar ID
function searchForMSID(id, country) {
  // If the identifier is actually a Morningstar ID, then return it
  if(isMSID(id)) return id;

  // Checks if there is a cached version
  var cache = CacheService.getScriptCache();
  var cached = cache.get("mf-msid-" + id);

  if (cached != null && cached != -1) { 
    Logger.log('msid: ' + cached + ' (cached)');
    return cached;
  }
  
  if (country == "au") {
    try {
      throw new Error("I could not get Austria morningstar working. sorry :-(");

      var url = getMorningstarCountryBase(country) + "/Ausearch/SecurityCodeAutoLookup?rows=20000&fq=SecurityTypeId:(1+OR+2+OR+3+OR+4+OR+5)&sort=UniverseSort+asc&q=" + id;
      var fetch = UrlFetchApp.fetch(url, {'muteHttpExceptions': true});
      var json = fetch.getContentText();
      var data = JSON.parse(json);
      var res = data["hits"]["hits"][0]["_source"]["Symbol"];
      cache.put("mf-msid-" + id, res, 999999999);
      return res;
    }
    catch(error) {
      throw new Error("This asset is not compatible with this Morningstar country. Try another country or data source");
    }
  }
  
  let options = {muteHttpExceptions: true, validateHttpsCertificates: false};
  var url = getMorningstarCountryBase(country) + getMorningstarCountrySearchLink(country) + id;
  Logger.log('url: ' + url);
  var fetch = UrlFetchApp.fetch(url, options);
  Logger.log('code: ' + fetch.getResponseCode());
  if(fetch.getResponseCode() == 200 && fetch.getContent().length > 0) {
    var xmlstr = fetch.getContentText();
    var doc = Cheerio.load(xmlstr);
    const searchResultClass = getMorningstarCountrySearchResultClass(country);
    Logger.log('searchResultClass: ' + searchResultClass);
    const msid = getMSIDFromMorningstarSearch(doc, searchResultClass, country);
    Logger.log('msid: ' + msid);
    cache.put("mf-msid-" + id, msid, 999999999);
    
    if (msid == -1) {
      throw new Error("This asset is not compatible with this Morningstar country. Try another country or data source");
    }
    return msid;
  }
}


// Given an asset's identifier, returns related country
function getMorningstarCountryFromAsset(id, country) {
  var cache = CacheService.getScriptCache();
  // First, if the identifier is a ISIN, extract it from there
  if(isISIN(id)) {
    return id.substr(0, 2).toLowerCase();
  }

  // Otherwise, if country is introduced by user, then save it for cache
  if(country) {
    cache.put("mf-country-" + id, country, 999999999);
    return country;
  }

  // If country is not defined or obtained via ISIN, then try cache or ask user
  var cached = cache.get("mf-country-" + id);
  if (cached != null)
    return cached;
  else
    throw new Error("ISIN country is not compatible with Morningstar. Please try another compatible data source");
}


function getMSIDFromMorningstarSearch(doc, searchClass, country) {
  const href = doc('.' + searchClass + ' a').attr('href');
  Logger.log('href: ' + href);
  if(href.length == 0) {
    Logger.log(' not found');
    return -1;
  }  
  
  const msid = country == "au" ? href.substr(18) : href.substr(-10);
  Logger.log('msid: ' + msid);
  return msid;
}


function getNavFromMorningstarCountry(doc, country) {
  return doc('.overviewKeyStatsTable .text').first().text().substr(4).replace(',', '.');
}

function getDateFromMorningstarCountry(doc, country) {
  return doc('.overviewKeyStatsTable .heading .heading').first().text();
}

function getChangeFromMorningstarCountry(doc, country) {
  const list= doc('.overviewKeyStatsTable .text').map(function() { return doc(this).text();}).get();
  Logger.log('list of items:' + JSON.stringify(list));
  return list[1].replace(/\s(\s+)/g, '').replace(/\n/g, '').replace(/\t/g, '').replace(',', '.');
}

function getCurrencyFromMorningstarCountry(doc, country) {
  if(country == "au") return "AUD";
  return doc('.overviewKeyStatsTable .text').first().text().substr(0,3);
}

function getExpensesFromMorningstarCountry(doc, country) {
  const list= doc('.overviewKeyStatsTable .text').map(function() { return doc(this).text();}).get();
  if(country == "de")
    return list[9].replace(',', '.');
  else if(country == "nl" || country == "uk" || country == "gb")
    return list[list.length-1].replace(',', '.');
  else if(country == "be")
    return list[list.length-2].replace(',', '.');
  else if(country == "dk" || country == "ch" || country == "it")
    return list[8].replace(',', '.');
  else
    return list[7].replace(',', '.');
}

function getTotalAssetsFromMorningstarCountry(doc, country) {
  const list= doc('.overviewKeyStatsTable .text').map(function() { return doc(this).text();}).get();
  if(country == "de")
    return list[list.length-4].replace(',', '.');
  else if(country == "nl" || country == "uk" || country == "gb")
    return list[list.length-3].replace(',', '.');
  else if(country == "be")
    return list[list.length-5].replace(',', '.');
  else if(country == "dk" || country == "ch" || country == "it")
    return list[8].replace(',', '.');
  else
    return list[7].replace(',', '.');
}


function getCategoryFromMorningstarCountry(doc, country) {
  return doc('.overviewKeyStatsTable .text a').first().text();
}

function fetchMorningstarCountry(id, country) {
  var url = getMorningstarCountryBase(country) + getMorningstarCountryLink(country) + id;
  return fetchURL(url, "morningstar-" + country + "-" + id);
}

function loadFromMorningstarCountry(option, id, country) {
  var base = getMorningstarCountryBase(country);
  var msid = searchForMSID(id, country);
  var doc = fetchMorningstarCountry(msid, country);

  if(option == "nav")
    return processNav(getNavFromMorningstarCountry(doc, country));

  if(option == "date")
    return processDate(getDateFromMorningstarCountry(doc, country));

  if(option == "change")
    return processChange(getChangeFromMorningstarCountry(doc, country));

  if(option == "currency")
    return processCurrency(getCurrencyFromMorningstarCountry(doc, country));

  if(option == "expenses")
    return processExpenses(getExpensesFromMorningstarCountry(doc, country));

  if(option == "category")
    return processCategory(getCategoryFromMorningstarCountry(doc, country));
  if(option == "source")
    return processSource("morningstar-" + country);
}

/* ------------------- Main function -------------------- */

function test() {
  // test_single('morningstar-be', 'BE6299843811');
  // test_single('morningstar-be', 'BE6301090674');
  // test_single('morningstar-de', 'US46137V5892');
  // test_single('morningstar-nl', 'LU0255977372');
  // test_single('morningstar-de', 'LU1171478784');
  // test_single('morningstar-de', 'LU0690375422');
  // test_single('morningstar-de', 'US02072L6074');
  test_single('morningstar-de', 'IE00BK5BC891');
}

function test_single(source, id) {
  // const options = ['nav', 'date', 'change', 'currency', 'expenses', 'category', 'source', 'aum'];
  const options = ['expenses', 'div-yield'];
  
  for (const option of options) {
    Logger.log('Test(id:' + id + ', option:' + option + ', source: ' + source+ ')');
    let result = muFunds(option, id, source);
    Logger.log('result: ' + result + ' (id:' + id + ', option:' + option + ', source:' + source + ')');
  }
}

/**
 * Imports mutual fund NAV or other data from Morningstar. See complete documentation at mufunds.com.
 *
 * @param {string} option Asset attribute: nav, date, change, currency, expenses or category.
 * @param {string} id Asset identifier (ISIN, ticker or Morningstar ID).
 * @param {string} source Source from which obtain the data (check documentation).
 * @return The asked information from the fund, according to the selected source.
 * @customfunction
 */
function muFunds(option, id, source) {
  // First, check if option is valid
  if(!( option == "nav" ||
        option == "date" ||
        option == "change" ||
        option == "currency" ||
        option == "expenses" ||
        option == "category" ||
        option == "aum" ||
        option == "source" ||
        option == "div-yield")) {
    throw new Error( "You have selected an invalid option." );
    return;
  }
  if(!id) {
    throw new Error( "Asset identifier is empty." );
    return;
  }

  // Auto mode (no explicit source defined)
  if(!source)
    return loadFromMorningstar(option, id);

  // Manual mode (explicit source defined)
  if(source == "morningstar")
    return loadFromMorningstar(option, id);

  if( source == "morningstar-au" || 
      source == "morningstar-es" || 
      source == "morningstar-de" || 
      source == "morningstar-ie" || 
      source == "morningstar-fr" || 
      source == "morningstar-za" || 
      source == "morningstar-at" || 
      source == "morningstar-be" || 
      source == "morningstar-dk" || 
      source == "morningstar-fi" || 
      source == "morningstar-gb" || 
      source == "morningstar-uk" || 
      source == "morningstar-ch" || 
      source == "morningstar-is" || 
      source == "morningstar-it" || 
      source == "morningstar-pt" || 
      source == "morningstar-no" || 
      source == "morningstar-nl") {
    var country = source.substr(12, 2).toLowerCase();
    return loadFromMorningstarCountry(option, id, country);
  }

  if(source == "quefondos")
    return loadFromQuefondos(option, id);

  // If no compatible source is chosen, return error
  throw new Error( "Source is not compatible. Please check the documentation for the compatibility list" );
  return;
}

// Adds "About µFunds" menu
function onOpen(e) {
  SpreadsheetApp.getUi().createAddonMenu()
      .addItem('About µFunds', 'showAbout')
      .addToUi();
}

// Installation
function onInstall(e) {
  onOpen(e);
}

// Opens "About µFunds" page
function showAbout() {
  var ui = HtmlService.createHtmlOutputFromFile('about')
      .setTitle('About µFunds');
  SpreadsheetApp.getUi().showSidebar(ui);
}

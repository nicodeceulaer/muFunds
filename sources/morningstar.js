function fetchMorningstar(id) {
  return fetchURL('https://quotes.morningstar.com/fund/c-header?t=' + id, "morningstar-" + id);
}

function getNavFromMorningstar(doc) {
  return doc('[vkey=NAV]').text().replace(/\s(\s+)/g, '').replace(/\n/g, '').replace(/\t/g, '');
}

function getDateFromMorningstar(doc) {
  return doc('[vkey=LastDate]').text().replace(/\s(\s+)/g, '').replace(/\n/g, '').replace(/\t/g, '');
}

function getChangeFromMorningstar(doc) {
  return doc('[vkey=DayChange]').text().replace(/\s(\s+)/g, '').replace(/\n/g, '').replace(/\t/g, '');
}

function getCurrencyFromMorningstar(doc) {
  return doc('[vkey=PriceCurrency]').text().replace(/\s(\s+)/g, '').replace(/\n/g, '').replace(/\t/g, '');
}

function getExpensesFromMorningstar(doc) {
  return doc('[vkey=ExpenseRatio]').text().replace(/\s(\s+)/g, '').replace(/\n/g, '').replace(/\t/g, '');
}

function getCategoryFromMorningstar(doc) {
  return doc('[vkey=MorningstarCategory]').text().replace(/\s(\s+)/g, '').replace(/\n/g, '').replace(/\t/g, '');
}

function getAUMFromMorningstar(doc) {
  return doc('[vkey=TotalAssetsCategory]').text().replace(/\s(\s+)/g, '').replace(/\n/g, '').replace(/\t/g, '');
}

function loadFromMorningstar(option, id) {
  var doc = fetchMorningstar(id);

  if(option == "nav")
    return processNav(getNavFromMorningstar(doc));
  if(option == "date")
    return processDate(getDateFromMorningstar(doc));
  if(option == "change")
    return processChange(getChangeFromMorningstar(doc));
  if(option == "currency")
    return processCurrency(getCurrencyFromMorningstar(doc));
  if(option == "expenses")
    return processExpenses(getExpensesFromMorningstar(doc));
  if(option == "category")
    return processCategory(getCategoryFromMorningstar(doc));
  if(option == "source")
    return processSource("morningstar");
  if(option == "aum")
    return processAUM(getAUMFromMorningstar(doc));
}

function countryLookup( country, option) {
  const lookup = {
    "au": {
      'url': "https://www.morningstar.com.au",
    },
    "es": {
      'url': "http://www.morningstar.es/es",
    },
    "de": {
      'url': "http://www.morningstar.de/de",
      'aum': 'Fondsvolumen',
      'nav': ['Schlusskurs', 'NAV'],
      'date': ['Schlusskurs', 'NAV'],
      'change': 'Änderung z. Vortag',
      'currency': ['Schlusskurs', 'NAV'],
      'expenses': 'Laufende Kosten',
      'category': 'Morningstar Kategorie',
      'div-yield': '12-Monats-Dividendenrendite'
    },
    "ie": {
      'url': "http://www.morningstarfunds.ie/ie",
    },
    "fr": {
      'url': "http://www.morningstar.fr/fr",
    },
    "za": {
      'url': "http://www.morningstar.co.za/za",
    },
    "at": {
      'url': "http://www.morningstar.at/at",
    },
    "be": {
      'url': "http://www.morningstar.be/be",
      'aum': 'Grootte Fonds ',
      'nav': ['slotkoers', 'Koers'],
      'date': ['slotkoers', 'Koers'],
      'change': 'Rendement 1 Dag',
      'currency': ['slotkoers', 'Koers'],
      'expenses': 'Lopende Kosten Factor',
      'category': 'Morningstar Categorie',
      'div-yield': 'Dividendrendement'
    },
    "dk": {
      'url': "http://www.morningstar.dk/dk",
    },
    "fi": {
      'url': "http://www.morningstar.fi/fi",
    },
    "gb": {
      'url': "http://www.morningstar.co.uk/uk",
    },
    "uk": {
      'url': "http://www.morningstar.co.uk/uk",
      'aum': 'Fund Size ',
      'nav': 'Closing Price',
      'date': 'Closing Price',
      'change': 'Day Change',
      'currency': 'Closing Price',
      'expenses': 'Ongoing Charge',
      'category': 'Morningstar Category'
    },
    "ch": {
      'url': "http://www.morningstar.ch/ch",
    },
    "is": {
      'url': "http://www.morningstar.is/is",
    },
    "it": {
      'url': "http://www.morningstar.it/it",
    },
    "pt": {
      'url': "http://www.morningstar.pt/pt",
    },
    "no": {
      'url': "http://www.morningstar.no/no",
    },
    "nl": {
      'url': "http://www.morningstar.nl/nl",
      'aum': 'Grootte Fonds ',
      'nav': ['slotkoers', 'Koers'],
      'date': ['slotkoers', 'Koers'],
      'change': 'Rendement 1 Dag',
      'currency': ['slotkoers', 'Koers'],
      'expenses': 'Lopende Kosten Factor',
      'category': 'Morningstar Categorie',
      'div-yield': 'Dividendrendement'
    }
  };

  const item = lookup[country];
  if (!item ) {
    throw new Error("Country " + country + " is not supported");
  }
  const value = item[option];
  if (!value) {
    throw new Error("The option '" + option + "' is not present for country '" + country + "'");
  }
  return value;
}

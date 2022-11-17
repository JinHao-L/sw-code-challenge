// your code here:

class Price {
  constructor({buy, sell, id, pair, timestamp}) {
    this.buy = buy / 100
    this.sell = sell / 100
    this.id = id
    this.pair = pair
    this.timestamp = timestamp
  }

  // returns the mid-point value between sell price and buy price
  mid() {
    return (this.sell + this.buy) / 2
  }

  // returns the quote currency of the trade pair
  quote() {
    return this.pair.substring(3)
  }
}

class DataSource {
  // Returns a promise of prices from a remote pricing engine
  static getPrices() {
    return fetch('https://static.ngnrs.io/test/prices')
      .then((res) => res.json())
      .then((res) => res.data.prices.map(p => new Price(p)))
  }
}

// for testing
// DataSource.getPrices()
//     .then(prices => {
//         prices.forEach(price => {
//             console.log(`Mid price for ${ price.pair } is ${ price.mid() } ${ price.quote() }.`);
//         });
//     }).catch(error => {
//         console.error(error);
//     });
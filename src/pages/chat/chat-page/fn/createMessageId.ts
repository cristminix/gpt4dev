export function createMessageId() {
    let random_bytes = (
      Math.floor(Math.random() * 1338377565) + 2956589730
    ).toString(2)
    let unix = Math.floor(Date.now() / 1000).toString(2)

    return BigInt(`0b${unix}${random_bytes}`).toString()
  }
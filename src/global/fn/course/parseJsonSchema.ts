import $ from "jquery"

export const parseJsonSchema = (responseText: any) => {
  $.expr[":"].containsRegex = $.expr.createPseudo(function (pattern) {
    var regex = new RegExp(pattern, "i")
    return function (elem) {
      return regex.test($(elem).text())
    }
  })
  let errorMessage = null

  let validResource = false
  const elDiv = $(`<div>${responseText}</div>`)

  const signInBtns = elDiv.find('a:containsRegex("sign in")')

  if (signInBtns.length > 0) {
    errorMessage = "ERR_NO_LOGIN"
  }
  const elCodes = elDiv.find("code")
  let dataCodes = []

  if (!errorMessage) {
    for (let codeIndex in elCodes) {
      let elCode: any = elCodes[codeIndex]
      try {
        if (elCode.id.match(/^bpr-guid/)) {
          dataCodes.push(JSON.parse(elCode.textContent))
        }
      } catch (e) {}
    }
  }

  return [dataCodes, errorMessage]
}

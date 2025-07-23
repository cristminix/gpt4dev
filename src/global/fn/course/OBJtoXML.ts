export const OBJtoXML = (obj: any) => {
  var xml = ""
  for (var prop in obj) {
    xml += "<" + prop + ">"
    if (Array.isArray(obj[prop])) {
      for (var array of obj[prop]) {
        // A real botch fix here
        xml += "</" + prop + ">"
        xml += "<" + prop + ">"

        xml += OBJtoXML(new Object(array))
      }
    } else if (typeof obj[prop] == "object" && typeof obj[prop] !== "string") {
      xml += OBJtoXML(new Object(obj[prop]))
    } else {
      xml += obj[prop]
    }
    xml += "</" + prop + ">"
  }
  var xml = xml.replace(/<\/?[0-9]{1,}>/g, "")
  return xml
}

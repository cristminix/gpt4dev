import { OBJtoXML } from "./OBJtoXML"
import { sanitizeKeys } from "./sanitizeKeys"

export const convertJsonToXml = (schema: any) => {
  const row = sanitizeKeys({ schema })
  const result = OBJtoXML({ root: row })
  // console.log(result)
  return result
  // let options = {compact: true, ignoreComment: true, spaces: 4}
  // let result = xmlbuilder.json2xml(row, options)
  // return result
  /*Old Code*/
  /*const root = xmlbuilder.create('root');
	const convert = (obj, parent) => {
	  if(typeof obj === "string"){
	    parent.text(obj)
	    return
	  }  
	  for (const key in obj) {
	    if (obj.hasOwnProperty(key)) {
	      if (Array.isArray(obj[key])) {
	        obj[key].forEach((item) => {
	          const arrayElement = parent.ele(key);
	          convert(item, arrayElement);
	        });
	      } else if (typeof obj[key] === 'object') {
	        const child = parent.ele(key)
	        convert(obj[key], child)
	      } else {
	        try{
	            parent.ele(key).text(obj[key])
	        }catch(e){
	        }
	      }
	    }
	  }
	};

	convert(row, root)
	return root.end({ pretty: true })
    */
}

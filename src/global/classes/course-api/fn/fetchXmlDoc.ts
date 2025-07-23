import {fetchRtry} from "@/global/fn/course/fetchRtry";
import PrxCache from "@/global/classes/PrxCache";
import {parseJsonSchema} from "@/global/fn/course/parseJsonSchema";
import {convertJsonToXml} from "@/global/fn/course/convertJsonToXml";
import jQuery from "jquery"
/**
 * This function is used to fetch course xml doc and toc xml doc
 * */
export async function fetchXmlDoc(url: string, noCache: boolean = false) {
    const mPrxCache = PrxCache.getInstance()
    let cacheContent:string|null = null
    let statusCode:number = 0
    let doc:any=null
    let errorMessage=null
    if (noCache) {
        try{
            let response = await fetchRtry(url)
             statusCode = response.status
            if(response.ok){
                cacheContent = await response.text()
                if(statusCode == 200){
                    await mPrxCache.set(url,cacheContent,statusCode)
                }
            }
        }catch(e){
            console.error(e)
        }
    }else {
        const webCache = await mPrxCache.get(url)
        if (!webCache.isEmpty()) {
            cacheContent = webCache.getCacheContent()
            statusCode = webCache.getStatusCode()

        }
    }
    if(cacheContent){
        const [jsonSchema,errMsg] = parseJsonSchema(cacheContent)
        errorMessage=errMsg
        console.log(errMsg)
        if(errMsg){
            if(errMsg == "ERR_NO_LOGIN"){
                // this.informUnauthenticatedAccess()
            }
        }else{
            doc = jQuery(convertJsonToXml(jsonSchema))
        }

    }

    return {doc,statusCode,errorMessage}
}
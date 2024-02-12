import { client } from "@/app/lib/services/node-appwrite.service";
import { Storage,  } from "node-appwrite";
import { Reader, CityResponse } from "maxmind";



const SingletonReader = (function(){
    let reader: Reader<CityResponse>;

    async function createReader(){
        client.setKey(process.env.APPWRITE_API!);
        const storage = new Storage(client);
        const file = await storage
        .getFileDownload(process.env.STATIC_BUCKET!, process.env.MMDB_FILE_ID!)
        .then((file) => file);
        return new Reader<CityResponse>(file)
    }

   return {
    getReader: async function(){
        if(!reader){
           reader = await createReader()
        }
        return reader;
    }
   }
})();

export default SingletonReader


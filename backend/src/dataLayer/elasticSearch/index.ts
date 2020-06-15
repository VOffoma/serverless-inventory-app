import esClient from './esConnection';
import { getMapping } from './mappings';



export class ElasticSearchAccess {

    constructor(
        private readonly es = esClient
    ){}
    

    async putMapping (indexName: string, type: string, mapping: object): Promise<any> {
        await this.es.indices.putMapping({
            index: indexName,
            type: type,
            body: {
                properties: mapping['properties']
            }
        });
    }
      

    async createIndex(indexName: string, type: string, mapping: object): Promise<any> {
        await this.es.indices.create({
            index: indexName,
            body: {
                mappings: {
                    [type]: {
                        properties: mapping["properties"]
                    } 
                }
            }
        });

    }

    async  deleteIndex(indexName: string): Promise<any>{
        await this.es.indices.delete({
            index: indexName
        });
    }

    async addDocument(indexName: string, type: string, id: string, body: object): Promise<any> {
        const indexExists = await this.es.indices.exists({
            index: indexName
        });
    
        if(!indexExists){
            const mapping = getMapping(type);
            await this.createIndex(indexName, type, mapping);
            // await this.createIndex(indexName);
            // const mapping = getMapping(type);
            // await this.putMapping(indexName, type, mapping)
        }
    
        await this.es.index({
            index: indexName, 
            type: type,
            id: id,
            body: body
        });
    }

     async  updateDocument(indexName: string, type: string, id: string, body: object): Promise<any> {
        await this.es.update({
            index: indexName, 
            type: type,
            id: id,
            body: body
        });
    }

    async  deleteDocument(indexName: string, id: string, type: string): Promise<any>{
        await this.es.delete({
            index: indexName,
            id: id,
            type: type,
        });
    }

     async  searchDocuments(indexName: string, type: string, body: object): Promise<any> {
        try {

            const response = await this.es.search({
                index: indexName, 
                type: type,
                body: body
            });
            console.log('response: ', response);
            const result = {
                total: response,
                hits: response
            } 
            return result;
        } catch (error) {
           throw error; 
        }
    }
}












class RedisBaseService{
    constructor(client) {
        this.client = client;
    }

    async getRedisData(key) {
        const data = await this.client.get(key)
        if(!!data){
            return JSON.parse(data)
        }

        return null;
    }

    async push(value, key) {
        let data = await this.getRedisData(key)
        if (!data || !Array.isArray(data)) {
            data = [];
        }

        data.push(value);
        await this.client.set(key, JSON.stringify(data))
    }

    async set(value, key) {
        await this.client.set(key, JSON.stringify(value))
    }

    async removeRedisData(key, client){
        await client.del(key)
    }
}

module.exports = RedisBaseService

const RedisBaseService = require('./RedisBaseService');

const USERS_KEY = 'users'
class RedisUserService extends RedisBaseService{
    constructor(client){
        super(client);
    }
    async getAllUsers(){
        return this.getRedisData(USERS_KEY)
    }
    async addNewUser(user){
        return this.push(user, USERS_KEY)
    }

    async removeUser(userId){
        let data = (await this.getAllUsers()) || [];
        const index = data.findIndex(item => item.id ===userId )
        if (index === -1 ) {
            return
        }
        data = data.filter(user => user.id !== userId);
        return await this.set(data,USERS_KEY)
    }

}

module.exports = RedisUserService

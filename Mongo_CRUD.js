const {MongoClient, ObjectId} = require("mongodb");
const url  = 'mongodb://localhost:27017';
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

async function check(username,password){
    try {
        const db = await client.db('DataBaseMedia');
        const collection =await db.collection('user-name');

        let value = await collection.findOne({"username":username});
        console.log(value);
        if(value != undefined && value.password === password)return true;
        else return false;
    } catch (error) {
        console.log(error);
        
    }
}
async function add(obj){
    try {
        const db = await client.db('DataBaseMedia');
        const collection =await db.collection('NewsApp');

        
        await collection.insertOne(obj)
       
    } catch (error) {
        console.log(error);
    }
}

async function allData(){

    try {
        const db = await client.db('DataBaseMedia');
        const collection =await db.collection('NewsApp');

        const data = await collection.find({}).toArray()
        
      //  console.log(data);
       return data;
    } catch (error) {
        console.log(error);
        
    }
    
}

async function latestNews(){
    try{
        const db =await client.db('DataBaseMedia');
        const collection = await db.collection('NewsApp');
        const data = await collection.find({}).sort({"published":-1}).limit(3).toArray();
        console.log(data);
        return data;

    }
    catch(err){
        console.log(error);
        return null;
    }
}
async function deleteOne(id){
    try{
      
        const db =await client.db('DataBaseMedia');
        const collection = await db.collection('NewsApp');
        const data = await collection.findOne({"_id":new ObjectId(id)});
        console.log(data);
        await collection.deleteOne({"_id":new ObjectId(id)})
        
       

    }
    catch(err){
        console.log(err);
       
    }

}

async function newUser(email,password){
    try{
      
        const db =await client.db('DataBaseMedia');
        const collection = await db.collection('user-name');
        const user = await collection.findOne({"username":email});
        if(user){
            return null;
        }
        console.log("hiii");
        await collection.insertOne({"username":email,"password":password});
        return 1;   
    }
    catch(err){
        console.log(err);
       
    }

}
module.exports = { allData, add, check, latestNews,deleteOne ,newUser};
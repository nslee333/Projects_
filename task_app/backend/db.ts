const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(process.env.URI, {useNewUrlParser: true});
import {ObjectId} from 'mongodb';

 // Function to fetch all current tasks.
export const fetchCollection = async () => {
    try {
        client.connect(async (err: Error) => {
            if (err) {
                return console.log("Unable to connect to database.")
            }
            const taskCollection = client.db("task_app").collection("tasks");
           
            const result = await taskCollection.find();
           
            client.close();
            return result;
        });

    } catch (error) {
        console.error(error);
    }
}

// Function to add a new task to the collection.
export const addTask = async (inputTask: string) => {
    try {
        client.connect(async (err: Error) => {
            const taskCollection = client.db("task_app").collection("tasks");

            const taskDocument = {
                task: inputTask,
            }

            await taskCollection.insertOne(taskDocument);
            client.close();
        });
        
    } catch (error) {
        console.error(error);
    }
}

// Delete a task from the database.
export const deleteTask = async (deleteId: ObjectId ) => {
    try {
        client.connect(async (err: Error) => {
            const taskCollection = client.db("task_app").collection("tasks");
            await taskCollection.deleteOne({_id: deleteId});
            client.close();
        })

    } catch (error) {
        console.error(error);
    }
}


module.exports = {fetchCollection, addTask, deleteTask}

import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';
import express from 'express';
import cors from 'cors';
import 'dotenv/config'


const port = process.env.port || 3000;
const app = express();

// middleware 
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Recipe Book server');
});




const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.7ngg3kc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        await client.connect();
        // create db
        const recipeCollection = client.db('recipedb').collection('recipes');

        //  all the recipe data from db
        app.get('/all-recipe', async (req, res) => {
            const cursor = recipeCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        // recipe details 
        app.get('/recipe-details/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await recipeCollection.findOne(query);
            res.send(result);
        });

        // my-recipes from db
        app.get('/my-recipes/', async (req, res) => {
            const email = req.query.email;

            const result = await recipeCollection.find({ 'user.email': email }).toArray();
            res.send(result);

        });

        // save recipe data from client to db
        app.post('/recipe', async (req, res) => {
            const recipe = req.body;
            const result = await recipeCollection.insertOne(recipe);
            res.send(result);

        });

        app.put('/recipe-update/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const updateRecipe = req.body;
            const updatedoct = {
                $set: updateRecipe
            }
            const result = await recipeCollection.updateOne(query, updatedoct);
            res.send(result);
        });

        // delete my recipe 
        app.delete('/recipe-delete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await recipeCollection.deleteOne(query);
            res.send(result);
        });

        app.patch('/like-update/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const likes = req.body;

            const updatedDoc = {
                $set: likes
            };

            const result = await recipeCollection.updateOne(query, updatedDoc, { upsert: true });
            res.send(result);
        });







    } finally {

        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`Server is running on port : ${port}`);

})

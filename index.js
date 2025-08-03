// XEfVIkwK2lzGUsIb
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
    res.send('Recipe Book server is getting hotter');
});




const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.7ngg3kc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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
        //  const coffeesCollection = client.db('coffeedb').collection('coffees');
        const recipeCollection = client.db('recipedb').collection('recipes');

        app.post('/recipe', async (req, res) => {
            const recipe = req.body;
            const result = await recipeCollection.insertOne(recipe);
            res.send(result);

        });

        app.get('/all-recipe', async (req, res) => {
            const cursor = recipeCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/recipe-details/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id : new ObjectId(id)};
            const result = await recipeCollection.findOne(query);
            res.send(result);
        });

        app.get('/my-recipes/',async(req,res)=>{
            const email = req.query.email;
            
            const result = await recipeCollection.find({'user.email':email}).toArray();
            res.send(result);
            
        })






    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`Server is running on port : ${port}`);

})

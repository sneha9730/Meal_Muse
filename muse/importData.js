const fs = require('fs');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function importData() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const database = client.db('MealMuse');
        const collection = database.collection('recipes');

        // Read JSON file
        const data = JSON.parse(fs.readFileSync('C:/Users/usika/Downloads/recipes_forms_data.json', 'utf8'));

        const transformedData = data.map((recipe) => {
            return {
                ...recipe,
                Keywords: recipe.Keywords ? recipe.Keywords.split(", ").map(keyword => keyword.replace(/c\(|\)|"/g, '')) : [],
                LifestyleGoals: recipe.LifestyleGoals ? JSON.parse(recipe.LifestyleGoals.replace(/'/g, '"')) : [],
            };
        });
        

        // Insert transformed data into MongoDB
        const result = await collection.insertMany(transformedData);
        console.log(`${result.insertedCount} recipes were inserted`);

    } catch (error) {
        console.error('Error importing data:', error);
    } finally {
        await client.close();
    }
}

importData();

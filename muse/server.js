const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Note = require('./models/Note');
require('dotenv').config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let userCollection;
let recipeCollection;

async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');

        userCollection = client.db('Login').collection('Users');
        recipeCollection = client.db('MealMuse').collection('recipes');
        noteCollection = client.db('MealMuse').collection('notes');
        
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
}

connectToDatabase();

process.on('SIGINT', async () => {
    await client.close();
    console.log('MongoDB connection closed.');
    process.exit(0);
});
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

app.get('/', (req, res) => {
    res.send('Welcome to the Meal Recommendation API!');
});

app.get('/recipes', async (req, res) => {
    const { minTime, maxTime, minCalories, maxCalories, ingredients = '', DietaryCategory = '', page = 1, limit = 20 } = req.query;

    try {
        let filter = {};

        if (minTime && maxTime) {
            filter.TotalTime = { $gte: parseInt(minTime), $lte: parseInt(maxTime) };
        }

        if (minCalories && maxCalories) {
            filter.Calories = { $gte: parseInt(minCalories), $lte: parseInt(maxCalories) };
        }

        if (ingredients) {
            const ingredientsArray = ingredients.split(',').map(ingredient => ingredient.trim());
            const regexArray = ingredientsArray.map(ingredient => new RegExp(ingredient, 'i'));
            filter.RecipeIngredientParts = { $all: regexArray };
        }

        if (DietaryCategory) {
            filter.DietaryCategory = { $regex: new RegExp(`^${DietaryCategory.trim().toLowerCase()}$`, 'i') };
        }

        const totalRecipes = await recipeCollection.countDocuments(filter);
        const recipes = await recipeCollection
            .find(filter)
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .toArray();

        res.json({
            totalRecipes,
            recipes,
            totalPages: Math.ceil(totalRecipes / limit),
            currentPage: parseInt(page),
        });
    } catch (error) {
        console.error('Error fetching recipes:', error.message);
        res.status(500).json({ message: 'Error fetching recipes', error: error.message });
    }
});

app.get('/recipe/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const recipe = await recipeCollection.findOne({ RecipeId: parseInt(id) });

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        res.json(recipe);
    } catch (error) {
        console.error('Error fetching recipe by ID:', error.message);
        res.status(500).json({ message: 'Error fetching recipe details', error: error.message });
    }
});
app.get('/search', async (req, res) => {
    const { query, category, page = 1, limit = 10 } = req.query;
  
    try {
      let filter = {};
  
      if (query) {
        filter.Name = { $regex: query, $options: 'i' };
      }
  
      if (category) {
        filter.RecipeCategory = { $regex: category, $options: 'i' };
      }

      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);

      const results = await recipeCollection
        .find(filter)
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber)
        .toArray();

      const totalCount = await recipeCollection.countDocuments(filter);
      const totalPages = Math.ceil(totalCount / limitNumber);
  
      res.json({
        results,
        totalCount,
        totalPages,
        currentPage: pageNumber
      });
    } catch (error) {
      console.error('Error during search:', error.message);
      res.status(500).json({ message: 'Error searching recipes', error: error.message });
    }
  });
const acceptableCategories = ['vegetarian', 'non-vegetarian', 'eggitarian', 'vegan', 'pescatarian'];
app.get('/recipes-by-diet', async (req, res) => {
    const { DietaryCategory, page = 1, limit = 20 } = req.query;

    try {
        const filter = {};

        if (DietaryCategory) {
            const normalizedCategory = DietaryCategory.trim().toLowerCase();
            if (acceptableCategories.includes(normalizedCategory)) {
                filter.DietaryCategory = { $regex: new RegExp(`^${normalizedCategory}$`, 'i') };
            } else {
                return res.status(400).json({ message: 'Invalid dietary category' });
            }
        }

        const totalRecipes = await recipeCollection.countDocuments(filter);
        const recipes = await recipeCollection
            .find(filter)
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .toArray();

        res.json({
            totalRecipes,
            recipes,
            totalPages: Math.ceil(totalRecipes / limit),
            currentPage: parseInt(page),
        });
    } catch (error) {
        console.error('Error fetching recipes by dietary category:', error.message);
        res.status(500).json({ message: 'Error fetching recipes by dietary category', error: error.message });
    }
});

app.get('/recipes-by-nutrition-and-diet', async (req, res) => {
    const { LifestyleGoals, DietaryCategory, page = 1, limit = 20 } = req.query;
    console.log('Query Parameters:', req.query);

    try {
        const database = client.db('MealMuse');
        const collection = database.collection('recipes');

        const filter = {};
        if (DietaryCategory) {
            const normalizedCategory = DietaryCategory.trim().toLowerCase();
            filter.DietaryCategory = { $regex: new RegExp(`^${normalizedCategory}$`, 'i') };
        }

        if (LifestyleGoals) {
            const goalsArray = Array.isArray(LifestyleGoals) ? LifestyleGoals : [LifestyleGoals];
            filter.LifestyleGoals = { $elemMatch: { $in: goalsArray } };
        }

        const totalRecipes = await collection.countDocuments(filter);
        console.log('Total Recipes Found:', totalRecipes);

        const recipes = await collection
            .find(filter)
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .toArray();

        console.log(`Number of recipes retrieved for LifestyleGoals "${LifestyleGoals}" and DietaryCategory "${DietaryCategory}" (page ${page}): ${recipes.length}`);

        res.json({
            totalRecipes,
            recipes,
            totalPages: Math.ceil(totalRecipes / limit),
            currentPage: parseInt(page),
        });
    } catch (error) {
        console.error('Error fetching recipes by nutrition and diet:', error);
        res.status(500).send('Error fetching recipes by nutrition and diet');
    }
});
app.get('/mealtype', async (req, res) => {
    const {
        DietaryCategory = '',
        Ingredients_to_Avoid = '',
        HealthGoals = '',
        MealType = '',
        HealthCondition = '',
        page = 1,
        limit = 20,
    } = req.query;

    try {
        let filter = {};

        if (DietaryCategory) {
            filter.DietaryCategory = { $regex: new RegExp(`^${DietaryCategory.trim()}$`, 'i') };
        }

        if (Ingredients_to_Avoid) {
            const ingredientsArray = Ingredients_to_Avoid.split(',').map(item => item.trim());
            filter.RecipeIngredientParts = { $not: { $in: ingredientsArray.map(ingredient => new RegExp(ingredient, 'i')) } };
        }

        if (HealthGoals) {
            filter.HealthGoals = { $regex: new RegExp(`^${HealthGoals.trim()}$`, 'i') };
        }

        if (MealType) {
            filter.MealType = { $regex: new RegExp(`^${MealType.trim()}$`, 'i') };
        }

        if (HealthCondition) {
            filter.HealthCondition = { $regex: new RegExp(`^${HealthCondition.trim()}$`, 'i') };
        }

        const totalRecipes = await recipeCollection.countDocuments(filter);
        const recipes = await recipeCollection.find(filter).skip((page - 1) * limit).limit(parseInt(limit)).toArray();

        res.json({
            totalRecipes,
            recipes,
            totalPages: Math.ceil(totalRecipes / limit),
            currentPage: parseInt(page),
        });
    } catch (error) {
        console.error('Error fetching filtered recipes:', error.message);
        res.status(500).json({ message: 'Error fetching recipes', error: error.message });
    }
});

app.post('/register', async (req, res) => {
    const { email, password, name } = req.body;
    try {
        const existingUser = await userCollection.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { email, name, password: hashedPassword, favorites: [] };
        const result = await userCollection.insertOne(newUser);

        const token = jwt.sign({ userId: result.insertedId }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            email: newUser.email,
            name: newUser.name,
            _id: result.insertedId,
            token
        });
    } catch (error) {
        console.error('Error registering user:', error.message);
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userCollection.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        res.json({
            _id: user._id,
            email: user.email,
            name: user.name,
            photo: user.photo,
            favorites: user.favorites,
            token,
        });
    } catch (error) {
        console.error('Error logging in user:', error.message);
        res.status(500).json({ message: 'Error logging in user', error: error.message });
    }
});

app.get('/user/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    console.log("Fetching user with ID:", id);
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const userId = req.user.userId;
        console.log("Fetching user with ID from token:", userId);
        const user = await userCollection.findOne({ _id: new ObjectId(userId) });
        console.log("User data from database:", user);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            _id: user._id,
            email: user.email,
            name: user.name,
            photo: user.photo,
            favorites: user.favorites,
        });
    } catch (error) {
        console.error('Error fetching user details:', error.message);
        res.status(500).json({ message: 'Error fetching user details', error: error.message });
    }
});
app.get('/user', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    try {
        const user = await userCollection.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            _id: user._id,
            email: user.email,
            name: user.name,
            photo: user.photo,
            favorites: user.favorites,
        });
    } catch (error) {
        console.error('Error fetching user details:', error.message);
        res.status(500).json({ message: 'Error fetching user details', error: error.message });
    }
});

app.put('/user/:userId/favorites', authenticateToken, async (req, res) => {
    const userId = req.params.userId;
    const { recipeId } = req.body;

    try {
        if (!req.user || req.user.userId !== userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await userCollection.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const favorites = user.favorites;
        if (favorites.includes(recipeId)) {
            await userCollection.updateOne(
                { _id: new ObjectId(userId) },
                { $pull: { favorites: recipeId } }
            );
            return res.status(200).json({ message: 'Recipe removed from favorites' });
        } else {
            await userCollection.updateOne(
                { _id: new ObjectId(userId) },
                { $addToSet: { favorites: recipeId } }
            );
            return res.status(200).json({ message: 'Recipe added to favorites' });
        }
    } catch (error) {
        console.error('Error updating favorites:', error.message);
        res.status(500).json({ message: 'Error updating favorites', error: error.message });
    }
});

app.get('/users/:userId/favorites', authenticateToken, async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await userCollection.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const favorites = user.favorites;
        const favoriteRecipes = await recipeCollection.find({ RecipeId: { $in: favorites } }).toArray();
        
        res.json(favoriteRecipes);
    } catch (error) {
        console.error('Error fetching favorite recipes:', error.message);
        res.status(500).json({ message: 'Error fetching favorite recipes', error: error.message });
    }
});
app.put('/user/:userId/photo', authenticateToken, async (req, res) => {
    const userId = req.params.userId;
    const { photo } = req.body;
  
    if (!photo) {
      return res.status(400).json({ message: "No photo URL provided." });
    }
  
    try {
      if (!req.user || req.user.userId !== userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
  
      const result = await userCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { photo } }
      );
  
      if (result.modifiedCount === 0) {
        return res.status(404).json({ message: "User not found or no change made." });
      }
  
      res.json({ message: "Profile picture updated successfully!" });
    } catch (error) {
      console.error("Error updating profile picture:", error);
      res.status(500).json({
        message: "Error updating profile picture",
        error: error.message || "Unknown error"
      });
    }
  });
  app.get('/related-recipes', async (req, res) => {
    const { ingredients, category, dietaryCategory, minRating, maxTotalTime, keywords } = req.query;
    
    // Parse ingredients
    const ingredientArray = ingredients
        .replace(/c\(|\)|"/g, '')
        .split(',')
        .map(ingredient => ingredient.trim());

    // Build the query object
    const query = { $or: ingredientArray.map(ingredient => ({
        RecipeIngredientParts: { $regex: new RegExp(`\\b${ingredient}\\b`, 'i') }
    })) };

    if (category) {
        query.RecipeCategory = category;
    }

    if (dietaryCategory) {
        query.DietaryCategory = dietaryCategory;
    }

    if (minRating) {
        query.AggregatedRating = { $gte: parseFloat(minRating) };
    }

    if (maxTotalTime) {
        query.TotalTime = { $lte: parseInt(maxTotalTime, 10) };
    }

    if (keywords) {
        const keywordArray = keywords.split(',').map(keyword => keyword.trim());
        query.Keywords = { $in: keywordArray };
    }

    try {
        const relatedRecipes = await recipeCollection.find(query).limit(11).toArray();
        res.json({ recipes: relatedRecipes });
    } catch (error) {
        console.error('Error fetching related recipes:', error.message);
        res.status(500).json({ message: 'Error fetching related recipes', error: error.message });
    }
});
app.post('/note', authenticateToken, async (req, res) => {
    const { recipeId, note } = req.body;
    const userId = req.user.userId;

    console.log("Received note:", { userId, recipeId, note });

    try {
        const existingNote = await noteCollection.findOne({ userId, recipeId });
        console.log("Existing note:", existingNote);

        if (existingNote) {
            const result = await noteCollection.updateOne(
                { _id: existingNote._id },
                { $set: { note } }
            );
            console.log("Update result:", result);
            if (result.modifiedCount === 0) {
                return res.status(400).json({ message: 'No changes made to the note' });
            }
            res.json({ message: 'Note updated successfully' });
        } else {
            const result = await noteCollection.insertOne({ userId, recipeId, note });
            console.log("Insert result:", result);
            res.json({ message: 'Note saved successfully' });
        }
    } catch (error) {
        console.error('Error saving note:', error);
        res.status(500).json({ message: 'Error saving note', error: error.message });
    }
});

app.get('/note/:recipeId', authenticateToken, async (req, res) => {
    const { recipeId } = req.params;
    const userId = req.user.userId;

    try {
        const note = await noteCollection.findOne({
            userId,
            recipeId,
        });
        res.json(note ? { note: note.note } : { note: '' });
    } catch (error) {
        console.error('Error retrieving note:', error);
        res.status(500).json({ message: 'Error retrieving note' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
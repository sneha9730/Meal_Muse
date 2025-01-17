import React, { useState, useEffect, useCallback } from 'react'; 
import { useParams } from 'react-router-dom';
import StarRating from './StarRating';
import MealCards from './MealCards'; 
import '../styles/Recipe.css';
import Fav from '../assests/Heart.png';
import Mail from '../assests/Mail.png';
import Pdf from '../assests/Pdf.png';

const RecipeDetails = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [relatedRecipes, setRelatedRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFavorited, setIsFavorited] = useState(false);
    const [note, setNote] = useState(''); // State for the note
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    const checkIfFavorited = useCallback((recipeId) => {
        if (token && userId) {
            fetch(`http://localhost:5000/user/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.favorites && data.favorites.includes(recipeId)) {
                    setIsFavorited(true);
                }
            })
            .catch(error => {
                console.error('Error fetching user favorites:', error);
                setError('Could not fetch favorites.');
            });
        }
    }, [token, userId]);

    useEffect(() => {
        const fetchRecipe = async () => {
            console.log('Fetching recipe with ID:', id);
            try {
                const response = await fetch(`http://localhost:5000/recipe/${id}`);
                if (!response.ok) {
                    throw new Error('Recipe not found');
                }
                const data = await response.json();
                console.log('Fetched recipe data:', data);
                setRecipe(data);
                checkIfFavorited(data.RecipeId);
                
                const ingredients = data.RecipeIngredientParts.replace(/c\(|\)/g, '').replace(/"/g, '').split(',');
                const category = data.RecipeCategory;
                const dietaryCategory = data.DietaryCategory;
                const minRating = 4;
                const maxTotalTime = 60;
                
                console.log('Ingredients for related recipes:', ingredients);
                fetchRelatedRecipes(ingredients.join(','), category, dietaryCategory, minRating, maxTotalTime);

                // Fetch the existing note for this recipe
                fetchNote();
            } catch (error) {
                console.error('Error fetching recipe:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchNote = async () => {
            if (token && userId) {
                try {
                    const response = await fetch(`http://localhost:5000/note/${id}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setNote(data.note || '');  // Set the note if it exists, otherwise set an empty string
                    } else {
                        console.error('Failed to fetch note');
                        setNote('');  // Default to an empty note if fetching fails
                    }
                } catch (error) {
                    console.error('Error fetching note:', error);
                    setNote('');  // Default to an empty note if an error occurs
                }
            }
        };
        
        fetchRecipe();
    }, [id, checkIfFavorited, token, userId]);

    const fetchRelatedRecipes = async (ingredientString, category, dietaryCategory, minRating, maxTotalTime) => {
        try {
            const response = await fetch(`http://localhost:5000/related-recipes?ingredients=${ingredientString}&category=${category}&dietaryCategory=${dietaryCategory}&minRating=${minRating}&maxTotalTime=${maxTotalTime}`);
            if (!response.ok) {
                throw new Error('Failed to fetch related recipes');
            }
            const data = await response.json();
            setRelatedRecipes(data.recipes);
        } catch (error) {
            console.error('Error fetching related recipes:', error);
            setError('Could not fetch related recipes.');
        }
    };

    const handleFavoriteToggle = async () => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!userId || !token) {
            alert('You must be logged in to add favorites.');
            return;
        }

        const response = await fetch(`http://localhost:5000/user/${userId}/favorites`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ recipeId: recipe.RecipeId })
        });

        if (response.ok) {
            setIsFavorited(prevState => !prevState);
        } else {
            const errorMessage = await response.text();
            console.error('Failed to update favorites:', response.statusText);
            alert(`Error: ${errorMessage}`);
        }
    };

    const handleNoteChange = (e) => {
        setNote(e.target.value);
    };

    const handleSaveNote = async () => {
        if (!token || !userId) {
            alert('You must be logged in to save notes.');
            return;
        }
    
        try {
            const response = await fetch('http://localhost:5000/note', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    recipeId: recipe.RecipeId,
                    note
                })
            });
    
            if (response.ok) {
                alert('Note saved successfully');
                setNote(note); // Update state with the latest note
            } else {
                const errorMessage = response.headers.get('Content-Type').includes('application/json')
                    ? await response.json()
                    : await response.text();
                alert(`Error: ${errorMessage.message || errorMessage}`);
            }
        } catch (error) {
            console.error('Error saving note:', error);
            alert('An error occurred while saving your note.');
        }
    };
    

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!recipe) {
        return <div>Recipe not found</div>;
    }

    const ingredientQuantities = recipe.RecipeIngredientQuantities.replace(/c\(|\)/g, '').replace(/"/g, '').split(',');
    const ingredientParts = recipe.RecipeIngredientParts.replace(/c\(|\)/g, '').replace(/"/g, '').split(',');
    const instructions = recipe.RecipeInstructions.replace(/c\(|\)/g, '').replace(/"/g, '').split(',');

    return (
        <div id="pdf-content" className="recipe-details">
            <div className="row my-3">
                <div className="col-md-6">
                    <img src={recipe.Images} alt={recipe.Name} className="img-fluid rounded" />
                </div>
                <div className="col-md-6">
                    <h2 className="text-warning" id="title">{recipe.Name}</h2>
                    <p className="text-uppercase text-muted" id="cat">{recipe.RecipeCategory}</p>
                    <p className="text-light" id="description">{recipe.Description}</p>
                    <div className="d-flex align-items-center">
                        <StarRating rating={recipe.AggregatedRating} className="text-warning" />
                        <p className="ms-2" id="count">{recipe.ReviewCount} ratings</p>
                    </div>
                    
                    <div className="row text-center my-3 recipe-stats">
                        <div className="col">
                            <p className="h4" id="number">{recipe.Calories}</p>
                            <span id="value">Calories</span>
                        </div>
                        <div className="col separator">
                            <p className="h4" id="number">{recipe.TotalTime}</p>
                            <span id="value">Minutes</span>
                        </div>
                        <div className="col separator">
                            <p className="h4" id="number">{recipe.RecipeServings}</p>
                            <span id="value">Servings</span>
                        </div>
                    </div>
                    <div className="button-container">
                    <button 
                            className={`fav-button ${isFavorited ? 'favorited' : ''}`} 
                            onClick={handleFavoriteToggle} 
                        >
                            <img src={Fav} alt="Heart" className="button-icon" />
                            {isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
                        </button>
                        <button className="gmail-button">
                            <img src={Mail} alt="Send Gmail" className="button-icon" /> Send Gmail
                        </button>
                        <button className="pdf-button" onClick={() => window.print()}>
                            <img src={Pdf} alt="Print PDF" className="button-icon" /> Print PDF
                        </button>
                    </div>
                </div>
            </div>

            <div className="my-3" id="pad">
                <h3 className="text-warning" id="head1">NUTRIENT CONTENT</h3>
                <div className="row text-center">
                    {["FatContent", "CholesterolContent", "CarbohydrateContent", "ProteinContent", "SugarContent", "FiberContent", "SodiumContent"].map((nutrient, index) => (
                        <div className="col" key={index}>
                            <p className="h5">{recipe[nutrient]}</p>
                            <span className='label'>{nutrient.replace('Content', '')}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="my-3" id="pad">
                <h3 className="text-warning" id="head1">INGREDIENTS</h3>
                <ul className="list-styled" id="ingred">
                    {ingredientQuantities.map((quantity, index) => (
                        <li key={index}>
                            {quantity} {ingredientParts[index]} 
                        </li>
                    ))}
                </ul>
            </div>

            <div className="my-3" id="pad">
                <h3 className="text-warning" id="head1">RECIPE</h3>
                <ol className="ps-4" id="dir">
                    {instructions.map((instruction, index) => (
                        <li key={index}>{instruction}</li>
                    ))}
                </ol>
            </div>
            <div className="my-3" id="pad">
                <h3 className="text-warning" id="head1">NOTES</h3>
                <div className="notes-container">
                    <textarea 
                        id="recipe-notes" 
                        placeholder="Write your notes here..." 
                        rows="5" 
                        value={note}
                        onChange={handleNoteChange}
                    />
                    <button className="save-notes" onClick={handleSaveNote}>Save Notes</button>
                </div>
            </div>
            <div className="my-3 recommendations-section">
                <h3 className="text-danger" id="recommend-title">You Might Like</h3>
                <div className="recommendations">
                    {relatedRecipes.length > 0 ? (
                        relatedRecipes
                            .filter(relatedRecipe => relatedRecipe.RecipeId !== recipe.RecipeId)
                            .map((relatedRecipe) => (
                                <MealCards key={relatedRecipe.RecipeId} recipe={relatedRecipe} />
                            ))
                    ) : (
                        <p>No related recipes found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecipeDetails;

import React, { useState } from 'react';
import questions from './file.json'; // Importing questions JSON file
import MealCards from '../components/MealCards'; // Import the MealCards component
import '../styles/mcqs.css';

const MultipleChoiceQuestion = () => {
    const [selectedOptions, setSelectedOptions] = useState(questions.map(() => []));
    const [mealResults, setMealResults] = useState([]);
    const [resultMessage, setResultMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const questionData = questions;

    const handleOptionChange = (questionIndex, option) => {
        setSelectedOptions(prev => {
            const questionOptions = prev[questionIndex] || [];
            const newOptions = questionOptions.includes(option)
                ? questionOptions.filter(o => o !== option)
                : [...questionOptions, option];

            const newSelectedOptions = [...prev];
            newSelectedOptions[questionIndex] = newOptions;
            return newSelectedOptions;
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const selectedData = selectedOptions.flatMap((options, index) =>
            options.map(option => ({ questionIndex: index, selectedOption: option }))
        );

        const baseUrl = 'http://localhost:5000/mealtype'; // Ensure this endpoint is correct
        const params = new URLSearchParams({
            page: 1,
            limit: 20,
        });

        selectedData.forEach(item => {
            const { questionIndex, selectedOption } = item;
            switch (questionIndex) {
                case 0:
                    params.append('DietaryCategory', selectedOption);
                    break;
                case 1:
                    params.append('Ingredients_to_Avoid', selectedOption); // Ensure you concatenate ingredients
                    break;
                case 2:
                    params.append('HealthGoals', selectedOption);
                    break;
                case 3:
                    params.append('MealType', selectedOption);
                    break;
                case 4:
                    params.append('HealthCondition', selectedOption);
                    break;
                default:
                    break;
            }
        });

        const url = `${baseUrl}?${params.toString()}`;

        try {
            const response = await fetch(url, { method: 'GET' });
            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Failed to fetch meals: ${errorMessage}`);
            }
            const data = await response.json();
            setMealResults(data.recipes); // Ensure you are accessing the correct key in the response
            setResultMessage(`${data.recipes.length} meal${data.recipes.length !== 1 ? 's' : ''} found!`);
            setSelectedOptions(questions.map(() => []));
        } catch (error) {
            console.error('Error fetching the meals:', error);
            setResultMessage('There was an error fetching the meals. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='context-mcqs'>
            <div className="form-container">
                <form onSubmit={handleSubmit} className="Form">
                    {questionData.map((q, questionIndex) => (
                        <div className="question-section" key={questionIndex}>
                            <h2>{q.question}</h2>
                            {q.options.map((option, index) => (
                                <div key={index}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            value={option}
                                            checked={selectedOptions[questionIndex].includes(option)}
                                            onChange={() => handleOptionChange(questionIndex, option)}
                                        />
                                        {option}
                                    </label>
                                </div>
                            ))}
                        </div>
                    ))}
                    <button type="submit" disabled={loading}>Submit</button>
                </form>
                {loading && <div>Loading...</div>}
                {resultMessage && <div className="result-message">{resultMessage}</div>}
            </div>
            <div className="results-container">
                {mealResults.length > 0 && (
                    <div className="meal-results">
                        <h3>Meal Results:</h3>
                        <div className="meal-cards-container">
                            {mealResults.map((meal, index) => (
                                <MealCards key={index} recipe={meal} /> // Pass meal data to MealCards component
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MultipleChoiceQuestion;

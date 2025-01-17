import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MealCards from "../components/MealCards";
import './Profile.css';
import pfp1 from './images/pfp1.jpeg';
import pfp2 from './images/pfp2.jpg';
import pfp3 from './images/pfp3.jpg';
import pfp4 from './images/pfp4.jpg';
import pfp5 from './images/pfp5.jpg';
import pfp6 from './images/pfp6.jpg';
import pfp7 from './images/pfp7.jpg';
import pfp8 from './images/pfp8.jpg';
import pfp9 from './images/pfp9.png';
import pfp10 from './images/pfp10.png';
import pfp11 from './images/pfp11.png';
import pfp12 from './images/pfp12.png';
import pfp13 from './images/pfp13.png';
import pfp14 from './images/pfp14.jpg';
import pfp15 from './images/pfp15.jpg';

function Profile() {
  const [userDetails, setUserDetails] = useState(null);
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProfilePic, setSelectedProfilePic] = useState("/default-profile.png");
  const [isEditingPic, setIsEditingPic] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const getUserIdFromToken = (token) => {
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId;
  };

  const userId = getUserIdFromToken(token);

  useEffect(() => {
    const fetchUserDetailsAndFavorites = async () => {
      if (userId) {
        try {
          const userResponse = await axios.get(`http://localhost:5000/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUserDetails(userResponse.data);
          setSelectedProfilePic(userResponse.data.photo);

          const favoritesResponse = await axios.get(`http://localhost:5000/users/${userId}/favorites`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setFavoriteRecipes(favoritesResponse.data);
        } catch (error) {
          const errorMessage = error.response
            ? error.response.data.message
            : "Error fetching data. Please try again later.";
          setError(errorMessage);
        }
      } else {
        setError("No token found. Please log in again.");
        navigate("/login");
      }
      setLoading(false);
    };

    fetchUserDetailsAndFavorites();
  }, [token, navigate, userId]);


  const handleProfilePicSelect = (image) => {
    setSelectedProfilePic(image);
  };

  const saveProfilePic = async () => {
    try {
      await axios.put(
        `http://localhost:5000/user/${userId}/photo`,
        { photo: selectedProfilePic },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Profile picture updated successfully!");
      setIsEditingPic(false); // Hide options after saving
    } catch (error) {
      console.error("Error updating profile picture:", error);
      alert("Failed to update profile picture.");
    }
  };

  if (loading) return <p className="loading-message">Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="profile-container">
      <div className="dashboard-content">
        <div className="profile-grid">
          <div className="profile-section">
            <div className="profile-header">
              <img
                src={selectedProfilePic}
                alt={`${userDetails?.name}'s profile`}
                className="profile-image"
              />
              <h3 className="Name">Welcome, {userDetails?.name}</h3>
              <p>{userDetails?.email}</p>
            </div>

            <button
              className="edit-profile-pic-button"
              onClick={() => setIsEditingPic((prev) => !prev)}
            >
              {isEditingPic ? "Cancel" : "Edit Profile Picture"}
            </button>

            {isEditingPic && (
              <div className="profile-pic-options">
                {[pfp1,pfp2,pfp3,pfp4,pfp5,pfp6,pfp7,pfp8,pfp9,pfp10,pfp11,pfp12,pfp13,pfp14,pfp15].map((image, index) => (
                  <div
                    key={index}
                    className={`profile-pic-option ${selectedProfilePic === image ? "selected" : ""}`}
                    onClick={() => handleProfilePicSelect(image)}
                    style={{
                      backgroundImage: `url(${image})`,
                      backgroundSize: 'cover',
                      width: '40px',
                      height: '40px',
                      cursor: 'pointer',
                      margin: '5px',
                    }}
                    title={`Choose image ${index + 1}`}
                  />
                ))}
                <button onClick={saveProfilePic} className="save-profile-pic-button">Save Profile Picture</button>
              </div>
            )}
          </div>

          <div className="image-section">
            <h1 className="dashboard-title">Recipe Haven 🌟</h1>
            <h4>Your Favorite Recipes:</h4>
            <div className="meal-cards-container">
              {favoriteRecipes.length > 0 ? (
                favoriteRecipes.map((recipe) => <MealCards key={recipe.RecipeId} recipe={recipe} />)
              ) : (
                <p>No favorite recipes found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

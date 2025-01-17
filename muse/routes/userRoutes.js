const express = require('express');
const { ObjectId } = require('mongodb');
const { authenticateJWT } = require('../middleware'); // Ensure this points to the correct middleware file

const router = express.Router();

// Route to update user profile picture
router.put('/:userId/profile-pic', authenticateJWT, async (req, res) => { // Use authenticateJWT instead
    const userId = req.params.userId;
    const { profilePic } = req.body; // Expecting the new profile picture URL in the body

    try {
        // Validate the token
        if (!req.user || req.user.userId !== userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const updatedUser = await userCollection.findOneAndUpdate(
            { _id: new ObjectId(userId) },
            { $set: { photo: profilePic } }, // Update the 'photo' field with the new URL
            { returnOriginal: false } // Return the updated document
        );

        if (!updatedUser.value) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            message: 'Profile picture updated successfully',
            user: updatedUser.value // Optionally return the updated user data
        });
    } catch (error) {
        console.error('Error updating profile picture:', error.message);
        res.status(500).json({ message: 'Error updating profile picture', error: error.message });
    }
});

module.exports = router;


const User = require('../models/User');

exports.updateUserProfile = async (req, res) => {
  const { id } = req.params; 
  const { bio } = req.body; 

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }


    await user.save();
    const { password, ...updatedUser } = user._doc;
    res.status(200).json(updatedUser);

  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error during profile update' });
  }
};
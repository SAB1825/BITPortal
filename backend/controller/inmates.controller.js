import User from "../model/user.model.js";
import Inmates from "../model/inmates.model.js";

export const addInmate = async (req, res) => {
    try {
      const userId = req.user.userId;
      const { name, relation, phoneNumber } = req.body;
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const newInmate = new Inmates({
        name,
        relation,
        phoneNumber
      });
  
      await newInmate.save();
  
      user.inmates.push(newInmate._id);
      await user.save();
  
      res.status(201).json({ message: 'Inmate added successfully', inmate: newInmate });
    } catch (error) {
      console.error('Add inmate error:', error);
      res.status(500).json({ error: 'An error occurred while adding the inmate' });
    }
  };
  
  export const getInmates = async (req, res) => {
    try {
      const userId = req.user.userId;
      const user = await User.findById(userId).populate('inmates');
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json({ inmates: user.inmates });
    } catch (error) {
      console.error('Get inmates error:', error);
      res.status(500).json({ error: 'An error occurred while fetching inmates' });
    }
  };

export const updateInmate = async (req, res) => {
  try {
    const userId = req.user.userId;
    const inmateId = req.params.id;
    const { name, relation, phoneNumber } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const inmate = await Inmates.findById(inmateId);
    if (!inmate) {
      return res.status(404).json({ error: 'Inmate not found' });
    }

    inmate.name = name;
    inmate.relation = relation;
    inmate.phoneNumber = phoneNumber;

    await inmate.save();

    res.status(200).json({ message: 'Inmate updated successfully', inmate });
  } catch (error) {
    console.error('Update inmate error:', error);
    res.status(500).json({ error: 'An error occurred while updating the inmate' });
  }
};

export const deleteInmate = async (req, res) => {
  try {
    const userId = req.user.userId;
    const inmateId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const inmate = await Inmates.findById(inmateId);
    if (!inmate) {
      return res.status(404).json({ error: 'Inmate not found' });
    }

    // Remove the inmate from the user's inmates array
    user.inmates = user.inmates.filter(id => id.toString() !== inmateId);
    await user.save();

    // Delete the inmate document
    await Inmates.findByIdAndDelete(inmateId);

    res.status(200).json({ message: 'Inmate deleted successfully' });
  } catch (error) {
    console.error('Delete inmate error:', error);
    res.status(500).json({ error: 'An error occurred while deleting the inmate' });
  }
};
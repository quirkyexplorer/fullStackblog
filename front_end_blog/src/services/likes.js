import axios from 'axios';
const baseUrl = 'http://localhost:3003/api/blogs';

const updateLikes = async (id, newObject) => {
  try {
    // console.log('id', id, 'newobject', newObject);
    const response = await axios.patch(`${ baseUrl}/${id}/like`, newObject);
    return response.data;
  } catch(error) {
    console.error('Error updating likes:', error.message);
    throw error;
  }
};

const getById = async (id) => {
  const response = await axios.get(`${ baseUrl}/${id}`);
  return response.data;
};

export default { updateLikes, getById };
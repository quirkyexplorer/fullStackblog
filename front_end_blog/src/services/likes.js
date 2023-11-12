import axios from "axios";
const baseUrl = 'http://localhost:3003/api/blogs';

const update = async (id, newObject) => {
  const response = await axios.put(`${ baseUrl}/${id}`, newObject);
  return response.data;
}

export default { update };
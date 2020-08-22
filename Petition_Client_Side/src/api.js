import axios from 'axios'
const SERVER_URL = 'http://localhost:4941/api/v1'

const localAxiosInstance = axios.create({
  baseURL: SERVER_URL,
  timeout: 100000
});

export default {
  getPetitions: () =>localAxiosInstance.get('/petitions'),
  createPetition: (token) =>localAxiosInstance.post('/petitions', {headers: {'X-Authorization': token}})

}

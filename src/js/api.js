import axios from 'axios';
axios.defaults.baseURL = 'https://deserts-store.b.goit.study/api';

async function getData(url, params = {}) {
    try {
        const response = await axios(url, params);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

async function MakeOrder(params) {
    try {
        const response = await axios.post('/orders', params);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export { getData, MakeOrder };
export default getData;
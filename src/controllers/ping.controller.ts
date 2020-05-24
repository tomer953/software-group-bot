import axios from 'axios';

const URL = process.env.URL || "";

export async function pingHeroku() {
    try {
        await axios.get(URL);
    } catch (error) {
        // ignore error from the ping
    }
}
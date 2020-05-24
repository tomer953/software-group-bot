import axios from 'axios';

const URL = process.env.URL || "";

export async function pingHeroku() {
    try {
        await axios.get(URL);
    } catch (error) {
        // probably will return error, but still does the ping work
        // so ignore it
    }
}
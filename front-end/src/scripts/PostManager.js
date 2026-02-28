// scripts/PostManager.js (ou onde estiver sua ApiService)
import axios from "axios";

class ApiService {
    static defaultIp = "http://localhost:8080"

    static async Get(apiLink) {
        try {
            const response = await axios.get(apiLink);
            return response.data;
        } catch (error) {
            console.error("Erro GET:", error);
            throw error;
        }
    }

    static async Post(url, body) {
        try {
            const response = await axios.post(this.defaultIp + url, body, {
                headers: { "Content-Type": "application/json" }
            });
            return response.data;
        } catch (err) {
            console.error("Erro POST:", err);
            throw err;
        }
    }

    static async InternalGet(apiLink) {
        try {
            const response = await axios.get(this.defaultIp + apiLink);
            return response.data;
        } catch (error) {
            console.error("Erro GET:", error);
            throw error;
        }
    }

    static async Put(url, body) {
        try {
            const response = await axios.put(this.defaultIp + url, body, {
                headers: { "Content-Type": "application/json" }
            });
            return response.data;
        } catch (err) {
            console.error("Erro PUT:", err);
            throw err;
        }
    }

    static async Delete(url) {
        try {
            const response = await axios.delete(this.defaultIp + url);
            return response.data;
        } catch (err) {
            console.error("Erro DELETE:", err);
            throw err;
        }
    }
}

export default ApiService;
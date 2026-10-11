import { ref } from "vue";
import { WEBSOCKET_URL } from "@/config";

class WebSocketService {
    constructor() {
        this.socket = null;
        this.isConnected = false;
        this.messages = ref([]);
    }

    connect(roomId) {
        if (this.socket && this.isConnected) {
            this.closeConnection();
        }

        this.socket = new WebSocket(WEBSOCKET_URL);

        this.socket.onopen = () => {
            //console.log('Connected to websocket server')
            try {
                const body = {
                    room_id: roomId,
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                };

                this.socket.send(JSON.stringify(body));
                this.isConnected = true;
            } catch (error) {
                console.error("Error opening websocket connection: ", error);
            }
        };

        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            this.messages.value.push(message);
        };

        this.socket.onclose = () => {
            //console.log('Websocket connection closed')
            this.isConnected = false;
        };

        this.socket.onerror = (error) => {
            console.error("Websocket error: ", error);
        };
    }

    closeConnection() {
        if (this.socket instanceof WebSocket && this.isConnected) {
            this.socket.close();
            this.socket = null;
            this.isConnected = false;
        }
    }
}

export default WebSocketService;

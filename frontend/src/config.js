const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";

const stripTrailingSlash = (s) => s.replace(/\/+$/, "");

export const REST_URL = stripTrailingSlash(
    import.meta.env.VITE_REST_URL ?? "/rest"
);

export const WEBSOCKET_URL = 
    import.meta.env.VITE_WEBSOCKET_URL ??
    `${wsProtocol}://${window.location.host}/ws/`;

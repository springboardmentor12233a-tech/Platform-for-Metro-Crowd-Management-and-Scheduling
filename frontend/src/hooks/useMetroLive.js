import { useEffect, useState } from "react";

export default function useMetroLive() {
    const [stations, setStations] = useState([]);

    useEffect(() => {

        const ws = new WebSocket("ws://localhost:8000/ws");

        ws.onmessage = (event)=>{
            setStations(JSON.parse(event.data));
        };

        return ()=>ws.close();

    }, []);

    return stations;
}
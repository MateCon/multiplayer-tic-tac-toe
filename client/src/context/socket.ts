import { createContext } from "react";
import { connect } from "socket.io-client";

export const socket = connect("http://localhost:8080");
export const SocketContext = createContext(socket);

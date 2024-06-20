import React from "react";

// will be used to give access to logged in state to all descendants in app. logged in state also controls if actual app or login page shows
export const AuthContext = React.createContext();


export const getUserToken = () => {
    const persistedState = localStorage.getItem('persist:me');
    if (!persistedState) {
        return null;
    }
    const { accessToken } = JSON.parse(persistedState);
    if (!accessToken || accessToken === "null") {
        return null;
    }
    return JSON.parse(accessToken);
}



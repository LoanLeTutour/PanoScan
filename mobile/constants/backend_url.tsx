

export const backend_url = (): string => {
    const localIp = '192.168.1.36:8000'
        return `http://${localIp}/api/`
    };
    
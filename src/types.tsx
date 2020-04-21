export type Navigation = {
    navigate: (scene: string) => void,
    goBack: () => void,
    dispatch: (action: any) => void,
    reset: (actions: Array<any>, index: number) => void,
    getParam: (paramName: string, defaultValue?: any) => void,
};

export type User = {
    firstname: string,
    lastname: string,
    username: string,
    email: string,
    phone?: string,
    id?: object,
};

export type Location = {
    name: string,
    latitude?: number,
    longitude?: number,
};

export type Event = {
    name: string,
    firstname: string,
    lastname: string,
    username: string,
    description: string,
    location: Location,
    phone?: string,
    participants: Array<User>,
    date: string,
    time: string,
    status?: string,
};
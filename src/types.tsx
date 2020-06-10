export type Navigation = {
    navigate: (scene: string, params?: object) => void,
    goBack: () => void,
    dispatch: (action: any) => void,
    reset: (actions: Array<any>, index: number) => void,
    getParam: (paramName: string, defaultValue?: any) => string,
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
    oid: string,
    name: string,
    username: string,
    description: string,
    location: Location,
    phone?: string,
    participants: Array<User>,
    date: string,
    time: string,
    status?: 'invited' | 'accepted',
    type: 'public' | 'private',
};
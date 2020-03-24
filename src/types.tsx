export type Navigation = {
    navigate: (scene: string) => void;
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
    lat: number,
    lng: number,
};

export type Event = {
    name: string,
    firstname: string,
    lastname: string,
    username: string,
    location: Location,
    phone?: string,
    participants: Array<User>,
    date: string,
    time: string,
    status?: string,
};
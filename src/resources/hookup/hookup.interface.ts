export default interface Hookup {
    date: Date,
    gender: string,
    images: participants[],
    status: string,
}

interface participants {
    image: string,
    id: string,
    isWinner: boolean
}
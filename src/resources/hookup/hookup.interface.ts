export default interface Hookup {
    date: Date,
    gender: string,
    images: participants[],
}

interface participants {
    image: string,
    id: string,
    isWinner: boolean
}
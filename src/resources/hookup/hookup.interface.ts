export default interface Hookup {
    startDate: Date,
    endDate: Date,
    gender: string,
    images: participants[],
    status: string,
}

interface participants {
    image: string,
    userId: string,
    isWinner: boolean
}
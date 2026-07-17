export interface Profile {
    id: string
    email: string
    username: string
    avatar: string | null
    favorite_deck_id: string | null
}

export interface PlayerStats {
    total_games_played: number
    total_wins: number
    win_rate: number
    average_placement: number
    most_played_deck: string
}

export interface DeckResponse {
    id: string
    deck_name: string
    commander_name: string
    commander_image_uri: string
    color_identity: string[]
    scryfall_id: string
    playstyle: string
}

export interface ScryfallCard {
    id: string
    name: string
    image_uris: { [key: string]: string } | null
    color_identity: string[]
    card_faces?: {
        name: string
        image_uris: { [ key: string]: string }
    }[]
}

export interface GamePlayer {
    user_id: string | null
    username: string 
    deck_id: | null
    deck_name: | null
}

export interface UserSearchResult {
    id: string
    username: string
}

export type RootStackParamList = {
    Tabs: undefined
    PlayerSetup: undefined
    LiveGame: {
        players: GamePlayer[]
        timerEnabled: boolean
        turnLength: number
    }
}
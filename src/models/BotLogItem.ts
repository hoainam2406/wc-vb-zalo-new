export interface BotLogGetAllItems {
    phone: string
    botId: string
    botName: string
    templateCode: string
    campaignCode: string
    conversation: BotLogGetAllConversation[]
}

export interface BotLogGetAllConversation {
    id: number
    sender: string
    receiver: string
    body: string
    createAt: number
}
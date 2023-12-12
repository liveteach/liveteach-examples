export interface RewardConfig {
    name: string
    group: string
    campaignID: string
    campaignKey: string
    urn: string
    isTimeGated?: boolean
    startTime?: Date
    endTime?: Date
}

export class Reward {
    name: string
    group: string
    campaignID: string
    campaignKey: string
    urn: string
    canClaim: boolean
    isTimeGated: boolean
    startTime: Date
    endTime: Date

    constructor(config: RewardConfig) {
        this.name = config.name
        this.group = config.group
        this.campaignID = config.campaignID
        this.campaignKey = config.campaignKey
        this.urn = config.urn
        this.isTimeGated = config.isTimeGated ?? false
        this.startTime = config.startTime ?? new Date()
        this.endTime = config.endTime ?? new Date()
        this.canClaim = true
    }
}
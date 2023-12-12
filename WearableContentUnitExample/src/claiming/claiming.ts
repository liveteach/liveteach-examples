import { ClaimTokenRequest, ClaimTokenRequestArgs, ClaimTokenResult, ClaimUI, ClaimUIConfig, ItemData, checkIfPlayerHasAnyWearableByUrn } from "./loot"
import { Reward, RewardConfig } from "./reward"
import { userData } from "./userData"
import { signedFetch } from '~system/SignedFetch'
import { Color4 } from "@dcl/sdk/math"
import * as ui from 'dcl-ui-toolkit'
import { Transform, engine } from "@dcl/sdk/ecs"

export class Claiming {
    static readonly CLAIM_SERVER: string = "https://rewards.decentraland.org"

    static claimingFromLocation: string = ""
    static captchaExpireTime: number = 0
    static captchaRetries: number = 10
    static rewards: Reward[] = []

    static AddReward(config: RewardConfig) {
        Claiming.rewards.push(new Reward(config))
        Claiming.CheckAllRewardEligibilities()
    }

    static ClaimReward(rewardName: string) {
        for (let reward of Claiming.rewards) {
            if (reward.name == rewardName) {
                Claiming.claimReward(reward)
            }
        }
    }

    static ClaimRewardFromGroup(group: string) {
        let groupRewards: Reward[] = []
        for (let reward of Claiming.rewards) {
            if (reward.group == group) {
                groupRewards.push(reward)
            }
        }

        let unclaimedRewards: Reward[] = []
        for (let reward of groupRewards) {
            if (reward.canClaim) {
                unclaimedRewards.push(reward)
            }
        }

        if (unclaimedRewards.length < 1) {
            // Default to the first reward, which will fail claiming
            if (groupRewards.length > 0) {
                Claiming.claimReward(groupRewards[0])
            }
            return
        }

        let index = Math.floor(Math.random() * unclaimedRewards.length)
        Claiming.claimReward(unclaimedRewards[index])
    }

    static ClaimFromLocation(): void {
        Claiming.rewards.forEach(reward => {
            if (Claiming.claimingFromLocation == reward.name) {
                Claiming.ClaimReward(reward.name)
            }
        });
    }

    static CheckAllRewardEligibilities(): void {
        Claiming.rewards.forEach(reward => {
            Claiming.checkRewardEligibility(reward)
        });
    }

    private static async checkRewardEligibility(reward: Reward): Promise<void> {
        let rewardKeys: string[] = []
        
        rewardKeys.push(reward.urn)
        let hasReward = await checkIfPlayerHasAnyWearableByUrn(rewardKeys)
        console.log("User " + (hasReward ? "has " : "does not have ") + reward.name + " wearable")

        // do not check if player is on guest account
        if (userData.hasConnectedWeb3 == false) {
            Claiming.rewards.forEach(reward => {
                reward.canClaim = false
            });
            return
        }

        reward.canClaim = !hasReward
    }

    private static async claimReward(reward: Reward): Promise<void> {
        if (reward.isTimeGated) {
            var now: number = new Date(new Date().toISOString()).getTime()
            if (now < reward.startTime.getTime() || now > reward.endTime.getTime()) return
        }

        Claiming.claimingFromLocation = reward.name

        let claimRequest: ClaimTokenRequestArgs = {
            claimServer: Claiming.CLAIM_SERVER,
            campaign: reward.campaignID,
            campaign_key: reward.campaignKey,
            captcha_uuid: "", // set async below
            captcha_input: "", // user entry
        }

        await Claiming.checkRewardEligibility(reward)
        
        if (!reward.canClaim) {
            return
        }

        Claiming.claim(claimRequest, reward)

    }

    private static customResolveSourceImageSize(): number {
        return 1024
    }

    private static async getCaptcha(): Promise<any> {
        try {
            const captchaUUIDQuery = await signedFetch({
                url: Claiming.CLAIM_SERVER + '/api/captcha',
                init: {
                    headers: { "Content-Type": "application/json" },
                    method: 'POST'
                }
            })
            
            const json = JSON.parse(captchaUUIDQuery.body)
            Claiming.captchaExpireTime = Date.parse(json.data.expires_at)
            return json
        } catch (error) {
            console.log(error)
        }
    }

    private static async claim(_claimTokenRequestArgs: ClaimTokenRequestArgs, reward: Reward, _captchaTitleOverride?: string) { 
        // but first, do a captcha

        const captcha = await Claiming.getCaptcha()

        if (captcha == null || captcha == undefined) {
            // something went wrong with captcha request
            console.log("CAPTCHA FAIL post")
            return
        } else {
            console.log("CAPTCHA GET " + captcha)
        }

 
                //let imageurl = ServerConnection.serverURL + "/api/missions/captcha/" + data.response.split("/")[data.response.split("/").length-1]
                let imageurl = captcha.data.image
                
 
                Claiming.captcha(Claiming.CLAIM_SERVER, imageurl, captcha.data.width, captcha.data.height, _captchaTitleOverride).then(async captchaResult=>{
                    if (captchaResult == null || captchaResult == undefined) {
                    // something went wrong with user input
                    console.log("CAPTCHA FAIL input")
                    return
                }
                else if (captchaResult.length != 6) {
                    console.log("Wrong number of characters entered into captcha")
                    Claiming.claimRetry_badCaptchaLength(_claimTokenRequestArgs, reward)
                    return
                }
                else {
                    console.log("CAPTCHA + RESULT " + captchaResult)
                }
        

                const claimReq = new ClaimTokenRequest(_claimTokenRequestArgs)

                claimReq.captcha_uuid = captcha.data.id
                claimReq.captcha_input = captchaResult
                const claimResult = await claimReq.claimToken()
                
        
                // console.log("claim result", claimResult.success)
                if (!claimResult.success && Claiming.captchaRetries > 0) {
                    Claiming.claim(_claimTokenRequestArgs, reward, "Incorrect captcha, please try again")
                    Claiming.captchaRetries--
                    return
                }        

                let claimUIConfig: ClaimUIConfig = { bgTexture: 'https://decentraland.org/images/ui/dark-atlas-v3.png', claimServer: Claiming.CLAIM_SERVER, resolveSourceImageSize: Claiming.customResolveSourceImageSize }
        
                let claimUI: ClaimUI = new ClaimUI(claimUIConfig)
                claimUI.handleClaimJson(claimResult, Claiming.claimCallbacks)
                if(claimResult && claimResult.json) {
                    delete claimResult.json
                }

                if (claimResult.success) {
                    // this should not be flagged false until claim has succeeded
                    reward.canClaim = false
                } else {
                    
                }

                            
            })
             
    }

    private static claimRetry_badCaptchaLength(_claimTokenRequestArgs: ClaimTokenRequestArgs, reward: Reward): void {
        Claiming.claim(_claimTokenRequestArgs, reward, "Your entry must be 6 characters long\nPlease complete this captcha")
    }

    private static claimCallbacks = {
        onOpenUI: (claimResult: ClaimTokenResult) => {
            console.log("on open", claimResult)
        },
        onAcknowledge: (claimResult: ClaimTokenResult) => {
            console.log("on ack", claimResult)
        },
        onCloseUI: (claimResult: ClaimTokenResult) => {
            console.log("on close", claimResult)
        }
    }

    // CAPTCHA
    // display ui asking user for for captcha solution
    private static async captcha(
        serverURL: string,
        captchaURL: string,
        width: number,
        height: number,
        titleOverride?: string
    ): Promise<string | undefined> {
        return new Promise((resolve) => {
            let captchaTitle = 'Please complete this captcha'
            if (titleOverride != null && titleOverride != undefined) {
                captchaTitle = titleOverride
            }
            const captchaUI = ui.createComponent(ui.CustomPrompt, {
                style: ui.PromptStyles.DARK,
                width: 600,
                height: 370,
                startHidden: false
            })

            captchaUI.addText({
                value: captchaTitle,
                xPosition: 0,
                yPosition: 130,
                color: Color4.White(),
                size: 24
            })
            let captchaImage = captchaURL
            console.log(captchaImage)
            captchaUI.addIcon({
                image: captchaImage,
                xPosition: 0,
                yPosition: 40,
                width: width,
                height: height,
                section: {
                    sourceHeight: height,
                    sourceWidth: width,
                    sourceLeft: 0,
                    sourceTop: 0,
                    atlasHeight: height,
                    atlasWidth: width
                }
            })
            let captchaCode = ''
            captchaUI.addTextBox({
                placeholder: '',
                xPosition: 0,
                yPosition: -75,
                onChange: (e: any) => {
                    captchaCode = e
                }
            })
            captchaUI.addButton({
                style: ui.ButtonStyles.ROUNDGOLD,
                text: 'Submit',
                xPosition: 100,
                yPosition: -140,
                onMouseDown: () => {
                    captchaUI.hide()
                    resolve(captchaCode)
                }
            })
            captchaUI.addButton({
                style: ui.ButtonStyles.ROUNDBLACK,
                text: 'Cancel',
                xPosition: -100,
                yPosition: -140,
                onMouseDown: () => {
                    captchaUI.hide()
                    resolve(undefined)
                }
            })
        })
    }
}
import { signedFetch } from '~system/SignedFetch'
import { openExternalUrl } from "~system/RestrictedActions"
import { playerRealm, setRealm, setUserData, userData } from './userData'
import { Claiming } from './claiming'
import { engine, Transform, AudioSource, AvatarAnchorPointType, AvatarAttach, Texture } from "@dcl/sdk/ecs";
import { Vector3, Color4 } from "@dcl/sdk/math";
import * as ui from 'dcl-ui-toolkit'

// TODO: export const custUiAtlas = new Texture('images/DispenserAtlas.png')

export let ClaimMessageConfig = {
  OK_PROMPT_BIGGER_THREASHOLD: 95,//4
  //OUT_OF_STOCK: "We apologize for the inconvenience.  All items of this type have been claimed.\nThanks for playing!"
  OUT_OF_STOCK: "Sorry, all wearables have been claimed. Please check back later."
}

export enum ChainId {
  ETHEREUM_MAINNET = 1,
  ETHEREUM_ROPSTEN = 3,
  ETHEREUM_RINKEBY = 4,
  ETHEREUM_GOERLI = 5,
  ETHEREUM_KOVAN = 42,
  MATIC_MAINNET = 137,
  MATIC_MUMBAI = 80001,
}

export enum ClaimState {
  ASSIGNED = 'assigned',
  SENDING = 'sending',
  SUCCESS = 'success',
  CONFIRMED = 'confirmed',
  REJECTED = 'rejected',
}

export enum ClaimCodes {
  BENEFICIARY_INVALID = 'beneficiary_invalid',
  BENEFICIARY_NOT_CONNECTED = 'beneficiary_not_connected',
  BENEFICIARY_POSITION = 'beneficiary_position',
  CAMPAIGN_UNINITIATED = 'campaign_uninitiated',
  CAMPAIGN_FINISHED = 'campaign_finished',
  BENEFICIARY_WEB3_CONNECTED = 'beneficiary_not_web3_connected',
  OUT_OF_STOCK = 'out_of_stock',
  CAPTCHA_INVALID = 'captcha_invalid',
  CAPTCHA_REQUIRED = 'captcha_required'
}

export type RewardData = {
  ok: boolean
  data: ItemData[]
  code?: string
  error?: string
}

export type CaptchaData = {
  ok: boolean
  data: CaptchaItemData
  code?: string
  error?: string
}

export type CaptchaItemData = {
  id: string
  height: number
  width: number
  image: string
  expires_at: string
}

export type ItemData = {
  id: string
  user: string
  campaign_id: string
  status: ClaimState
  transaction_hash: string | null
  transaction_id: string | null
  token: string
  value: string
  created_at: string
  updated_at: string
  from_referral: null
  block_number: null
  claim_id: string | null
  target: string
  payload: string | null
  expires_at: string | null
  signature: string | null
  airdrop_type: string
  group: string | null
  priority: string
  campaign_key: string
  assigned_at: string
  image: string
  chain_id: ChainId
}

//export let claimJson: any = null

export type ClaimTokenOptions = {

}
export type HandleClaimTokenCallbacks = {
  onAcknowledge?: (claimResult: ClaimTokenResult) => void
  onOpenUI?: (claimResult: ClaimTokenResult) => void
  onCloseUI?: (claimResult: ClaimTokenResult) => void
}

export class CaptchaResult {
  ok: boolean | undefined
  data: object | undefined
  dataId: string | undefined
  dataWidth: number | undefined
  dataHeight: number | undefined
  dataImage: string | undefined
  dataExpires: string | undefined
}

export class ClaimTokenResult {
  json: any
  success: boolean = false
  exception: any
  claimCode: any
  requestArgs?: ClaimTokenRequestArgs

  getClaimCode(): any {
    const claimJson = this.json
    if (this.claimCode && this.claimCode !== undefined) {
      return this.claimCode
    } else if (claimJson !== null && claimJson !== undefined) {
      return claimJson.code
    } else {
      return 'unknown'
    }
  }

  isClaimJsonSuccess() {
    return _isClaimJsonSuccess(this.json)
  }
  isClaimJsonOutOfStock() {
    return _isOutOfStock(this.json)
  }
}

export type ClaimTokenRequestArgs = {
  claimServer: string
  campaign: string
  campaign_key: string
  captcha_uuid: string
  captcha_input: string
}

export class ClaimTokenRequest {
  claimServer: string
  campaign: string
  campaign_key: string
  claimResult: ClaimTokenResult
  captchaResult: CaptchaResult | undefined
  captcha_uuid: string | undefined
  captcha_input: string | undefined

  constructor(args: ClaimTokenRequestArgs) {
    this.claimServer = args.claimServer
    this.campaign = args.campaign
    this.campaign_key = args.campaign_key
    this.claimResult = new ClaimTokenResult()
  }

  onFetchError(err: any) {
    
    this.claimResult.success = false
    this.claimResult.exception = err

    /*
    let p = new ui.OkPrompt(
      'An unexpected error occurred',
      () => {
        p.close()
        //   representation.vanish()
        PlayCloseSound()
      },
      'OK',
      true
    )*/
  }

  async validate() {
    if (!userData) {
      await setUserData()
    }
    if (!playerRealm) {
      await setRealm()
    }

    if (!userData.hasConnectedWeb3) {
      
      this.claimResult.success = false
      this.claimResult.claimCode = ClaimCodes.BENEFICIARY_WEB3_CONNECTED

      this.onMissingConnectedWeb3()

      return false;
    }

    return true;
  }

  onMissingConnectedWeb3() {
    /*
    PlayOpenSound()
      let p = new ui.OkPrompt(
        'You need an in-browser Ethereum wallet (eg: Metamask) to claim this item.',
        () => {
          p.close()
          // representation?.vanish()
          PlayCloseSound()
        },
        'OK',
        true
      )*/
  }

  async processResponse(response: any) {
    console.log('Reward received resp: ', response)

    if (!response) {
      throw new Error('Invalid response')
    }
    let json: RewardData = await JSON.parse(response.body) //SIGNED FETCH VERSION

    console.log('Reward received json: ', json)

    //json = {ok:true,data:[]}
    //log('Reward changed  json: ', json)

    this.claimResult.json = json


    this.claimResult.success = this.claimResult.isClaimJsonSuccess()
    return this.claimResult
  }

  async processCaptcha(response: any) {
    let json: CaptchaData = await JSON.parse(response.text) //SIGNED FETCH VERSION

    console.log('Captcha received json: ', json)

    if (this.captchaResult) {
      this.captchaResult.ok = json.ok
      this.captchaResult.data = json.data
      this.captchaResult.dataId = json.data.id
      this.captchaResult.dataWidth = json.data.width
      this.captchaResult.dataHeight = json.data.height
      this.captchaResult.dataImage = json.data.image
      this.captchaResult.dataExpires = json.data.expires_at
    }
  }

  async claimToken() {
    const claimResult = this.claimResult = new ClaimTokenResult()
    this.claimResult.requestArgs = { claimServer: this.claimServer, campaign: this.campaign, campaign_key: this.campaign_key, captcha_uuid: this.captcha_uuid as string, captcha_input: this.captcha_input as string }

    

    const isValid = await this.validate()
    if (!isValid) {
      return this.claimResult
    }

    const url = this.claimServer + '/api/campaigns/' + this.campaign + '/rewards'
    console.log('Xsending req to: ', url)

    let body = JSON.stringify({
      campaign_key: this.campaign_key,
      catalyst: playerRealm?.domain,
      beneficiary: userData.publicKey,
      captcha_id: this.captcha_uuid,
      captcha_value: this.captcha_input
      //beneficiary: '0xe2b6024873d218B2E83B462D3658D8D7C3f55a18',
    })

    try {
      console.log('signedFetch')
      let response = await signedFetch({
        url: url,
        init: {
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
          body: body
        }
      })
   
      console.log('Reward received resp: ', response)

      this.processResponse(response)
    } catch (error) {
      
      console.log('error fetching from token server ', url) 

      this.onFetchError(error) 
      
      console.log(error)

    }
    
    return claimResult
  }
}


export async function checkIfPlayerHasAnyWearableByUrn(wearableUrnsToCheck: string[]) {
  if (!userData) {
    await setUserData()
  }
  if (!playerRealm) {
    await setRealm()
  }

  let hasWearable = false

  //must cal this to get ALL
  //https://docs.decentraland.org/development-guide/user-data/ docs was not working for me
  const url =
    'https://peer.decentraland.org/lambdas/collections/wearables-by-owner/' +
    //'https://peer.decentraland.org/lambdas/profile/' +
    userData.userId
  try {
    console.log("checkProgression callin " + url)
    let response = await fetch(url)
    let json = await response.json()
    console.log('checkIfPlayerHasWearable Player progression: ', response.status, json)

    main:
    for (const p in json) {
      for (const q in wearableUrnsToCheck) {
        //log(json[p].urn,'vs',wearableUrnsToCheck[q]) 
        if (json[p].urn === wearableUrnsToCheck[q]) {
          hasWearable = true
          break main
        }
      }
    }
  } catch {
    console.log('checkProgression error fetching from token server ', url)
  }

  console.log('returning', hasWearable)
  return hasWearable
}

export async function claimTokenAndHandle(args: ClaimTokenRequestArgs): Promise<ClaimTokenResult> {
  let claimResult = await claimToken(
    { claimServer: args.claimServer, campaign: args.campaign, campaign_key: args.campaign_key, captcha_uuid: args.captcha_uuid, captcha_input: args.captcha_input }
  )
  const claimUI = new ClaimUI()
  claimUI.handleClaimJson(claimResult,
    {
      onOpenUI: (claimResult: ClaimTokenResult) => {
        console.log("on open")
      },
      onAcknowledge: (claimResult: ClaimTokenResult) => {
        console.log("on ack")
      },
      onCloseUI: (claimResult: ClaimTokenResult) => {
        console.log("on close", claimResult)
      }
    })
  return claimResult
}
export async function claimToken(args: ClaimTokenRequestArgs): Promise<ClaimTokenResult> {
  const claimReq = new ClaimTokenRequest(args)

  await claimReq.claimToken()

  return claimReq.claimResult
}



function _isOutOfStock(json: any) {
  return json && json.ok && json.data && !json.data[0] && !json.error
}

function _isClaimJsonSuccess(json: any) {
  //log("_isClaimJsonSuccess " ,json)
  
  var retVal = false
  if (json && json.ok) {
    retVal = true

    // HEY! if you succeed in claiming a reward, check to block attempting claim again
    Claiming.CheckAllRewardEligibilities()
  }

  console.log('_isClaimJsonSuccess ' + retVal, json)
  return retVal
}

/**
 * 
 * @param json 
 * @param code - can ovveride what is in json
 * @param onCompleteCallback 
 */
function _handleClaimJson(claimResult: ClaimTokenResult, claimUI: ClaimUI, callbacks?: HandleClaimTokenCallbacks) {
  const json = claimResult.json
  const overrideCode = claimResult.claimCode
  const error = claimResult.exception
  console.log("_handleClaimJson", json, overrideCode, callbacks)

  debugger

  let returnVal: ui.OkPrompt | ui.CustomPrompt | undefined = undefined
  let p: ui.OkPrompt

  /*
    claimResult.json.ok=false
    claimResult.success = false
    claimResult.claimCode = ClaimCodes.BENEFICIARY_NOT_CONNECTED
    claimResult.json.code = ClaimCodes.BENEFICIARY_NOT_CONNECTED
  */

  if (json && !json.ok) {
    PlayOpenSound()
    console.log('ERROR: ', json.code)
    let code = json.code
    if (overrideCode) {
      code = overrideCode
    }
    let uiMsg = ''

    switch (code) {
      case ClaimCodes.BENEFICIARY_INVALID:
      case ClaimCodes.BENEFICIARY_NOT_CONNECTED:
      case ClaimCodes.BENEFICIARY_POSITION:
        claimUI.openNotOnMap(claimResult, callbacks)
        break
      case 'campaign_uninitiated':
      case 'campaign_key_uninitiated':
        uiMsg = 'This campaign has not started yet.'
        console.log(uiMsg)
        break
      case 'campaign_finished':
        uiMsg = 'This campaign is over.'
        console.log(uiMsg)
        break
      default:
        if (json.error.toLowerCase().indexOf("invalid data") > -1) {
          uiMsg = 'Sorry, all wearables have been claimed. Please check back later.'
          console.log(uiMsg)
        } else {
          uiMsg = 'An unexpected error occurred: \n' + json.error
          console.log(uiMsg)
        }
        break
    }

    if (uiMsg.length > 0) {
      console.log(uiMsg)
      claimUI.openOKPrompt(uiMsg, claimResult, callbacks)
    }
  } else if (_isOutOfStock(json)) {
    claimUI.openOutOkStockPrompt(claimResult, callbacks)
  } else if (!json || !json.data[0]) {
    console.log('no rewards', overrideCode)
    switch (overrideCode) {
      case ClaimCodes.BENEFICIARY_WEB3_CONNECTED:
        claimUI.openRequiresWeb3(claimResult, callbacks)
        break
      default:
        let msg = 'An unexpected error occurred, please try again.'

        if (error == undefined) {
          // no error so it worked
          let msg = "You have successfully\nclaimed your wearable"
          claimUI.openOKPrompt(msg, claimResult, callbacks)
        } else {

          if (error.message.toLowerCase().indexOf("invalid data") > -1) {
            msg = 'You have received the\nmaximum number of wearables today'
            claimUI.openOKPrompt(msg, claimResult, callbacks)
          } else {
            if (error && error.message) {
              msg += '\n' + error.message
            }
            claimUI.openOKPrompt(msg, claimResult, callbacks)
          }
        }
        break
    }
  } else {
    switch (json.data[0].status) {
      case ClaimState.ASSIGNED:
      case ClaimState.SENDING:
      case ClaimState.SUCCESS:
      case ClaimState.CONFIRMED:
        returnVal = claimUI.openClaimUI(claimResult, callbacks)
        break
      case ClaimState.REJECTED:
        console.log('player not on map')
        claimUI.openNotOnMap(claimResult, callbacks)
        break
      default:
        //   openClaimUI(json.data[0], representation)
        claimUI.openClaimUI(claimResult, callbacks)
        break
    }
  }

}


export type ClaimUIConfig = {
  bgTexture: string
  claimServer: string
  bgTextureInst?: Texture
  resolveSourceImageSize?: () => number
  customPromptStyle?: ui.PromptStyles
}

const claimConfigDefaults: ClaimUIConfig = {
  bgTexture: 'images/claim/WearablePopUp.png',
  claimServer: /*TESTING ? */'https://rewards.decentraland.io' /*:  'https://rewards.decentraland.org'*/ //default is non prod to avoid accidents
  , resolveSourceImageSize: () => { return 512 },
  customPromptStyle: ui.PromptStyles.DARK
}

export class ClaimUI {

  lastUI?: ui.CustomPrompt | ui.OkPrompt
  claimUI?: ui.CustomPrompt
  claimUIConfig: ClaimUIConfig = claimConfigDefaults


  UI_SCALE_MULT = 0.7

  constructor(claimUIConfig?: ClaimUIConfig) {
    console.log("ClaimUI.constructor", claimUIConfig)
    this.setClaimUIConfig(claimUIConfig)
  }

  setClaimUIConfig(claimUIConfig?: ClaimUIConfig) {
    if (claimUIConfig) this.claimUIConfig = claimUIConfig
  }
  handleClaimJson(claimResult: ClaimTokenResult, callbacks?: HandleClaimTokenCallbacks) {
    _handleClaimJson(claimResult, this, callbacks)
  }

  nothingHere() {
    let p = ui.createComponent(ui.OkPrompt, {
      text: 'Nothing here.  Keep looking.',
      onAccept: () => {
        p.hide()
      },
      acceptLabel: 'OK',
      useDarkTheme: this.getOKPromptUseDarkTheme(),
      startHidden: true,
    })

    this.applyCustomAtlas(p) 
    p.show()
    return p
  }

  openYouHaveAlready() {
    let p = ui.createComponent(ui.OkPrompt, {
      text: 'You already have this wearable.',
      onAccept: () => {
        p.hide()
      },
      acceptLabel: 'OK',
      useDarkTheme: this.getOKPromptUseDarkTheme(),
      startHidden: true,
    })

    this.applyCustomAtlas(p)

    p.show()

  }

  openOutOkStockPrompt(claimResult: ClaimTokenResult, callbacks?: HandleClaimTokenCallbacks) {
    let msg = ClaimMessageConfig.OUT_OF_STOCK

    const p = this.openOKPrompt(msg, claimResult, callbacks)

  }

  openSuccessMsg(claimResult: ClaimTokenResult, callbacks?: HandleClaimTokenCallbacks) {
    this.openClaimUI(claimResult, callbacks)
  }
  openNotOnMap(claimResult: ClaimTokenResult, callbacks?: HandleClaimTokenCallbacks) {
    PlayOpenSound()

    const p = this.openOKPrompt('We can`t validate the authenticity of your request.  If you just arrived please wait a few moments and try again.', claimResult, callbacks)
  }
  openRequiresWeb3(claimResult: ClaimTokenResult, callbacks?: HandleClaimTokenCallbacks) {
    const mmPrompt = ui.createComponent(ui.CustomPrompt, {
      style: this.getCustomPromptStyle()
    })
    this.applyCustomAtlas(mmPrompt)

    mmPrompt.width = 600

    mmPrompt.addText({
      value: 'A MetaMask Digital wallet\nis required to claim this token.',
      xPosition: 0,
      yPosition: 45,
      color: this.getCustomPromptFontColor(),
      size: 20
    })
    mmPrompt.addButton({
      style: ui.ButtonStyles.ROUNDGOLD,
      text: 'GET MetaMask',
      xPosition: -120,
      yPosition: -100,
      onMouseDown: () => {
        openExternalUrl({ url: 'https://metamask.io/' })
      }
    })

    mmPrompt.addButton({
      style: ui.ButtonStyles.ROUNDSILVER,
      text: 'Cancel',
      xPosition: 120,
      yPosition: -100,
      onMouseDown: () => {
        PlayCloseSound()
        mmPrompt.hide()
      }
    })



    if (callbacks && callbacks.onOpenUI) callbacks.onOpenUI(claimResult)
    this.lastUI = mmPrompt

    mmPrompt.show()

    return mmPrompt
  }

  getCustomPromptStyle(): ui.PromptStyles {
    return this.claimUIConfig.customPromptStyle ? this.claimUIConfig.customPromptStyle : ui.PromptStyles.LIGHT
  }

  /* TODO
  getCustomBGImageSection(): ImageAtlasData {
    const style = this.getCustomPromptStyle()
    switch (style) {
      case ui.PromptStyles.LIGHTLARGE:
      case ui.PromptStyles.DARKLARGE:
        return resources.backgrounds.promptLargeBackground
      default:
        return resources.backgrounds.promptBackground
    }
  }*/

  getCustomPromptFontColor(): Color4 | undefined {
    const style = this.getCustomPromptStyle()
    switch (style) {
      case ui.PromptStyles.DARK:
      case ui.PromptStyles.DARKLARGE:
        return Color4.White()
      default:
        return Color4.Black()
    }
  }

  getOKPromptUseDarkTheme(): boolean {
    const style = this.getCustomPromptStyle()
    switch (style) {
      case ui.PromptStyles.DARK:
      case ui.PromptStyles.DARKLARGE:
        return true
      default:
        return false
    }
  }

  openOKPrompt(uiMsg: string, claimResult: ClaimTokenResult, callbacks?: HandleClaimTokenCallbacks) {
    console.log(uiMsg)
    PlayOpenSound()
    let result: ui.OkPrompt | ui.CustomPrompt

    if (uiMsg.length > ClaimMessageConfig.OK_PROMPT_BIGGER_THREASHOLD) {
      const mmPrompt = ui.createComponent(ui.CustomPrompt, { style: this.getCustomPromptStyle() })
      this.applyCustomAtlas(mmPrompt)

      result = mmPrompt

      let height = 300 / 2 + 10
      if (uiMsg.length > 200) {
        height = 300 / 2 - 50
      }

      const uiText = mmPrompt.addText({
        value: uiMsg,
        xPosition: 0,
        yPosition: height,
        color: this.getCustomPromptFontColor(),
        size: 20
      })

      if (uiText.textElement.uiTransform) {
        uiText.textElement.uiTransform.flexWrap = 'wrap'
        uiText.textElement.uiTransform.width = 350
        uiText.textElement.uiTransform.height = 300
      }

      mmPrompt.addButton({
        style: ui.ButtonStyles.E,
        text: 'OK',
        xPosition: 0,
        yPosition: -100,
        onMouseDown: () => {
          mmPrompt.hide()
          //   representation.vanish()
          PlayCloseSound()
        },
      })
      mmPrompt.show()
    } else {

      let p = ui.createComponent(ui.OkPrompt, {
        text: uiMsg,
        onAccept: () => {
          p.hide()
          //   representation.vanish()
          PlayCloseSound()
        },
        acceptLabel: 'OK',
        useDarkTheme: this.getOKPromptUseDarkTheme(),
        startHidden: false,
      })

      this.applyCustomAtlas(p)

      //p.background.width = 500

      p.show()
    }
    if (callbacks && callbacks.onOpenUI) callbacks.onOpenUI(claimResult)
    this.lastUI = result


  }

  applyCustomAtlas(modal: ui.OkPrompt | ui.CustomPrompt) {
    // TODO: if (custUiAtlas !== undefined) {
    // TODO: modal.background.source = custUiAtlas

    if (modal instanceof ui.CustomPrompt) {
      // TODO: modal.texture = custUiAtlas
    }
    // TODO: }
    /*setSection(mmPrompt.background, this.getCustomBGImageSection())
      mmPrompt.background.source
      mmPrompt.texture = custUiTexture
      mmPrompt.background.source = custUiTexture*/
  }

  //data: ItemData,
  openClaimUI(claimResult: ClaimTokenResult, callbacks?: HandleClaimTokenCallbacks): ui.CustomPrompt {

    debugger
    const data: ItemData = claimResult.json.data[0]
    PlayOpenSound()

    if (this.claimUI) { //TODO && this.claimUI.background.visible) {
      this.claimUI.hide()
    }

    const offsetY = 40
    const UI_SCALE_MULT = this.UI_SCALE_MULT
    const claimUI = this.claimUI = ui.createComponent(ui.CustomPrompt, {
      style: ui.PromptStyles.LIGHTLARGE,
      width: 680 * UI_SCALE_MULT,
      height: 512 * UI_SCALE_MULT
    })

    if (callbacks && callbacks.onOpenUI) callbacks.onOpenUI(claimResult)
    this.lastUI = claimUI

    if (this.claimUIConfig) {
      let bgTexture = this.claimUIConfig.bgTextureInst
      if (!bgTexture && this.claimUIConfig.bgTexture) {
        // TODO: bgTexture = new Texture(this.claimUIConfig.bgTexture)
        // TODO: this.claimUIConfig.bgTextureInst = bgTexture
      }

      // TODO: claimUI.background.source = bgTexture
    }

    // TODO: claimUI.background.sourceWidth = 640
    // TODO: claimUI.background.sourceHeight = 512
    // TODO: claimUI.background.sourceTop = 0
    // TODO: claimUI.background.sourceLeft = 0

    const fontColor = Color4.Black() //this.getCustomPromptFontColor()

    claimUI.addText({
      value: data.status == ClaimState.SUCCESS
        ? 'You now own this item!'
        : data.status == ClaimState.SENDING || ClaimState.CONFIRMED || ClaimState.ASSIGNED
          ? 'This item is on its way!\nCheck rewards.decentraland.org.'
          : 'This item will be sent to you soon!\nCheck rewards.decentraland.org.',
      xPosition: 0,
      yPosition: (158 + offsetY) * UI_SCALE_MULT,//188 * UI_SCALE_MULT,
      color: fontColor,
      size: 34 * UI_SCALE_MULT
    })

    claimUI.addText({
      value: data.token,
      xPosition: 0,
      yPosition: (100 + offsetY) * UI_SCALE_MULT,
      color: fontColor,
      size: 24 * UI_SCALE_MULT
    }) // wearable name

    let sourceSize = 512

    if (this.claimUIConfig.resolveSourceImageSize) sourceSize = this.claimUIConfig.resolveSourceImageSize()

    debugger
    claimUI.addIcon({
      image: data.image,
      xPosition: 0,
      yPosition: -12 * UI_SCALE_MULT,
      width: 180 * UI_SCALE_MULT,
      height: 180 * UI_SCALE_MULT,
      section: {
        sourceHeight: sourceSize,
        sourceWidth: sourceSize,
        sourceLeft: 0,
        sourceTop: 0,
        atlasHeight: 0,
        atlasWidth: 0
      }
    })

    let okButton = claimUI.addButton({
      style: ui.ButtonStyles.E,
      text: 'OK',
      xPosition: 134 * UI_SCALE_MULT,
      yPosition: -155 * UI_SCALE_MULT - -5 - offsetY / 2,
      onMouseDown: () => {
        claimUI.hide()
        PlayCloseSound()
        claimUI.hide()
        if (callbacks && callbacks.onAcknowledge) callbacks.onAcknowledge(claimResult)
        //   representation.openUi = false
      },
    })

    //TODO
    //okButton.label.positionX = 30 * UI_SCALE_MULT
    //okButton.image.width = 238 * UI_SCALE_MULT - 18
    //okButton.image.height = 64 * UI_SCALE_MULT - 5
    //if (okButton.icon) {
    //  okButton.icon.width = 36 * UI_SCALE_MULT
    //  okButton.icon.height = 36 * UI_SCALE_MULT
    //}
    //okButton.label.fontSize = 24 * UI_SCALE_MULT

    let txButton = claimUI.addButton({
      style: ui.ButtonStyles.F,
      text: 'Details'.toUpperCase(),
      xPosition: -134 * UI_SCALE_MULT,
      yPosition: -155 * UI_SCALE_MULT - -5 - offsetY / 2,
      onMouseDown: () => {
        let baseUrl = this.claimUIConfig.claimServer
        if (claimResult && claimResult.requestArgs && claimResult.requestArgs.claimServer) {
          baseUrl = claimResult.requestArgs.claimServer
        }
        openExternalUrl({ url: baseUrl + '/reward/?id=' + data.id })
      },
    })

    //TODO
    //txButton.image.width = 238 * UI_SCALE_MULT - 18
    //txButton.image.height = 64 * UI_SCALE_MULT - 5
    //if (txButton.icon) {
    //  txButton.icon.width = 36 * UI_SCALE_MULT
    //  txButton.icon.height = 36 * UI_SCALE_MULT
    //}
    //txButton.label.fontSize = 24 * UI_SCALE_MULT
    //txButton.label.positionX = 30 * UI_SCALE_MULT

    claimUI.show()

    return claimUI
  }
}
export function openTxLink(chain_id: ChainId, transaction_hash: string) {
  switch (chain_id) {
    case ChainId.ETHEREUM_MAINNET:
      openExternalUrl({ url: 'https://etherscan.io/tx/' + transaction_hash })
      break
    case ChainId.ETHEREUM_ROPSTEN:
      openExternalUrl({ url: 'https://ropsten.etherscan.io/tx/' + transaction_hash })
      break
    case ChainId.MATIC_MAINNET:
      openExternalUrl({ url: 'https://polygonscan.com/tx/' + transaction_hash })
      break
    case ChainId.MATIC_MUMBAI:
      openExternalUrl({ url: 'https://mumbai.polygonscan.com/tx/' + transaction_hash })
      break
  }
}

// Open dialog sound
export const openDialogSound = engine.addEntity()
Transform.create(openDialogSound, {
  position: Vector3.create(0, 0, 0)
})
AudioSource.create(openDialogSound, {
  audioClipUrl: 'sounds/navigationForward.mp3',
  loop: false,
  playing: false
})
AudioSource.getMutable(openDialogSound).volume = 0.5
AvatarAttach.create(openDialogSound, {
  anchorPointId: AvatarAnchorPointType.AAPT_POSITION
})

export const closeDialogSound = engine.addEntity()
Transform.create(closeDialogSound, {
  position: Vector3.create(0, 0, 0)
})
AudioSource.create(closeDialogSound, {
  audioClipUrl: 'sounds/navigationBackward.mp3',
  loop: false,
  playing: false
})
AudioSource.getMutable(closeDialogSound).volume = 0.5
AvatarAttach.create(closeDialogSound, {
  anchorPointId: AvatarAnchorPointType.AAPT_POSITION
})

export function PlayOpenSound() {
  AudioSource.getMutable(openDialogSound).playing = true
}

export function PlayCloseSound() {
  AudioSource.getMutable(closeDialogSound).playing = true
}




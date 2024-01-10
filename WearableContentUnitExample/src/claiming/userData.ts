import { getUserData, UserData } from '~system/UserIdentity'
import { getCurrentRealm, EnvironmentRealm } from '~system/EnvironmentApi'

export let userData: UserData
export let playerRealm: EnvironmentRealm | undefined


export function getUserDataFromLocal(): UserData {
  return userData
}

export async function setUserData() {
  const response = await getUserData({})
  if (response && response.data) {
    console.log(response.data.publicKey)
    userData = response.data
  }
}

// fetch the player's realm
export async function setRealm() {
  let realm = await getCurrentRealm({})
  if (realm) {
    console.log(`You are in the realm: ${JSON.stringify(realm.currentRealm?.displayName)}`)
    playerRealm = realm.currentRealm
  }
}

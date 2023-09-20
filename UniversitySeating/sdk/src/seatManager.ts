import { AvatarModifierArea, AvatarModifierType, Entity, MeshRenderer, Transform, engine, executeTask } from "@dcl/sdk/ecs";
import { SeatingData } from "./UniversitySeatingData";
import { Seat } from "./seat";
import { MessageBus } from '@dcl/sdk/message-bus'
import * as ui from 'dcl-ui-toolkit'
import { announcement } from "./ui";
import * as utils from '@dcl-sdk/utils'
import { Vector3 } from "@dcl/sdk/math";
import { getUserData } from "~system/UserIdentity";

export class SeatManager {

    static mySeatID: number = -1 // No seat by default
    static tryingToSit: boolean = false
    static sceneMessageBus = new MessageBus()
    static seats: Seat[] = []

    static updateTime: number = 1
    static currentUpdateInterval: number = 0

    static seatedPosition: Vector3 = Vector3.Zero()
    static seated: boolean = false

    static seatedAvatarList: string[] = []
    static myAddress: string = ""

    static hideAvatarEntity: Entity = engine.addEntity()

    static connectedToWeb3: boolean = false

    constructor() {
        executeTask(async () => {
            let userData = await getUserData({})
            if (userData.data.hasConnectedWeb3) {
                SeatManager.myAddress = userData.data?.publicKey
                SeatManager.connectedToWeb3 = true
            } else {
                SeatManager.myAddress = userData.data.userId
            }
            this.load()
        })
    }
 
    load() {
        SeatingData.seats.forEach(chair => {
            SeatManager.seats.push(new Seat(chair.id, chair.position))
        });

        SeatManager.sceneMessageBus.on('ClaimedSeat', (data: any) => {
            SeatManager.seats.forEach(seat => {
                if (seat.id == data.id) {
                    seat.claimed = true
                }
            })
            SeatManager.addAddress(data.address)
            console.log("Seat " + data.id + " is claimed")
            console.log("addresses excluded: " + SeatManager.seatedAvatarList.length)
        })

        SeatManager.sceneMessageBus.on('UnClaimedSeat', (data: any) => {
            SeatManager.seats.forEach(seat => {
                if (seat.id == data.id) {
                    seat.claimed = false
                }
            })
            SeatManager.removeAddress(data.address)
            console.log("Seat " + data.id + " is released")
        })

        // Hide not seated avatars - don't do this with out web3
        if (SeatManager.connectedToWeb3) {
            AvatarModifierArea.create(SeatManager.hideAvatarEntity, {
                area: Vector3.create(5, 4, 8.5),
                modifiers: [AvatarModifierType.AMT_HIDE_AVATARS],
                excludeIds: SeatManager.seatedAvatarList.sort(),
            })

            //MeshRenderer.setBox(hideAvatarEntity)

            Transform.create(SeatManager.hideAvatarEntity, {
                position: Vector3.create(22, 2, 16),
                //scale: Vector3.create(5, 4, 8.5),
            })

            SeatManager.addAddress(SeatManager.myAddress)
        }

        engine.addSystem(this.update)
    }

    update(_dt: number) {
        SeatManager.currentUpdateInterval += _dt

        if (SeatManager.currentUpdateInterval >= SeatManager.updateTime) {
            SeatManager.currentUpdateInterval = 0

            // Brodcast my seat to everyone
            if (SeatManager.mySeatID != -1) {
                SeatManager.sceneMessageBus.emit("ClaimedSeat", { id: SeatManager.mySeatID, address: SeatManager.myAddress })
            }
        }

        // Check I am still in a seated position
        if (Transform.get(engine.CameraEntity) != undefined) {
            let match = SeatManager.compareVectors(SeatManager.seatedPosition, Transform.get(engine.PlayerEntity).position)
            if (SeatManager.seated && !match) {
                // Give up my seat as I have moved from it
                SeatManager.sceneMessageBus.emit("UnClaimedSeat", { id: SeatManager.mySeatID, address: SeatManager.myAddress })

                // Put the collider back on the seat so it can be selected again in the future
                SeatManager.seats.forEach(seat => {
                    if (seat.id == SeatManager.mySeatID) {
                        seat.createCollider()
                    }
                });

                SeatManager.mySeatID = -1
                SeatManager.seated = false
            }
        }
    }

    static addAddress(_address: string) {
        if (!SeatManager.seatedAvatarList.includes(_address)) {
            SeatManager.seatedAvatarList.push(_address)
            if (AvatarModifierArea.getMutableOrNull(SeatManager.hideAvatarEntity) != null) {
                AvatarModifierArea.getMutable(SeatManager.hideAvatarEntity).excludeIds = SeatManager.seatedAvatarList.sort()
            }
        }
    }

    static removeAddress(_address: string) {

        if (_address == SeatManager.myAddress) {
            return // Never remove your own address so you will always be visible for yourself
        }


        let seatIndex = SeatManager.seatedAvatarList.indexOf(_address)

        if (seatIndex > -1) {
            SeatManager.seatedAvatarList.splice(seatIndex, 1)
            if (AvatarModifierArea.getMutableOrNull(SeatManager.hideAvatarEntity) != null) {
                AvatarModifierArea.getMutable(SeatManager.hideAvatarEntity).excludeIds = SeatManager.seatedAvatarList.sort()
            }
        }
    }

    static compareVectors(_vector1: Vector3, _vector2: Vector3): boolean {
        let match: boolean = true

        if (_vector1.x != _vector2.x) {
            match = false
        }

        if (_vector1.y != _vector2.y) {
            match = false
        }

        if (_vector1.z != _vector2.z) {
            match = false
        }

        return match
    }

    static checkIfSeatIsFree(_seatID: number) {

        SeatManager.seats.forEach(seat => {
            if (seat.id == _seatID) {
                if (!seat.claimed) {
                    seat.claimed = true
                    SeatManager.mySeatID = _seatID
                    seat.sitDown()
                    SeatManager.sceneMessageBus.emit("ClaimedSeat", { id: SeatManager.mySeatID, address: SeatManager.myAddress })
                } else {
                    announcement.value = "Seat already taken"
                    announcement.show()
                    utils.timers.setTimeout(() => {
                        announcement.hide()
                    }, 1000)
                }
            }
        })

    }

}

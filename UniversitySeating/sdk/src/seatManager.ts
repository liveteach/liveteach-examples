import { Transform, engine } from "@dcl/sdk/ecs";
import { SeatingData } from "./UniversitySeatingData";
import { Seat } from "./seat";
import { MessageBus } from '@dcl/sdk/message-bus'
import * as ui from 'dcl-ui-toolkit'
import { announcement } from "./ui";
import * as utils from '@dcl-sdk/utils'
import { Vector3 } from "@dcl/sdk/math";

export class SeatManager {

    static mySeatID: number = -1 // No seat by default
    static tryingToSit: boolean = false
    static sceneMessageBus = new MessageBus()
    static seats: Seat[] = []

    static updateTime: number = 1
    static currentUpdateInterval: number = 0

    static seatedPosition: Vector3 = Vector3.Zero()
    static seated: boolean = false



    constructor() {
        SeatingData.seats.forEach(chair => {
            SeatManager.seats.push(new Seat(chair.id, chair.position))
        });

        SeatManager.sceneMessageBus.on('ClaimedSeat', (data: any) => {
            SeatManager.seats.forEach(seat => {
                if (seat.id == data.id) {
                    seat.claimed = true
                }
            })
            console.log("Seat " + data.id + " is claimed")
        })

        SeatManager.sceneMessageBus.on('UnClaimedSeat', (data: any) => {
            SeatManager.seats.forEach(seat => {
                if (seat.id == data.id) {
                    seat.claimed = false
                }
            })
            console.log("Seat " + data.id + " is released")
        })

        engine.addSystem(this.update)
    }

    update(_dt: number) {
        SeatManager.currentUpdateInterval += _dt

        if (SeatManager.currentUpdateInterval >= SeatManager.updateTime) {
            SeatManager.currentUpdateInterval = 0

            // Brodcast my seat to everyone
            if (SeatManager.mySeatID != -1) {
                SeatManager.sceneMessageBus.emit("ClaimedSeat", { id: SeatManager.mySeatID })
            }
        }

        // Check I am still in a seated position
        if (Transform.get(engine.CameraEntity) != undefined) {
            let match = SeatManager.compareVectors(SeatManager.seatedPosition, Transform.get(engine.PlayerEntity).position)
            if (SeatManager.seated && !match) {
                // Give up my seat as I have moved from it
                SeatManager.sceneMessageBus.emit("UnClaimedSeat", { id: SeatManager.mySeatID })

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
                    SeatManager.sceneMessageBus.emit("ClaimedSeat", { id: SeatManager.mySeatID })
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
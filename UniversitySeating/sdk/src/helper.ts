import { Quaternion, Vector3 } from "@dcl/sdk/math"

export class Helper {


    static getForwardVector(_rotation: Quaternion) : Vector3{

        let x = 2 * (_rotation.x * _rotation.z + _rotation.w * _rotation.y)
        let y = 2 * (_rotation.y * _rotation.z - _rotation.w * _rotation.x)
        let z = 1 - 2 * (_rotation.x * _rotation.x + _rotation.y * _rotation.y)

        return Vector3.create(x,y,z)

    }

    static randomNumberBetween(_min:number, _max:number):number {
        return _min + Math.random() * (_max - _min)
    }
}
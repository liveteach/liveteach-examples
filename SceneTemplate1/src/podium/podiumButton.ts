import { Entity, InputAction, Material, MeshCollider, MeshRenderer, PointerEventType, Transform, engine, inputSystem, pointerEventsSystem } from "@dcl/ecs";
import { Quaternion, Vector3 } from "@dcl/ecs-math";

export class PodiumButton {
    entity: Entity
    originalScale: Vector3
    holding: boolean = false
    elapsed: number = 0
    constructor(_parent: Entity, _position: Vector3, _rotation: Quaternion, _scale: Vector3, _hoverText: string, _onClick: Function, _onHold: Function = undefined, _canHold: boolean = false) {
        this.entity = engine.addEntity()
        Transform.create(this.entity, {
            parent: _parent,
            position: _position,
            rotation: _rotation,
            scale: _scale
        })
        this.originalScale = _scale
        MeshRenderer.setBox(this.entity)
        MeshCollider.setBox(this.entity)
        Material.setPbrMaterial(this.entity, {
            alphaTexture: Material.Texture.Common({
                src: 'images/alpha.png'
            })
        })

        if (_canHold) {
            const self = this
            pointerEventsSystem.onPointerDown(
                {
                    entity: this.entity,
                    opts: {
                        button: InputAction.IA_POINTER,
                        hoverText: _hoverText
                    }
                },
                function () {
                    self.holding = true
                    self.elapsed = 0
                }
            )

            engine.addSystem((dt: number) => {
                if (self.holding) {
                    self.elapsed += dt
                    if (!inputSystem.isPressed(InputAction.IA_POINTER)) {
                        self.holding = false
                        if (self.elapsed > 1) {
                            _onHold()
                        }
                        else {
                            _onClick()
                        }
                    }
                }
            })
        }
        else {
            pointerEventsSystem.onPointerDown(
                {
                    entity: this.entity,
                    opts: {
                        button: InputAction.IA_POINTER,
                        hoverText: _hoverText
                    }
                },
                function () {
                    _onClick()
                }
            )
        }
    }

    show() {
        Transform.getMutable(this.entity).scale = this.originalScale
    }

    hide() {
        Transform.getMutable(this.entity).scale = Vector3.Zero()
    }
}
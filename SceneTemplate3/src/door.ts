import { Animator, Entity, GltfContainer, PBAnimationState, Transform, engine } from '@dcl/sdk/ecs';
import { Vector3 } from '@dcl/sdk/math';

export class Door {

    private mainEntity: Entity
    public get getMainEntity(): Entity {
        return this.mainEntity;
    }
    private playerIn: boolean = false;
    private activated: boolean = false;
    private triggerPosition: Vector3 = Vector3.Zero()
    private triggerRadius: number = 0

    constructor(
        parent: Entity,
        model: string,
        triggerShape: {
            type: "sphere",
            position: Vector3.MutableVector3;
            radius: number;
        }[]
    ) {
        this.triggerPosition = Vector3.subtract(Transform.get(parent).position, triggerShape[0].position)
        this.triggerRadius = triggerShape[0].radius

        this.mainEntity = engine.addEntity()
        GltfContainer.create(this.mainEntity, { src: model })
        Transform.create(this.mainEntity, { parent: parent })

        Animator.create(this.mainEntity,
            {
                states: [
                    { clip: 'open', loop: true, playing: true, weight: 0 },
                    { clip: 'close', loop: true, playing: true, weight: 1 }
                ]
            }
        )
        let self = this
        engine.addSystem(self.update.bind(self))
    }

    public update(dt: number): void {
        if (Vector3.distance(Transform.get(engine.PlayerEntity).position, this.triggerPosition) < this.triggerRadius) {
            this.playerIn = true
            if (!this.activated) {
                this.activated = true
            }
        }
        else {
            this.playerIn = false
            if (!this.activated) {
                this.activated = true
            }
        }

        if (!this.activated) return
        if (this.playerIn) {
            this.addWeight(Animator.getClip(this.mainEntity, 'open'), dt)
            this.removeWeight(Animator.getClip(this.mainEntity, 'close'), dt)
            if (
                Animator.getClip(this.mainEntity, 'open').weight === 1 && Animator.getClip(this.mainEntity, 'close').weight === 0
            ) {
                this.activated = false
            }
        } else {
            this.addWeight(Animator.getClip(this.mainEntity, 'close'), dt)
            this.removeWeight(Animator.getClip(this.mainEntity, 'open'), dt)
            if (
                Animator.getClip(this.mainEntity, 'open').weight === 0 && Animator.getClip(this.mainEntity, 'close').weight === 1
            ) {
                this.activated = false
            }
        }
    }

    private removeWeight(animation: PBAnimationState, value: number) {
        if (animation.weight == undefined) return

        if (animation.weight <= 0) animation.weight = 0
        else animation.weight -= value
    }

    private addWeight(animation: PBAnimationState, value: number) {
        if (animation.weight == undefined) return

        if (animation.weight >= 1) animation.weight = 1
        else animation.weight += value
    }
}
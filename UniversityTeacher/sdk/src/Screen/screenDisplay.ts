import { Color3, Quaternion, Vector3 } from "@dcl/sdk/math";
import { Entity, Material, MeshRenderer, TextureUnion, Transform, VideoPlayer, engine } from "@dcl/sdk/ecs"
import { ScreenContent } from "./content/screenContent";
import { ScreenContentType } from "./enums";
import { VideoContent } from "./content/videoContent";
import { ClassroomManager } from "@dclu/dclu-liveteach/src/classroom";

export class ScreenDisplay {

    entity: Entity
    static videoTexture: TextureUnion
    static instances: ScreenDisplay[] = []

    constructor(_position: Vector3, _rotation: Vector3, _scale: Vector3, _parent?: Entity) {
        this.entity = engine.addEntity()

        if (_parent != undefined) {
            Transform.create(this.entity, {
                parent: _parent,
                position: _position,
                rotation: Quaternion.fromEulerDegrees(_rotation.x, _rotation.y, _rotation.z),
                scale: _scale
            })
        } else {
            Transform.create(this.entity, {
                position: _position,
                rotation: Quaternion.fromEulerDegrees(_rotation.x, _rotation.y, _rotation.z),
                scale: _scale
            })
        }

        MeshRenderer.setPlane(this.entity)
        VideoPlayer.create(this.entity)

        ScreenDisplay.instances.push(this)

    }

    startContent(_content: ScreenContent) {
        _content.isShowing = true
        switch (_content.contentType) {
            case ScreenContentType.image:
                Material.setPbrMaterial(this.entity, {
                    texture: Material.Texture.Common({
                        src: _content.configuration.sourcePath
                    }),
                    emissiveTexture: Material.Texture.Common({
                        src: _content.configuration.sourcePath
                    }),
                    emissiveColor: Color3.White(),
                    emissiveIntensity: 1,
                    metallic: 0,
                    roughness: 1
                })
                if (_content.configuration.ratio != undefined) {
                    Transform.getMutable(this.entity).scale.x = Transform.getMutable(this.entity).scale.y * _content.configuration.ratio
                } else {
                    Transform.getMutable(this.entity).scale.x = Transform.getMutable(this.entity).scale.y
                }
                break
            case ScreenContentType.video:
                Material.setPbrMaterial(this.entity, {
                    texture: (_content as VideoContent).videoTexture,
                    roughness: 1.0,
                    specularIntensity: 0,
                    metallic: 0,
                    emissiveTexture: (_content as VideoContent).videoTexture,
                    emissiveColor: Color3.White(),
                    emissiveIntensity: 1
                });

                VideoPlayer.getMutable((_content as VideoContent).videoEntity).playing = true

                if (_content.configuration.ratio != undefined) {
                    Transform.getMutable(this.entity).scale.x = Transform.getMutable(this.entity).scale.y * _content.configuration.ratio
                } else {
                    Transform.getMutable(this.entity).scale.x = Transform.getMutable(this.entity).scale.y
                }
                break
        }
    }
} 
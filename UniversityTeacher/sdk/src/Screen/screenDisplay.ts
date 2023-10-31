import { Color3, Quaternion, Vector3 } from "@dcl/sdk/math";
import { Entity, GltfContainer, Material, MeshRenderer, PBMaterial, TextureUnion, Transform, VideoPlayer, VideoTexture, engine } from "@dcl/sdk/ecs"
import { ScreenContent } from "./content/screenContent";
import { ScreenContentType } from "./enums";
import { VideoContent } from "./content/videoContent";
import * as utils from '@dcl-sdk/utils'

export class ScreenDisplay {

    baseEntity: Entity
    baseScreenEntity: Entity
    entity: Entity
    static videoTexture: TextureUnion
    static currentContent: ScreenContent
    podiumnScreen: boolean = false
    
    modelEntity: Entity
    parent: Entity

    constructor(_position: Vector3, _rotation: Vector3, _scale: Vector3, _podiumnScreen:boolean, _parent?: Entity) {
        this.baseEntity = engine.addEntity()
        this.baseScreenEntity = engine.addEntity()
        this.entity = engine.addEntity()

        this.podiumnScreen = _podiumnScreen

        if (_parent != undefined) {
            Transform.create(this.baseEntity, {
                parent: _parent,
                position: _position,
                rotation: Quaternion.fromEulerDegrees(_rotation.x, _rotation.y, _rotation.z),
            })
        } else {
            Transform.create(this.baseEntity, {
                position: _position,
                rotation: Quaternion.fromEulerDegrees(_rotation.x, _rotation.y, _rotation.z),
            })
        }

        Transform.create(this.baseScreenEntity, {parent: this.baseEntity, scale: Vector3.One()})
        Transform.create(this.entity, {parent: this.baseScreenEntity, scale: _scale})

        MeshRenderer.setPlane(this.entity)

    }

    hideContent(){
        Transform.getMutable(this.baseEntity).scale = Vector3.Zero()
    }

    unHideContent(){
        Transform.getMutable(this.baseEntity).scale = Vector3.One()
        this.startContent(ScreenDisplay.currentContent)
    }

    startContent(_content: ScreenContent) {
        _content.isShowing = true
        ScreenDisplay.currentContent = _content
        switch (_content.contentType) {
            case ScreenContentType.image:
                Transform.getMutable(this.baseScreenEntity).scale = Vector3.One()
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
                if(this.modelEntity!=undefined){
                    Transform.getMutable(this.modelEntity).scale = Vector3.Zero()
                }
                break
            case ScreenContentType.video:
                Transform.getMutable(this.baseScreenEntity).scale = Vector3.One()
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

                if(this.modelEntity!=undefined){
                    Transform.getMutable(this.modelEntity).scale = Vector3.Zero()
                }
                break
            case ScreenContentType.model:
                Transform.getMutable(this.baseScreenEntity).scale = Vector3.Zero()
                if(this.podiumnScreen){
                    // Podium screens won't show the 3d model as it will block the teacher controls.
                    return
                }
                if(this.modelEntity==undefined){
                    this.modelEntity = engine.addEntity()
                }
                Transform.createOrReplace(this.modelEntity, {
                    parent: this.baseEntity,
                    position: Vector3.create(0,-0.3,-2.5),
                    rotation: Quaternion.fromEulerDegrees(0,0,0),
                    scale: _content.configuration.modelScale}
                )
                GltfContainer.createOrReplace(this.modelEntity, {src:_content.configuration.sourcePath})
        }
    }

    update(_dt:number){
        if(this.modelEntity!=undefined && ScreenDisplay.currentContent.configuration.spin != undefined){
            if(ScreenDisplay.currentContent.configuration.spin){
             let yRotation:number = Quaternion.toEulerAngles(Transform.getMutable(this.modelEntity).rotation).y

             yRotation+=_dt*ScreenDisplay.currentContent.configuration.spinSpeed
             
             Transform.getMutable(this.modelEntity).rotation = Quaternion.fromEulerDegrees(0,yRotation,0)

             console.log("Spinning!?")
            }
        }
    }
} 
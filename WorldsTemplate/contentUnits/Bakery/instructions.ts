import { Entity, GltfContainer, MeshRenderer, Rotate, TextShape, Transform, TransformTypeWithOptionals, engine } from "@dcl/sdk/ecs"
import { Quaternion, Vector3 } from "@dcl/sdk/math"

export class Instructions {

    text: string [] = []
    display:Entity
    textEntity:Entity
    currentStep:number = 0

    constructor(_transform:TransformTypeWithOptionals){
        // Fill instructions
        this.text.push("Preheat the oven to 180°C")
        this.text.push("Place the eggs and\nsugar in a bowl")
        this.text.push("Whisk for 12-15 minutes")
        this.text.push("Sift the flour over\nthe egg mixture")
        this.text.push("Using a large spatula gently\nfold to combine the flour\nand the egg mixture")
        this.text.push("Add the butter")
        this.text.push("Gently fold to\ncombine the butter")
        this.text.push("Add the dough\nto a baking tin")
        this.text.push("Put the tin into the oven")
        this.text.push("Bake for 14-18 minutes")
        this.text.push("Display the baked cake")
        this.text.push("Choose a topping\nChocolate or Jam and Cream")
        this.text.push("Congratulations")

        this.display = engine.addEntity()
        Transform.create(this.display,_transform)
        GltfContainer.create(this.display,{src:"contentUnits/Bakery/models/instructionsDisplay.glb"})

        this.textEntity = engine.addEntity()
        Transform.create(this.textEntity, {
            parent:this.display,
            position: Vector3.create(-0.1,0,0),
            rotation: Quaternion.fromEulerDegrees(0,90,0),
            scale: Vector3.create(0.25,0.25,0.25)
        })
        TextShape.create(this.textEntity , {
            text: this.getText(this.currentStep)
        })
    }

    getText(_index){
        return this.text[_index]
    }

    increaseStep(){
        this.currentStep = this.currentStep + 1
        TextShape.getMutable(this.textEntity).text = this.getText(this.currentStep)
    }

    destroy(){
        TextShape.deleteFrom(this.textEntity)
        engine.removeEntity(this.textEntity)
        engine.removeEntity(this.display)
    }
}
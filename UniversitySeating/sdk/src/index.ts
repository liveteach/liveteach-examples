
import { Model } from "./model";
import { Vector3 } from '@dcl/sdk/math'
import { setupUi } from "./ui";

import { SeatingData } from "@dclu/dclu-liveteach/src/seating";
import * as dclu from '@dclu/dclu-liveteach'
import * as ecs from "@dcl/sdk/ecs"

export function main() {
  dclu.setup({
    ecs: ecs,
    Logger: null
  })


  new Model("models/UniSeatsTesting.glb", // Model path
    Vector3.create(16, 0, 16), //Position
    Vector3.create(0, 0, 0), //Rotation
    Vector3.create(1, 1, 1) //Scale
  )

  let seatingData: SeatingData = new SeatingData()

  const lookAtTarget = Vector3.create(16, 1, 16)
  seatingData.seats = [
    {
      id: 1,
      position: Vector3.create(4.221118927001953, 0.9218379259109497, 2.1278562545776367),
      rotation: Vector3.create(-89.999995674289, -0.0, -0.0),
      lookAtTarget: lookAtTarget
    },
    {
      id: 2,
      position: Vector3.create(4.552060127258301, 0.9218378663063049, 1.3081111907958984),
      rotation: Vector3.create(-89.999995674289, -0.0, -0.0),
      lookAtTarget: lookAtTarget
    },
    {
      id: 3,
      position: Vector3.create(4.720509052276611, 0.9218377470970154, 0.4402732849121094),
      rotation: Vector3.create(-89.999995674289, -0.0, -0.0),
      lookAtTarget: lookAtTarget
    },
    {
      id: 4,
      position: Vector3.create(4.720271110534668, 0.9218376874923706, -0.44374847412109375),
      rotation: Vector3.create(-89.999995674289, -0.0, -0.0),
      lookAtTarget: lookAtTarget
    },
    {
      id: 5,
      position: Vector3.create(4.551359176635742, 0.9218376278877258, -1.311495304107666),
      rotation: Vector3.create(-89.999995674289, -0.0, -0.0),
      lookAtTarget: lookAtTarget
    },
    {
      id: 6,
      position: Vector3.create(4.219976425170898, 0.921837568283081, -2.1310625076293945),
      rotation: Vector3.create(-89.999995674289, -0.0, -0.0),
      lookAtTarget: lookAtTarget
    },
    {
      id: 7,
      position: Vector3.create(5.866034030914307, 1.2139322757720947, 2.964784622192383),
      rotation: Vector3.create(-89.999995674289, -0.0, -0.0),
      lookAtTarget: lookAtTarget
    },
    {
      id: 8,
      position: Vector3.create(6.234636306762695, 1.2139322757720947, 2.164811134338379),
      rotation: Vector3.create(-89.999995674289, -0.0, -0.0),
      lookAtTarget: lookAtTarget
    },
    {
      id: 9,
      position: Vector3.create(6.484633445739746, 1.2139321565628052, 1.3202142715454102),
      rotation: Vector3.create(-89.999995674289, -0.0, -0.0),
      lookAtTarget: lookAtTarget
    },
    {
      id: 10,
      position: Vector3.create(6.6108503341674805, 1.2139321565628052, 0.4484901428222656),
      rotation: Vector3.create(-89.999995674289, -0.0, -0.0),
      lookAtTarget: lookAtTarget
    },
    {
      id: 11,
      position: Vector3.create(6.6106743812561035, 1.2139320373535156, -0.43231964111328125),
      rotation: Vector3.create(-89.999995674289, -0.0, -0.0),
      lookAtTarget: lookAtTarget
    },
    {
      id: 12,
      position: Vector3.create(6.484109878540039, 1.2139320373535156, -1.3039960861206055),
      rotation: Vector3.create(-89.999995674289, -0.0, -0.0),
      lookAtTarget: lookAtTarget
    },
    {
      id: 13,
      position: Vector3.create(6.23377799987793, 1.213931918144226, -2.1484861373901367),
      rotation: Vector3.create(-89.999995674289, -0.0, -0.0),
      lookAtTarget: lookAtTarget
    },
    {
      id: 14,
      position: Vector3.create(5.8648576736450195, 1.213931918144226, -2.948314666748047),
      rotation: Vector3.create(-89.999995674289, -0.0, -0.0),
      lookAtTarget: lookAtTarget
    },
    {
      id: 15,
      position: Vector3.create(7.385390758514404, 1.5607224702835083, 3.762807846069336),
      rotation: Vector3.create(-89.999995674289, -0.0, -0.0),
      lookAtTarget: lookAtTarget
    },
    {
      id: 16,
      position: Vector3.create(7.7754645347595215, 1.5607223510742188, 2.9766931533813477),
      rotation: Vector3.create(-89.999995674289, -0.0, -0.0),
      lookAtTarget: lookAtTarget
    },
    {
      id: 17,
      position: Vector3.create(8.072600364685059, 1.5607223510742188, 2.1509571075439453),
      rotation: Vector3.create(-89.999995674289, -0.0, -0.0),
      lookAtTarget: lookAtTarget
    },
    {
      id: 18,
      position: Vector3.create(8.272858619689941, 1.5607222318649292, 1.2965402603149414),
      rotation: Vector3.create(-89.999995674289, -0.0, -0.0),
      lookAtTarget: lookAtTarget
    },
    {
      id: 19,
      position: Vector3.create(8.373586654663086, 1.5607222318649292, 0.42476463317871094),
      rotation: Vector3.create(-89.999995674289, -0.0, -0.0),
      lookAtTarget: lookAtTarget
    },
    {
      id: 20,
      position: Vector3.create(8.37344741821289, 1.5607221126556396, -0.45279598236083984),
      rotation: Vector3.create(-89.999995674289, -0.0, -0.0),
      lookAtTarget: lookAtTarget
    },
    {
      id: 21,
      position: Vector3.create(8.272443771362305, 1.5607221126556396, -1.3245348930358887),
      rotation: Vector3.create(-89.999995674289, -0.0, -0.0),
      lookAtTarget: lookAtTarget
    },
    {
      id: 22,
      position: Vector3.create(8.071914672851562, 1.56072199344635, -2.178891181945801),
      rotation: Vector3.create(-89.999995674289, -0.0, -0.0),
      lookAtTarget: lookAtTarget
    },
    {
      id: 23,
      position: Vector3.create(7.77451753616333, 1.56072199344635, -3.0045347213745117),
      rotation: Vector3.create(-89.999995674289, -0.0, -0.0),
      lookAtTarget: lookAtTarget
    },
    {
      id: 24,
      position: Vector3.create(7.3841938972473145, 1.5607218742370605, -3.7905192375183105),
      rotation: Vector3.create(-89.999995674289, -0.0, -0.0),
      lookAtTarget: lookAtTarget
    },
  ]

  // Apply offset
  let offset = Vector3.create(16, 0.3, 16)
  seatingData.seats.forEach(seat => {
    seat.position = Vector3.add(seat.position, offset)
  });

  // Debugging
  // seatingData.seats.forEach(seat => {
  //   let entity: ecs.Entity = ecs.engine.addEntity()
  //   ecs.Transform.create(entity, {position:seat.position, rotation: Quaternion.fromEulerDegrees(seat.rotation.x,seat.rotation.y,seat.rotation.z)})
  //   ecs.MeshRenderer.setBox(entity)
  // });

  new dclu.seating.SeatingController(seatingData, Vector3.Zero(), Vector3.Zero())


  // new TeacherAssigner()

  setupUi()
}

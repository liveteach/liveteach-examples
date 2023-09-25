# DCLU Example Seating Scene

This scene is built with SDK7

# How to set up the seating data

## Export
An easy way to set up the seating data is to export straight from Blender. The script below will export a collection of selcted objects

```py
import bpy
from math import pi

file = open("C:\\UniversitySeating\\sdk\\src\\UniversitySeatingData.ts", "w")
file.write("import { Vector3 } from \"@dcl/sdk/math\";\n")
file.write("export class SeatingData{\n")
file.write("static seats = [\n")

index = 0

sel_objs = [obj for obj in bpy.context.selected_objects]
for obj in sel_objs:
    file.write("\t{\n")    
    pos = obj.location
    rot = obj.rotation_euler
    file.write("\t\tid: " + str(index) + ",\n")
    file.write("\t\tposition: Vector3.create(" + str(-pos.x) + ", " + str(pos.z) + ", " + str(-pos.y) + "),\n")
    file.write("\t\trotation: Vector3.create(" + str(-rot.x * 180 / pi) + ", " + str(-rot.z * 180 / pi) + ", " + str(rot.y * 180 / pi) + ")")
    file.write("\t},\n")
    index+=1
    
file.write("]\n")
file.write("}\n")
file.close()
```

> The rotation will be used to angle the user when they sit in the chair. This isn't always needed, in this example scene the users seated rotation is set from a look position which would be where the teacher would be standing.

## Import
The exported type script file can now be stored in the project to be read by the Seating Manager class. The blender script could also be used to create json to be held on a server if prefered, it is up to the implementor if they want to store the data in a different way.


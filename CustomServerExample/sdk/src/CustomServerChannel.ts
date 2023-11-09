
import { IServerChannel } from "@dclu/dclu-liveteach/src/classroom/comms/IServerChannel";
import { UserData } from "~system/UserIdentity";
import { ClassContentPacket, ClassPacket, Classroom, StudentCommInfo, ServerParams } from "@dclu/dclu-liveteach/src/classroom/types/classroomTypes";

export class CustomServerChannel implements IServerChannel{

    private static myCustomServer;

    serverConfig(params: ServerParams):void {
        /* 
            Use the server Params object to configure the Your server,
            the Object contains the following fields
            {
                serverUrl: string   = the url of your custom server 
                role: string        = the Users role Teacher or Student
                _userData: UserData = Userdata provided by the ~system/UserIdentity 
            }
        
            instatiate your custom server to use in the following methods

            CustomServerChannel.myCustomServer = new MyCustomServer(params)

        */
        
    }

    emitClassActivation(_info: ClassPacket):void {
        
        CustomServerChannel.myCustomServer.handlemessage(_info) 

        // Handle the Class Activation Message
    }
    emitClassDeactivation(_info: ClassPacket):void {
        
        CustomServerChannel.myCustomServer.handlemessage(_info) 

        // Handle the Class Deactivation Message
    }
    emitClassStart(_info: ClassPacket):void {
       
        CustomServerChannel.myCustomServer.handlemessage(_info) 

        // Handle the Class Start Message
    }
    emitClassEnd(_info: ClassPacket):void {
       
        CustomServerChannel.myCustomServer.handlemessage(_info) 

        // Handle the Class End Message
    }
    emitClassJoin(_info: StudentCommInfo):void {
       
        CustomServerChannel.myCustomServer.handlemessage(_info) 

        // Handle the Student Join Class Message
    }
    emitClassExit(_info: StudentCommInfo):void {
       
        CustomServerChannel.myCustomServer.handlemessage(_info) 

        // Handle the Student Leave Class Message
    }
    emitClassroomConfig(_info: Classroom):void {
        
        CustomServerChannel.myCustomServer.handlemessage(_info) 

        // Handle the Classroom Config Message
    }
    emitImageDisplay(_info: ClassContentPacket):void {
        
        CustomServerChannel.myCustomServer.handlemessage(_info) 

        // Handle the Display Image Message
    }
    emitVideoDisplay(_info: ClassContentPacket):void {
        
        CustomServerChannel.myCustomServer.handlemessage(_info) 

        // Handle the Display Video Message
    }
    emitModelDisplay(_info: ClassContentPacket):void {
       
        CustomServerChannel.myCustomServer.handlemessage(_info) 

        // Handle the Display 3D Model Message
    }
    emitVideoPlay(_info: ClassContentPacket): void {
        
        CustomServerChannel.myCustomServer.handlemessage(_info) 

        // Handle the Video Play Message
    }
    emitVideoPause(_info: ClassContentPacket): void {
        
        CustomServerChannel.myCustomServer.handlemessage(_info) 

        // Handle the Video Pause Message
    }
    emitVideoResume(_info: ClassContentPacket): void {
        
        CustomServerChannel.myCustomServer.handlemessage(_info) 

        // Handle the Video Resume Message
    }
    emitVideoVolume(_info: ClassContentPacket): void {
        
        CustomServerChannel.myCustomServer.handlemessage(_info) 

        // Handle the Video Volume Message
    }
    emitModelPlay(_info: ClassContentPacket): void {
        
        CustomServerChannel.myCustomServer.handlemessage(_info) 

        // Handle the 3D Model Play Message
    }
    emitModelPause(_info: ClassContentPacket): void {
        
        CustomServerChannel.myCustomServer.handlemessage(_info) 

        // Handle the 3D Model Pause Message
    }
    emitModelResume(_info: ClassContentPacket): void {
        
        CustomServerChannel.myCustomServer.handlemessage(_info) 

        // Handle the 3D Model Resume Message
    }
    emitScreenDeactivation(_info: ClassPacket): void {
        
        CustomServerChannel.myCustomServer.handlemessage(_info) 

        // Handle the Screen Deactivation Message
    }
    emitModelDeactivation(_info: ClassPacket): void {
        
        CustomServerChannel.myCustomServer.handlemessage(_info) 

        // Handle the Model Deactivation Message
    }
}
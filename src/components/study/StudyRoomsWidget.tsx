import { useState } from "react";
import { motion } from "framer-motion";
import { useStudyRooms } from "@/hooks/useStudyRooms";
import { useAuth } from "@/hooks/useAuth";
import { Users, Plus, DoorOpen, ArrowLeft, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const statusColors: Record<string, string> = {
  studying: "bg-green-500",
  break: "bg-yellow-500",
  online: "bg-blue-500",
  offline: "bg-gray-400",
};

const statusLabels: Record<string, string> = {
  studying: "Studying",
  break: "On Break",
  online: "Online",
  offline: "Offline",
};

const StudyRoomsWidget = () => {
  const { user } = useAuth();
  const { rooms, currentRoom, participants, createRoom, joinRoom, leaveRoom, setCurrentRoom } = useStudyRooms();
  const [showCreate, setShowCreate] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [roomDesc, setRoomDesc] = useState("");

  if (!user) return null;

  if (currentRoom) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => { leaveRoom(currentRoom.id); setCurrentRoom(null); }}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h3 className="font-bold">{currentRoom.name}</h3>
            <p className="text-xs text-muted-foreground">{participants.length} participants</p>
          </div>
        </div>

        <div className="space-y-2">
          {participants.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-card/80 border border-border/30"
            >
              <div className="relative">
                <Avatar className="w-9 h-9">
                  <AvatarImage src={p.avatar_url || ""} />
                  <AvatarFallback className="text-xs">{(p.display_name || "?")[0]}</AvatarFallback>
                </Avatar>
                <Circle className={cn("w-3 h-3 absolute -bottom-0.5 -right-0.5 rounded-full", statusColors[p.status || "offline"])} fill="currentColor" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{p.display_name || "Anonymous"}</p>
                <p className="text-[10px] text-muted-foreground">{statusLabels[p.status || "offline"]}</p>
              </div>
              {p.status === "studying" && (
                <span className="text-[10px] px-2 py-0.5 bg-green-500/15 text-green-500 rounded-full font-bold">
                  📖 Active
                </span>
              )}
            </motion.div>
          ))}
          {participants.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-8">No one here yet. Invite friends to join!</p>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold">Study Rooms</h3>
        <Button size="sm" variant="outline" className="rounded-full text-xs gap-1" onClick={() => setShowCreate(true)}>
          <Plus className="w-3.5 h-3.5" />
          Create
        </Button>
      </div>

      <div className="space-y-3">
        {rooms.map((room, i) => (
          <motion.div
            key={room.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-xl border border-border/50 bg-card/80 p-4 hover:border-primary/30 transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold">{room.name}</h4>
                {room.description && <p className="text-xs text-muted-foreground mt-0.5">{room.description}</p>}
              </div>
              <Button size="sm" className="rounded-full text-xs gap-1" onClick={() => joinRoom(room.id)}>
                <DoorOpen className="w-3.5 h-3.5" />
                Join
              </Button>
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <Users className="w-3 h-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">{room.participant_count || 0} / {room.max_participants}</span>
            </div>
          </motion.div>
        ))}
        {rooms.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-8">No rooms yet. Create one!</p>
        )}
      </div>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Create Study Room</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Room name" value={roomName} onChange={e => setRoomName(e.target.value)} />
            <Textarea placeholder="Description (optional)" value={roomDesc} onChange={e => setRoomDesc(e.target.value)} rows={2} />
            <Button
              onClick={async () => {
                await createRoom(roomName, roomDesc);
                setRoomName("");
                setRoomDesc("");
                setShowCreate(false);
              }}
              disabled={!roomName.trim()}
              className="w-full"
            >
              Create Room
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudyRoomsWidget;

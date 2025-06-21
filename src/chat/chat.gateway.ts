import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: '*', // In production, you should restrict this to your frontend's origin
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('ChatGateway');
  private rooms = new Map<string, Set<string>>();

  constructor(private jwtService: JwtService) {}

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ): void {
    const username = client.data.user?.username;
    if (!username) return;

    client.join(room);
    if (!this.rooms.has(room)) {
      this.rooms.set(room, new Set());
    }
    const roomUsers = this.rooms.get(room);
    if (roomUsers) {
      roomUsers.add(username);
      this.logger.log(`${username} joined room: ${room}`);
      const users = Array.from(roomUsers);
      this.server.to(room).emit('updateUserList', users);
    }
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ): void {
    client.leave(room);
    this.logger.log(`Client ${client.id} left room: ${room}`);
    client.emit('leftRoom', room); // Optional: notify client they left
  }

  @SubscribeMessage('sendMessage')
  handleMessage(
    @MessageBody() payload: { room: string; message: string },
    @ConnectedSocket() client: Socket,
  ): void {
    const author = client.data.user?.username;
    if (!author) {
      this.logger.error(`Could not find user for client ${client.id}`);
      return;
    }
    
    this.logger.log(`Message received from ${author} in room ${payload.room}: ${payload.message}`);

    const messagePayload = {
      message: payload.message,
      author: author,
      createdAt: new Date(),
    };
    
    this.server.to(payload.room).emit('newMessage', messagePayload);
    this.logger.log(`Broadcasting message from ${author} to room ${payload.room}`);
  }

  async handleConnection(client: Socket, ...args: any[]) {
    try {
      const token = client.handshake.auth.token;
      if (!token) {
        throw new Error('Authentication token not found');
      }
      const payload = await this.jwtService.verifyAsync(token, { secret: 'YOUR_SECRET_KEY' });
      // Attach user to the socket object for later use
      client.data.user = payload;
      this.logger.log(`Client connected: ${client.id}, user: ${payload.username}`);
    } catch (error) {
      this.logger.error(`Authentication failed for client ${client.id}: ${error.message}`);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    const username = client.data.user?.username;
    if (!username) {
      this.logger.log(`Client disconnected: ${client.id}`);
      return;
    }
    
    this.logger.log(`Client disconnected: ${username} (${client.id})`);
    
    this.rooms.forEach((users, room) => {
      if (users.has(username)) {
        users.delete(username);
        const updatedUsers = Array.from(users);
        this.server.to(room).emit('updateUserList', updatedUsers);
        if (users.size === 0) {
          this.rooms.delete(room);
        }
      }
    });
  }
}

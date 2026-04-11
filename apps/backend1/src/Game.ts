import {WebSocket} from "ws";
import{ Chess} from 'chess.js';
import { GAME_OVER, INIT_GAME, MOVE } from "./message";
export class Game {
    public player1 :WebSocket;
     public player2 :WebSocket;
     private board : Chess;
     private move : number;
     
     private startTime : Date;

     constructor(player1:WebSocket,player2:WebSocket){
        this.player1=player1;
        this.player2=player2;
        this.board=new Chess();
        this.move=0;

        this.startTime = new Date();
        this.player1.send(JSON.stringify({
         type:INIT_GAME,
         payload:{
            color:"white"
         }
        }));
         this.player2.send(JSON.stringify({
         type:INIT_GAME,
         payload:{
            color:"black"
         }
        }))


     };

     public makeMove(socket:WebSocket,move:{from:string,to:string}
     ){
      // validattion here, add zod validation here, the move validation will be done by the library.

      if(this.move%2==0 && socket!==this.player1){
         return;
      };

      if(this.move%2==1 && socket!==this.player2){
         return;
      }


      // is it this users move
      // Is this move valid.

      // upate the board
      // push teh mvoe

      try {
         this.board.move(move);
         this.move++;
      } catch (error) {
         console.error("error occured while validating and updating the chess move : ",error);
         return;
      }



         // check if the mgame is over 
      // send the updated board to the both playsers


      if(this.board.isGameOver()){
         this.player1.emit(JSON.stringify({
            type:GAME_OVER,
            payload:{
               winner:this.board.turn() ==="w" ?"black":"white"
            }
         }));

         this.player2.emit(JSON.stringify({
            type:GAME_OVER,
            payload:{
               winner:this.board.turn() ==="w" ?"black":"white"
            }
         }));

         return;
      }

      if(this.board.moves.length%2===0){
         this.player2.send(JSON.stringify({
            type:MOVE,
            payload:move,
            message:"moved made by player 1"
         }))
      }else{
         this.player1.send(JSON.stringify({
            type:MOVE,
            payload:move,
             message:"moved made by player 2"
         }))
      };


   


      

 
   
     }
     
    
}
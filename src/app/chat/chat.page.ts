import { Component,OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/sdk/core/auth.service';
import { UserService } from 'src/sdk/core/user.service';
import { ContactsService } from 'src/sdk/core/contacts.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  
online
offline
  message = '';
  smessage
  messages = [];
  currentUser = '';
   name;
   chattername;
roomid;
contact
userid
   constructor(
     private authService:AuthService ,
     private contactsService:ContactsService,
     private userService:UserService,
     private socket: Socket,
      private toastCtrl: ToastController) { }
 
  ngOnInit() {
    this.socket.connect();     
 this.getdatafromstorage();
 this.online=false;
 this.offline=true;
  
 // let name = `user-${new Date().getTime()}`;
   
console.log("current user",this.currentUser);
    this.socket.emit('set-name', this.name);

    this.socket.fromEvent('users-changed').subscribe(data => {
      let user = data['user'];
      if (data['event'] === 'left') {
        
        this.online=false;
        this.offline=true;
      } else {
      
      this.online=true;
      this.offline=false;
      }
    });
 
 
    this.socket.fromEvent('message').subscribe(message => {
      this.messages.push(message);  
      console.log("messages",this.messages); 
    this.savemsgs(message);
    }
    );
   
  }
  
async savemsgs(message){
  const observable = await this.contactsService.updateMessages(message,this.roomid);
  observable.subscribe(
  async data => {
      console.log('message save successfully ', data);
     
   err => {
      console.log(' err while saving messages', err);          
    }
  }
  );
}

  getdatafromstorage(){
    const name='name';
    this.authService.getTokenFromStorage(name).then(data => {
     
     this.name = data;
     console.log('fetched name',this.name);
     this.currentUser = this.name;
   this.getuserid();
     
     
      })
      .catch(error => { console.log('fethching error',error) });
  }
 
  getuserid(){
   const id='userid';
    this.authService.getTokenFromStorage(id).then(data => {
     
     this.userid = data;
     console.log('fetched userid',this.userid);
     this.getroomid();
   
    })
      .catch(error => { console.log('fethching error',error) });
  }

  async getchattername( _id){
 
    if(_id==="614ff8d793f1b20d40b9f6e1"){
      this.chattername='Admin';
      console.log('recieved chatter name', this.chattername);
 
      if(this.contact.user_id===this.userid){
        this.getmsgsuseridt();
      
   }
            else{
           this.getmsgsuseridf();
            }
             
    }
    else{
      const observable = await this.userService.getSingleUserbyid(_id);
      observable.subscribe(
      async data => {
          console.log('user ', data);
          this.chattername=data.data.name;
       console.log('recieved chatter name', this.chattername);
       
       if(this.contact.user_id===this.userid){
        this.getmsgsuseridt();
      
   }
            else{
           this.getmsgsuseridf();
            }
             
       err => {
          console.log('recieveing chatter name err', err);          
        }
      }
      );
    }
    
  }

  getmsgsuseridt(){
//for getting user messages     
if(this.contact.user_messages.length===0){
  console.log("no messages by ",this.currentUser);
}

else{
for(let msg of this.contact.user_messages){
const message={
  msg:msg.message,
  user:this.currentUser,
  createdAt:msg.createdAt
}
console.log("user messages",message);
this.messages.push(message); 
}

}
//for getiing contacted person saved messages
if(this.contact.contacteduser_messages.length===0){
  console.log("no messages by ",this.chattername);
}
else{
for(let msg of this.contact.contacteduser_messages){
  const message={
    msg:msg.message,
    user:this.chattername,
    createdAt:msg.createdAt
  }
  console.log("user messages",message);
  this.messages.push(message); 
  }
  this.messages.sort(function(a,b) { 
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() 
  });
  //this.messages.sort((a, b) => parseFloat(a.createdAt) - parseFloat(b.createdAt));
          }
        }
  
  getmsgsuseridf(){
    if(this.contact.contacteduser_messages.length===0){
      console.log("no messages by ",this.currentUser);
    }
    else{
//for getting user messages     
for(let msg of this.contact.contacteduser_messages){
const message={
msg:msg.message,
user:this.currentUser,
createdAt:msg.createdAt
}
console.log("user messages",message);
this.messages.push(message); 
}
    }
    if(this.contact.user_messages.length===0){
      console.log("no messages by ",this.chattername);
    }
    
    else{
//for getiing contacted person saved messages
for(let msg of this.contact.user_messages){
const message={
msg:msg.message,
user:this.chattername,
createdAt:msg.createdAt
}
console.log("user messages",message);
this.messages.push(message); 
}

this.messages.sort(function(a,b) { 
return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() 
});

  }
  }
  getroomid(){
    //to get thw whole contact
    const room="idforchat"
    this.authService.getTokenFromStorage(room).then(data => {
     this.contact=data;
     console.log('fetched contact',this.contact);
     this.roomid = data.roomid;

     //to get user name
     if(this.contact.user_id===this.userid){
      this.getchattername(this.contact.contacted_userid);
      console.log("entered if");
 }
          else{
            this.getchattername(this.contact.user_id)
            console.log("entered else");
          }
          
//to connect to socket
        console.log('fetched roomid',this.roomid);
        this.socket.emit('join', this.roomid);
        console.log("current user",this.currentUser);
        this.socket.emit('set-name', this.currentUser);
    
      })
      .catch(error => { console.log('fethching error',error) });
    
  }
  sendMessage() {
   
    this.socket.emit('send-message', { text: this.message });
    this.message = '';
  }
 
  ionViewWillLeave() {
    this.socket.disconnect();
  }
 
  async showToast(msg) {
    let toast = await this.toastCtrl.create({
      message: msg,
      position: 'top',
      duration: 2000
    });
    toast.present();
  }
}

function complete(arg0: {}): (error: any) => void {
  throw new Error('Function not implemented.');
}

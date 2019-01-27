const Discord = require('discord.js');
const YouTube = require('simple-youtube-api');
const client = new Discord.Client();
const DISCORD_TOKEN = YOUR_DISCORD_TOKEN;
const YOUTUBE_TOKEN = YOUR_YOUTUBE_API_TOKEN;
const ytdl = require('ytdl-core');
const youtube = new YouTube(YOUTUBE_TOKEN);
var players = new Array();
var queues = {};

//tirar dps


//



//players recebe o dispatcher com id do server
//queues recebe o id do server e musica
client.on('ready', () => {
  console.log('Logged in as' + client.user.tag);
  client.user.setActivity('.help');
});

//bot command functions
function add(msg, text){
  		numbers = text.substr(5, text.length);
    	number = numbers.split(" ");
    		try{
    			sum = parseInt(number[0]) + parseInt(number[1]);
					if(!isNaN(sum)){
						msg.reply(sum);
			}else{
				msg.reply("Insira apenas números.");
			}

    		}catch(err){
    			msg.reply("Erro!");
    		}
  	}



  	async function stop(msg){
  		if(msg.member.voiceChannel){
  			if(msg.guild.voiceConnection){
  				msg.guild.voiceConnection.disconnect();
  				delete players[msg.guild.id];
  				delete queues[msg.guild.id];
  			}
  		}
	}


	async function queue(url, id){
  		queues[id+""].push(url);

  	}

  	async function check(id, connection, msg){
  		if(queues[id][0]==undefined){
  			stop(msg);
  		}else{
  			url = queues[id].shift();
  			if(url.includes('youtu.be') || url.includes('youtube.com')){
  				msg.channel.send("Now playing: "+url);
  			}else{
  				msg.channel.send("Now playing: https://www.youtube.com/watch?v="+url);
  			}
  			stream = ytdl(url, {filter : 'audioonly'});
  			players[id] = connection.playStream(stream);
  			players[id].on('end', function(){
  				check(id, connection, msg);
  			})
  		}
  	}

  	async function skip(msg){
  		players[msg.guild.id].destroy();
  	}

  	async function pause(msg){
  		players[msg.guild.id].pause();
  	}

  	async function resume(msg){
  		players[msg.guild.id].resume();
  	}

  	async function play(msg, url, players){
  		query = msg.content.substring(6, msg.content.length);
  		var search = await youtube.searchVideos(query, 1);
		url = await search[0].id;
  		if(msg.member.voiceChannel){
  			if(!msg.guild.voiceConnection){
  				queues[msg.guild.id+""] = [];
  				msg.member.voiceChannel.join().then(async function(){
  						connection = msg.member.voiceChannel.connection;
  							if(players[msg.guild.id]==undefined){
  				
				queue(url, msg.guild.id);
  				check(msg.guild.id, connection, msg);
  				
  			}else{
  				
  				msg.channel.send("Music queued!");
  				queue(url, msg.guild.id);
  			}
  				});
  			
  				
  			}else{
  				
  				msg.channel.send("Music queued!");
  				queue(url, msg.guild.id);
  			}
	
  		}else{
  			msg.reply("You have to be in a voice channel.");
  		}
  	}

  	//end//
client.on('message', msg => {
  //bot commands
  text = msg.content;
  if (text.startsWith('.filas')){
    	
   		console.log("Procura...");
    	search(text);
    
  }
  if (text.startsWith('.play ')){
  	url = text.substr(6, text.length);
  	
  	play(msg, url, players);
  }
  if (text.startsWith('.skip')){
  	skip(msg);
  }
  if (text.startsWith('.pause')){
  	pause(msg);
  }
  if (text.startsWith('.resume')){
  	resume(msg);
  }
  if (text.startsWith('.stop')){
  	stop(msg);
  }

  
});

client.login(DISCORD_TOKEN);

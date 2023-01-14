const express= require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const axios= require("axios");
const app=express();
app.set('view engine', 'ejs');
const key="RGAPI-c35d0fdd-feda-443f-9eb7-f99a304568ba";
const riot="https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/";
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.get("/",function(req,res){
    res.sendFile(__dirname +"/views/html"+"/index.html");
});


const champ="http://ddragon.leagueoflegends.com/cdn/13.1.1/data/en_US/champion.json";
app.post("/summonerLoL",function(req,reses){
   const name= req.body.sum;
   const newReq= riot + name + "?api_key=" + key;
   var champ1;
   var champ2;
   var champ3;

   axios.get(newReq).then(function(response){
        var i = 0;
        const getChamp= "https://na1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/"+ response.data.id +"/top?count=3&api_key=" + key;
        axios.get(getChamp).then(function(res){
            axios.get(champ).then(function(ress){
                

                while (i < 3){
                    for (let x in ress.data.data){
            
                        if( ress.data.data[x].key == res.data[i].championId){
                            
                            if (i == 0){
                                champ1 = ress.data.data[x].name;
                            }else if (i == 1){
                                champ2 = ress.data.data[x].name;
                            }else{
                                champ3= ress.data.data[x].name;
                            }
                            break;
                       }
                    }
                    i = i + 1;
                }
                reses.render("result",{
                    name: response.data.name,
                    level: response.data.summonerLevel,
                    pic: response.data.profileIconId,
                    champ1: champ1,
                    champ2: champ2,
                    champ3: champ3,
                    champ1M: res.data[0].championLevel,
                    champ2M: res.data[1].championLevel,
                    champ3M: res.data[2].championLevel

                });
            });
           
        });     
    }).catch(function(error){
        console.log(response.data);
    });

});





app.listen(3000,function(){
    console.log("Server is running!");
})
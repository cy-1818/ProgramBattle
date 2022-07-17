var screen=document.getElementById("canvas");
var c = screen.getContext('2d');
var redHP=document.getElementById("redHP");
var blueHP=document.getElementById("blueHP");
var jsid=null,shotTime=0,moveLogi=true,itemKind="",itemLogi=0,HPE,HPT;
function isThere(name,x,y){
 switch(name.shape){
  case "circle":
   if((name.x-x)**2+(name.y-y)**2<name.size**2){
    return true;
   }else{
    return false;
   }
   break;
  default:
   return false;
   console.error(name.shape+"was undefined as shape kind(in isThere, name:"+name.name+")");
 }
}

function whatThere(x,y,self){
 if(self){
  var ans=self;
 }else{
  //console.log("write self name");
  var ans=null;
 }
 for(var n in objects){
  if(objects[objects.length-n-1]!==self && isThere(getObjectByName(objects[objects.length-n-1]),x,y)){
   ans=objects[objects.length-n-1];
   break;
  }
 }
 return ans;
}

function getObjectByName(name){
 if(objectPass[name]===undefined){
  console.log(name);
 }
 return objectPass[name];
}

function makeObject(pass,name,date){
 if(objects.includes(name)){
  var forkName=name+"2",n=2;
  do{
   forkName=name+n;
   n++;
  }while(objects.includes(forkName));
  pass[forkName]=date;
  pass[forkName].name=forkName;
  objectPass[forkName]=pass[forkName];
  objects.push(forkName);
  firstRun.push(forkName);
 }else{
  pass[name]=date;
  pass[name].name=name;
  objectPass[name]=pass[name]
  objects.push(name);
  firstRun.push(name);
 }
}
function die(name){
 objects.splice(objects.indexOf(name), 1);
 delete getObjectByName(name);
}
function outCheck(obj){
 if(obj.x>1000){
  return true;
 }else if(obj.y>500){
  return true;
 }else if(obj.x<0){
  return true;
 }else if(obj.y<0){
  return true;
 }else{
  return false;
 }
}
var addDrow={
 added:false,
 elements:[],
 add:function(func){
  this.elements.push(func);
  this.added=true;
 },
 drow:function(){
  if(this.added){
   for(var n in this.elements){
    this.elements[n]();
   }
   this.added=false;
   this.elements=[];
  }
 }
}

var hpCheck="if(this.hp<=0){die(this.name);heal=(addHP)=>{th.hp=0}}if(outCheck(this)){this.hp-=this.mpGain*100+10000}",PF="this.programFirst=false";
var funcs=`
var th=this,scan=function(face,length){
 if(th.mp>length-100&&length>=0){
  addDrow.add(function(){
   c.strokeStyle=th.color;
   c.beginPath();
   c.moveTo(th.x,th.y);
   c.lineTo(th.x+Math.cos(face*(Math.PI/180))*length,th.y+Math.sin(face*(Math.PI/180))*length);
   c.closePath();
   c.stroke();
  });
  th.mp-=length-100;
  var scanX=th.x+Math.cos(face*(Math.PI/180))*(length+10);
  var scanY=th.y+Math.sin(face*(Math.PI/180))*(length+10);
  var thing,scanThing,ans=[];
  for(var thing in objects){
   scanThing=getObjectByName(objects[thing]);
   if((scanThing.x-scanX)*(th.x-scanThing.x)>=0){
    if((scanThing.y-scanY)*(th.y-scanThing.y)>=0){
     if(Math.abs(scanThing.y-(scanThing.x-th.x)
      *Math.tan(face*(Math.PI/180))-th.y)<scanThing.size){
      ans.push([scanThing.name,scanThing.x,scanThing.y]);
     }else if(Math.abs(scanThing.x-(scanThing.y-th.y)
      /Math.tan(face*(Math.PI/180))-th.x)<scanThing.size){
      ans.push([scanThing.name,scanThing.x,scanThing.y]);
     }
    }
   }
  }
  //console.log(ans);
  return ans;
 }else{
  return [];
 }
},move = function(face,speed){
 if(speed>1000){
  move(face,1000);
 }else{
  if(th.mp>=speed-20&&speed>=0&&moveLogi){
   moveLogi=false;
   if(speed>20){
    th.mp-=speed-20;
   }
   th.x+=Math.cos(face*(Math.PI/180))*speed/40;
   th.y+=Math.sin(face*(Math.PI/180))*speed/40;
  }
 }
},heal = function(addHP){
 if(th.mp>addHP*th.hp/100&&addHP>=0){
  th.mp-=addHP*th.hp/100;
  th.hp+=addHP;
 }
},search = function(name){
 if(th.mp>100000){
  var ans = getObjectByName(name);
  th.mp-=100000
  if(ans === undefined){
   return ans;
  }else{
   return [ans.x,ans.y];
  }
 }
},getX = function(){
 return th.x;
},getY = function(){
 return th.y;
},getHP = function(){
 return th.hp;
},getMP = function(){
 return th.mp;
},getMpGain = function(){
 return th.mpGain;
},shot = function(face,speed){
 if(speed>th.mpGain/10){
  shot(face,th.mpGain/10);
 }else{
  if(th.mp>speed&&shotTime<10&&speed>=0){
   shotTime++;
   th.mp-=speed;
   makeObject(otherObjects,th.parent+"shot:shot",{
    Program:function(){
     var thing=whatThere(this.x,this.y,this.name);
     this.x+=Math.cos(face*(Math.PI/180))*this.hp/400+this.mp;
     this.y+=Math.sin(face*(Math.PI/180))*this.hp/400+this.mp;
     if(thing!==null&&thing.split(":")[0]!=this.parent&&thing.split(":")[0]!=this.parent+"shot"&&thing!=this.name){
      thing=getObjectByName(thing);
      //console.log(this.name+" hits "+thing.name);
      if(this.hp>thing.hp){
       this.hp-=thing.hp;
       thing.hp=0;
      }else{
       thing.hp-=this.hp;
       this.hp=0;
      }
     }
     if(outCheck(this)){
      this.hp=0;
     }
     eval(hpCheck);
    },
    name:th.parent+"shot:shot",
    hp:speed*2,
    mp:(Math.random()/50)-0.01,
    mpGain:0,
    x:th.x,
    y:th.y,
    shape:"circle",
    size:3,
    color:"gray",
    border:th.color,
    sub:{},
    parent:th.parent
   })
  }
 }
},mpGainUp = function(){
 if(th.mp>th.mpGain**2/100){
  th.mp-=th.mpGain**2/100;
  th.mpGain*=10;
 }
},makeSub = function(program,hp,mp,name,color,border){
 if(th.mp>mp+hp*10+1000000){
  var subx=th.x;
  var suby=th.y;
  var parent=th.parent;
  th.mp-=mp+hp*2+1000000;
  makeObject(th.sub,parent+":"+name,{
   Program:new Function(setFunc+hpCheck+program+PF),
   programFirst:true,
   name:parent+":"+name,
   x:subx,
   y:suby,
   hp:hp,
   mp:mp,
   mpGain:0.1,
   shape:"circle",
   size:10,
   color:color,
   border:border,
   sub:{},
   parent:parent
  })
  
 }
},
bomb = function(power,time){
 if(th.mp>power**4*(1/(time+1))/10&&power>=0&&time>=0){
  th.mp-=power**4*(1/(time+1))/10;
  makeObject(otherObjects,"bomb:bomb",{
   Program:function(){
    eval(hpCheck);
    if(this.time<=Date.now()){
     this.size=(Date.now()-this.time)/10;
     this.color="hsla(36,100%,"+(100-(this.hp/this.mp)*50)+"%,"+((this.hp/this.mp))+")";
     this.hp-=2000;
     last=null;
     for(var n=0;n<this.size*2*Math.PI;n++){
      thing=whatThere((1+this.size)*Math.cos(n)+this.x,(1+this.size)*Math.sin(n)+this.y);
      if(last!==null&&thing===null&&last.split(":")[0]!="bomb"){
       getObjectByName(last).hp-=Math.floor(this.hp/10);
      }
      last=thing;
     }
    }else{
     if(Date.now()%2000<1000){
      this.color="red";
    }else{
      this.color="black";
     }
    }
   },
   name:"bomb:bomb",
   hp:power**2,
   mp:power**2,
   mpGain:0,
   x:th.x,
   y:th.y,
   shape:"circle",
   size:10,
   color:"black",
   border:"white",
   time:Date.now()+time*1000,
   sub:{},
   parent:"bomb"
  });
 }
},first=function(){
 return th.programFirst;
},sendMP=function(name,sendmp){
 if(th.mp>Math.floor(sendmp*1.1)){
  th.mp-=Math.floor(sendmp*1.1);
  getObjectByName(name).mp+=sendmp;
 }
},warp=function(x,y){
 if(th.mp>100000000){
  th.x=x;
  th.y=y;
  th.mp-=100000000;
 }
}
`,setFunc=/*if(this.programFirst)*/"eval(funcs);";
function makeItem(){
 if(Math.random()*100<0.3&&itemLogi>3){
  if(Math.random()<0.1){
   itemKind="MG-";
  }else if(Math.random()<0.5){
   itemKind="MP+";
  }else{
   itemKind="HP+";
  }
  makeObject(otherObjects,"item:"+itemKind,{
   Program:function(){
    itemLogi=0;
    var th=this;
    addDrow.add(function(){
     c.textAlign="center";
     c.font="14px sans-serif";
     c.fillStyle=th.border;
     c.beginPath();
     c.fillText(itemKind,th.x,th.y+4);
     c.closePath();
     c.fill();
    })
    if(this.programFirst){
     this.out=true;
     if(itemKind=="MG-"){
      this.color="plum";
      this.border="purple";
     }else if(itemKind=="MP+"){
      this.color="yellowgreen";
      this.border="green";
     }else if(itemKind=="HP+"){
      this.color="lightskyblue";
      this.border="navy";
     }
     if(this.y>0){
      this.f=225+(Math.random()>0.5)*90;
     }else{
      this.f=45+(Math.random()>0.5)*90;
     }
    }
    this.x+=Math.cos(this.f*(Math.PI/180))*5;
    this.y+=Math.sin(this.f*(Math.PI/180))*5;
    if(outCheck(this)){
     if(!this.out){
      this.f+=90;
     }
    }else{
     this.out=false;
    }
    var thing=whatThere(this.x,this.y,this.name);
    if(thing.split(":")[0]=="red"||thing.split(":")[0]=="blue"){
     thing=getObjectByName(thing);
     if(itemKind=="MG-"){
      thing.mpGain/=10;
     }else if(itemKind=="MP+"){
      thing.mp+=1000000;
     }else{
      thing.hp+=100000;
     }
     die(this.name);
    }
    this.programFirst=false;
   },
   programFirst:true,
   name:"item:"+itemKind,
   hp:100000,
   mp:0,
   mpGain:0,
   x:Math.random()*1000,
   y:(Math.random()>0.5)*600-50,
   shape:"circle",
   size:15,
   color:null,
   border:null,
   sub:{},
   parent:"item"
  })
 }else{
  itemLogi++;
 }
}
function giveMP(){
 var pass;
 for(var n in objects){
  pass=getObjectByName(objects[n]);
  pass.mp+=pass.mpGain;
 }
}
function run(){
 for(var n in objects){
  shotTime=0;
  moveLogi=true;
  getObjectByName(objects[n]).Program();
 }
}
/*
function firstSet(){
 for(var n in firstRun){
  getObjectByName(firstRun[n]).programFirst=false;
 }
 firstRun=[];
}
*/
function draw(){
 var thing;
 c.clearRect(0,0,1000, 500);
 for(var n in objects){
  thing=getObjectByName(objects[n]);
  switch(thing.shape){
   case "circle":
   default:
    c.strokeStyle =thing.border;
    c.fillStyle =thing.color;
    c.beginPath();
    c.arc(thing.x, thing.y, thing.size, 0, 2 * Math.PI);
    c.closePath();
    c.fill();
    c.stroke();
  }
 }
 addDrow.drow();
}
function hpShow(){
 redHP.innerHTML="";
 blueHP.innerHTML="";
 for(var i in objects){
  if(objects[i].split(":")[0]=="red"){
   thing=getObjectByName(objects[i]);
   HPE=document.createElement('span');
   if(objects[i]=="red"){
    HPE.appendChild(document.createTextNode("red:"));
   }else{
    HPE.appendChild(document.createTextNode(objects[i].split(":")[1]+":"));
   }
   HPE.style.color=thing.color;
   HPE.appendChild(document.createTextNode(thing.hp));
   redHP.appendChild(HPE);
   redHP.appendChild(document.createElement('br'));
  }else if(objects[i].split(":")[0]=="blue"){
   thing=getObjectByName(objects[i]);
   HPE=document.createElement('span');
   if(objects[i]=="blue"){
    HPE.appendChild(document.createTextNode("blue:"));
   }else{
    HPE.appendChild(document.createTextNode(objects[i].split(":")[1]+":"));
   }
   HPE.style.color=thing.color;
   HPE.appendChild(document.createTextNode(thing.hp));
   blueHP.appendChild(HPE);
   blueHP.appendChild(document.createElement('br'));
  }
 }
}
function js(){
 run();
 giveMP();
 //firstSet();
 makeItem();
 draw();
 hpShow();
}
function start(){
clearInterval(jsid);
objects=["red","blue"];
 otherObjects={};
 firstRun=["red","blue"];
 red={
 Program:new Function(setFunc+hpCheck+document.getElementById("t1").value+PF),
 programFirst:true,
 name:"red",
 x:100,
 y:250,
 hp:10000,
 mp:1000,
 mpGain:1,
 shape:"circle",
 size:10,
 color:"red",
 border:"red",
 sub:{},
 parent:"red"
}
blue={
 Program:new Function(setFunc+hpCheck+document.getElementById("t2").value+PF),
 programFirst:true,
 name:"blue",
 x:900,
 y:250,
 hp:10000,
 mp:1000,
 mpGain:1,
 shape:"circle",
 size:10,
 color:"blue",
 border:"blue",
 sub:{},
 parent:"blue"
}
 objectPass={"red":red,"blue":blue};
 jsid=setInterval(js,40);
}

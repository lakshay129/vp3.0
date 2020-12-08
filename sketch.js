var dog,happydog,database;
var happydogi,dogi;
var foodS,foodStack;
var addFoods,feedDog;
var fedTime,lastFed;
var foodObj;
var changeGamestate,readState;
var bedi,livingroomi,washroomi,dogsadi;


function preload()
{
  dogi=loadImage("Dog.png");
  happydogi=loadImage("happydog.png");
  bedi=loadImage("Bed Room.png");
  livingroomi=loadImage("Living Room.png");
  washroomi=loadImage("Wash Room.png");
  dogsadi=loadImage("Lazy.png")
}

function setup() {
  createCanvas(900, 700);
  
  dog=createSprite(250,400,4,5);
  dog.scale=0.5;
  dog.addImage(dogi)

 foodObj=new Food();
//referring to firebase database 
  database=firebase.database();

 //referring foodStack to food node in database
  foodStack=database.ref('food')

 //On func. is used to read value of foodStack from readData  
  foodStack.on("value",readData);

  feed =createButton("feed the dog");
  feed.position(450,55)
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(550,55);
  addFood.mousePressed(addFoods);
  
  readState=database.ref('gameState');
  readState.on("value",function(data){
  gameState=data.val();
})

fedTime=database.ref('FeedTime');
fedTime.on("value",function(data){
  lastFed=data.val();

})

}


function draw() {  
  

//foodObj.display();

//reading lastFed time from database
 
//texted lastFeed time
  fill(225,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+lastFed%12 + "PM",400,55);
  }else if(lastFed==0){
    text("Last Feed :12 AM",300,75);
  } else {
    text("Last Feed : "+ lastFed +"AM",650,95)

  }

  currentTime=hour();
  console.log(hour());
  console.log(lastFed);
  if(currentTime==(lastFed+1)){
    update("Playing");
    foodObj.garden();
  }else if(currentTime==(lastFed+2)){
    update("Sleeping");
    foodObj.bedroom();
  }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
    foodObj.washroom();
  }else {
    update("Hungry")
    foodObj.display();
  }
  
  if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  } else{
    feed.show();
    addFood.show();
    dog.addImage(dogsadi);
  }


  drawSprites();
}

//readData is a func. help in catching value from database
function readData(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);

}


function addFoods(){
foodS++;
database.ref('/').update({

  food:foodS
  
})
}

function feedDog(){
  dog.addImage(happydogi);
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  console.log(foodObj.getFoodStock);
  database.ref('/').update({
    food:foodObj.getFoodStock(),
    FeedTime:hour()
    
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  })
}




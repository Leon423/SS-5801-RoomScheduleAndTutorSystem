//construct AWS objects
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

//lambda handler
//callsback an array of rooms which contain an array of available timeblocks
exports.handler = async (event, context, callback) => {
    var eventDate = event.date;
    var Rooms = await getRooms().then(function(result) {
      //callback(null,result);
      return(result);
    }, function(err) {
      callback(err);
    });
    //console.log(Rooms);
    var TimeBlocks = await getTimeBlocks().then(function(result) {
      return(result);
    }, function(err) {
      callback(err);
    });
    //console.log(TimeBlocks);
    //callback(null,TimeBlocks);
    var Reservations = await getReservations(eventDate).then(function(result) {
      return(result);
    }, function(err) {
      callback(err);
    });
    //console.log(Reservations);
    //callback(null,Reservations);
    var roomsTimeBlocks = addRoomTimeBlocks(Rooms,TimeBlocks);
    //console.log(roomsTimeBlocks);
    var returnedRooms = removeReserved(roomsTimeBlocks, Reservations);
    //console.log(returnedRooms);
    callback(null,returnedRooms);
};

//scan database for rooms
function getRooms() {
  var options = {TableName : process.env.RoomsTable};
  return new Promise(function(resolve,reject) {
    dynamo.scan(options, function(err,data){
      if (err) {
        reject(err);
      } else {
        console.log("Scan results" + data);
        resolve(data.Items);
      }
    });
  });
}

//scans database for timeblocks
function getTimeBlocks() {
  return new Promise(function(resolve,reject) {
    var options = {TableName : process.env.TimeBlocksTable};
    dynamo.scan(options, function(err,data){
      if (err) {
        reject(err);
      } else {
        console.log("Scan results" + data);
        var returnItems = data.Items.sort(function(a, b){return a.timeBlockId - b.timeBlockId});
        resolve(returnItems);
      }
    });
  });
}

//scan database for reservations
function getReservations(selectedDate) {
  //var selectedDateAsDate = new Date(selectedDate);
  var DOW = (new Date(selectedDate)).getDay();
  console.log('Day of week:' + DOW);
  return new Promise(function(resolve,reject) {
    var options = {
      TableName : process.env.ReservationsTable,
      ProjectionExpression: "roomReservedID, timeBlockReservedID",
      FilterExpression: "(#dateReserved = :dateReservedValue) OR (#reoccuring = :reoccuring)",
      ExpressionAttributeNames: {
        "#dateReserved" : "dateReserved",
        "#reoccuring" : "reoccuring"
      },
      ExpressionAttributeValues: {
        ":dateReservedValue" : selectedDate,
        ":reoccuring" : DOW
      }
    };
    //console.log(options);
    dynamo.scan(options, function(err,data){
      if (err) {
        reject(err);
      } else {
        console.log("Scan results" + data);
        resolve(data.Items);
      }
    });
  });
}

//remove reserved timeblocks from room timeblock arrays
function removeReserved(rooms,reservations) {
  rooms.forEach(function(room){
    reservations.forEach(function(reservation) {
      if (room.roomID === reservation.roomReservedID) {
        for(let i = room.timeBlocks.length-1; i >= 0; i--) {
          if(room.timeBlocks[i].timeBlockId == reservation.timeBlockReservedID) {
            room.timeBlocks.splice(i,1);
          }
        }
      }
    });
  });
  return rooms;
}

//adds an array of timeblocks to a room
function addRoomTimeBlocks(rooms,timeBlocks) {
  rooms.forEach(function(room) {
    room["timeBlocks"] = timeBlocks.slice();
  });
  return rooms;
}
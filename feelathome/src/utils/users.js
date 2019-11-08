const users = []

const addUser = ({ id, username, room,response}) => {

    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }

    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    if (existingUser) {
        return {
            error: 'Username is in use!'
        }
    }

    const user = { id, username, room,response }
  {  users.push({...user,response:'no'})
     console.log(users);
     console.log(users.length);
       return { user }
  }

}

const userslength=(users)=>{
  return users.length;
}

console.log(userslength(users));
const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}

module.exports = {
    userslength,
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}

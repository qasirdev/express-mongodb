import passport from "passport";
import { Strategy } from "passport-local";
import { mockUsers } from "../utils/constants";

//https://stackoverflow.com/questions/27637609/understanding-passport-serialize-deserialize
passport.serializeUser((user,done) => {
  console.log('inside serializeUser')
  console.log('user:',user);
  done(null,user.id)
});

passport.deserializeUser((id,done) => {
  console.log('inside deserializeUser')
  console.log('id:',id);
 try{
  const findUser = mockUsers.find((user) => user.id === id);
  if(!findUser) throw new Error('Not found user');
  done(null, findUser);
 } catch(error) {
  done(error,null);
 }
});

export default passport.use(
  // new Strategy({usernameField: 'email'},(username,password,done) => {
  new Strategy((username,password,done) => {
    console.log('username', username);
    console.log('password', password);
    try {
      const findUser = mockUsers.find((user) => user.username === username);
      if(!findUser) throw new Error("Not found user")
      
      if(findUser.password  !== password)
        throw new Error("Invalid password")

      done(null, findUser)
    } catch (error) {
      done(error,undefined);
    }
  })
)

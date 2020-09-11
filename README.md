## Guidance
Coders Never Quit Youtube channel. Feel free to look the channel. But code may differ from the channel. 

## Installing dependecies...
npm install for both server and client(cd - /client).
Or delete client folder and then install using the command "npx create-react-app client" and add proxy in package.json.

## Changes to consider
engines in package.json in server,
histry.push in AuthContextProvider (in login and logged)

## To hide credentials
Add .env file outside of server.
{
 "MONGODB_URI",
 "jwtSecretKey",
 "EMAIL",
 "PASS"
}

## Hashing password
here we used bcryptjs package. If you need bcrypt, just changed it.  

## For new creation like boilerplate (helps in push)
first remove git in client folder (using rm -rf .git).
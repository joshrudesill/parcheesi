# ParchEZ

This project was built as part of the Prime Digital Academy Full Stack Engineering program. It is meant to play the board game parcheesi online with friends. You must simply log in or create an account, and then click create game. Once you have created a game you will be given a code that you can send to your friends. All they need to do is paste it into the join game area and join the lobby. After that you can play. After the game if you go to the stats area you can see how many games you have won and lost plus your winrate. There you can also delete your account.

## Getting Started

Clone this repository and ```npm install``` 

After all the dependencies are installed you will need an instance of PostgreSQL running and you will need to connect to it in ```server/server.js```

1. Create a database named `parcheesi`,
2. The queries in the `tables.sql` file are set up to create all the necessary tables and populate the needed data to allow the application to run correctly. The project is built on [Postgres](https://www.postgresql.org/download/), so you will need to make sure to have that installed. We recommend using Postico to run those queries as that was used to create the queries, 
3. Open up your editor of choice and run an `npm install`
4. Run `npm run server` in your terminal
5. Run `npm run client` in your terminal
6. The `npm run client` command will open up a new browser tab for you!





## Built With

* [React](https://react.dev/) - The front end framework used
* [Express](https://expressjs.com/) - For the server
* [Socket.io](https://socket.io/) - For socket management
* [Tailwind](https://tailwindcss.com/) - For general styling
* [Acerternity](https://ui.aceternity.com/) - For selected styled components
  


## Acknowledgments

* Thank you to everyone at Prime for supporting me through this project


![MIT LICENSE](https://img.shields.io/github/license/scottbromander/the_marketplace.svg?style=flat-square)
![REPO SIZE](https://img.shields.io/github/repo-size/scottbromander/the_marketplace.svg?style=flat-square)
![TOP_LANGUAGE](https://img.shields.io/github/languages/top/scottbromander/the_marketplace.svg?style=flat-square)
![FORKS](https://img.shields.io/github/forks/scottbromander/the_marketplace.svg?style=social)



## Support
If you have suggestions or issues, please email me at [youremail@whatever.com](www.google.com)

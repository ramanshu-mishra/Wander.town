# WanderTown

project WanderTown was started as as creating an alternative of pre existing open source project Gather.town

wandertown is a 2D tiled metaverse platform that redefines the way of online meetups. Contrary to traditional video conferencing application like google-meet,zoom, facetime etc. Wandertown lets people interact with each other in a virtual world, allowing them users interacts with either in group of their choice or attend the meet in solitude, interact with various virtual object that can be either multimedia files, minutes of the conference, or even sponsor promotions. 

there is going to be support for private chat rooms, elements like whiteboard, plugin support for google calendar, github , spotify, and much more

---

## To contribute

**clone the repo**

```bash
git clone https://github.com/ramanshu-mishra/wander.town
```

inside root directory install the dependencies

```bash
npm install
```



generate prisma client

```bash
cd packages/databse
npx prisma generate

```

run the project

```bash
cd ..
npx turbo build
npx turbo dev
```

**NOTE** project need to be rebuild when chages made to authserver or gameServer

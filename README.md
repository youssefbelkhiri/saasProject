# Exam Generator SaaS Project

1. Run Nest Server:  
  `cd server`  
  `yarn`   *Install dependencies*  
  `yarn run start`  

2. Run React:  
  `cd client`  
  `yarn`  *Install dependencies*  
  `yarn dev`

3. Run together:  
   `cd server`  
  ` yarn start:together`
4. Test reports
   Post `http://127.0.0.1:3000/api/reports/statistics`
   body:`{
    "exam_id":1,
    "group_id":1
    }`


#####

Pull Containter to Docker :
  `docker-compose up`

Run prisma studop :
  `npx prisma studio`

  `npx prisma migrate dev --name init`


cd server ; yarn start --watch
cd server ; yarn run start
cd client ; yarn dev
cd server ; npx prisma studio
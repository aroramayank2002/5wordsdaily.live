Build on React With Postgres

Focus on smoothening dev and production process.

In dev: index.html and bundle.js is taken from root of the project, and different client id is used for google login, different db
In prod: index.html and bundle.js is taken from static folder of the project, and different client id is used for google login

npm run build
eb deploy Helloworld02-env

e:\212_swedishLearnFiveWords\workspace\HelloWorld02>set PORT=3000 
e:\212_swedishLearnFiveWords\workspace\HelloWorld02>npm run start 
This will start express with set port.

Word count for a user today: 
    SELECT COUNT(m.WORD) FROM public.meaning m, public.user u where u.id=m.user_id and u.email='aroramayank2002@gmail.com' and m.date='2018-08-06'
    SELECT COUNT(m.WORD) FROM public.meaning m, public.user u where u.id=m.user_id and u.email='sonia.miglani33@gmail.com' and m.date='2018-08-06'

Server side validation of google apis
    https://developers.google.com/identity/sign-in/web/backend-auth
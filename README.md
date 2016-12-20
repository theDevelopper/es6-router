# es6-router

```javascript
import Router from 'es6-router';

let router = new Router();
router
    .add('/home', (params) => { // add new route
        console.log('home route', params);
    })
    .add('/movies/:id', (params) => { // add new route with paramters
        console.log('movies route', params); // params = {id: ?}
    })
   
    .check() // set current route
    .listen() // listen to route changes
    .navigate('/home'); // navigate to route 'home'

```

// imports 
importScripts( 'js/sw-utils.js' );


const STATIC_CACHE = 'static-v5';
const DINAMIC_CACHE = 'dinamic-v2';
const INMUTABLE_CACHE = 'inmutable-v1';

const APP_SHELL = [
    //'/',
                    'index.html',
                    'css/style.css',
                    'img/favicon.ico',
                    'img/avatars/hulk.jpg',
                    'img/avatars/ironman.jpg',
                    'img/avatars/spiderman.jpg',
                    'img/avatars/thor.jpg',
                    'img/avatars/wolverine.jpg',
                    'js/app.js',
                    'js/sw-utils.js'
                ];
const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'


];

self.addEventListener( 'install' , e => {
    
   const promsesCache = caches.open( STATIC_CACHE ).then( cache =>cache.addAll(APP_SHELL) );
   const promsesCacheInmutable = caches.open( INMUTABLE_CACHE ).then( cache =>cache.addAll(APP_SHELL_INMUTABLE) );
    
    e.waitUntil( Promise.all( [promsesCache, promsesCacheInmutable] ) );
});


self.addEventListener( 'activate', e =>{
   const respuesta = caches.keys().then( keys =>{
       console.log(keys);

        keys.forEach( key => {
            if( key !== STATIC_CACHE && key.includes( 'static' ) ) {
               return caches.delete( key );
            }
            if( key !== DINAMIC_CACHE && key.includes( 'dinamic' ) ) {
                return caches.delete( key );
             }


        });
    });
e.waitUntil( respuesta );

});

 self.addEventListener( 'fetch' , e =>{
    const respuesta =   caches.match( e.request )
                .then( response => {
                    if( response ) {
                        return response;
                    }else{
                        fetch( e.request ).then( responseFetch=> {
                            return actualizaCacheDinamico (DINAMIC_CACHE, e.request , responseFetch );

                        } )
                    }

                //   fetch( e.request )
                //     .then( newResponse =>{
                //         caches.open( DINAMIC_CACHE )
                //         .then( cache =>{
                //             cache.add( newResponse )
                //             return newResponse.clone()
                //         } );
                //     });


                } ).catch( error =>console.log );



                e.respondWith( respuesta  )


});

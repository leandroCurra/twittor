function actualizaCacheDinamico ( dinamicCache , request , response ) {
if (response.ok) { 
  return  caches.open( dinamicCache ).then( cache => {
        cache.put( request , response.clone() );
        return response.clone();
    });
} else {
    return response ;
}
}
aja.js
======

Ajax without XML : Asynchronous Javascript and JavaScript/JSON(P)

## Basic Sample

Request JSON data

```javascript
  aja()
    .url('/api/data.json')
    .on('success', function(data){
        //data is a JavaScript object
    })
    .go();
```


Load html into an element

```javascript
  aja()
    .url('/views/page.html')
    .into('.container')
    .go();
```


More options using the fluent api, terrific REST client.

```javascript
  aja()
    .method('GET')
    .url('/api/customer')
    .data({firstname: 'John Romuald'})
    .on('200', function(response){
        //well done
    })
    .go();

  aja()
    .method('PUT')
    .url('/api/customer')
    .body({id : 12, firstname: 'John Romuald', job : 'linguist'})
    .on('200', function(response){
        //well done
    })
    .on('500', function(response){
        //oh crap
    })
    .go();
```


const express = require('./express');

(async function main(){

   

    try {

        
        const port =  process.env.PORT;
        express(port);
        
    } catch (error) {
        console.log(error.message)
    }

})()


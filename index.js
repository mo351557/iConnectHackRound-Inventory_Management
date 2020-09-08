const {argv} = require('yargs');
const inventory = require('./inventory.json')

// Declaring variables
let input, inputArr = [];
let purchase_country, optional_passport_number, gloves, masks, europian = false, german = false, total_sale_price=0;
let stockExceeds = false;

// REGEX
let ukPassportValidation = /[bB]{1}\d{3}[a-zA-Z]{2}[a-z0-9]{7}$/i
let germanPassportValidation = /[aA]{1}[a-zA-Z]{2}[a-z0-9]{9}$/i

//Getting the input
argv && argv._ && (input = argv._[0])

inputArr = input.split(":");

purchase_country = inputArr[0];

//Getting initial inventory 
let initialUkMask = inventory.uk.masks.available_units;
let initialUkGloves = inventory.uk.gloves.available_units;

let initialGermanyMask = inventory.germany.masks.available_units;
let initialGermanyGloves = inventory.germany.gloves.available_units;

// Assigning values with passport
if(inputArr.length > 5){
    console.log("optional passport")
    optional_passport_number = inputArr[1];
    if(inputArr[2].toLowerCase() == "gloves"){
        gloves = inputArr[3];
        masks = inputArr[5];
    }
    if(inputArr[2].toLowerCase() == "mask"){
        masks = inputArr[3];
        gloves = inputArr[5];
    }
}
// Assigning values without passport
else { 
    if(inputArr[1].toLowerCase() == "gloves"){
        gloves = inputArr[2];
        masks = inputArr[4];
    }
    if(inputArr[1].toLowerCase() == "mask"){
        manas = inputArr[2];
        gloves = inputArr[4];
    }
}

// Validating Passport
if(optional_passport_number && (!ukPassportValidation.test(optional_passport_number) && !germanPassportValidation.test(optional_passport_number))){
     console.log("Given passport is invalid")
}
else if(optional_passport_number && ukPassportValidation.test(optional_passport_number)){
    europian = true;
}
else if(optional_passport_number && germanPassportValidation.test(optional_passport_number)){
    german = true;
}
else{
    // No Passport
}

// Checking out of stock
if(masks > (inventory.uk.masks.available_units + inventory.germany.masks.available_units) || 
        gloves > (inventory.uk.gloves.available_units + inventory.germany.gloves.available_units)) {
            stockExceeds = true;
        return console.log(`OUT OF STOCK:${inventory.uk.masks.available_units}:${inventory.germany.masks.available_units}:${inventory.uk.gloves.available_units}:${inventory.germany.gloves.available_units}`)
}


if(purchase_country.toLowerCase() == "uk"){
     // masks
     if(masks > inventory.uk.masks.available_units){
        masks = masks - inventory.uk.masks.available_units
        inventory.uk.masks.available_units = 0;
        inventory.germany.masks.available_units = inventory.germany.masks.available_units - masks
    }
    else{
        inventory.uk.masks.available_units = inventory.uk.masks.available_units - masks
    }

    // gloves
    if(gloves > inventory.uk.gloves.available_units){
        gloves = gloves - inventory.uk.gloves.available_units
        inventory.uk.gloves.available_units = 0;
        inventory.germany.gloves.available_units = inventory.germany.gloves.available_units - gloves
    }
    else{
        inventory.uk.gloves.available_units = inventory.uk.gloves.available_units - gloves
    }
}

if(purchase_country.toLowerCase() == "germany"){
    //Europian
    if(europian){
        // masks
        if(masks > inventory.uk.masks.available_units){
            masks = masks - inventory.uk.masks.available_units
            inventory.uk.masks.available_units = 0;
            inventory.germany.masks.available_units = inventory.germany.masks.available_units - masks
        }
        else{
            inventory.uk.masks.available_units = inventory.uk.masks.available_units - masks
        }

        // gloves
        if(gloves > inventory.uk.gloves.available_units){
            gloves = gloves - inventory.uk.gloves.available_units
            inventory.uk.gloves.available_units = 0;
            inventory.germany.gloves.available_units = inventory.germany.gloves.available_units - gloves
        }
        else{
            let remaining = gloves % 10;
            inventory.germany.gloves.available_units = inventory.germany.gloves.available_units - remaining;
            inventory.uk.gloves.available_units = inventory.uk.gloves.available_units - (gloves - remaining)
        }
    }
    // German 
    else{
        // masks
        if(masks > inventory.germany.masks.available_units){
            masks = masks - inventory.germany.masks.available_units
            inventory.germany.masks.available_units = 0;
            inventory.uk.masks.available_units = inventory.uk.masks.available_units - masks
        }
        else{
            inventory.germany.masks.available_units = inventory.germany.masks.available_units - masks
        }

        // gloves
        if(gloves > inventory.uk.gloves.available_units){
            gloves = gloves - inventory.uk.gloves.available_units
            inventory.uk.gloves.available_units = 0;
            inventory.germany.gloves.available_units = inventory.germany.gloves.available_units - gloves
        }
        else{
            let remaining = gloves % 10;
            inventory.germany.gloves.available_units = inventory.germany.gloves.available_units - remaining;
            inventory.uk.gloves.available_units = inventory.uk.gloves.available_units - (gloves - remaining)
        }
    }

}


// Calculating total_sale_price
if(purchase_country.toLowerCase() == "uk"){
    total_sale_price = ((initialUkMask - inventory.uk.masks.available_units) * inventory.uk.masks.cost) +  ((initialUkGloves - inventory.uk.gloves.available_units) * inventory.uk.gloves.cost) + 
    ((initialGermanyMask - inventory.germany.masks.available_units) * inventory.germany.masks.cost) +  ((initialGermanyGloves - inventory.germany.gloves.available_units) * inventory.germany.gloves.cost)

    if(german && ((masks > inventory.uk.masks.available_units) || (gloves > inventory.uk.gloves.available_units))){
        total_sale_price = total_sale_price + (Math.floor((initialGermanyMask - inventory.germany.masks.available_units) / 10) * 3.2 * 100) + (Math.floor((initialGermanyGloves - inventory.germany.gloves.available_units) / 10) * 3.2 * 100)
    }
    else if(german){
        total_sale_price = total_sale_price + (Math.floor((initialGermanyMask - inventory.germany.masks.available_units) / 10) * 4 * 100 ) + (Math.floor((initialGermanyGloves - inventory.germany.gloves.available_units) / 10) * 4 * 100) 
    }
    else{
        total_sale_price = total_sale_price + (Math.floor((initialGermanyMask - inventory.germany.masks.available_units) / 10) * 4 * 100 ) + (Math.floor((initialGermanyGloves - inventory.germany.gloves.available_units) / 10) * 4 * 100) 
    }
}

else{
    total_sale_price = ((initialUkMask - inventory.uk.masks.available_units) * inventory.uk.masks.cost) +  ((initialUkGloves - inventory.uk.gloves.available_units) * inventory.uk.gloves.cost) + 
    ((initialGermanyMask - inventory.germany.masks.available_units) * inventory.germany.masks.cost) +  ((initialGermanyGloves - inventory.germany.gloves.available_units) * inventory.germany.gloves.cost)

    if(europian && ((masks > inventory.germany.masks.available_units) || (gloves > inventory.germany.gloves.available_units))){
        total_sale_price = total_sale_price + (Math.floor((initialUkMask - inventory.uk.masks.available_units) / 10) * 3.2 * 100) + (Math.floor((initialUkGloves - inventory.uk.gloves.available_units) / 10) * 3.2 * 100)
    }
    else if(europian){
        total_sale_price = total_sale_price + (Math.floor((initialUkMask - inventory.uk.masks.available_units) / 10) * 3.2 * 100) + (Math.floor((initialUkGloves - inventory.uk.gloves.available_units) / 10) * 3.2 * 100)
    }
    else{
        total_sale_price = total_sale_price + (Math.floor((initialUkMask - inventory.uk.masks.available_units) / 10) * 4 * 100 ) + (Math.floor((initialUkGloves - inventory.uk.gloves.available_units) / 10) * 4 * 100) 
    }
}

// Output
console.log(`${total_sale_price}:${inventory.uk.masks.available_units}:${inventory.germany.masks.available_units}:${inventory.uk.gloves.available_units}:${inventory.germany.gloves.available_units}`)

    
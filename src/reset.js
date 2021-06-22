// const Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
// const RESET = new Gpio(4, 'out'); //use GPIO pin 4, and specify that it is output
// RESET_gpio(); //run the blinkRESET function every 250ms

export function RESET_gpio() { //function to start blinking
    // RESET.writeSync(1); //set pin state to 1 (turn RESET on)
    setTimeout(endBlink, 100); //stop blinking after 5 seconds
}

function endBlink() { //function to stop blinking
    // RESET.writeSync(0); // Turn RESET off
    // RESET.unexport(); // Unexport GPIO to free resources
}


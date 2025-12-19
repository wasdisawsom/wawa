async function main() {
    try {
        const rls = require("readline-sync")
        while (true) {

            let test = String(rls.question('Enter 1 for encoding, 2 for decoding, and anything else to end the program\nInput: '))

            if (test == '1') {
                output = await encode(String(rls.question('Enter string to be encoded\nInput: ')))
            } else if (test == '2') {
                output = await decode(String(rls.question('Enter wawa to be decoded\nInput: ')))
            } else {
                console.log("Thank you for using wawa encoder, and a fair wawa to you!")
                return
            }
            console.log(String(output) + "\n")

        }
    } catch {}
}


async function encode(ui) {
        let baseTen = await alphatoten(ui) // converting the input to base 10 
        let numdivisor = BigInt(Math.floor(Math.random() * 27) + 1) // generating a random number between 1 and 27 as a divisor
        let wadivisor = await tentowa(numdivisor - 1n) // making into 3bit base 3 wawa
        wadivisor = " ".repeat(3-wadivisor.length) + wadivisor // making sure it reserves 3 bits to be wawa
        let modulo = baseTen % BigInt(numdivisor) // getting the modulo to ensure the base 10 user input can be divided cleanly by divisor
        let wadulo = await tentowa(modulo) // making into 3bit base 3 wawa
        wadulo = " ".repeat(3-wadulo.length) + wadulo // making sure it reserves 3 bits to be wawa
        baseTen -= modulo // subtracting the modulo to ensure it can be divided cleanly
        baseTen /= numdivisor // dividing it to add complexity so its harder to crack
        let encodedInput = await tentowa(baseTen) // converting input to wawa
        let output = "wa" + wadulo + encodedInput + wadivisor + "wa" // adding the modulo and divisor as keys to decode the wawa

    return output
}

async function decode(wawa){

    let splitInputArray = [await watoten(wawa.slice(2,5)), await watoten(wawa.slice(5,-5)), await watoten(wawa.slice(-5,-2))] 
    // splitInputArray[0,1,2] are modulo, message, divisor respectively and are converted to base 10

    let baseTen = splitInputArray[0] + splitInputArray[1] * (splitInputArray[2]+1n)
    // wawa input decoded to base 10

    output = await tentoalpha(baseTen)
    // base 10 input converted to base 27

    return output
}

async function alphatoten(input) { // function to turn base 27 to base 10

    const regex = /^[a-z ]+$/ // regular expression to filter the 27 characters
    inputArray = String(input).toLowerCase().split("") // splitting the string into an array
    let filteredArray = []
    for (const char of inputArray) {
        if (regex.test(char)) {
            filteredArray.push(char) // running the array through a filter 
        }
    }
    
    // console.log(filteredArray)

    for (index = 0; index < filteredArray.length; index++) { // loop to convert the characters to base 27 in number in the array
        if (filteredArray[index].charCodeAt(0) == 32) {
            filteredArray[index] = 0
        } else {
            filteredArray[index] = filteredArray[index].charCodeAt(0) - 96
        }
    } 

    // console.log(filteredArray)

    let output = 0n // making the output a bigint for accuracy

    for (const value of filteredArray) { // converting the base 27 numbers into base 10 and adding them to the output
        output = output * 27n + BigInt(value)
    }

    return output
    
}

async function tentoalpha(input) { // function to turn base 10 to base 27

    const rawArray = [] // array to store the converted base 27 numbers

    while (input > 0n) {
        rawArray.push(Number(input % 27n)) 
        input /= 27n
    }

    rawArray.reverse() // using push and reverse instead of unshift for optimisation reasons

    let alphaArray = []

    for (const value of rawArray) { // converting the elements in the array back to alpha char
        if (value == 0) {
            alphaArray.push(" ")
        } else {
            alphaArray.push(String.fromCharCode(value+96))
        }
    }
    
    output = alphaArray.join("") // joining all the elements together
    
    return output
    
}

async function tentowa(input) { // function to turn base 10 to base 3

    const rawArray = [] // array to store the converted base 3 numbers

    while (input > 0n) { // converting into base 3 and storing the numerical values in the array
        rawArray.push(Number(input % 3n))
        input /= 3n
    }

    rawArray.reverse()

    let alphaArray = []

    // console.log(rawArray)

    for (const value of rawArray) { // convert the base 3 numerical values into wawa
        if (value == 0) {
            alphaArray.push(" ")
        } else if (value == 1) {
            alphaArray.push("a")
        } else {
            alphaArray.push("w")
        }
    }

    let output = alphaArray.join("") // joining the array together

    return output

}

async function watoten(input) { // function to turn base 3 to base 10

    const regex = /^[wa ]+$/ // regular expression to filter the 27 characters
    inputArray = String(input).toLowerCase().split("") // splitting the string into an array
    let filteredArray = []

    for (const char of inputArray) {
        if (regex.test(char)) {
            filteredArray.push(char) // running the array through a filter 
        }
    }

    let output = 0n

    for (const char of filteredArray) { // convert base 3 to base 10
        output = output * 3n
        if (char == "w") {
            output += 2n
        } else if (char == "a") {
            output += 1n
        }
    }

    return output
}

main()

try {
document.addEventListener('DOMContentLoaded', async function() {
    
    document.getElementById('enter').onclick = async function() {

        const input = document.getElementById("userInput").value
        const action = document.querySelector('input[name="selection"]:checked').value

        console.log(action)
        console.log(input)
        if (action == "encode") {
            console.log('wawa')
            document.getElementById("output").textContent = await encode(input)
        } else {
            console.log('wawa')
            document.getElementById("output").textContent = await decode(input)
        }
    }

    document.getElementById("encode").onclick = async function() {

        document.getElementById("instruction").textContent = "Enter words to convert to wawa"
        document.getElementById("enter").textContent = "Convert"
        document.getElementById("showResult").textContent = "Converted text"
        document.getElementById("encodel").textContent = "encode"
        document.getElementById("decodel").textContent = "decode"
        document.getElementById("copyBtn").textContent = "Copy to clipboard"
        
    }

    document.getElementById("decode").onclick = async function() {

        document.getElementById("instruction").textContent = await encode("Enter wawa to convert to words")
        document.getElementById("enter").textContent = await encode("Convert")
        document.getElementById("showResult").textContent = await encode("Converted text")
        document.getElementById("encodel").textContent = await encode("encode")
        document.getElementById("decodel").textContent = await encode("decode")
        document.getElementById("copyBtn").textContent = await encode("Copy to clipboard")
        
    }

    document.getElementById("copyBtn").onclick = async function() {

        const copiedText = document.getElementById("output").value
        await navigator.clipboard.writeText(copiedText)
        copyBtn.disabled = true

        const action = document.querySelector('input[name="selection"]:checked').value
        const originalText = document.getElementById("copyBtn").textContent

        console.log(originalText)
        if (action == "encode")  {
            copyBtn.textContent = "Copied to clipboard"
        } else {
            copyBtn.textContent = await encode("Copied to clipboard")
        }

        setTimeout(() => {
            copyBtn.textContent = originalText
            copyBtn.disabled = false
        }, 1000)


    }
        
})
} catch (error) {
    console.log(error)
}
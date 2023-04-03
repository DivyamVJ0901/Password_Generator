// handle slider naam ka ek function bnayenge jo password ki length decide krega
// Copy naam ka function banega jo password copy krne ke liye use hoga
// Random password ke liye :- random uppercase letters , random lowercase letters , random numbers , random symbools.

const inputSlider = document.querySelector("[data-lengthSlider]");
const lenghtDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copypassword]");
const upperCaseCheck = document.querySelector("#uppercase");
const lowerCaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateButton = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type = checkbox]");
const symbols = '~!@#$%^&*()_+}{?><|,.\][;/' 

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider(); // handleSlider() ka kaam sirf itna hai ki UI pe slider ki value show krana bas
setIndicator("#ccc");


// For setting length of password
function handleSlider()
{
    inputSlider.value = passwordLength;
    lenghtDisplay.innerText = passwordLength;
    // Yaha hume color fill karne ke liye ek formula nikalna padega
    const min = inputSlider.min;
    const max = inputSlider.max;
    // Inverted commas me jo likha hai usse height niklegi 
    // And formula se width niklegi
    inputSlider.style.backgroundSize = ((passwordLength - min) * 100 / (max-min)) + "% 100%"
}

function setIndicator(color)  {
    indicator.style.backgroundColor = color;     
    // Shadow
    indicator.style.boxShadow = `0px 0px 12px 1x ${color}`;
}

function getRandomInteger(min ,max){
    return Math.floor(Math.random() * (max-min)) + min;
}   

function generateRandomNumber(){
    return getRandomInteger(0 , 9);
}

// It will give a random small letter 
function generateRandomLowercase(){
    return String.fromCharCode(getRandomInteger(97 , 123)) // ASCII values of small letters of English 
} 

// It will give a random capital letter
function generateRandomUppercase(){
    return String.fromCharCode(getRandomInteger(65 , 91)) // ASCII values of capital letters of English
} 

function generateSymbols(){
    const randNum = getRandomInteger(0 , symbols.length);
    return symbols.charAt(randNum);
}

function calculateStrength()
{
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(upperCaseCheck.checked) hasUpper = true;
    if(lowerCaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8)
        setIndicator("#0f0");
    else if(hasUpper || hasLower && (hasNum || hasSym) && passwordLength >= 6)
        setIndicator("#ff0");
    else    
        setIndicator("#f00");  
}

async function copyContent()
{
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "failed";
    } 

    // Aisa hum kar rahe hai jisse "copied" wala span visible ho
    copyMsg.classList.add("active");

    // Aur 2000ms ke baad hat jaaye 
    setTimeout( () => {
        copyMsg.classList.remove("active");
    } , 2000);
}

function shufflePassword(array){
    // FISHER YATES METHOD
    for (let i = array.length - 1; i > 0; i--) {

        // finding random index
        const j = Math.floor(Math.random() * (i+1));

        // logic of swap
        const temp = array[i];
        array[i] =  array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

// Is function me checkBox count kra ki humne 
function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked)
             checkCount++;
    });

    // SPECIAL CONDITION :- 
    // agar humne password ki length 2 mark kari 
    // lekin 4 check box charo select kr diye , to by default 
    // password ki length ko automatically 4 kar dega ye 

    if(passwordLength < checkCount){
        passwordLength = checkCount; 
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change' , handleCheckBoxChange);
});

// Slider ke uper event listner :- isse uski value aage peeche hogi
inputSlider.addEventListener('input' , (e) => {
    passwordLength = e.target.value;
    handleSlider();
}) 

// Copy wale button ke uper event listner :- 
copyBtn.addEventListener('click' , () => {
    if(passwordDisplay.value)
        copyContent();
})

/*Is code se basically hum ye kar rahe hai ki agar password wale col me
kuch value hai to copyContent wala function call kardo */

generateButton.addEventListener('click' , () =>{

    // None of the checkbox are selected
    if(checkCount == 0)
        return;
    
    if(passwordLength < checkCount)
    {
        passwordLength = checkCount;
        handleSlider();
    }

    // remove old password
    password = "";

    let funcArr = [];
    
    if(upperCaseCheck.checked)
        funcArr.push(generateRandomUppercase);
    if(lowerCaseCheck.checked)
        funcArr.push(generateRandomLowercase);
    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);
    if(symbolsCheck.checked)
        funcArr.push(generateSymbols);
    
    // Compulsory addition
    for(let i = 0 ; i < funcArr.length ;i++)
    {
        password += funcArr[i]();
    }
    
    // Remaining addition
    for(let i = 0 ; i < passwordLength - funcArr.length ; i++)
    {
        let randIndex = getRandomInteger(0 , funcArr.length);
        password += funcArr[randIndex]();
    }

    // yaha tk hamara password to ban chuka hai but hame ye pta hai ki 
    // pehla hamesha uppercase hoga , dusra hamesha lowercase , teesra koi 
    // number aur chhotha koi symbol hoga 

    // To fir kaai baat ka random password ??
    // So shuffle krenge ab

    // Shuffle the password
    password = shufflePassword(Array.from(password));

    // Show the password in UI
    passwordDisplay.value = password;

    // Calculate strength 
    calculateStrength();
})


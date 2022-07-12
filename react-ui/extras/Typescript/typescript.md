
# Learn Typescript (TS)

TS Playground: https://www.typescriptlang.org/play

### Topics included

- Types and assigning them to variables (Multiple types)
- const, var and let
- Variables (with and without type)
- Iterating
- Functions
	- Arrow functions
	- Opcional parameters
- Rest and Spread Operators
- Nested Objects
- Destructuring (from array, object and function return)
- Classes (their properties, methods and constructor)
- Interfaces (Class inheritance & using interfaces as object "Schemas")
- Modules (Import/Export functionalities)

## Types
Most common types in Typescript:

- any (Any other type)
- number
- string
- boolean
- Array
- null
- undefined (Used when parameter is not passed in)
- void (When a variable is of type void it's values can either be **null** or **undefined**)
- objects (can have multiple key:value pairs)

## const, var and let
Although variables have their type it's important to define their scope and mutability.

- **const** : value can't change
- **var** : value can change
- **let** : value can change (scope more limited than var and const)

**const** example : `const a = 2`
**var** example : `var b = 5; b = 10; b = 200`
**let** example: `let b = 5; b = 10; b = 200`

One of the differences between **var** and **let** :

> var

```javascript
var color =  "yellow"
if  (color ===  "yellow"){
	var color =  "blue"
	console.log(color)
}
console.log(color)

// Output:
blue
blue
```

> let
```javascript
let color = "yellow"
if  (color === "yellow"){
	let color = "blue"
	console.log(color)
}
console.log(color)

// Output:
blue
yellow
```
**let** is closed to it's declaration scope
**var** is available from scopes inside it's declaration scope

## Variables
As, by default, valid JS is also valid TS you can define variables without a type.
In JS this means a variable can change it's type during execution.
In TS, if you don't assign a type to a variable it will be infered by the initial value you give it.

> Valid JS

```javascript
var d =  0;   // infered type: number
d = 'hello';  // new type: string
d = {};       // new type: object
```
    
> Invalid TS

```javascript
var d =  0;   // infered type: number
d = 'hello';  // cant change type
d = {};       // cant change type
```
> Valid TS
```javascript
var d : any =  0;  // initial type: any
d = 'hello';       // new type: string
d = {};            // new type: object
```

You can also say that, during it's lifetime, a variable can only have certain types.
If we wanted to say that variable **b** could only be of type **number**, **string** or **object** we could do it this way:

```javascript
var d : string | number | object = 0;
d = 'hello';
d = {};
```
Any other type we would try to assign to this variable would give us a TS error.

## Iterating
In TS, an array of numbers can be defined as `const array: Array<number> = [1, 2, 3, 4]` 
There are many ways to iterarate over this array.

> Using C-Style For Loop
```javascript
const array: Array<number> = [1, 2, 3, 4]
    
for (let i = 0; i < array.length ; i++) {
 console.log(array[i])
}
   ```
   
> Iterate through the keys of an object  (For/in loop)
```javascript
// Object (with key/property:value pairs)
const obj = {
	username: 'foo',
	password: 'bar'
}

for (let key in obj) {
	console.log(`${key}: ${obj[key]}`)
}

// Output
username: foo
password: bar
```

> Iterate through the keys of an object (Object.keys)
```javascript
// Object (with key/property:value pairs)
const obj = {
	username: 'foo',
	password: 'bar'
}
const keys = Object.keys(obj)
console.log(keys)

// Output
['username', 'password']
```

> Iterate through the values of an object (Object.values)
```javascript
// Object (with key/property:value pairs)
const obj = {
	username: 'foo',
	password: 'bar'
}
const keys = Object.values(obj)
console.log(keys)

// Output
['foo', 'bar']
```

> Iterate throught the entries of an object (Object.entries)
```javascript
const obj = {
	username: 'foo',
	password: 'bar'
}
const entries = Object.entries(obj)
console.log(entries)

// Output
[['username', 'foo'], ['password', 'bar']]
```

> Iterate through an array using forEach
```javascript
const array: Array<number> = [1, 2, 3, 4]

array.forEach(item => {
	console.log(item)
})

// Output
1
2
3
4
```

You can check all the Array extension functions at https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array

## Functions
Some Function examples in TS.

> TS Function 1

```javascript
 function sum(a: number, b: number, c: number): number{
	 return a + b + c;
 }
```

> TS Function 2

```javascript
function logMessage(message: string) {
	 console.log(message)
}
```

> TS Function 3

```javascript
// The return type is often unnecessary but a good practice 
function buildObject(a: string | number, b: number, c: boolean) : object {
	 return {
	  'first': a,
	  'second': b,
	  'third': c
	 }
}
```

### Arrow Functions
This topic is **not specific to Typescript**. Arrow functions also exist in Javascript and work the same way.

Arrow functions are just like **normal** functions, but they have a different syntax

> Arrow Function Example

```javascript
(a:  number, b:  number)  =>  { 
   return a + b 
}
```
Arrow functions are also called **lambdas** and **anonymous**, since they don't have a name.
So how do we use them?
The next piece of code is an example of 2 similar functions, one is a **normal** function and the other is an **arrow** function.
```javascript
function sum_n(a: number, b: number): number {
	 return a + b;
}

const sum_a1 = (a: number, b: number): number => {
	 return a + b
}

const sum_a2 = (a: number, b: number): number => a + b
```
The last 2 functions are both **arrow** functions. It's syntax is cleaner than **normal** functions.

Also, there is an advantage to not give a name to a function. One of them is to pass a function inside another function without needing to create a function for that purpose. The example ahead shows this is practice.

The function **my_map** will iterate through an array of **numbers** and transform every item based on the function passed in **transformItem**.

```javascript
function my_map(array: Array<number>, transformItem: (a: number) => number) {
	 const newArray: Array<number> = [];
	 for (let i = 0; i < array.length; i++) {
		  const transformedItem = transformItem(array[i])
		  newArray.push(transformedItem)
	 }
	 return newArray
}
```
> Calling with normal function

```javascript
function multiplyBy2(a: number) {
	 return a * 2
}
    
const newArray: Array<number> = my_map([1,2,3,4], multiplyBy2)
```
> Calling with Arrow Function (Non-Anonymous)
```javascript
const multiplyBy2 = (a: number) => a * 2
    
const newArray: Array<number> = my_map([1,2,3,4], multiplyBy2)
```
> Calling with Arrow Function (Anonymous)

 ```javascript
const newArray: Array<number> = my_map([1,2,3,4], (a: number) => a * 2) // a's type is unnecessary here
 ```

Using **console.log( )** to log the resulting array to the console would produce the same result for all the examples above: [2, 4, 6, 8].

Another powerful usage of arrow functions is as callbacks. 

> Arrow Function as Callback
```javascript
function sum(a: number, b: number, callback: (result: number) => any): void {
  const result = a + b
  callback(result)
}

sum(2,  3,  (result)  =>  {
  console.log("Sum result: ", result)
}
```
> Normal Function as Callback
```javascript
function sum(a: number, b: number, callback: (result: number) => any): void {
	 const result = a + b
	 callback(result)
}

sum(2,  3,  function (result)  {
	 console.log("Sum result: ", result)
}
```
This usage of **arrow functions** is very common. A better example is the function **readFile** from the 'fs' library in NodeJS. 

A call to this function would look like this:
```javascript
fs.readFile('somefile.txt', 'utf-8', (error, data) => {
	 if (error != undefined) {
		  throw `Error: ${error}`;
	 } else {
		  // Success reading from file
		  console.log(data)
	 }
})
```
Since this is an **asynchronous function,** meaning it will not block the execution flow, it is important to have a way of knowing when this function has finished executing. The code below shows this concept better.
```javascript
function printDataFromFile(filename: string): void {
	 var contents: string; 
	 // Get file data
	 fs.readFile(filename, 'utf-8', (error, data) => {
		 if (error != undefined) {
			   throw `Error: ${error}`;
		 } else {
				 contents = data; 
		 }
	 })
	 // Print file data
	 console.log(contents)
} 
```
The simplified execution flow would be something like this:

- Call printDataFromFile
- Call fs.readFile
- Call console.log(contents)
- fs.readFile is still executing in parallel
- fs.readFile ends its execution and sets content = data

The problem here is that fs.readFile will not block the execution flow. This way, console.log will be called before fs.readFile finishes and sets "content = data".
```javascript
function printDataFromFile(filename: string): void {
    // Get file data
    fs.readFile(filename, 'utf-8', (error, data) => {
	    if (error != undefined) {
		    throw `Error: ${error}';
		  } else {
			  // Print file data
		      console.log(data)
		  }
    })
} 
```
The solution here is only printing when the **readFile** function is ready to provide the data.
Nowadays there are better solutions to this type of problems (Promises and async/await) but this was a simple demonstration of why a callback function can be useful.

The idea to take from this topic is that, at the end of the day you can use whatever form you want to define a function in TS/JS, **arrow** or **normal**.

### Opcional Parameters
In TS function parameter can be optional. To set an parameter as opcional the syntax is the following:

```javascript
function sum(a: number, b: number, c?: number)
```

Defining a function as follows will cause a warning by TS.
```javascript
function sum(a:  number, b:  number, c?: number)  {
    return a + b + c
}
```
TS Compiler knows that, since **c** is an optional parameter its actual type is not 
`c: number`, it is `c: number | undefined`.

A valid solution for this would be to check if **c** is undefined before executing math operations over it.
```javascript
function sum(a:  number, b:  number, c?: number)  {
	if (c === undefined) return a + b
	else return a + b + c
}
	
/* OR */

// Using the Ternary Operator : condition ? (do this if true) : (do this if false)
// Add c if not undefined, 0 otherwise
function sum(a:  number, b:  number, c?: number)  {
	else return a + b + (c === undefined ? 0 : c)
}
```
## Rest and Spread Operators
This chapter talks brielfy about the basic usage of **Rest** and **Spread** operators.

### Rest Operator
The **Rest** operator works as a placeholder for an unknown number of values. When we don't know how many arguments will be passed into a function we can use this operator.
```javascript
function sum(a:  number, b:  number,  ...morenumbers :  number[])  {
	var totalSum = a + b
	for  (let  number  of morenumbers)  {
		totalSum +=  number
	}
	return totalSum
}

console.log(sum(1,  1,  1,  1,  1,  1))
```
In the example above **morenumbers** is an array (since its defined as a rest operator with **...** before its name). 
When we call this function we can pass at minimum 2 parameters (**a** and **b**) and after that we can pass as many parameters as we wish. 
The function will receive these **extra** parameters and wrap them inside an **array of numbers**, as we defined it when creating the function (...morenumbers: **number[]**).
The function now has access to this array and can iterate over it as show in the example.

### Spread Operator
As the name sugests, the **Spread** operator spreads the content of an array, for example into a field.

```javascript
const otherNumbers =  [1,  1,  1,  1]
console.log(otherNumbers)
console.log(...otherNumbers)

// Output
[1, 1, 1, 1]
"1, 1, 1, 1"
```

A more useful example of this operator:
```javascript
function sum(a:  number, b:  number,  ...morenumbers :  number[])  {
	var totalSum = a + b
	for  (let  number  of morenumbers)  {
		totalSum +=  number
	}
	return totalSum
}

const otherNumbers =  [1,  1,  1,  1]

console.log(sum(1,  1,  1,  1,  1,  1))
console.log(sum(1,  1,  ...otherNumbers))
```

Here we are **spreading**  the elements of an array as arguments for a function. The last 2 lines are the same from the function's point of view.

The Spread operator is also useful to play with objects.

> Clone Object

```javascript
const obj =  {
	username:  'foo',
	password:  'bar',
	token:  '345HJIC89'
}

const clonedObj =  {
	...obj,
}

console.log(clonedObj)

// Output
{
	"username": "foo",
	"password": "bar",
	"token": "345HJIC89"
}
``` 

> Update Object 
```javascript
const obj =  {
	username:  'foo',
	password:  'bar',
	token:  '345HJIC89'
}

// Keep all the properties, but update username
const updatedObj =  {
	...obj,
	username: 'newFoo'
}

console.log(updatedObj)

// Output
{
	"username": "newFoo",
	"password": "bar",
	"token": "345HJIC89"
}
``` 

## Nested Objects
Objects are and essential part of web programming. 
Some of the examples from previous topics already included objects.

> Declaring an object in Typescript/Javacript
```javascript
// You could also define it as "const obj: object = {} in Typescript"
const obj = {
	key1: "value1",
	key2: "value2",
	key3: "value3"
}
```

Objects are allowed to have any type of value. An object could have other objects as value of some of it's properties/keys.

> Object with nested objects
```javascript
const obj = {
    username: "somevalue",
    groups: [
	    0: {
		    groupname: "A group"
	    },
	    1: {
		    groupname: "Another group"
	    }
    ],
    friends: ["foo", "bar"]
}
```
The example above shows how objects can be really helpful to store structured data.

## Destructuring
In JS/TS destructuring allows you to extract parts of an object/array and put them into new variables.

```javascript
const [a, b] = c;
```
You can think of the example above as:

- Take the first element of **c** and put it in **a**
- Take the second element of **c** and put it in **b**

This concept should get clearer with the following examples
> Array Destructuring
```javascript
const array:  Array<number>  =  [5,  2,  3,  4,  6];

const [a, b, c] = array;

console.log(a)
console.log(b)
console.log(c)

// Output
5
2
3
```
> Object Destructuring
```javascript
const obj =  {
	username :  'foo',
	password:  'bar',
	token:  '34t9u8034u'
}
// Objective: Extract username and password from "obj"

// 1. Not using destructuring technique
const  username = obj.username;
const  password = obj.password;

// 2. Using destructuring technique
const { username, password } = obj;
```

> Example with a function that returns a tuple (array with 2 items) in the format: [errorMessage, result]
```javascript
// If error: returns [errorMessage, null]
// If no error: returns [null, result]
function divide(a: number, b: number) {
	if (b == 0)
		return ['Cant divide by 0', null]
	return [null, a / b]
}

const [error, res] = divide(2,0)
console.log(error)
console.log(res)

// Output
Cant divide by 0
null

const [error, res] = divide(2,2)
console.log(error)
console.log(res)

// Output
null
1
```

## Classes

> Example of a class
```javascript
class Car {
	// class property
	isLicenced: boolean = false
	// class property
	year: number = 0
	
	// class method
	licenceThisCar()  {
		this.isLicenced = true
	}
}

// Create an instance of the class Car
const car = new Car()
console.log(car.isLicenced) // false
car.licenceThisCar()
console.log(car.isLicenced) // true
```
If we wanted to set the car **year** property as soon as we instantiated the class we would need a **constructor**.
```javascript
class Car {
	year: number;
	
	constructor(carYear: number) {
		this.year = carYear
	}
}

// Create an instance of the class Car
const car = new Car(1956)
console.log(car.year) // 1956
```

The keyword **private** can be added before a method or property to deny access from outside the class. This way, only the class methods have access to this properties or methods.
```javascript
private printYear() {} 
private color: number;
```

## Interfaces
Interfaces can be used to define behaviour requirements for classes, for example.

### Interfaces with classes
> Animal Interface with 2 properties and 2 functions

```javascript
interface Animal {
	name: string,
	weight: number,
	eat(): void,
	exercise(): void
}
```
Any class that decides to **implement** this interface is required to implement the interface methods and properties.
An example using the interface above is the following.
```javascript
class  Dog  implements  Animal  {
	/* ---- CLASS PROPERTIES ---- */
	name:  string
	weight:  number

	/* ---- CLASS CONSTRUCTOR ---- */
	/* -- (initWeight is opcional, if not passed it takes the value of '0') -- */
	constructor(name:  string, initWeight:  number  =  0)  {
		this.name = name
		this.weight = initWeight
	}
	
	/* ---- CLASS METHODS ---- */
	// Obligatory method since implements Animal
	eat()  {
		this.weight +=  10
	}
	
	// Obligatory method since implements Animal
	exercise():  void  {
		this.weight -=  10
	}

	// Method which ONLY belongs to class Dog
	bark()  {
		console.log("DOG BARKING!")
	}
}

const dog1 =  new  Dog("Mark")
```
As shown above, a class needs to implement all the properties and methods from the **interface** it implements but **can expand** and have their own methods and properties.

### Interfaces as Object Schemas
A very common usage of interfaces in Typescript is to describe what properties (and their types) an object should have. The following example should be clear enough.
 
 > Object Schema for a Game Board
 ```javascript
 interface Board {
	boardAsString: string
	boardType: string
	moves: Array<number>
}

// Usage example of Board Interface
const someChessBoard: BoardDocument = {
	boardAsString: "ppppppRNKQPrrrpppd",
	boardType: "CHESS-BOARD",
	moves: [2,  3,  234,  3234]
}
```
By assigning **a** the type **Board**, Typescript will warn us if the object we are building is missing properties or if properties don't have the expected type. 

The next example shows a more useful usage of this concept.
```javascript
// Enum class
enum PieceType { King, Pawn, Bishop, Knight, Rook, Queen }
// Enum class
enum PieceColor { Black, White }

interface Piece {
	color: PieceColor,
	type: PieceType
}
``` 
### Opcional Properties and Methods
You might wants some of your interface methods and properties to me optional. In Typescript you can do it this way.
```javascript
interface Board {
	winner?: string
	boardAsString: string
	boardType: string
	moves: Array<number>
}
```   
This way we are saying that the **winner** property is opctional. If not passed, it's value will be undefined, just as if you tried to console.log() a parameter that was not passed into a function as we did in the **Functions** chapter, on the topic **Opcional Parameters**.
A usage of this interface without setting the **winner** property would be the following
```javascript
const newBoard: Board = {
	boardAsString: "",
	boardType: "tic-tac-toe",
	moves: [1, 543, 534, 5, 34]
}
```

## Modules

### Export multiple functions
This chapter describes show simple usages of modules in Typescript.
Let's say we wanted to create a multiplication function inside **mult.ts** which uses the **add** function inside **sum.ts**.
```javascript
// File: sum.ts

export function add(a: number, b: number) {
	return a + b
}
```
In the **sum.ts** file we add the keyword **export** before the functions which we want other files to be able to **import**.

```javascript
// File: mult.ts

import { add } from './sum';

function multiplication(a: number, b: number) {
	var result: number = 0
	while (b--) {
		result = add(result, a)
	}
	return result
}
```
In the **mult.ts** file the first line indicates that we would like to import a function named **add** from the file at location **./sum** (.ts is ommited).
If we were to import more functions from the same file we could do it like this: 
```javascript
import { add, sub, mod } from './myMathFunctions'
```

For this to work the functions **add**, **sub** and **mod** (in file 'myMathFunctions.ts') would need to have the keyword **export** behind it's name.

### Export function as "default"
Exporting a function as default makes it so that when we import this function we don't need the curly braces '{}'
around the function name.

> Exporting
```javascript
// File: sum.ts
export default function add(a: number, b: number) { return a + b }
 ```
> Importing
```javascript
// File: mult.ts (Doesn't really matter)
import add from './sum'
```
   
We can still export more functions from 'sum.ts'.

> Exporting
```javascript
// File: sum.ts

export default function add(a: number, b: number) {
	return a + b
}

export function sub(a: number, b: number) {
	return  a - b
}
```

> Importing
```javascript
// File: mult.ts (Doesn't really matter)
import add, { sub } from './sum'
```

**This is the end of this Typescript script**
Version: 1.0 (06/02/2022)

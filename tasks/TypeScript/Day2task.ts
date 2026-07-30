// 1 ans:
interface Book {
  id: number;
  title: string;
  author: string;
  pages?: number; //(ekhane pages er por ? eta mane holo apni pages e value dileo hobe na dileo hobe . so eta optional)
}
// end
// example
const book1: Book = {
  id: 1,
  title: "Harry Potter",
  author: "J.K. Rowling",
};//(ekhane pages optional tai value na diye o ami amr output peye jabo jodi ? uthiye dei then eta error korbe jodi value na set koren)
console.log(book1);

// 2 ans:
function calculateDiscount(price: number, discount: number): number {
  return price - discount;
}
// end
// example
console.log(calculateDiscount(100, 20));

// 3 ans:
type Status = "idle" | "loading" | "success";
// end
// example
let netStatus: Status = "idle";
//OR
netStatus = "loading";
//OR
netStatus = "success";

console.log(netStatus);//(3ta theke jekono ekta use kore console e show koren hobe.ar jehetu eta *const na *let jar karone apni pore oitar value jeta diben last e oitai show korbe)

// 4 ans:
interface User {
  id: number;
  name: string;
}

const users: User[] = [
  {
    id: 1,
    name: "John Doe"
  },
  {
    id: 2,
    name: "Jane Smith"
  },
];//(eta unlimited array joto iccha add korte parben *id *name or apni interface e jeta use koren arki)

console.log(users);

// 5 ans:
function printValue(value: string | number){
  if (typeof value == "string") {
    console.log(value.toUpperCase());
  } else {
    console.log(value);
  }
}
// end
printValue("hello");  //(ekbar string diye output)
printValue(12); //(ekbar number diye output)   


// 6 ans:
interface Vehicle {
  brand: string;
  model: string;
}

interface ElectricVehicle extends Vehicle {
  batteryCapacity: number;
}

const car: ElectricVehicle = {
  brand: "Tesla",
  model: "Model 3",
  batteryCapacity: 75,
};

// end
console.log(car);//(eta car variable er bhitor ki ache dekhabe)

// 7 ans:
type Coordinate = [number, number];//eta limited array etai ei 2tar beshi value add korte parben na,jodi korte chan tahole aro koma diye *number or *string boshan dite parben 

const netLocation: Coordinate = [23, 90];
// end
console.log(netLocation);

// 8 ans:
interface Configuration {
  readonly apiKey: string;
}

const config: Configuration = {
  apiKey: "ABC123",
};

// config.apiKey = "XYZ"; (Error dekhabe jodi pore change korte jaw karon eta read only dewa tai apiKey er value change kora jabe na)
console.log(config);

// 9 ans:
interface ApiResponse<T> {
  status: string;
  data: T;
}

const response: ApiResponse<string> = {
  status: "success",
  data: "Hello",
};

console.log(response);
//end
//example
const numberResponse: ApiResponse<number> = {
  status: "success",
  data: 100,
};//(chaile T er bhitor number o dite paro then data ta number type e change hoye jabe)

//10 ans
interface Product {
  id: number;
  name: string;
  price: number;
}

type withoutId = Omit<Product, "id">;//(Omit mani hocche muche fela.etar bhitor ami Product select kore tar bhitor id ta muche dite bolechi)

type partialPro = Partial<Product>; //(partial mani puro ekta interface e ja value ache shobai ke ami Optional kore dite parbo. mane oi value gula thakleo hobe na thakleo hobe)


const pro1: withoutId = { //(ekhane Omit hocche cuz pro1 withoutId type follow kortese)
  name: "Laptop",
  price: 50000,
};

const pro2: partialPro = {//(ekhane Partial hocche cuz pro2 partialPro type follow kortese)
  name: "Phone",
};

console.log(pro1);
console.log(pro2);
// 创建迭代器
function createIterator0(items) {
    var i = 0;
    return {
        next: function() {
            const done = (i >= items.length);
            const value = !done ? items[i++] : undefined;
            return {
                done: done,
                value: value
            };
        }
    }
}

let iterator = createIterator0([1,2,3])
console.log(iterator.next());  // {value: 1, done: false}
console.log(iterator.next());  // {value: 2, done: false}
console.log(iterator.next());  // {value: 3, done: false}
console.log(iterator.next());  // {value: undefined, done: true}


// 创建生成器
function *createIterator() {
    yield 1;
    yield 2;
    yield 3;
}

iterator = createIterator();
console.log(iterator.next());  // {value: 1, done: false}
console.log(iterator.next());  // {value: 2, done: false}
console.log(iterator.next());  // {value: 3, done: false}
console.log(iterator.next());  // {value: undefined, done: true}

// 访问默认迭代器
const values = [1, 2, 3]
iterator = values[Symbol.iterator]();
console.log(iterator.next());  // {value: 1, done: false}
console.log(iterator.next());  // {value: 2, done: false}
console.log(iterator.next());  // {value: 3, done: false}
console.log(iterator.next());  // {value: undefined, done: true}


// 创建可迭代对象
const collection = {
    items: [1, 2, 3],
    *[Symbol.iterator]() {
        for (let item of this.items) {
            yield item;
        }
    }
}

for (let x of collection) {
    console.log(x);
}
// 1
// 2
// 3



// 内建迭代器
let colors = ["red", "green", "blue"]
let tracking = new Set([111, 222, 333])
let data = new Map();
data.set("name", "Tom")
data.set("age", 18)

for (let entry of colors.entries()) {
    console.log(entry);  // [0, 'red']
    console.log(entry[0]);  // 0
    console.log(entry[1]);  // 'red'
}

// 委托生成器

function *createNumberIterator() {
    yield 1;
    yield 2;
}

function *createColorIterator() {
    yield "red";
    yield "blue";
}

function *createCombinedIterator() {
    yield *createNumberIterator();
    yield *createColorIterator();
    yield true;
}

iterator = createCombinedIterator();
console.log(iterator.next());  // {value: 1, done: false}
console.log(iterator.next());  // {value: 2, done: false}
console.log(iterator.next());  // {value: 'red', done: false}
console.log(iterator.next());  // {value: 'blue', done: false}
console.log(iterator.next());  // {value: true, done: false}

// 简单任务执行器
function run(taskDef) {
    let task  = taskDef();
    // 开始执行任务
    let result = task.next();
    // 循环调用next()函数
    function step() {
        if (!result.done) {
            result = task.next(result.value);
            step();
        }
    }
    // 开始迭代执行
    step();
}

run(function*(){
    let value  = yield 1;
    console.log(value);  // 1

    value = yield value + 3;
    console.log(value);  // 4
});


// 异步任务执行器
function run1(taskDef) {
    let task  = taskDef();
    // 开始执行任务
    let result = task.next();
    // 循环调用next()函数
    function step() {
        if (!result.done) {
            if (typeof result.value === "function") {
                result.value(function(err, data){
                    if (err) {
                        result = task.throw(err);
                        return;
                    }
                    result = task.next(data);
                    step();
                });
            } else {
                result = task.next(result.value);
                step();
            }
        }
    }
    // 开始迭代执行
    step();
}

let fs = require("fs")

function readFile(filename) {
    return function(callback) {
        fs.readFile(filename, callback);
    }
}

run1(function*(){
    let contents = yield readFile("README.md");
    console.log(contents);
});
var fs = require("fs")


// 创建未完成的Promise

function readFile(filename) {
    return new Promise(function(resolve, reject) {
        // 触发异步操作
        fs.readFile(filename, { encoding: "utf-8"}, function(err, contents){
            // 检查是否有错误
            if (err) {
                reject(err);
                return;
            }

            // 成功读取文件
            resolve(contents);
        });
    });
}

// 调用写法1:
let promise  = readFile("README.md");
promise.then(function(contents){
    // 完成
    console.log(contents);
}, function(err) {
    // 拒绝
    console.error(err.message);
});

// 调用写法2:
promise  = readFile("README1.md");
promise.then(function(contents){
    // 完成
    console.log(contents);
}).catch(function(err) {
    // 拒绝
    console.error(err.message);
});

// 创建已处理的Promise
promise = Promise.resolve(42);
promise.then(function(value) {
    console.log(value);  // 42
});

// 创建已处理的Promise
promise = Promise.reject(45);
promise.catch(function(value) {
    console.log(value);  // 45
});

let thenable = {
    then: function(resolve, reject) {
        resolve(42);
    }
};
let p1 = Promise.resolve(thenable);
p1.then(function(value) {
    console.log(value);  // 42
});

thenable = {
    then: function(resolve, reject) {
        reject(45);
    }
};
p1 = Promise.resolve(thenable);
p1.catch(function(value) {
    console.log(value);  // 45
});

// 执行器错误
promise = new Promise(function(resolve, reject){
    throw new Error("XXX Exception");
});
promise.catch(function(error) {
    console.log(error.message);  // XXX Exception
});


// 全局的Promise拒绝处理
let rejected;
process.on("unhandledRejection", function(reason, promise) {
    console.log(reason.message);  // "XXX Exception"
    console.log(rejected === promise);  // true
});
rejected = Promise.reject(new Error("XXX Exception"));
// 若没有unhandledRejection，则抛Uncaught Error Error: XXX Exception


// 全局的Promise同意处理（测试有点问题，见P249）
// process.on("rejectionHandled", function(promise) {
//     console.log(rejected === promise);  // true
// });
// rejected = Promise.reject(new Error("YYY Exception"));
// setTimeout(function() {
//     rejected.catch(function(error) {
//         console.log(error.message);
//     });
// }, 1000);

// 串联Promise




// 异步任务执行器
function run1(taskDef) {
    let task  = taskDef();
    // 开始执行任务
    let result = task.next();
    // 循环调用next()函数
    function step() {
        if (!result.done) {
            let promise = Promise.resolve(result.value);
            promise.then(function(value) {
                result = task.next(value);
                step()
            }).catch(function(error) {
                result = task.throw(error);
                step();
            });
        }
    }
    // 开始迭代执行
    step();
}

let fs = require("fs")

function readFile(filename) {
    return new Promise(function(resolve, reject){
        fs.readFile(filename, function(err, contents){
            if (err) {
                reject(err);
            } else {
                resolve(contents);
            }
        });
    });
}

run1(function*(){
    let contents = yield readFile("README.md");
    console.log(contents);
});

(async function() {
    let contents = await readFile("README.md");
    console.log(contents);
})();
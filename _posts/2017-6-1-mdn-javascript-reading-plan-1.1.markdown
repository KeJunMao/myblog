---
layout: post
title: MDN JavaScript阅读计划(1)
date: 2017-6-1 0:0:0 +0800
categories: reading
tags: javascript mdn reading
img: https://ooo.0o0.ooo/2017/06/02/59312aafca8db.jpg
---
JavaScript document reading plan 1.

> JavaScript 是一门为你的网站添加交互功能的编程语言。

## 什么是JavaScript？

JavaScript(缩写：JS)是一门成熟的动态编程语言，当应用于HTML文档时，可以在网站上提供动态交互性。

## 一个"hello, world"示例

index.html:
```html
<script src="scripts/main.js"></script>
```

将 </script/> 元素放在 HTML 文件底部的原因是，浏览器解析 HTML 似乎按照代码出现的顺序来的。如果 JavaScript被首先读取，它也应该影响下面的 HTML，但有时会出现问题，因为 JavaScript 会在 HTML 之前被加载，如果 JavaScript 代码出现问题则 HTML 不会被加载。所以将 JavaScript 代码放在底部是最好的选择。

scripts/main.js:
```javascript
var maHeading = document.querySelector('h1');

maHeading.innerHTML = 'hello, world';
```

## 语言基础浏览

### 变量(variables)

```javascript
var myVariables;
```

行末的分号表示语句结束；几乎可以以任何名称来命名一个变量；JavaScript 是对大小写敏感的

定义的变量可以赋值：
```javascript
myVariables = 'Bob';
```
可以通过变量名称检索变量：
```javascript
myVariables;
```
### 注释

多行注释：
```javascript
/*
注释
*/
```
单行注释：
```javascript
// 注释
```
### 运算符

[表达式和运算符完整列表](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators)

### 语句

if...else等

### 函数

除了浏览器内置函数，允许自定义函数：

```javascript
//创建
function multiply(num1,num2){
    var result = num1 * num2;
    return result;
}
//使用
multiply(4,7);
```

return 语句告诉浏览器返回 result 变量以便使用。这是很有必要的，因为函数内定义的变量只能在函数内使用。这叫做作用域 scoping

### 事件

事件是能够捕捉浏览器操作并且允许你运行代码进行响应的代码结构.

```javascript
document.querySelector('html').onclick = function(){
    alert('Ouch! Stop poking me!');
}
```

## 改善示例网页

### 图片转换器

```javascript
var myImage = document.querySelector('img');

myImage.onclick = function(){
    var mySrc = myImage.getAttribute('src');
    if(mySrc === 'images/firefox-icon.png'){
        myImage.setAttribute('src','https://ooo.0o0.ooo/2017/06/02/59312aafca8db.jpg');
    }else{
        myImage.setAttribute('src','images/firefox-icon.png');
    }
}
```

### 个性化欢迎信息

```javascript
var myButton = document.querySelector('button');
var myHeading = document.querySelector('h1');

function setUserName(){
    var myName = prompt('Please enter your name.');
    localStorage.setItem('name',myName);
    myHeading.innerHTML = 'Mozilla is cool, ' + myName;
}

if (!localStorage.getItem('name')){
    setUserName();
} else {
    var storedName = localStorage.getItem('name');
    myHeading.innerHTML = "Mozilla is cool, " + storedName;
}

myButton.onclick = function(){
    setUserName();
}
```
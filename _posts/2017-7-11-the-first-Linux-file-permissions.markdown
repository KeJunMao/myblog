---
layout: post
title: 初识 Linux 文件权限
date: 2017-07-11 19:49:27 +0800
categories: reading
tags: linux 权限 
img: https://ooo.0o0.ooo/2017/07/11/5964b22cefd17.jpg
---
> Linux一般将文件可存取的身份分为三个类别，分别是 owner/group/others，且三种身份各有 read/write/execute 等权限——鸟哥

如文章头图所示，**r = 4，w = 2 , x = 1**。

我们一般在网上所找到的授予`755`权限就是相当于`-rwxr-xr-x`,`777`权限就是`-rwxrwxrwx`。

---

与文件权限相关的命令主要有三个：

1. `chgrp` ：改变文件所属群组
2. `chown` ：改变文件拥有者
3. `chmod` ：改变文件的权限, SUID, SGID, SBIT等等的特性

## `chgrp`

改变一个文件的群组很简单，直接以`chgrp`来改变即可，这个指令就是`change group`的缩写嘛！很好记吧！ QwQ。


```bash
[kejun@localhost ~]$ chgrp [-R] dirname/filename ...
选项与参数：
-R : 进行递回（recursive）的持续变更，亦即连同次目录下的所有文件、目录
     都更新成为这个群组之意。常常用在变更某一目录内所有的文件之情况。

其他参数使用man chgrp查询
```

```bash
范例：
将test.sh的所属群组更改为testgrp
[kejun@localhost ~]$ chgrp testgrp test.sh
[kejun@localhost ~]$ ls -l
-rw-rw-r--. 1 kejun testgrp 0 Jul 12 03:43 test.sh
```

## `chown`

如何改变一个文件的拥有者呢？很简单呀！既然改变群组是change group，那么改变拥有者就是change owner啰！

`chown` 也可以直接修改所属群组~

```bash
[kejun@localhost ~]$ chown [-R] 帐号名称 文件或目录
[kejun@localhost ~]$ chown [-R] 帐号名称:群组名称 文件或目录
选项与参数：
-R : 进行递回（recursive）的持续变更，亦即连同次目录下的所有文件都变更
```

```bash
范例：
将test.sh的文件拥有者更改为testusr、文件所属群组更改为testgrp
[kejun@localhost ~]$ chown testusr:testgrp test.sh
```

## `chmod`

文件权限的改变使用的是chmod这个指令，权限的设置方法有两种,分别是数字或符号。

### 使用数字

如开头所说，各权限对应分数如下:

**r:4 w:2 x:1**

```bash
[kejun@localhost ~]$ chmod [-R] xyz 文件或目录
选项与参数：
xyz : 就是刚刚提到的数字类型的权限属性，为 rwx 属性数值的相加。
-R : 进行递回（recursive）的持续变更，亦即连同次目录下的所有文件都会变更
```

```bash
范例：
将test.sh文件的所有权限都启用
[kejun@localhost ~]$ chmod 777 test.sh
```

如果要将权限变成`-rwxr-xr--`，那么对应分数就是 [4+2+1][4+0+1][4+0+0]=754；使用`chmod 754 filename`即可完成。

### 使用符号

| chmod | u<br> g<br> o<br> a<br> | +（加入）<br> -（除去）<br> =（设置）<br> | r w x | 文件或目录 |

* u = user;
* g = group;
* o = others;
* a = all

```bash
范例1：
将 test.sh 文件的权限设置为-rwxr-xr-x
[kejun@localhost ~]$ chmod u=rwx,go=rx test.sh

范例2：
为 test.sh  的ugo加上可执行权限
[kejun@localhost ~]$ chmod a+x test.sh
```

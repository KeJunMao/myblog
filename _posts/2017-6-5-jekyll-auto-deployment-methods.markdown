---
layout: post
title: "在 VPS 上利用 GIT HOOKS 自动部署 Jekyll"
date: 2017-6-5 0:0:0 +0800
categories: Living
tags: jekyll git hooks vps ubuntu
img: https://ooo.0o0.ooo/2017/06/05/5934f228dbaf9.jpg
---

jekyll 官方提供了[教程](https://jekyllrb.com/docs/deployment-methods/)，写的还是蛮清楚的，但我觉得还是有必要记录一下。

希望看到此文的同学能够一起讨论更高效的自动化部署。

感谢[Mysaku](http://miku01qaq.xyz/)提供的机器测试。

下面命令中：
* `root@server$` 前缀表示服务器的root用户；
* `git@server$` 前缀表示服务器的git用户；
* `localhost$` 前缀表示本地用户；
* 无前缀表示文本。

## 配置用户

新建一个`git`用户

```bash
root@server$ adduser git
```

## 用户授权

授与无需密码操作的权限

```shell
root@server$ sudo vim /etc/sudoers
```

添加 `git    ALL=(ALL:ALL) ALL`

然后使用 `:wq!` 强制保存并退出。

授予操作 nginx 放网页的地方的权限

```shell
root@server$ cd /var/www
root@server$ mkdir jekyll
root@server$ chown git:git -R /var/www/jekyll
```

## 配置Hooks

```shell
root@server$ su git
git@server$ cd ~
git@server$ mkdir jekyll.git
git@server$ cd jekyll.git/
git@server$ git --bare init
git@server$ vim hooks/post-receive
```

复制下面的内容粘贴并保存：

```bash
#!/bin/bash
GIT_REPO=$HOME/jekyll.git
TMP_GIT_CLONE=$HOME/tmp/myrepo
PUBLIC_WWW=/var/www/jekyll

git clone $GIT_REPO $TMP_GIT_CLONE
cd $TMP_GIT_CLONE
bundle
jekyll build -s $TMP_GIT_CLONE -d $PUBLIC_WWW
rm -Rf $TMP_GIT_CLONE
exit
```
最后授予执行权限

```shell
git@server$ chmod +x hooks/post-receive
```

## 安装Jekyll

推荐使用git用户安装jekyll。

如何安装 jekyll ？详见[此文章](https://blog.kejun.space/technology/2017/05/27/how-to-install-jekyll.html)。

## 添加SSh

接下来上传本地机器的SSH公钥到服务器。

首先打开你**本地机器**的`git bash` 输入：

```shell
localhost$ ssh-keygen -t rsa
localhost$ vim ~/.ssh/id_rsa.pub
"*yy
```
`"*yy` 为vim的复制命令。

继续**返回到服务器**（git用户）。

```shell
git@server$ cd ~
git@server$ mkdir .ssh && cd .ssh
git@server$ touch authorized_keys
git@server$ vim authorized_keys
```
粘贴刚刚复制的公钥。

现在，在**本地机器** 使用 `ssh git@yourvpsip` 已经可以成功登陆啦~

如果你vps的端口不是22，那么在**本地机器**：

```shell
localhost$ vim ~/.ssh/config
```
输入,并调整为你vps的信息：

```bash
Host #VPS IP
HostName #VPS IP
User git
Port #SSH Port
IdentityFile ~/.ssh/id_rsa
```

## 关联本地仓库

在你**本地机器的博客仓库**中添加一个远程仓库：

```shell
localhost$ git remote add www git@yourvpsip:~/jekyll.git
```

现在，每次发布新文章只要`push`即可~

```shell
localhost$ git push www master
```

## nginx & apache

记得配置http哟~
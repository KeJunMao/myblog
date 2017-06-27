---
layout: post
title: "Windows 无痛运行 Jekyll 3?"
date: 2017-6-3 0:0:0 +0800
categories: Living
tags: jekyll install windows 一键安装 .bat
img: https://ooo.0o0.ooo/2017/06/03/5932ace80eee4.jpg
---

在windows上运行ruby也是相当麻烦的，安装各种出错...但是win10 、jekyll3之后官方起码有了在bash下安装的教程。

仅在win7+win10下测试。

不过本文是写给不想用 bash 的同学。

如果你使用的是 Ubuntu ，请查看此<a href='https://blog.kejun.space/technology/2017/05/27/how-to-install-jekyll.html' >文章</a>

## 安装 RubyInstallers

1. 访问 https://rubyinstaller.org/downloads/ 页面。
2. 选择最新版本下载并运行，攥写此文章时最新版本为 `Ruby 2.4.1-1`。
3. 勾选I accept the License 单选框，然后一路下一步，直到点击完成按钮出现时，取消勾选`run ‘ridk install’ to install MSYS2...` 复选框并点击完成。
    * 请务必勾选`Add Ruby executables to your PATH`复选框。

## 安装Jekyll

打开cmd窗口，键入如下：

```bash
gem install bundler jekyll
```

至此，已经完成。

## 运行Jekyll

新建博客：

```bash
jekyll new blog
```

使用`cd blog`进入`blog`文件夹并安装依赖：

```bash
bundle install
```

运行：

```bash
jekyll s -w
```

如果出现

```bash
Please add the following to your Gemfile to avoid polling for changes:
gem 'wdm', '>= 0.1.0' if Gem.win_platform?
```
请不要担心，目录仍然会被正常监视（我也不知道为啥，反而尝试安装`wdm`倒是会报错）。

现在使用`chrome53+`访问 `127.0.0.1:4000/`。

![tu.jpg](https://ooo.0o0.ooo/2017/06/03/5932a82785044.jpg)

> 嗯，几乎和linux下体验差不多。妈妈再也不用担心我的系统是windows啦（雾

## 一键安装

RubyInstallers可以使用命令行安装，既然如此我为何不写个bat呢？

* ruby 2.4
* jekyll 3.4.3

[项目地址](https://github.com/KeJunMao/fastjekyll)

[下载](https://github.com/KeJunMao/fastjekyll/releases/tag/1.0)

## 有用的链接

* [Run Jekyll on Windows](http://jekyll-windows.juthilo.com/)（jekyll2）
* [Jekyll on Windows](https://jekyllrb.com/docs/windows/#installation)（bash）
* [如何安装Jekyll？](https://blog.kejun.space/technology/2017/05/27/how-to-install-jekyll.html)（ubuntu）
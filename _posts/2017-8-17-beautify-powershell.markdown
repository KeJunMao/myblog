---
layout: post
title: Powershell 美化笔记
date: 2017-08-17 16:01:16 +0800
categories: technology
tags: powershell 
img: https://i.loli.net/2017/08/17/599546da7202b.jpg
---
嗯，PowerShell 的蠢蓝色背景和宋体真的是丑到让我怀疑人生。


## 缘起

某天某人尝试折腾宝塔面板，但没注意看宝塔面板只适合**纯净系统**。

于是尝试卸载不行就重装的无敌大法，突然想起了 halyul 的站用了 docker 。向 dalao 看齐。

再本地调试的时候，实在忍受不了 PowerShell 难看的默认样式，就开始折腾了。

## 前面的坑

首先通过强大的浏览器找的了 [How to Change PowerShell Console Font and Background Colors](https://www.petri.com/change-powershell-console-font-and-background-colors) 这篇文章。

确实写的蛮不错，复制粘贴用了之后好爽。

配图的截图就来自于这个的运行结果：

```bash
Function Test-ConsoleColor {
[cmdletbinding()]
Param()
 
Clear-Host
$heading = "White"
Write-Host "Pipeline Output" -ForegroundColor $heading
Get-Service | Select -first 5
 
Write-Host "`nError" -ForegroundColor $heading
Write-Error "I made a mistake"
 
Write-Host "`nWarning" -ForegroundColor $heading
Write-Warning "Let this be a warning to you."
 
Write-Host "`nVerbose" -ForegroundColor $heading
$VerbosePreference = "Continue"
Write-Verbose "I have a lot to say."
$VerbosePreference = "SilentlyContinue"
 
Write-Host "`nDebug" -ForegroundColor $heading
$DebugPreference = "Continue"
Write-Debug "`nSomething is bugging me. Figure it out."
$DebugPreference = "SilentlyContinue"
 
Write-Host "`nProgress" -ForegroundColor $heading
1..10 | foreach -Begin {$i=0} -process {
 $i++
 $p = ($i/10)*100
 Write-Progress -Activity "Progress Test" -Status "Working" -CurrentOperation $_ -PercentComplete $p
 Start-Sleep -Milliseconds 250
}
} #Test-ConsoleColor
```

在终端输入 `Test-ConsoleColor` 就可以测试各种类型输出的颜色。

最终，我没有选择这个。

## 配色

[lukesampson/concfg](https://github.com/lukesampson/concfg) 可以用来导入和导出Windows控制台的设置。总之 concfg 十分方便。

安装很简单，首先安装 scoop

```bash
iex (new-object net.webclient).downloadstring('https://get.scoop.sh')
```
如果你没有打开运行远程签名的脚本文件则会提示你输入下面的指令：

```bash
Set-ExecutionPolicy RemoteSigned -scope CurrentUser
```
允许之后，再允许一次安装命令即可。

使用 `scoop help` 检查是否已安装成功。

接下来只要使用 `scoop install concfg` 就完成了concfg的安装。

## 字体

首选 Inziu Iosevka 系列字体，可以在 [ Inziu Iosevka ](https://be5invis.github.io/Iosevka/inziu.html) 下载，然后安装到`C:\Windows\Fonts` （安装后会有三个小字体，Inziu Iosevka SC/TC/J 和 Inziu IosevkaCC SC/TC/J 可以用于控制台）。

另外还需要修改注册表：

```bash
HKEY_LOCAL_MACHINE >> SOFTWARE >> Microsoft >> Windows NT >> CurrentVersion >> Console >> TrueTypeFont
```

新增一个字符串项目，内容为“Inziu Iosevka SC”。

## 应用

新建一个 `Ttheme.cfg` 文件，并键入如下内容：

```bash
{
    "cursor_size":  "small",
    "command_history_length":  50,
    "num_history_buffers":  4,
    "command_history_no_duplication":  false,
    "quick_edit":  true,
    "insert_mode":  true,
    "load_console_IME":  true,
    "font_face":  "Inziu Iosevka SC",
    "font_true_type":  true,
    "font_size":  "0x18",
    "font_weight":  0,
    "screen_buffer_size":  "80x3000",
    "window_size":  "80x20",
    "fullscreen":  false,
    "popup_colors":  "cyan,white",
    "screen_colors":  "white,black",
    "black":  "#1E1E1E",
    "dark_blue":  "#2472C8",
    "dark_green":  "#0DBC79",
    "dark_cyan":  "#11A8CD",
    "dark_red":  "#CD3131",
    "dark_magenta":  "#BC3FBC",
    "dark_yellow":  "#E5E510",
    "gray":  "#E5E5E5",
    "dark_gray":  "#666666",
    "blue":  "#3B8EEA",
    "green":  "#23D18B",
    "cyan":  "#29B8DB",
    "red":  "#F14C4C",
    "magenta":  "#D670D6",
    "yellow":  "#F5F543",
    "white":  "#E5E5E5"
}
```

当然可以根据自己的需求随意改动。

在此处打开 PowerShell ，使用 `concfg import Ttheme.cfg -n` 命令后新开一个 PowerShell 窗口，就完成拉~

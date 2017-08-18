---
layout: post
title: Docker+Jekyll+NGINX 全自动部署
date: 2017-08-18 16:01:16 +0800
categories: technology
tags: jekyll docker nginx auto pull autopull
img: https://i.loli.net/2017/08/18/5996ce487b3a1.jpg
---
继上一篇文章，完成了[个人首页](kejun.me)的全自动部署。

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

## 开始

需要安装以下工具：

* 编辑器,以vim为例
* docker
* docker-compose

新建并进入要工作的目录：

```bash
mkdir workspace
cd workspace
```

> 不建议使用 windows 系统

## NGINX

创建 NGINX 的 `Dockerfile` ：

```bash
mkdir nginx
cd nginx
vim Dockerfile
```
输入：

```bash
FROM nginx
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
```

可以看的我们 `COPY` 了一份 `default.conf` ,因此还要再新建一个 `default.conf`:

```bash
vim default.conf
```

输入：

```nginx

server {
    listen       80;
    server_name  localhost;
    root /app;
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
    location ~* /(images|css|assets) {
        index index.html;
    }
}
```

创建`conf.d`文件夹：

```bash
mkdir conf.d
```

以后所有的服务器配置全部放置在 `conf.d` 文件夹里。

返回 `workspace` 并创建 `docker-compose.yml` :

```bash
# 这个时候的工作目录是在 workspace ！
vim Dockerfile 
```

输入以下内容：

```yaml
version: '2.1'

services:
  nginx:
    build:
      context: .
      dockerfile:  ./nginx/Dockerfile
    volumes:
      - ./site/data:/app
      - ./nginx/conf.d:/etc/nginx/conf.d
    ports:
      - 80:80
      - 443:443
```

在 volumes 中可以看的，`./site/data` 对应 `/app` ,也就是说，未来我们的jekyll构建的文件都将在 `./site/data` 中。

这个时候，我们的 `nginx` 已经可以跑起来了，你可以在 `./site/data` 创建一个`index.html` ,并使用：

```bash
docker-compose build
docker-compose up
```

然后访问你的ip，就可以看到了。

## jekyll

想当初，要使用 githooks 自动部署，必须在服务器安装 Ruby 。

如今，Docker 大法好。

在 `workspace` 下创建 `jekyll` 目录并建立 Dockerfile ：

```bash
mkdir jekyll
cd jekyll
vim Dockerfile
```

输入：

```bash
FROM jekyll/jekyll
CMD jekyll build -w
```

返回 `workspace` ，编辑 `docker-compose.yml` ：

```bash
vim docker-compose.yml
```

修改为：

```yaml
version: '2.1'
services:
  # nginx 在这
  nginx:
    build:
      context: .
      dockerfile:  ./nginx/Dockerfile
    volumes:
      - ./site/data:/app
      - ./nginx/conf.d:/etc/nginx/conf.d
      - /etc/letsencrypt:/etc/letsencrypt
    ports:
      - 80:80
      - 443:443
  # jekyll 在这
  jekyll:
    build:
      context: .
      dockerfile:  ./jekyll/Dockerfile
    volumes:
      - ./site/source:/srv/jekyll
      - ./site/data:/srv/jekyll/_site
```

在 volumes 中可以看的，`./site/source` 对应 `/srv/jekyll` ,也就是说，我们的jekyll 站点的源码就在 `./site/source` 中；`./site/data/homepage` 对应 `/srv/jekyll/_site` ,也就是说，我们 jekyll 构建后的内容就在 `./site/data` 中。

`./site/data` 目录正好对应 nginx。

> 比较建议将 `./site/data:/srv/jekyll/_site` 改为 `./site/data/jekyllsite:/srv/jekyll/_site` ，并在 `./nginx/conf.d` 里新建 nginx 配置，这样你可以更方便的管理一个以上的站点。

这个时候，我们的 `jekyll` 已经可以跑起来了，你可以在 `./site/source` 中拉取我们的 jekyll 项目：

```bash
# ./site/source 目录里，命令最后有个"."
git clone https://git.coding.net/KeJun/homepage.git .
```

然后执行：

```bash
# `workspace` 目录里
docker-compose build
docker-compose up
```

此时，访问 ip ，成功的将jekyll部署啦~

## autopull

由于我的远程仓库在 coding 里，无法操作 githooks 。

但是，无论是 github 还是 coding 都提供了 [WebHook](https://open.coding.net/webhooks/) 。

我使用 nodejs 造了一个接受 coding webhook 一小段代码。

返回 `workspace` ，创建 `autopull` 目录并新建 `config.js` ：

```javascript
module.exports = {
    folder : "site",
    port : 9091,
    token : "xxx"
  };
```

新建 `index.js` ：

```javascript
var http = require('http');
var exec = require('child_process').exec;
var config = require('./config.js');
var main = function (data,res) {
    //校验是不是第一次绑定
    if (data.zen){
        console.log(data.zen);
        res.end();
        return 0;
    }
    //校验 event 类型
    if (data.event === "push") {
        //校验 token 类型
        if (data.token == config.token) {
            //执行 pull
            exec("cd "+config.folder+" && git pull", function (err, stdout) {
                var cmd_message = stdout.replace(/^[0-9a-f]+?\ /, '');
                console.log(cmd_message);
                //console.log(err);
                res.end();
            });
        }
    }
}
var server = http.createServer(function (req, res) {
    var POST = "";
    req.on('data', function (chunk) {
        POST += chunk;
    });
    req.on('end', function () {
        POST = JSON.parse(POST);
        res.writeHead(200, {
            "Content-Type": "text/plain"
        });
        main(POST,res);
    });
});
server.listen(config.port);
console.log("Server runing at port: " + config.port + ".");
```

这段代码参考了[使用 Node.js 实现简单的 Webhook](https://blog.coding.net/blog/nodejs-webhook)，目前自用还没有看到bug，有 dalao 的话帮忙优化以下。

新建 `Dockerfile` ：

```bash
FROM node:6-alpine
ENV NODE_ENV production
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh
WORKDIR /usr/src/app
COPY ./* /usr/src/app/
EXPOSE 9091
CMD node index.js
```

这里我们在容器里安装了 `git`

返回 `workspace` 并修改 `docker-compose.yml` :

```bash
# 这个时候的工作目录是在 workspace ！
vim docker-compose.yml 
```

修改为：

```yaml
version: '2.1'
services:
  # nginx 在这
  nginx:
    build:
      context: .
      dockerfile:  ./nginx/Dockerfile
    volumes:
      - ./site/data:/app
      - ./nginx/conf.d:/etc/nginx/conf.d
      - /etc/letsencrypt:/etc/letsencrypt
    ports:
      - 80:80
      - 443:443
  # jekyll 在这
  jekyll:
    build:
      context: .
      dockerfile:  ./jekyll/Dockerfile
    volumes:
      - ./site/source:/srv/jekyll
      - ./site/data:/srv/jekyll/_site
  # autopull 在这
  autopull:
    build:
      context: .
      dockerfile: ./autopull/Dockerfile
    ports:
      - 9091:9091
    volumes:
      - ./site/source:/usr/src/app/site
```

`./site/source:/usr/src/app/site` 注意这里一定要加上 `site` 。

现在我们就可以启动咯！

```bash
# `workspace` 目录里
docker-compose build
docker-compose up
```

现在，在 coding 仓库项目设置中添加一个WebHook，并将 url 指向，你 `服务器ip:9091`,如果设置令牌的话，一定要和 `config.js` 中的 `token` 一致。

绑定成功后， coding 会自动发送：

```json
{
    "token": "123", 
    "zen": "Coding！ 让开发更简单"
}
```

如果没有意外，你可以在 console 里看到 `autopull_1  | Coding！ 让开发更简单` 。

这个时候，尝试修改远程仓库文件并提交，你会在 console 里看到类似下面的信息：

```bash
autopull_1  | Updating c79effb..0fba65c
autopull_1  | Fast-forward
autopull_1  |  offline.html | 3 +--
autopull_1  |  1 file changed, 1 insertion(+), 2 deletions(-)
autopull_1  | 
jekyll_1    |       Regenerating: 1 file(s) changed at 2017-08-18 07:43:04 ...done in 0.081600133 seconds.
```

至此，我们就完成了，一切就绪后，我们使用：

```bash
docker-compose up -d
```

在后台运行 docker ，享受高枕无忧。
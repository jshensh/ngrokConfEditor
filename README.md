Ngrok 客户端面板
==============

###安装 Node
您需要先在客户端上安装 Node.js（这里以 Raspberry Pi 2 ARM v7 为例）

    wget https://nodejs.org/dist/v4.4.2/node-v4.4.2-linux-armv7l.tar.xz
    xz -d node-v4.4.2-linux-armv7l.tar.xz
    tar xvf node-v4.4.2-linux-armv7l.tar
    mv node-v4.4.2-linux-armv7l.tar /usr/local
    ln -s /usr/local/node-v4.4.2-linux-armv7l/bin/node /usr/local/bin/node
    ln -s /usr/local/node-v4.4.2-linux-armv7l/bin/npm /usr/local/bin/npm
    echo "registry = https://registry.npm.taobao.org" > ~/.npmrc

###下载并启动面板

    git clone https://github.com/jshensh/ngrokConfEditor
    mv ngrokConfEditor /
    chmod 754 /ngrokConfEditor
    cd /ngrokConfEditor
    npm install --save
    npm install forever -g
    /usr/local/node-v4.4.2-linux-armv7l/bin/forever start /ngrokConfEditor/app.js

###设置自启动
    [将 Ngrok Conf Editor 加入自启动项](http://233.imjs.work/2535.html)

###注意事项
1. Ngrok 的服务端与客户端配置见 [树莓派教程：利用 Ngrok 穿透内网访问树莓派](http://233.imjs.work/2513.html)
2. 一定需要将面板加入自启动列表
3. 配置文件请放在 /root/ngrok.cfg，并 chmod 777
4. 客户端请放在 /root/ngrok，并 chmod +x
5. 面板启动时会自动启动 /root/ngrok，不要另外添加客户端的自启动
6. 面板向公网开放时，请一定要设置 auth

###截图
![screenshot1](http://233.imjs.work/wp-content/uploads/2016/04/QQ图片20160403164945.png)
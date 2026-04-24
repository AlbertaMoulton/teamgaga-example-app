---
title: "Building your first TeamGaga Bot"
date: "2026-03-22"
---

一步一步教你构建你的第一个`TeamGaga`应用。

`TeamGaga` 应用允许您使用一系列 API 和交互式功能来自定义和扩展 `TeamGaga`。本指南将引导您使用 `JavaScript` 构建您的第一个 `TeamGaga` 应用。

我们将开发一款 `TeamGaga` 应用，让用户可以玩石头剪刀布（有 7 个选项，而不是 3 个）。本指南面向初学者，但假设您已具备 `JavaScript` 的基础知识。

### 步骤 0：项目设置

在开始之前，您需要设置本地环境并从示例 [应用程序存储库](https://github.com/AlbertaMoulton/teamgaga-example-app) 中获取项目代码。
如果你还没有安装 `bun`，请先[安装](https://bun.com)它。
安装完`bun`后，打开命令行并克隆项目代码：

```{bash}
git clone https://github.com/AlbertaMoulton/teamgaga-example-app.git
```

然后导航到该目录并安装项目的依赖项：

```{bash}
cd teamgaga-example-app
bun install
```

### 步骤 1：创建并添加应用程序

##### 创建

1. 首先，如果您还没有应用，则需要在开发者门户中[创建一个应用](https://open.teamgaga.com/applications?new_application=true)；
2. 输入应用名称，然后按“创建”；
3. 创建应用后，您将进入应用设置的“常规信息”页面，您可以在此更新应用的基本信息，例如应用描述和图标。您还会看到应用 `ID`，我们稍后会在本指南中使用到它们。

##### 添加应用到社区

1. 进入“应用测试”页面上，将你的社区添加到测试社区列表里。
2. 在 `TeamGaga App` 上，点击你的社区名称，选择`App市场`，然后将你刚刚创建的这个应用，点击`添加按钮`，添加到你的社区中。

##### 获取您的凭据

我们需要设置并获取您应用的一些敏感值，例如其令牌和 ID。

回到项目文件夹，将 `.env.sample` 文件重命名为 `.env` 。我们将在这里存储应用程序的所有凭据。

我们需要从您的应用程序设置中获取三个文件值`.env`：

- 在“应用信息”页面上，复制“应用ID”的值。在 `.env` 文件中，替换`<YOUR_APP_ID>`为您复制的 `ID`。
- 在“机器人设置”页面上，复制`Token`的值，在 `.env` 文件中，替换`<YOUR_BOT_TOKEN>`为您复制的 `Token`。

现在您已经拥有了所需的凭据。

### 步骤 2：运行您的应用

1
首先，进入你的项目文件夹，然后运行以下命令来启动你的应用程序：

```{bash}
cd teamgaga-example-app
bun run start
```

### 步骤 3：与机器人进行消息交互

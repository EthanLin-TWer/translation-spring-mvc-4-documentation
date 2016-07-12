# Spring MVC 4.2.4.RELEASE 中文文档

![Spring Logo](./spring-logo.png)

本项目翻译的是Spring MVC官方4.2.4.RELEASE版本的文档，包含原文档第21章Spring MVC部分的全部内容。译文尽力于准确传达原意的，同时使译文更符合中文习惯，自然、简练。至于风格和质感，则是追求，仍在努力。截至目前，本文档是在Spring MVC单独的这一块上相对较完整的译本了。 ——2016年6月28 交房租日

目前大部分章节的翻译已完成，剩小部分章节仍在进行及优化。在文档达至我所满意的状态之前都会继续维护它，主要还有译文细化、术语定义、翻译规范、内容、样式等工作可做。翻译过程中遇到值得探讨的问题、取舍及最终解决方案，读者可见[翻译注记](NOTES.md)。

## 中文文档地址

* 七牛主站：[mvc.linesh.tw](http://mvc.linesh.tw)（更快更稳定）
* 国内镜像：[一个奇怪的域名](http://7xvpsh.com1.z0.glb.clouddn.com)（主站不稳定时使用）
* [国外Gitbook原站](https://linesh.gitbooks.io/spring-mvc-documentation-linesh-translation/content/)

## 原文地址
[Spring MVC 4.2.4.RELEASE Documentation](http://docs.spring.io/spring-framework/docs/4.2.4.RELEASE/spring-framework-reference/html/mvc.html)

## 友情链接

本翻译初始只是自我学习需要，逐渐完善后才有坚持完成的执念。“我不确知多少读者需要读此文档，不知多少人果真读之而受益。这不是我能估测、所能评断之事。”昨晚在看陈丹青的《木心谈木心》，讲到他犹豫于出版木心先生这本私房话的心境。正好最近在做翻译、推广，面对我的读者，读之，感觉真挚感动。不敢自比木心，我在我的风中等消息。

这个译本我在国内的多个站点均发表过一篇相同的推广，如OSC/CSDN/Iteye/博客园/掘金/v2ex/segmentfault/Githuber等。除了交付的文档本身外，聊~~瞎扯~~了一些其他的东西。同时，关于这个翻译文档的创始、管理及自动化部署等方面，我也已将其总结成为文章。此二篇文章是对这个项目的完整记录，均发布在我的博客上，有兴趣的读者可以前往阅读。最末，连同本项目托管在Travis上的自动化构建网址一并附上。

* [Spring MVC官方文档翻译稿发布](http://blog.linesh.tw/#/posts/2016-06-23-spring-mvc-documentation-reference)
* [我是如何进行Spring MVC文档翻译项目的环境搭建、项目管理及自动化构建工作的](http://blog.linesh.tw/#/posts/2016-06-26-auto-deploy-translation-to-production-using-jenkins-and-qiniu)
* [Travis: 本项目的CI](https://travis-ci.org/linesh-simplicity/translation-spring-mvc-4-documentation)

## 其他相关翻译项目

以“Spring MVC 中文 文档 翻译”作为关键词，浏览其在google和baidu上前6页的搜索结果就可以对目前文档翻译现状有个大致的了解。其中值得留意的有以下项目，其中除了第一个项目，其他翻译未涉及Spring MVC的部分：

| 项目 | 作者 | 项目Github | 描述 |
| :---: | :---: | :---: | --- |
| [Spring框架参考文档](http://spring.cndocs.tk) | [一个团队](http://blog.csdn.net/isea533/article/details/50450289) | [Github](http://git.oschina.net/free/spring-framework-reference) | 该项目规模较大、参与人数较多，进度似也因此较慢。翻译内容是Spring 4.1.3.RELEASE版本全部文档，其中MVC部分的文档翻译了大概50%~60%。另其项目主页保留了与原生Spring文档较一致的样式，很不错 |
| [Spring Framework 4.x参考文档](https://waylau.gitbooks.io/spring-framework-4-reference/content/) | [waylau](https://github.com/waylau) | [Github](https://github.com/waylau/spring-framework-4-reference) | 翻译了Spring文档的简介、新特性和容器IOC部分内容 |
| [Spring Framework 4.x中文翻译](https://sunrh.gitbooks.io/spring4-reference-chinese/content/) | [sunrh](https://github.com/sunrh) | [Github](https://github.com/sunrh/spring-reference-chinese) | 翻译了Spring文档的简介、新特性和容器IOC部分。最近更新已在一年前 |
| [Spring 中文文档3.1](https://wizardforcel.gitbooks.io/spring-doc-3x/content/) | [wizardforcel](https://github.com/wizardforcel) | - | 主页已标记废弃的项目。楼主BIO是专注单身二十年，言语间竟有一种大学宿友~~不是说我的宿友~~的即视感 |
| [Spring Framework 2.5翻译计划](http://javasalatu.iteye.com/blog/1212618) | 满江红机构 | - | 文档版本为较早前的2.5，机构首页和维基已打不开，其2.5版本的翻译稿也未能在网上搜到，似已成传说 |

## 联系方式

阅读过程有任何想法、建议、吐槽、强迫症~~不给译者狂点100个赞就浑身不舒服~~、觉得赞、觉得不赞，无论关于翻译、技术、样式等，请让我知道。你可以通过以下的方式联系作者我：

* [来Github赞我 ~~被消费一个~~](https://github.com/linesh-simplicity/translation-spring-mvc-4-documentation)
* 在Gitbook讨论里[给我留言](https://www.gitbook.com/book/linesh/spring-mvc-documentation-linesh-translation/discussions)
* 在Github里给这个项目提[issue](https://github.com/linesh-simplicity/gitbook-translation-spring-mvc-documentation/issues)
* 在Github里给这个项目提[pull request](https://github.com/linesh-simplicity/translation-spring-mvc-4-documentation/pulls)
* [在文档上进行即时评论](https://linesh.gitbooks.io/spring-mvc-documentation-linesh-translation/content/)：在gitbook文档上，鼠标划过任何段落右侧，浮现`+`号时点击即可评论
* **邮箱**：linesh.simpcity@gmail.com

## License

MIT License

## 贡献者 Contributor

感谢那些让这个项目变得更好的人们。

* ![](https://avatars0.githubusercontent.com/u/4997466?v=3&s=20)[ 吕立青](https://github.com/JimmyLv)
* ![](https://avatars0.githubusercontent.com/u/2171071?v=3&s=20)[ Sun](https://github.com/yaming116)
* ![](https://avatars0.githubusercontent.com/u/7877752?v=3&s=20)[ SongWang](https://github.com/aCoder2013)
* ![](https://avatars3.githubusercontent.com/u/1506425?v=3&s=20)[ 易枭寒](https://github.com/Yixiaohan)
* ![](https://avatars1.githubusercontent.com/u/5453359?v=3&s=20)[ xcatliu](https://github.com/xcatliu)

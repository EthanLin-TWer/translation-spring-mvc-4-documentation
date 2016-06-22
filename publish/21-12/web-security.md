# 21.12 Web安全

[Spring Security](http://projects.spring.io/spring-security/)项目为保护web应用免受恶意攻击提供了一些特性。你可以去看看参考文档的这几小节：["CSRF保护"](http://docs.spring.io/spring-security/site/docs/current/reference/htmlsingle/#csrf)、["安全响应头"](http://docs.spring.io/spring-security/site/docs/current/reference/htmlsingle/#headers)以及["Spring
MVC集成"](http://docs.spring.io/spring-security/site/docs/current/reference/htmlsingle/#mvc)。不过并非应用的所有特性都需要引入Spring Security。比如，需要CSRF保护的话，你仅需要简单地在配置中添加一个过滤器`CsrfFilter`和处理器`CsrfRequestDataValueProcessor`。你可以参考[Spring MVC Showcase](https://github.com/spring-projects/spring-mvc-showcase/commit/361adc124c05a8187b84f25e8a57550bb7d9f8e4)一节，观看一个完整的展示。

另一个选择是使用其他专注于Web安全的框架。[HDIV](http://hdiv.org/)就是这样的一个框架，并且它能与Spring MVC良好集成。

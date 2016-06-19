# 21.8.3 Cookie解析器CookieLocaleResolver

`CookieLocaleResolver`解析会检查客户端是否有`Cookie`，里面可能存放了地区`Locale`或时区`TimeZone`信息。如果检查到相应的值，解析器就使用它们。通过该解析器的属性，你可以指定cookie的名称和其最大的存活时间。请见下面的例子，它展示了如何定义一个`CookieLocaleResolver`：

```xml
<bean id="localeResolver" class="org.springframework.web.servlet.i18n.CookieLocaleResolver">

    <property name="cookieName" value="clientlanguage"/>

    <!-- 单位为秒。若设置为-1，则cookie不会被持久化（客户端关闭浏览器后即被删除） -->
    <property name="cookieMaxAge" value="100000">

</bean>
```

**表21.4. CookieLocaleResolver支持的属性**

| 属性 | 默认值 | 描述 |
| --- | --- | --- |
| cookieName | classname + LOCALE | cookie名 |
| cookieMaxAge | Integer.MAX_INT | cookie被保存在客户端的最长时间。如果该值为-1，那么cookie将不会被持久化，在客户端浏览器关闭之后就失效了 |
| cookiePath | / | 限制了cookie仅对站点下的某些特定路径可见。如果指定了cookiePath，那么cookie将仅对该路径及其子路径下的所有站点可见 |

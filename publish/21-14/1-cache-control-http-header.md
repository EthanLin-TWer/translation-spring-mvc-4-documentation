# 21.14.1 HTTP请求头Cache-Control

Spring MVC提供了许多方式来配置"Cache-Control"请求头，支持在许多场景下使用它。关于该请求头完整详尽的所有用法，你可以参考[RFC 7234的第5.2.2小节](https://tools.ietf.org/html/rfc7234#section-5.2.2)，这里我们只讲解最常用的几种用法。

Spring MVC的许多API中都使用了这样的惯例配置：`setCachePeriod(int seconds)`，若返回值为：
* `-1`，则框架不会生成一个`'Cache-Control'`缓存控制指令响应头
* `0`，则指示禁止使用缓存，服务器端返回缓存控制指令`'Cache-Control: no-store'`
* 任何`n > 0`的值，则响应会被缓存`n`秒，并返回缓存控制指令`'Cache-Control: max-age=n'`

[`CacheControl`](http://docs.spring.io/spring-framework/docs/4.2.4.RELEASE/javadoc-api/org/springframework/http/CacheControl.html)构造器类被简单的用来描述"Cache-Control"缓存控制指令，使你能更容易地创建自己的HTTP缓存策略。创建完了以后，`CacheControl`类的实例就可以在Spring MVC的许多API中被传入为方法参数了。

```java
// 缓存一小时 - "Cache-Control: max-age=3600"
CacheControl ccCacheOneHour = CacheControl.maxAge(1, TimeUnit.HOURS);

// 禁止缓存 - "Cache-Control: no-store"
CacheControl ccNoStore = CacheControl.noStore();

// 缓存十天，对所有公共缓存和私有缓存生效
// 响应不能被公共缓存改变
// "Cache-Control: max-age=864000, public, no-transform"
CacheControl ccCustom = CacheControl.maxAge(10, TimeUnit.DAYS)
                                    .noTransform().cachePublic();
```

# 21.14 HTTP缓存支持

一个好的HTTP缓存策略可以极大地提高一个web应用的性能及客户端的体验。谈到HTTP缓存，它主要是与HTTP的响应头`'Cache-Control'`相关，其次另外的一些响应头比如`'Last-Modified'`和`'ETag'`等也会起一定的作用。

HTTP的响应头`'Cache-Control'`主要帮助私有缓存（比如浏览器端缓存）和公共缓存（比如代理端缓存）了解它们应该如果缓存HTTP响应，以便后用。

[ETag](http://en.wikipedia.org/wiki/HTTP_ETag)（实体标签）是一个HTTP响应头，可由支持HTTP/1.1的web应用服务器设置返回，主要用于标识给定的URL下的内容有无变化。可以认为它是`Last-Modified`头的一个更精细的后续版本。当服务器端返回了一个ETag头的资源表示时，客户端就可以在后续的GET请求中使用这个表示，一般是将它放在`If-None-Match`请求头中。此时若内容没有变化，服务器端会直接返回`304: 内容未更改`。

这一节将讲解其他一些在Spring Web MVC应用中配置HTTP缓存的方法。

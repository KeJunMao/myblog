---
layout: null
---
var urlsToCache = [
    'https://cdn.bootcss.com/mdui/0.2.1/css/mdui.min.css',
    'https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js',
    'https://cdn.bootcss.com/mdui/0.2.1/js/mdui.min.js',
    'https://cdn.bootcss.com/nprogress/0.2.0/nprogress.min.js',
    'https://cdn.bootcss.com/nprogress/0.2.0/nprogress.min.css',
    'https://cdn.bootcss.com/jquery_lazyload/1.9.7/jquery.lazyload.min.js',
    'https://cdn.bootcss.com/aplayer/1.6.0/APlayer.min.js'
];

var CACHE_NAME = 'james-ives-cache-v1';

// Cache posts
// Limits the number of posts that gets cached to 3
// Reads a piece of front-matter in each post that directs the second loop to the folder where the assets are held
{% for post in site.posts limit:3 %}
  urlsToCache.push("{{ post.url }}")
  {% for file in site.static_files %}
    {% if file.path contains post.assets %}
      urlsToCache.push("{{ file.path }}")
    {% endif %}
  {% endfor %}
{% endfor %}

// Cache pages
// Do nothing if it's either an AMP page (as these are served via Googles cache) or the blog page
// Fallback to the offline pages for these
{% for page in site.html_pages %}
  {% if page.path contains 'amp-html' or page.path contains 'blog' %}
  {% else if %}
    urlsToCache.push("{{ page.url }}")
  {% endif %}
{% endfor %}

// Cache assets
// Removed assets/posts because I only want assets from the most recent posts getting cached
{% for file in site.static_files %}
    {% if file.extname == '.js' or file.path contains '/assets/css' or file.path contains '/assets/images' %}
    urlsToCache.push("{{ file.path }}")
    {% endif %}
{% endfor %}

// Cache name: adjust version number to invalidate service worker cachce.

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(caches.open(CACHE_NAME).then(function(cache) {
    return cache.addAll(urlsToCache);
  }).catch(function(err) {
    console.log('Cache add error: ', err);
  }));
});
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        var fetchRequest = event.request.clone();
        return fetch(fetchRequest).then(
          function(response) {
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            var responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });
            return response;
          }
        );
      })
    );
});
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open(CACHE_NAME).then(function(cache) {
      return fetch(event.request).then(function(response) {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch(function() {
      // Fallback to the offline page if not available in the cache.
      return caches.match('/offline.html');
    })
  );
});
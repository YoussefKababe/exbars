Exbars
======

Exbars is a flexible [Handlebars](http://handlebarsjs.com/) view engine for [Express](http://expressjs.com/), designed to give developers complete freedom to choose how they want to organize their templates, partials, and helpers.

[![Package Version](https://img.shields.io/npm/v/exbars.svg?style=flat-square)](https://www.npmjs.com/package/exbars)
[![Package Downloads](https://img.shields.io/npm/dt/exbars.svg?style=flat-square)](https://www.npmjs.com/package/exbars)
[![Travis Build Status](https://img.shields.io/travis/YoussefKababe/exbars.svg?style=flat-square)](https://travis-ci.org/YoussefKababe/exbars)
[![Dependencies Status](https://img.shields.io/david/youssefkababe/exbars.svg?style=flat-square)](https://david-dm.org/youssefkababe/exbars)

### Installation

```bash
$ npm install --save exbars
```

### Usage

```javascript
var express = require('express');
var exbars = require('exbars');

var app = express();

app.engine('hbs', exbars({defaultLayout: 'main'}));
app.set('view engine', 'hbs');

app.get('/', function(req, res) {
  res.render('index', {title: 'Welcome!'});
});

app.listen(3000);
```

Your **views/** directory will contain four types of files: Layouts, Templates, Partials, and Helpers.

If your **views/** directory is somewhere other than ther root of your application folder, you need to specify it like this:

```javascript
app.engine('hbs', exbars({defaultLayout: 'main', viewsPath: 'app/views'}));

app.set('views', 'app/views');
app.set('view engine', 'hbs');
```

### Layouts

Layouts live inside the **views/layouts/** directory, they are just a special kind of templates with a {{{body}}} placeholder

Render a view with another layout:

```javascript
app.get('/', function(req, res) {
  res.render('index', {title: 'Welcome!', layout: 'other_layout'});
});
```

Render a view with no layouts:

```javascript
app.get('/', function(req, res) {
  res.render('index', {title: 'Welcome!', layout: false});
});
```

### Templates

Templates are files ending with a '.hbs' extension, with no underscore at the beginning, ex: home.hbs

### Partials

Each file that starts with an underscore is a partial, ex: _header.hbs, _footer_content.hbs

**template.hbs:**

```handlebars
<div>
  {{partial 'footer_content' }}
</div>
```

the code above will look for a partial called **_footer_content.hbs** in the same folder as **template.hbs**, if it's not found, it will look under the **views/** folder instead. If you want to include a partial from another folder, let's say **views/partials/_header.hbs**, you need to do something like this:

```handlebars
<div>
  {{partial 'partials/header' }}
</div>
```

This code will look for the partial **header** inside a folder called **partials** located in the same directory as the view that calls the partial, if it's not found, it will look inside the **views/partials/** folder.

### Helpers

Helpers are files that end with '_helper.js', ex: date_helper.js

Helpers must also export themselves so they can be available for use in template:

**full_name_helper.js:**

```javascript
module.exports = function(person) {
  return persone.firstName + ' ' + person.lastName;
};
```

**template.hbs:**

```handlebars
<div>
  {{fullName person}}
</div>
```

**Notice:** your helper name will always be transformed from underscore to camelcase!

### Views directory structure

You can structure your files anyway you want, depending on your work style and your application logic.

```bash
.
├── app.js
└── views
    ├── contact.hbs
    ├── _footer.hbs
    ├── _header.hbs
    ├── index.hbs
    ├── layouts
    │   └── main.hbs
    ├── login.hbs
    └── title_helper.js

2 directories, 8 files
```

You can put your helpers and partials in their own folder if you don't want them mixed with your templates:

```bash
.
├── app.js
└── views
    ├── contact.hbs
    ├── helpers
    │   └── title_helper.js
    ├── index.hbs
    ├── layouts
    │   └── main.hbs
    ├── login.hbs
    └── partials
        ├── _footer.hbs
        └── _header.hbs

4 directories, 8 files
```

And you can also do something like this:

```bash
.
├── app.js
└── views
    ├── layouts
    │   └── main.hbs
    ├── posts
    │   ├── edit.hbs
    │   ├── index.hbs
    │   ├── new.hbs
    │   ├── show.hbs
    │   └── title_helper.js
    └── users
        ├── gravatar_helper.js
        ├── login.hbs
        ├── profile.hbs
        └── _social_links.hbs

4 directories, 11 files
```

### License

Copyright (c) 2015 Youssef Kababe <hello@youssefkababe.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

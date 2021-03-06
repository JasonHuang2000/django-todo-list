# Django TODO List

A small project made by Jason Huang at 2021 summer.

## Prerequisite

Make sure `pip` is installed and run : 
```
pip install -r requirement.txt
```

## Getting Started

To start the django server, run :
```
python manage.py runserver
```

Then go to http://127.0.0.1:8000/main to view the webpage.

## Libraries / Packages Used

- [jQuery 3.5.1](https://api.jquery.com/)
- [Bootstrap 5.0.1](https://getbootstrap.com/docs/5.0/)
- [sass](https://sass-lang.com/documentation)
- [webpack](https://webpack.js.org/)
- [django-fontawesome-5](https://pypi.org/project/django-fontawesome-5/)
- [onepage-scroll](https://github.com/peachananr/onepage-scroll)
- [Glide.js](https://glidejs.com/)

## Appendix

1. Some modifications are done in the script `jquery.onepage-scroll.js`.
  - I use a [variation](https://gist.github.com/AlexeySachkov/7c526e6729fee936acde) of onepage-scroll that was forked from the original project. This variation provides the ability to enable/disable onepage-scroll when needed.
  - According to [this reply](https://github.com/peachananr/onepage-scroll/issues/346#issuecomment-547004469), I change some lines in the outdated script which will cause warning in Chrome.

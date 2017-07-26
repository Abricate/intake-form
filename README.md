Setup
=====

Install prerequisites:

* [Homebrew](https://brew.sh/)
* [Heroku Toolbelt](https://devcenter.heroku.com/articles/heroku-cli)
* NodeJS: `brew install node`
* Postgres: `brew install postgres`

Run the server locally:

This will start the backend, frontend, and database instance. It will also initialize the database if it hasn't yet been created:

```
intake-form $ npm start
```

Setup Heroku remote:
```
intake-form $ heroku git:remote -a intake-form
```

Deploy to Heroku:
```
intake-form $ git push heroku master
```

To Make Changes
===============

1) Create a new branch:
```
intake-form $ git checkout -b `whoami`/my-nifty-change
```

2) Make / commit your changes

3) Push branch to Github:
```
intake-form $ git push origin <branchname>
```

4) Open pull request on Github

5) Receive review from team member

6) Make any requested changes

7) Squash and merge your change via Github UI

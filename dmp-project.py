#!/usr/bin/python

import webapp2
import os
import jinja2

from google.appengine.ext import db

template_dir = os.path.join(os.path.dirname(__file__), 'templates')
JINJA_ENVIRONMENT = jinja2.Environment(
	loader=jinja2.FileSystemLoader(template_dir),
	autoescape = True)

class ScorePost(db.Model):
	username = db.StringProperty(required = True)
	score = db.IntegerProperty(required = True)


class Handler(webapp2.RequestHandler):
	def write(self, *a, **kw):
		self.response.out.write(*a, **kw)

	def render_str(self, template, **params):
		t = JINJA_ENVIRONMENT.get_template(template)
		return t.render(params)

	def render(self, template, **kw):
		self.write(self.render_str(template, **kw))

class MainPage(Handler):
	def get(self):
		self.render('main.html')

class HighScore(Handler):
	def render_score(self, score="", username="", error=""):
		scores=db.GqlQuery("select * from ScorePost order by score desc limit 10")

		self.render('highscore.html', score=score, username=username, error=error, scores=scores)

	def get(self):
		score = self.request.get('a')
		self.render_score(score)

	def post(self):
		input_username = self.request.get("username-input")
		score = int(self.request.get('a'))

		if input_username:
			post = ScorePost(username=input_username, score=score)
			post.put()
			self.redirect('/highscore')
		else:
			error = "Input a username"
			self.render_score(score, input_username, error)


app = webapp2.WSGIApplication([
		('/', MainPage),
		('/highscore', HighScore),
	], debug=True)

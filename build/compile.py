# This file handles the "backend" compilation pipeline
# it converts the contents of the '../content' folder into
# well structured JSON to be parsed on the front end.
# 
# Posts are written in a combination of yaml (for metadata), and 
# markdown. The content is pre-processed through jinja2 to allow
# more advanced markdown macros at compile time.

import os, yaml, json, datetime, markdown
from jinja2 import Template, Environment, DictLoader, ChoiceLoader, FileSystemLoader

EXT = '.post'

def clear():
	print("\x1b[2J\x1b[H")
	os.system('clear')
# clear()

def get_immediate_subdirectories(a_dir):
    return [name for name in os.listdir(a_dir)
            if os.path.isdir(os.path.join(a_dir, name))]

def get_immediate_files(a_dir):
    return [name for name in os.listdir(a_dir)
            if os.path.isfile(os.path.join(a_dir, name))]

class Post(object):
	""" This represents a single post """
	def __init__(self, path, parent, child_ids=[]):
		self.path = path
		self.parent = None
		if parent:
			self.parent = parent.id()
		self.children = child_ids

		self.metadata = {}
		self.content = ''
		
		self.raw_content = ''
		self.raw_yaml = ''

		self.load_raw()
		self.parse_yaml()
		
	def load_raw(self):
		delimiter = '---'
		with open(self.path) as f:
			raw_string = f.read()
			pos = raw_string.find(delimiter)
			if pos > 0:
				self.raw_yaml = raw_string[:pos]
				self.raw_content = raw_string[pos + len(delimiter):]
			else:
				self.raw_yaml = raw_string
	
	def parse_yaml(self):
		self.metadata = yaml.load(self.raw_yaml)

		if not 'id' in self.metadata:
			raise(Exception("Post missing ID! path: " + self.path))

	def get_template(self):
		loader = ChoiceLoader([
			DictLoader({'template': self.raw_content.decode('unicode-escape')}),
			FileSystemLoader('../macros')
		])
		env = Environment(loader=loader)
		return env.get_template('template')

	def render_content(self, posts):
		raw_markdown = self.get_template().render(
			content=self.content, children=self.children,
			parent=self.parent, metadata=self.metadata, posts=posts)
		if self.id() == 'nonlinear-gaussian-interpolation':
			print 'test', raw_markdown
		self.content = markdown.markdown(raw_markdown)
		if self.id() == 'nonlinear-gaussian-interpolation':
			print 'test', self.content
		if self.id() == 'projects':
			print self.content

	def id(self):
		return self.metadata['id']

	def title(self):
		return self.metadata['title']

	def has_content(self):
		if self.id() == 'nonlinear-gaussian-interpolation':
			print self.content
		# print self.id(),  len(self.content.strip(' '))
		return len(self.content.strip(' ')) > 0

	def date_ms(self):
		epoch = datetime.date(1,1,1)
		if 'date' in self.metadata:
			d = self.metadata['date']
			if isinstance(d, int):
				d = datetime.date(d, 1, 1)
			if isinstance(d, datetime.date):
				return -(d - epoch).total_seconds()
		return 0

	def to_obj(self):
		metadata = self.metadata.copy()
		if 'date' in metadata and isinstance(metadata['date'], datetime.date):
			metadata['date'] = metadata['date'].strftime("%Y-%m-%d")

		return {
			"metadata": metadata,
			"content": self.content,
			"parent": self.parent,
			"children": self.children,
		}

	def __str__(self):
		options = ['title', 'id']
		for i in options:
			if i in self.metadata:
				return self.metadata[i]
		return "Post Object"

class Posts(object):
	def __init__(self, path):
		self.posts = {}
		self.roots = []
		self.leafs = []
		self.nodes = []

		self.load_level(path, None)
		self.render_posts()

	def render_posts(self):
		for i in self.leafs:
			self.get_post(i).render_content(self)
		for i in self.nodes:
			self.get_post(i).render_content(self)
		for i in self.roots:
			self.get_post(i).render_content(self)

	def load_level(self, path, parent):
		files = filter(lambda x: EXT in x, get_immediate_files(path))
		non_index = filter(lambda x: not x == 'index' + EXT, files)

		# load index post
		index_post = None
		if 'index' + EXT in files:
			index_post = Post(
				os.path.join(path, 'index' + EXT), 
				parent, 
				map(lambda x: x.replace(EXT, ""), non_index))
			self.store_post(index_post)
		
		# load all posts in directory
		for i in non_index:
			post = Post(os.path.join(path, i), index_post)
			self.store_post(post)

		sub_dirs = get_immediate_subdirectories(path)

		# Recursively load subdirectories
		for i in sub_dirs:
			self.load_level(os.path.join(path, i), index_post)

	def store_post(self, post):
		if post.parent == None:
			self.roots.append(post.id())
		elif post.children == []:
			self.leafs.append(post.id())
		else:
			self.nodes.append(post.id())
		
		self.posts[post.id()] = post

	def get_post(self, id):
		return self.posts.get(id)

	def by_date(self, posts):
		return sorted(posts, key=lambda post: self.get_post(post).date_ms())
	def by_semester(self, posts, which):
		return filter(lambda post: self.get_post(post).metadata['semester'] == which, posts)

	def to_json(self):
		data = {}
		for pid, post in self.posts.iteritems():
			data[pid] = post.to_obj()
		return json.dumps(data)

def compile(path):
	posts = Posts(path)
	# print posts.get_post('projects').content
	return posts.to_json()

with open('../_compiled/data/posts.json', 'w') as f:
	f.write(compile('../content'))

print "done"
# print compile('content')
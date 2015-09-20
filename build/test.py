import json, os, yaml
from pprint import pprint

import html2text

def clear():
	print("\x1b[2J\x1b[H")
	os.system('clear')

clear()
# with open('data.json') as data_file:    
#     data = json.load(data_file)

# pprint(data)
paths = []
for root, dirs, files in os.walk('data/'):
	paths = map(lambda name: (os.path.join(root, name), name), files) 

def byteify(input):
    if isinstance(input, dict):
        return {byteify(key):byteify(value) for key,value in input.iteritems()}
    elif isinstance(input, list):
        return [byteify(element) for element in input]
    elif isinstance(input, unicode):
        return input.encode('utf-8')
    else:
        return input

data = {}
for path in paths:
	with open(path[0]) as data_file:
		data[path[1][:-5]] = byteify(json.load(data_file))

def y(k,v):
	if isinstance(v, list):
		v = "".join(v)
	# print v
	return k + ': ' + v + '\n'

def save_article(article, folder):
	yaml_obj = []

	order = [
		'title', 
		'subtitle', 
		'course-name',
		'number',
		'units',
		'date',
		'href',
		'id',
		'template',
	]

	if 'subheader' in article:
		article['subtitle'] = article["subheader"]
		del article['subheader']
	if 'description' in article:
		article['subtitle'] = article["description"]
		del article['description']

	name = article['id']

	for k in order:
		if k in article and article[k]:
			yaml_obj.append((k, article[k]))
			del article[k]

	with open('content/' + folder + '/' + name + '.post', 'w') as f:
		for tup in yaml_obj:
			f.write(y(*tup))
		
		if 'detailed' in article:
			d = article['detailed']
			if isinstance(article['detailed'], list):
				d = ''.join(d)

			if d and not d == True:
				try:
					s = html2text.html2text(d)
					f.write('---\n')
					f.write(s)
				except Exception as e:
					print d, e
				# f.write('---\n')
				# # print d
				# f.write(str(d))
for key, post in data.iteritems():
	if key in ['blog', 'classes', 'ideas', 'projects']:
		for article in post['articles']:

			if 'id' in article:
				# print article['id']
				save_article(article, key)
			else:
				print article, key

# h = html2text.HTML2Text()
# h.ignore_links = True
# print html2text.html2text("<p>Hello, <a href='http://earth.google.com/'>world</a>!")




			# print article
		# print key, len(post['articles'])
		# print
	# v = filter(lambda (a, b): a in ['title', 'id', 'subheader'], post.iteritems())
	# d[t[1]] = t[2]
	# myDict = reduce(lamb da d, t: (v['test']='hello', d)[1], v, {})
	# ymal_obj = {}
	# for k, v in post.iteritems():
	# 	if k in ['title', 'id']:
	# 		print k, v
	# 		ymal_obj[str(k)] = str(v)
	# 	if k == 'subheader':
	# 		ymal_obj['subtitle'] = str(v)

	# print ymal_obj

	# with open('content/' + key + '.post', 'w') as new_file:
	# 	for k, v in ymal_obj.iteritems():
	# 		new_file.write(k + ': ' + v + '\n')
	# 	new_file.write('---')


	# print 
	# for i in value:
	# 	print i